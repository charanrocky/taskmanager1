import asyncHandler from "express-async-handler";
import TaskModel from "../../../models/tasks/TaskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, status, proiority } = req.body;

    if (!title || title.trim() === "") {
      res.status(400).json({ message: "Title is required" });
    }

    if (!description || description.trim() === "") {
      res.status(400).json({ message: "Description is required" });
    }

    const task = new TaskModel({
      title,
      description,
      dueDate,
      proiority,
      status,
      user: req.user.id,
    });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (e) {
    console.log("Error in createTask: ", e.message);
    res.status(500).json({ message: e.message });
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      res.status(400).json({ message: "User not found" });
    }

    const tasks = await TaskModel.find({ user: userId });

    res.status(200).json({
      length: tasks.length,
      tasks,
    });
  } catch (err) {
    console.log("Error in getTask: ", err.message);
    res.status(500).json({ message: err.message });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Please provide a task id" });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.log("Error in getTask: ", err.message);
    res.status(500).json({ message: err.message });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Please provide a task id" });
    }

    const { title, description, dueDate, proiority, status, completed } =
      req.body;

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.proiority = proiority || task.proiority;
    task.status = status || task.status;
    task.completed = completed || task.completed;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.log("Error in getTask: ", err.message);
    res.status(500).json({ message: err.message });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Please provide a task id" });
    }
    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized" });
    }

    await TaskModel.findByIdAndDelete(id);

    return res.status(200).json(task);
  } catch (err) {
    console.log("Error in deleteTask: ", err.message);
    res.status(500).json({ message: err.message });
  }
});
