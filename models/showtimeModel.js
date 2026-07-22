import pool from "../config/db.js";

export const getShowtimesByMovie = async (movieId) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        showtime.id,
        showtime.starts_at,
        showtime.price,
        hall.hall_number,
        theater.name,
        theater.location
      FROM showtime
      JOIN hall 
        ON showtime.hall_id = hall.id
      JOIN theater 
        ON hall.theater_id = theater.id
      WHERE showtime.movie_id = $1
        AND showtime.starts_at > NOW()
      `,
      [movieId],
    );

    return result.rows;
  } catch (error) {
    console.error("Error getting showtimes by movie:", error);
    throw error;
  }
};
