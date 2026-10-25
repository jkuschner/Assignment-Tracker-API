import Task from '../models/Task.js';

// POST /api/tasks
// Create a new task/assignment
export const createTask = async (req, res) => {
    try {
        const { title, description, status, difficulty, dueDate } = req.body;

        const task = await Task.create({
            title,
            description,
            status,
            difficulty,
            dueDate,
        });

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/tasks
// Get all tasks
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error retrieveing tasks',
            error: error.message,
        });
    }
};