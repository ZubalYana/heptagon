import Task from "./taskSchema";
import Day from "../days/daysSchema";
import type { Priority, Repetition } from "./taskTypes";
import type TaskType from "./taskTypes";
import occursOn from "../../helpers/occursOn";
import toDateString from "../../helpers/toDateString";
import { daysRepository } from "../days/daysRepository";

export const taskRepository = {
  async create(
    userId: string,
    text: string,
    priority: Priority,
    repetition: Repetition
  ) {
    const task = new Task({ userId, text, priority, repetition });
    await task.save();
    return task;
  },

  async getByDay(userId: string, dayId: string) {
    const day = await daysRepository.findById(userId, dayId);
    console.log("getByDay result:", day);
    if (!day) throw new Error("Day not found in database records.");

    const allRegularTasks = await Task.find({
      userId,
      repetition: { $ne: null },
    });
    const occurringTasks = allRegularTasks.filter((task) =>
      occursOn(task, day.date)
    );

    return [...day.tasks, ...occurringTasks];
  },

  async toggle(userId: string, taskId: string, dayId: string) {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) throw new Error("Task not found in database records.");

    let updated: TaskType | null;

    if (task.repetition === null) {
      const newCompletedStatus = !task.completed;
      updated = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        {
          $set: {
            completed: newCompletedStatus,
            "subtasks.$[].completed": newCompletedStatus,
          },
        },
        { returnDocument: "after" }
      );
    } else {
      const day = await Day.findById(dayId);
      if (!day) throw new Error("Day not found in database records.");

      const isCompleted = task.completedDates.includes(toDateString(day.date));

      const updateOperation = isCompleted
        ? {
            $pull: {
              completedDates: day.date,
              "subtasks.$[].completedDates": day.date,
            },
          }
        : {
            $addToSet: {
              completedDates: day.date,
              "subtasks.$[].completedDates": day.date,
            },
          };

      updated = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        updateOperation,
        { returnDocument: "after" }
      );
    }

    if (!updated) throw new Error("Task not found after update.");
    return updated;
  },

  async edit(
    userId: string,
    taskId: string,
    text: string,
    priority: Priority,
    repetition: Repetition
  ) {
    const updated = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: { text, priority, repetition } },
      { returnDocument: "after" }
    );
    if (!updated) throw new Error("Task not found in database records.");
    return updated;
  },

  async delete(userId: string, taskId: string) {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) throw new Error("Task not found");
    return "Deleted successfully";
  },

  async addSubtask(
    userId: string,
    taskId: string,
    taskDate: string,
    subtaskText: string
  ) {
    let newDateArray: string[] = [];
    const parentalTask = await Task.findOne({ _id: taskId, userId });
    if (!parentalTask) throw new Error("Parental task not found");
    parentalTask.subtasks.push({ text: subtaskText });

    if (parentalTask.repetition) {
      newDateArray = parentalTask.completedDates.includes(taskDate)
        ? parentalTask.completedDates.filter((d) => d != taskDate)
        : parentalTask.completedDates;

      parentalTask.completedDates = newDateArray;
    } else {
      parentalTask.completed = parentalTask.completed
        ? false
        : parentalTask.completed;
    }

    await parentalTask.save();
    return parentalTask;
  },

  async toggleSubtask(
    userId: string,
    taskId: string,
    subtaskId: string,
    date: string
  ) {
    const parentalTask = await Task.findOne({ _id: taskId, userId });
    if (!parentalTask)
      throw new Error("Parental task not found in database records.");

    const subtask = parentalTask.subtasks.id(subtaskId);
    if (!subtask) throw new Error("Subtask not found in database records.");

    if (parentalTask.repetition === null) {
      subtask.completed = !subtask.completed;

      const uncompletedSubtasks = parentalTask.subtasks.filter(
        (s) => s.completed == false
      );
      if (uncompletedSubtasks.length === 0) {
        parentalTask.completed = true;
      } else {
        parentalTask.completed = false;
      }
    } else {
      subtask.completedDates.includes(date)
        ? (subtask.completedDates = subtask.completedDates.filter(
            (d) => d !== date
          ))
        : subtask.completedDates.push(date);

      const uncompletedSubtasks = parentalTask.subtasks.filter(
        (s) => !s.completedDates.includes(date)
      );
      if (uncompletedSubtasks.length === 0) {
        parentalTask.completedDates.includes(date)
          ? (parentalTask.completedDates = parentalTask.completedDates)
          : parentalTask.completedDates.push(date);
      } else {
        parentalTask.completedDates.includes(date)
          ? (parentalTask.completedDates = parentalTask.completedDates.filter(
              (d) => d != date
            ))
          : (parentalTask.completedDates = parentalTask.completedDates);
      }
    }

    await parentalTask.save();
    return parentalTask;
  },

  async editSubtask(
    userId: string,
    taskId: string,
    subtaskId: string,
    text: string
  ) {
    const parentalTask = await Task.findOne({ _id: taskId, userId });
    if (!parentalTask)
      throw new Error("Parental task not found in database records.");

    const subtask = parentalTask.subtasks.id(subtaskId);
    if (!subtask) throw new Error("Subtask not found in database records.");

    subtask.text = text;
    await parentalTask.save();
    return subtask;
  },

  async deleteSubtask(userId: string, taskId: string, subtaskId: string) {
    const parentalTask = await Task.findOne({ _id: taskId, userId });
    if (!parentalTask)
      throw new Error("Parental task not found in database records.");

    parentalTask.subtasks.id(subtaskId)!.deleteOne();

    await parentalTask.save();

    return "Deleted successfully";
  },
};
