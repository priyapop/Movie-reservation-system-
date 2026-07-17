import bcrypt from "bcrypt";
import * as userModel from "../models/userModel.js";

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const registerUser = async (username, password, email) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userModel.createUser(
      username,
      hashedPassword,
      email
    );

    return user;
  } catch (error) {
    // PostgreSQL unique constraint violation
    if (error.code === "23505") {
      throw new Error("USER_ALREADY_EXISTS");
    }

    throw error;
  }
};