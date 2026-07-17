import { getAllMovies } from "../models/movieModel.js";

export const getMovies = async (req, res) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies" });
  }
};