import pool from "../config/db.js";

export const createUser = async (username, hashedPassword, email) => {
  const query = `
    INSERT INTO users (username, password, email)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, role, created_at;
  `;
 const values = [username, hashedPassword, email];
  const { rows } = await pool.query(query, values);

  return rows[0];
};
export const findUserByUsername = async (username) => {
  const query = `
    SELECT *
    FROM users
    WHERE username = $1;
  `;

  const { rows } = await pool.query(query, [username]);
  return rows[0];
};