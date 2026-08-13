import { getShowtimesByMovie ,getSeatsForShowtime } from "../models/showtimeModel.js";
import redis from '../config/redis.js';
export const getShowtimes = async (req, res) => {
  const { movieId } = req.query;
  if (!movieId) {
    return res
      .status(400)
      .json({ message: "movieId query parameter is required." });
  }
  try {
    const showtime = await getShowtimesByMovie(movieId);
    res.status(200).json(showtime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch showtime" });
  }
};

// export const getSeats = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const seats = await getSeatsForShowtime(id);
//     if (seats.length === 0) {
//       return res.status(404).json({ message: "Showtime not found or has no seats" });
//     }
//     res.status(200).json(seats);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch seat availability" });
//   }
// };

export const getSeats = async (req, res) => {
  const { id } = req.params;
  try {
    const seats = await getSeatsForShowtime(id);
    if (seats.length === 0) {
      return res.status(404).json({ message: "Showtime not found or has no seats" });
    }

    // Only check Redis for seats not already booked in Postgres
    const unbookedSeats = seats.filter(seat => !seat.is_booked);
    const holdKeys = unbookedSeats.map(seat => `hold:${id}:${seat.seat_id}`);

    let holders = [];
    if (holdKeys.length > 0) {
      holders = await redis.mget(...holdKeys);
    }

    // Build a lookup: seat_id -> isHeld
    const heldSeatIds = new Set();
    unbookedSeats.forEach((seat, i) => {
      if (holders[i]) {
        heldSeatIds.add(seat.seat_id);
      }
    });

    const seatsWithStatus = seats.map(seat => {
      let status;
      if (seat.is_booked) {
        status = 'booked';
      } else if (heldSeatIds.has(seat.seat_id)) {
        status = 'held';
      } else {
        status = 'available';
      }
      return {
        seat_id: seat.seat_id,
        seat_no: seat.seat_no,
        status
      };
    });

    res.status(200).json(seatsWithStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch seat availability" });
  }
};
