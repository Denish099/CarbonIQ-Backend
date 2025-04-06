import { Router } from "express";
import {
  predictEmissions,
  getIndustry,
  getIndustries,
  addIndustry,
} from "../controller/industryController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// router.use(verifyToken);

router.get("/industry/:id", getIndustry); // more specific first
router.get("/:userId", getIndustries);

router.post("/industry", addIndustry);
router.post("/emissions", predictEmissions);

export default router;
