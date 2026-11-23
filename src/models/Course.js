import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        course_code: {
            type: String,
            required: [true, 'Please provide a course code'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a course title'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        instructor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Course must have an assigned instructor'],
        },
        term: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;