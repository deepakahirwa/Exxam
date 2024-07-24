import { Question } from '../models/question.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js';


// Create a new question
export const createQuestion = asyncHandler(async (req, res) => {
    try {
        const { questionText, options, correctAnswer, tags, difficulty, marks, negativeMarks, subject, idealTimeSpent } = req.body;

        if (!questionText || !options || !correctAnswer || !tags || !difficulty || !marks || !negativeMarks || !subject || !idealTimeSpent) {
            throw new ApiError(400, "All fields are required.");
        }

        const question = new Question({
            questionText,
            options,
            correctAnswer,
            tags,
            difficulty,
            marks,
            negativeMarks,
            subject,
            idealTimeSpent,
            createdBy: req.admin._id
        });

        if (req.files?.images) {
            const imageUrls = [];
            for (const file of req.files.images) {
                const imagePath = file.path;
                const image = await uploadOnCloudinary(imagePath);
                imageUrls.push(image.url);
            }
            question.images = imageUrls;
        }

        await question.save();
        return res.status(201).json(new ApiResponse(201, question, "Question created successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Update an existing question
export const updateQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { questionText, options, correctAnswer, tags, difficulty, marks, negativeMarks, subject, idealTimeSpent } = req.body;
    console.log(req.body);
    try {
        const question = await Question.findById(id);
        if (!question) {
            throw new ApiError(404, "Question not found");
        }
        if(question.createdBy.toString()!=req.admin._id.toString()){
            throw new ApiError(403, "You are not authorized to update this question");
        }
        question.questionText = questionText || question.questionText;
        question.options = options || question.options;
        question.correctAnswer = correctAnswer || question.correctAnswer;
        question.tags = tags || question.tags;
        question.difficulty = difficulty || question.difficulty;
        question.marks = marks || question.marks;
        question.negativeMarks = negativeMarks || question.negativeMarks;
        question.subject = subject || question.subject;
        question.idealTimeSpent = idealTimeSpent || question.idealTimeSpent;

        if (req.files?.images) {
            const imageUrls = [];
            for (const file of req.files.images) {
                const imagePath = file.path;
                const image = await uploadOnCloudinary(imagePath);
                imageUrls.push(image.url);
            }
            question.images = imageUrls;
        }

        await question.save();
        return res.status(200).json(new ApiResponse(200, question, "Question updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Get all questions
export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        console.log(questions);
        return res.status(200).json(new ApiResponse(200, questions, "Questions retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};

// Get a single question by ID
export const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            throw new ApiError(404, "Question not found");
        }
        
        return res.status(200).json(new ApiResponse(200, question, "Question retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};


// Delete a question
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question||question.createdBy.toString()!=req.admin._id.toString()) {
            throw new ApiError(404, "Question not found");
        }
         await Question.findByIdAndDelete(req.params.id);

        return res.status(200).json(new ApiResponse(200, null, "Question deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};