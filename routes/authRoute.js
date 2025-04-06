import { Router } from "express";
import {
  signup,
  signin,
  getCurrentUser,
} from "../controller/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = Router();

router.post("/signup", signup);
router.get("/signin", signin);
router.get("/me", verifyToken, getCurrentUser);

export default router;
