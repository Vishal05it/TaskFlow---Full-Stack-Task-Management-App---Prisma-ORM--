import express from "express";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllers/task.controller.js";
export const taskRouter = express.Router();
taskRouter.get("/getalltasks/:page", verifyUser, getAllTasks);
taskRouter.post("/createtask", verifyUser, createTask);
taskRouter.patch("/updatetask/:taskId", verifyUser, updateTask);
taskRouter.delete("/deletetask/:taskId", verifyUser, deleteTask);
taskRouter.get("/gettask/:taskId", verifyUser, getTask);
