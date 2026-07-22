import { getShowtimesByMovie } from "../models/showtimeModel.js";

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
