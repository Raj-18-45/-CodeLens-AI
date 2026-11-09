import { generateContent } from "../services/ai.service.js";

export const getReview = async (req, res) => {

    try {

        const code = req.body.code;

        if (!code) {
            return res.status(400).json({
                message: "Code is required"
            });
        }

        const response = await generateContent(code);

        res.json({
            review: response
        });

    } catch (error) {

        console.error("Gemini Error:", error);

        const statusCode = (Number.isInteger(error.status) && error.status >= 100 && error.status <= 599)
            ? error.status
            : 500;

        res.status(statusCode).json({
            message: error.message || "Something went wrong"
        });
    }
};