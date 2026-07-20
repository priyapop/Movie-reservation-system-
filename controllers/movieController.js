import { createMovie, getAllMovies } from "../models/movieModel.js";

export const getMovies = async (req, res) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies" });
  }
};

export const createMovies = async (req, res) => {
  const { title, description, duration, image } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }
  try {
    const movie = await createMovie(title, description, duration, image);
    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create movies" });
  }
};
