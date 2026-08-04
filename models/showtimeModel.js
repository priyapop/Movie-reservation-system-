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

export const getSeatsForShowtime = async (showtimeId) => {
  const result = await pool.query(
    `SELECT 
       seat.id AS seat_id,
       seat.seat_no,
       seat.hall_id,
       ticket.id IS NOT NULL AS is_booked
     FROM seat
     JOIN showtime ON showtime.hall_id = seat.hall_id
     LEFT JOIN ticket 
       ON ticket.seat_id = seat.id 
       AND ticket.showtime_id = showtime.id
     WHERE showtime.id = $1
     ORDER BY seat.seat_no`,
    [showtimeId]
  );
  return result.rows;
};
