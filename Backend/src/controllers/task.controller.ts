import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import {
  createTaskService,
  deleteTaskService,
  fetchTaskService,
  updateTaskService,
} from "../services/task.service.js";
import { redis } from "../config/redis.js";

export const getAllTasks = async (req: Request | any, res: Response) => {
  try {
    let page = req.params.page;
    const limit = 5;
    const totalRows = await prisma.task.count({
      where: {
        createdBy: Number(req.userId) as number,
      },
    });
    const lastPage = Math.ceil(totalRows / limit);
    if (page > lastPage || page < 0) {
      return res.status(404).json({
        message: "Page not found",
        success: true,
      });
    }
    //console.log("Last Page = ", lastPage);
    let cachedTasks = await redis.get(`allMyTasks:userId:${req.userId}`);
    if (cachedTasks) {
      return res.status(200).json({
        message: "All tasks found from cache",
        success: true,
        tasks: JSON.parse(cachedTasks).slice(
          (page - 1) * limit,
          (page - 1) * limit + limit,
        ),
        lastPage,
      });
    }

    const allTasks = await prisma.task.findMany({
      where: {
        createdBy: Number(req.userId) as number,
      },
      include: {
        user: true,
      },
      orderBy: {
        addedMs: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    const safeTasks = allTasks.map((task) => {
      return JSON.parse(
        JSON.stringify(task, (_, value) =>
          typeof value == "bigint" ? value.toString() : value,
        ),
      );
    });
    const allTheTasks = await prisma.task.findMany({
      where: {
        createdBy: Number(req.userId) as number,
      },
      include: {
        user: true,
      },
      orderBy: {
        addedMs: "desc",
      },
    });
    await redis.set(
      `allMyTasks:userId:${req.userId}`,
      JSON.stringify(allTheTasks, (_, value) =>
        typeof value == "bigint" ? value.toString() : value,
      ),
    );
    return res.status(200).json({
      message: "All tasks found",
      success: true,
      tasks: safeTasks,
      lastPage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const createTask = async (req: Request | any, res: Response) => {
  try {
    const { title, description, priority, deadline } = req.body;
    console.log("Body : ", req.body);
    if (!title) {
      return res.status(401).json({
        message: "Title cannot be empty",
        success: false,
      });
    }
    if (title.toString().trim().length < 5) {
      return res.status(401).json({
        message: "Title must be atleast more than 5 characters long",
        success: false,
      });
    }
    const refTask = {
      title,
      deadline: deadline ? deadline : "",
      description: description ? description : "",
      priority: priority ? priority : "",
      createdBy: req.userId,
      addedMs: BigInt(Date.now()) as bigint,
      isDone: false,
    };
    let newTask = await createTaskService(refTask);
    const safeTask = JSON.parse(
      JSON.stringify(newTask, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
    await redis.del(`allMyTasks:userId:${req.userId}`);
    return res.status(200).json({
      message: "Task created successfully",
      success: true,
      task: safeTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const updateTask = async (req: Request | any, res: Response) => {
  try {
    const { title, description, priority, deadline, isDone } = req.body;

    const { taskId } = req.params;
    const taskExist = await prisma.task.findUnique({
      where: {
        id: Number(taskId) as number,
      },
    });
    if (!taskExist) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }
    if (taskExist && taskExist.createdBy != req.userId) {
      return res.status(401).json({
        message: "Cannot update other's task",
        success: false,
      });
    }
    let refTask: any = {
      id: Number(taskId),
    };

    if (title) {
      if (title.toString().trim().length < 5) {
        return res.status(401).json({
          message: "Title must be atleast more than 5 characters long",
          success: false,
        });
      }
      refTask.title = title;
    }
    if (description) {
      refTask.description = description;
    }
    if (deadline) {
      refTask.deadline = deadline;
    }
    if (priority) {
      refTask.priority = priority;
    }
    if (isDone || isDone == false) {
      refTask.isDone = JSON.parse(isDone);
    }
    refTask.addedMs = BigInt(Date.now()) as bigint;
    const updatedTask = await updateTaskService(refTask);
    await redis.del(`allMyTasks:userId:${req.userId}`);
    await redis.del(`taskDetails:user:${req.userId}:task:${taskId}`);
    const safeTask = JSON.parse(
      JSON.stringify(updatedTask, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
    return res.status(200).json({
      message: "Task updated successfully",
      success: true,
      task: safeTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const deleteTask = async (req: Request | any, res: Response) => {
  try {
    let task = await prisma.task.findUnique({
      where: { id: Number(req.params.taskId) as number },
      select: {
        id: true,
        createdBy: true,
      },
    });
    if (!task) {
      return res.status(404).json({
        message: "Task not found or already deleted",
        success: false,
      });
    }
    if (task.createdBy != req.userId) {
      return res.status(401).json({
        message: "Cannot delete other's task",
        success: false,
      });
    }
    const deletedTask = await deleteTaskService(task.id);
    await redis.del(`allMyTasks:userId:${req.userId}`);
    await redis.del(`taskDetails:user:${req.userId}:task:${task.id}`);
    const safeTask = JSON.parse(
      JSON.stringify(deletedTask, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
    return res.status(200).json({
      message: "Task deleted successfully",
      success: true,
      task: safeTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const getTask = async (req: Request | any, res: Response) => {
  try {
    let cachedTask = await redis.get(
      `taskDetails:user:${req.userId}:task:${req.params.taskId}`,
    );
    if (cachedTask) {
      return res.status(200).json({
        message: "Task found from cache",
        success: true,
        task: JSON.parse(cachedTask),
      });
    }
    const task = await fetchTaskService(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }
    if (task?.createdBy != req.userId) {
      return res.status(401).json({
        message: "Cannot fetch other's task",
        success: false,
      });
    }
    const safeTask = JSON.parse(
      JSON.stringify(task, (_, value) =>
        typeof value == "bigint" ? value.toString() : value,
      ),
    );
    await redis.set(
      `taskDetails:user:${req.userId}:task:${task.id}`,
      JSON.stringify(safeTask),
    );
    return res.status(200).json({
      message: "Task found",
      success: true,
      task: safeTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
