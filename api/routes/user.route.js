import express from "express";
import { addColorHistory, getAllHistory } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/index.js";

const router = express();

router.post("/color-history", verifyToken, addColorHistory);
router.get("/get-history", verifyToken, getAllHistory);

export default router;
