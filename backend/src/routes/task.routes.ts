import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
  filterTasks,
  getPaginatedTasks,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../validation/task.validation";
import { validateTaskId } from "../middleware/validate.middleware";

const router = Router();

router.use(authMiddleware);

// Query-based routes — must come BEFORE /:id
router.get("/search", searchTasks);
router.get("/filter", filterTasks);
router.get("/paginated", getPaginatedTasks);

// CRUD routes
router.post("/", validate(createTaskSchema), createTask);
router.get("/", getAllTasks);
router.get("/:id", validateTaskId, getTaskById);
router.put("/:id", validateTaskId, validate(updateTaskSchema), updateTask);
router.delete("/:id", validateTaskId, deleteTask);

export default router;