import mongoose, { mongo } from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide an assignment or task title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: {
                values: ['not_started', 'in_progress', 'completed'],
                message: '{VALUE} is not a valid status (not_started, in_progress, completed)',
            },
            default: 'not_started',
        },
        difficulty: {
            type: String,
            enum: {
                values: ['easy', 'medium', 'hard'],
                message: '{VALUE} is not a valid difficulty (easy, medium, hard)',
            },
            default: 'medium',
        },
        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;