import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
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

export const loginUser = async (username, password) => {
  const user = await userModel.findUserByUsername(username);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      user_id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};