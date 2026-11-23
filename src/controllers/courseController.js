import Course from '../models/Course.js';

// Create a new course syllabus (requires instructor role)
// POST /api/courses
export const createCourse = async (req, res) => {
    try {
        const { course_code, title, description, term } = req.body;

        if (!course_code || !title) {
            return res.status(400).json({
                succuess: false,
                message: 'Please provide a course code and title',
            });
        }

        const courseExists = await Course.findOne({
            course_code: course_code.toUpperCase(),
        });

        if (courseExists) {
            return res.status(400).json({
                success: false,
                message: `Course with code ${course_code.toUpperCase()} already exists`,
            });
        }

        const course = await Course.create({
            course_code: course_code.toUpperCase(),
            title,
            description,
            term: term,
            instructor_id: req.user._id, // sets course instructor to the logged in user
        });

        res.status(201).json({
            success: true,
            data: course,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};