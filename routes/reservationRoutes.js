import express from "express";
import * as reservationController from "../controllers/reservationController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/showtimes/:id/hold", authenticate, reservationController.holdSeats);
router.post("/showtimes/:id/confirm", authenticate, reservationController.confirmSeats);
router.post("/showtimes/:id/cancel", authenticate, reservationController.cancelSeats);

export default router;