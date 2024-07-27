
import mongoose from 'mongoose';
import { Result } from '../models/result.model.js';
import { ExamPaper } from '../models/examPaper.model.js';
import { AnswerSheet } from '../models/answerSheet.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const ObjectId = mongoose.Types.ObjectId;

// Create a class result
export const createClassResult = asyncHandler(async (req, res) => {
    const { examPaperId } = req.body;
    console.log(examPaperId, req.admin._id);
    const examPaper = await ExamPaper.findById(examPaperId);
    if (!examPaper) {
        throw new ApiError(404, 'Exam paper not found');
    }
    console.log(examPaper.createdBy.toString(), req.admin._id.toString());
    if (examPaper.createdBy.toString() != req.admin._id.toString()) {
        throw new ApiError(403, 'You are not authorized to create result for this exam paper')
    }
    let result = await Result.findOne({ examPaper: examPaperId });
    if (result) {
        throw new ApiError(404, 'already result is created');
    }


    result = new Result({
        examPaper: examPaperId,
    });

    await result.save();
    return res.status(201).json(new ApiResponse(201, result, 'Class result created successfully'));
});

// Get the class result for an exam paper
export const getClassResult = asyncHandler(async (req, res) => {
    try {
        const { examPaperId } = req.params;

        const result = await Result.findOne({ examPaper: examPaperId });
        if (!result) {
            throw new ApiError(404, 'Class result not found for this exam paper');
        }

        return res.status(200).json(new ApiResponse(200, result, 'Class result retrieved successfully'));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || 'Something went wrong'));
    }
});

// Get the first rank student for an exam paper
export const getFirstRank = asyncHandler(async (req, res) => {
    try {
        const { examPaperId } = req.params;

        const answerSheet = await AnswerSheet.find({ examPaper: examPaperId })
            .sort({ positiveMarks: -1, negativeMarks: 1 })
            .limit(2)
            .select("-answers");

        if (!answerSheet.length) {
            throw new ApiError(404, 'No answer sheets found for this exam paper');
        }

        return res.status(200).json(new ApiResponse(200, answerSheet, 'First rank retrieved successfully'));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || 'Something went wrong'));
    }
});

// Get the last rank student for an exam paper
export const getLastRank = asyncHandler(async (req, res) => {
    try {
        const { examPaperId } = req.params;

        const answerSheet = await AnswerSheet.find({ examPaper: examPaperId })
            .sort({ positiveMarks: 1, negativeMarks: -1 })
            .limit(1)
            .select("-answers");

        if (!answerSheet.length) {
            throw new ApiError(404, 'No answer sheets found for this exam paper');
        }

        return res.status(200).json(new ApiResponse(200, answerSheet[0], 'Last rank retrieved successfully'));
    } catch (error) {
        return res.status(200).json(new ApiError(500, error.message || 'Something went wrong'));
    }
});

// Get the average score for an exam paper
export const getAverageScore = asyncHandler(async (req, res) => {
    try {
        const { examPaperId } = req.params;

        const result = await Result.findOne({ examPaper: examPaperId });
        if (!result) {
            throw new ApiError(404, 'Class result not found for this exam paper');
        }

        return res.status(200).json(new ApiResponse(200, { averageScore: result.averageScore }, 'Average score retrieved successfully'));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || 'Something went wrong'));
    }
});

export const getallExamAverage = asyncHandler(async (req, res) => {
    try {
        // if(req.student||req.admin){
        //     throw new ApiError(404, 'you are not student or teacher to see results');
        // }
        const results = await Result.find();

        if (results.length === 0) {
            throw new ApiError(404, 'No results found');
        }

        return res.status(200).json(new ApiResponse(200, results, "All exam results fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || 'Something went wrong'));
    }
})
