import express from 'express';
import { 
    createTask, 
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from '../controllers/taskController.js';
import { generateStudyPlan } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createTask)
    .get(getTasks);

router.route('/:id')
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

router.post('/:id/ai-breakdown', generateStudyPlan);

export default router;