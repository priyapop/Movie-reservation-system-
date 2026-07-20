import pool from "../config/db.js";

export const getAllMovies = async () => {
  try {
    const result = await pool.query("SELECT * FROM movie");
    return result.rows;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const createMovie = async (title, description, duration, image) => {
  try {
    const result = await pool.query(
      `INSERT INTO movie (title, description, duration, image)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description, duration, image]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating movie:", error);
    throw error;
  }
};
