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

// Get task by ID
// GET /api/tasks/:id
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(400).json({ success: false, message: 'Task not found' });
        }

        if (task.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};