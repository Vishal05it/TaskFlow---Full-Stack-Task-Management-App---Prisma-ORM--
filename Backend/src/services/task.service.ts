import prisma from "../config/prisma.js";
type Task = {
  title: string;
  description: string;
  addedMs: bigint;
  isDone: boolean;
  deadline: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdBy: number;
};
type TaskExist = {
  id: number;
  title: string;
  description: string;
  addedMs: bigint;
  isDone: boolean;
  deadline: string | undefined | Date | null | any;
  priority: "LOW" | "MEDIUM" | "HIGH";
};
export const createTaskService = async (refTask: Task) => {
  console.log("Received for creation : ", refTask);
  return await prisma.task.create({
    data: refTask,
    include: {
      user: true,
    },
  });
};
export const updateTaskService = async (refTask: TaskExist) => {
  console.log("Received for creation : ", refTask);
  return await prisma.task.update({
    where: {
      id: refTask.id,
    },
    data: refTask,
    include: {
      user: true,
    },
  });
};
export const deleteTaskService = async (taskId: number) => {
  return await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};
export const fetchTaskService = async (taskId: number) => {
  return await prisma.task.findUnique({
    where: {
      id: Number(taskId),
    },
  });
};
