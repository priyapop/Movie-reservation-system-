import pool from '../config/db.js';

export const validateSeatsForShowtime = async (showtimeId, seatIds) => {
  try {
    const result = await pool.query(
      `
      SELECT s.id AS seat_id
      FROM seat s
      JOIN showtime st ON st.hall_id = s.hall_id
      WHERE st.id = $1
        AND s.id = ANY($2::uuid[])
      `,
      [showtimeId, seatIds]
    );
    return result.rows;
  } catch (error) {
    console.error("Error validating seats for showtime:", error);
    throw error;
  }
};

export const confirmReservation = async (userId, showtimeId, seatIds) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const showtimeResult = await client.query(
      `SELECT price FROM showtime WHERE id = $1`,
      [showtimeId]
    );
    const pricePerSeat = showtimeResult.rows[0].price;

    const reservationResult = await client.query(
      `INSERT INTO reservation (user_id, showtime_id, status)
       VALUES ($1, $2, 'confirmed')
       RETURNING id`,
      [userId, showtimeId]
    );
    const reservationId = reservationResult.rows[0].id;

    for (const seatId of seatIds) {
      await client.query(
        `INSERT INTO ticket (seat_id, reservation_id, showtime_id, price)
         VALUES ($1, $2, $3, $4)`,
        [seatId, reservationId, showtimeId, pricePerSeat]
      );
    }

    const totalAmount = pricePerSeat * seatIds.length;

    await client.query(
      `INSERT INTO payment (reservation_id, payment_method, status, total_amount)
       VALUES ($1, 'mock', 'succeeded', $2)`,
      [reservationId, totalAmount]
    );

    await client.query('COMMIT');
    return reservationId;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error confirming reservation:", error);
    throw error;
  } finally {
    client.release();
  }
};