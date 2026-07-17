import * as authService from "../services/authServices.js";

export const register = async (req, res) => {
  const { username, password, email } = req.body;

  // Validate required fields
  if (!username || !password || !email) {
    return res.status(400).json({
      message: "Username, password, and email are required.",
    });
  }

  // Username cannot be only whitespace
  if (username.trim().length === 0) {
    return res.status(400).json({
      message: "Username cannot be empty.",
    });
  }

  // Password length
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long.",
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address.",
    });
  }

  try {
    const user = await authService.registerUser(
      username.trim(),
      password,
      email.trim().toLowerCase()
    );

    return res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    if (error.message === "USER_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "Username or email already exists.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};