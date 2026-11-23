import Task from '../models/Task.js';

// AI study breakdown for large assignments
// POST /api/tasks/:id/ai-breakdown
export const generateStudyPlan = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error: GEMINI_API_KEY is missing from .env',
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (task.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to modify this task' });
        }

        const prompt = `You are an academic study planner. Break down this academic assignment into 3 to 5 clear, sequential, actionable subtasks.
Assignment Title: "${task.title}"
Description: "${task.description || 'N/A'}"
Difficulty Level: "${task.difficulty}"
Return a JSON array of strings only, for example:
["Read instructions and rubric", "Build prototype", "Write unit tests"]`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    responseMimeType: 'application/json',
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({
                success: false,
                message: `Gemini API request failed with status ${response.status}`,
                details: errorData.error?.message || errorData,
            });
        }

        const result = await response.json();
        const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            return res.status(502).json({
                success: false,
                message: 'Gemini API returned an empty response',
            });
        }

        // parse subtasks returned by Gemini
        const subtaskTitles = JSON.parse(rawText);

        if (!Array.isArray(subtaskTitles) || subtaskTitles.length === 0) {
            return res.status(502).json({
                success: false,
                message: 'Gemini API response was not able to make subtasks.',
            });
        }

        task.subtasks = subtaskTitles.map((title) => ({
            title: typeof title === 'string' ? title : title.title || String(title),
            completed: false,
        }));

        await task.save();

        res.status(200).json({
            success: true,
            message: 'AI study plan generated successfully via Google Gemini',
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to process AI breakdown request',
            error: error.message,
        });
    }
};