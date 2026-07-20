import { Router } from "express";
import { getMovies } from "../controllers/movieController.js";
import * as movieController from "../controllers/movieController.js";
import {authenticate} from "../middleware/auth.js"
import { requireAdmin } from "../middleware/reqAdmin.js";

const router = Router();

router.get("/", getMovies);
router.post("/", authenticate,requireAdmin, movieController.createMovies);

export default router;