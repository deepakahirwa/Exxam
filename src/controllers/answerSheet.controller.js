import { AnswerSheet } from '../models/answerSheet.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new answer sheet
export const createAnswerSheet = asyncHandler(async (req, res) => {
    try {
        const { examPaper, totalQuestions } = req.body;
        // console.log(examPaper);
        if (!examPaper || !totalQuestions) {
            throw new ApiError(400, "examPaper fields are required.");
        }
        const student = req.student._id;
        // console.log(student);
        const answerSheet = await AnswerSheet.create({
            examPaper,
            student,
            totalQuestions
        });
        // console.log(answerSheet);
        // await answerSheet.save();
        if (!answerSheet) {
            throw new ApiError(400, "Answer sheet not created");
        }
        return res.status(201).json(new ApiResponse(201, answerSheet, "Answer sheet created successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});


// Update an existing answer sheet
export const updateAnswerSheet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { positiveMarks, negativeMarks, totalQuestions, answers } = req.body;

    try {
        const answerSheet = await AnswerSheet.findById(id);
        if (!answerSheet) {
            throw new ApiError(404, "Answer sheet not found");
        }

        if (answerSheet.student.toString() !== req.student._id.toString()) {
            throw new ApiError(403, "You are not authorized to update this answer sheet");
        }

        answerSheet.positiveMarks = positiveMarks || answerSheet.positiveMarks;
        answerSheet.negativeMarks = negativeMarks || answerSheet.negativeMarks;
        answerSheet.totalQuestions = totalQuestions || answerSheet.totalQuestions;
        answerSheet.answers = answers || answerSheet.answers;

        await answerSheet.save();
        return res.status(200).json(new ApiResponse(200, answerSheet, "Answer sheet updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Get all answer sheets
export const getAnswerSheets = asyncHandler(async (req, res) => {
    try {
        const student = req.student._id;
        const answerSheets = await AnswerSheet.find({ student });
        if (!answerSheets) {
            throw new ApiError(404, "Answer sheet not found");
        }

        return res.status(200).json(new ApiResponse(200, answerSheets, "Answer sheets retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
});

// Get a single answer sheet by ID
export const getAnswerSheetById = asyncHandler(async (req, res) => {
    try {
        const answerSheet = await AnswerSheet.findById(req.params.id);
        if (!answerSheet) {
            throw new ApiError(404, "Answer sheet not found");
        }

        if (answerSheet.student.toString() !== req.student._id.toString()) {
            throw new ApiError(403, "You are not authorized to view this answer sheet");
        }

        return res.status(200).json(new ApiResponse(200, answerSheet, "Answer sheet retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
});


// get all sheets of question paper
export const admingetallanswerSheet = asyncHandler(async (req, res) => {
    try {
        const examPaper = req.params.id;

        const answerSheets = await AnswerSheet.find({ examPaper });
        if (!answerSheets) {
            throw new ApiError(404, "Answer sheet not found");
        }

        return res.status(200).json(new ApiResponse(200, answerSheets, "Answer sheets retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
});


// add answer in answer sheet 

export const addAnswer = asyncHandler(async (req, res) => {
    try {
        const { examPaper } = req.params;
        const { answer } = req.body;

        if (!answer) {
            throw new ApiError(400, "Answer is required");
        }

        const answerSheet = await AnswerSheet.findOne({ examPaper, student: req.student._id });

        if (!answerSheet) {
            throw new ApiError(404, "Answer sheet not found");
        }

        const isAnswerAlreadyInserted = answerSheet.answers.some(inserted_answer => inserted_answer == answer);

        if (isAnswerAlreadyInserted) {
            console.log("already inserted_answer");
            throw new ApiError(400, "Answer already inserted");
        }

        answerSheet.answers.push(answer);
        await answerSheet.save();

        return res.status(200).json(new ApiResponse(200, answerSheet, "Answer added successfully"));
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(error);
        }
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Delete an answer sheet
export const deleteAnswerSheet = asyncHandler(async (req, res) => {
    try {
        const answerSheet = await AnswerSheet.findById(req.params.id);
        if (!answerSheet) {
            throw new ApiError(404, "Answer sheet not found");
        }

        if (answerSheet.student.toString() !== req.student._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this answer sheet");
        }

        await AnswerSheet.findByIdAndDelete(req.params.id);
        return res.status(200).json(new ApiResponse(200, null, "Answer sheet deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
});


