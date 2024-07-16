import { Router } from "express";
import tasksRoutes from "./task";
import userRoutes from "./user";
import authRoutes from "./auth";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tasks", tasksRoutes);

export default router;
