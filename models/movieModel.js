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