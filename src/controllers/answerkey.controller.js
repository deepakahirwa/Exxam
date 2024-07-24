import { AnswerKey } from '../models/answerkey.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new answer key
export const createAnswerKey = asyncHandler(async (req, res) => {
    try {
        const { question, studentAnswer, actualTimeSpent, examPaper } = req.body;

        if (!question || !studentAnswer || !actualTimeSpent || !examPaper) {
            throw new ApiError(400, "All fields are required.");
        }

        const student = req.student._id;
        const answerKey = new AnswerKey({
            question,
            studentAnswer,
            actualTimeSpent,
            examPaper,
            student,
            noOfVisits: req.body.noOfVisits || 0
        });

        await answerKey.save();
        return res.status(201).json(new ApiResponse(201, answerKey, "Answer key created successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Update an existing answer key
export const updateAnswerKey = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { studentAnswer, actualTimeSpent, noOfVisits } = req.body;

    try {
        const answerKey = await AnswerKey.findById(id);
        if (!answerKey) {
            throw new ApiError(404, "Answer key not found");
        }

        if (answerKey.student.toString() !== req.student._id.toString()) {
            throw new ApiError(403, "You are not authorized to update this answer key");
        }

        answerKey.studentAnswer = studentAnswer || answerKey.studentAnswer;
        answerKey.actualTimeSpent = actualTimeSpent || answerKey.actualTimeSpent;
        answerKey.noOfVisits = noOfVisits || answerKey.noOfVisits;

        await answerKey.save();
        return res.status(200).json(new ApiResponse(200, answerKey, "Answer key updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Get all answer keys
export const getAnswerKeys = asyncHandler(async (req, res) => {
    try {
        const answerKeys = await AnswerKey.find();
        return res.status(200).json(new ApiResponse(200, answerKeys, "Answer keys retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
});

// Get a single answer key by ID
export const getAnswerKeyById = asyncHandler(async (req, res) => {
    try {
        const answerKey = await AnswerKey.findById(req.params.id);
        if (!answerKey) {
            throw new ApiError(404, "Answer key not found");
        }
        console.log(answerKey.student,req.student._id);
        if (answerKey.student.toString() !== req.student._id.toString()) {
            throw new ApiError(403, "You are not authorized to view this answer key");
        }

        return res.status(200).json(new ApiResponse(200, answerKey, "Answer key retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
});

// Delete an answer key
export const deleteAnswerKey = asyncHandler(async (req, res) => {
    try {
        const answerKey = await AnswerKey.findById(req.params.id);
        if (!answerKey) {
            throw new ApiError(404, "Answer key not found");
        }

        if (answerKey.student.toString() !== req.student._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this answer key");
        }

        await AnswerKey.findByIdAndDelete(req.params.id);
        return res.status(200).json(new ApiResponse(200, null, "Answer key deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
});
