import redis, { holdSeatsScript } from "../config/redis.js";
import { validateSeatsForShowtime } from "../models/reservationModel.js";
import { confirmReservation } from "../models/reservationModel.js";

//Temporarily lock seats in Redis
export const holdSeats = async (req, res) => {
  const { seatIds } = req.body;
  const showtimeId = req.params.id;

  if (!Array.isArray(seatIds) || seatIds.length === 0) {
    return res
      .status(400)
      .json({ message: "seatIds must be a non-empty array" });
  }

  const uniqueSeatIds = [...new Set(seatIds)];

  try {
    const validSeats = await validateSeatsForShowtime(
      showtimeId,
      uniqueSeatIds,
    );

    if (validSeats.length !== uniqueSeatIds.length) {
      return res.status(400).json({
        message: "One or more requested seats are invalid for this showtime",
      });
    }

    const userId = req.user.user_id;
    const ttl = 600;
    const holdKeys = uniqueSeatIds.map(
      (seatId) => `hold:${showtimeId}:${seatId}`,
    );

    const result = await redis.eval(
      holdSeatsScript,
      holdKeys.length,
      ...holdKeys,
      userId,
      ttl,
    );

    if (result === 0) {
      return res
        .status(409)
        .json({ message: "One or more seats are already held or booked" });
    }

    res
      .status(200)
      .json({ success: true, holdExpiresIn: ttl, seatIds: uniqueSeatIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to hold seats" });
  }
};

//Turn the temporary hold into a real reservation in the database
export const confirmSeats = async (req, res) => {
  const { seatIds } = req.body;
  const showtimeId = req.params.id;
  const userId = req.user.user_id;
  if (!Array.isArray(seatIds) || seatIds.length === 0) {
    return res
      .status(400)
      .json({ message: "seatIds must be a non-empty array" });
  }

  try {
    const holdKeys = seatIds.map((seatId) => `hold:${showtimeId}:${seatId}`);
    const holders = await redis.mget(...holdKeys);
    //temp check
    // const holdKeys = seatIds.map((seatId) => `hold:${showtimeId}:${seatId}`);
    // const holders = await redis.mget(...holdKeys);

    console.log("holdKeys:", holdKeys);
    console.log("holders:", holders);
    console.log("userId:", userId);

    const allOwnedByUser = holders.every((holder) => holder === userId);
    // const allOwnedByUser = holders.every((holder) => holder === userId);
    if (!allOwnedByUser) {
      return res
        .status(409)
        .json({ message: "Hold expired or does not belong to this user" });
    }

    const reservationId = await confirmReservation(userId, showtimeId, seatIds);

    await redis.del(...holdKeys);

    res.status(200).json({ success: true, reservationId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to confirm reservation" });
  }
};
