import { Router } from "express";
import { getShowtimes,getSeats } from "../controllers/showtimeController.js";

const router = Router();
router.get("/", getShowtimes);
router.get('/:id/seats', getSeats);
export default router;
