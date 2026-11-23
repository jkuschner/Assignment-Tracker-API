import express from 'express';
import { createCourse, getCourses } from '../controllers/courseController';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getCourses);

router.post('/', authorize('instructor'), createCourse);

export default router;