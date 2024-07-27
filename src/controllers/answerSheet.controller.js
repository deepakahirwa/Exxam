import { AnswerSheet } from '../models/answerSheet.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ExamPaper } from '../models/examPaper.model.js';
import { Result } from '../models/result.model.js';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

// Create a new answer sheet
export const createAnswerSheet = asyncHandler(async (req, res) => {
    try {
        const { examPaper, totalQuestions } = req.body;

        if (!examPaper || !totalQuestions) {
            throw new ApiError(400, "examPaper and totalQuestions fields are required.");
        }

        const student = req.student._id;
        const answerSheet = await AnswerSheet.create({
            examPaper,
            student,
            totalQuestions
        });

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
            throw new ApiError(404, "Answer sheets not found");
        }

        return res.status(200).json(new ApiResponse(200, answerSheets, "Answer sheets retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
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
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Get all sheets of a question paper
export const admingetallanswerSheet = asyncHandler(async (req, res) => {
    try {
        const examPaper = req.params.id;
        const answerSheets = await AnswerSheet.find({ examPaper });

        if (!answerSheets) {
            throw new ApiError(404, "Answer sheets not found");
        }

        return res.status(200).json(new ApiResponse(200, answerSheets, "Answer sheets retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Add an answer in the answer sheet
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
            throw new ApiError(400, "Answer already inserted");
        }

        answerSheet.answers.push(answer);
        await answerSheet.save();

        return res.status(200).json(new ApiResponse(200, answerSheet, "Answer added successfully"));
    } catch (error) {
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
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Update result schema
export const updateResult = async (examPaperId, student, answerSheet) => {
    try {
        if (answerSheet.student.toString() !== student._id.toString()) {
            throw new ApiError(400, "You are not the owner of this sheet");
        }

        const classResult = await Result.findOne({ examPaper: examPaperId });
        if (!classResult) {
            throw new ApiError(400, "No result found for this exam paper");
        }

        const examPaper = await ExamPaper.findById(examPaperId);
        if (!examPaper) {
            throw new ApiError(400, "No exam paper found");
        }

        const studentMarks = answerSheet.positiveMarks - answerSheet.negativeMarks;
        const studentPercentage = (studentMarks / examPaper.totalMarks) * 100;

        classResult.totalStudents += 1;
        classResult.highestScore = Math.max(classResult.highestScore || 0, studentMarks);
        classResult.lowestScore = Math.min(classResult.lowestScore || studentMarks, studentMarks);
        classResult.averageScore = ((classResult.averageScore * (classResult.totalStudents - 1)) + studentPercentage) / classResult.totalStudents;

        await classResult.save();
    } catch (error) {
        console.error("Error updating result:", error.message);
    }
};

// Submit the exam
export const submit = asyncHandler(async (req, res) => {
    try {
        const { examPaperId, answerSheetId } = req.params;
        const questions = await ExamPaper.aggregate([
            {
                '$match': {
                    '_id': new ObjectId(examPaperId)
                }
            },
            {
                '$unwind': '$questions'
            },
            {
                '$lookup': {
                    'from': 'questions',
                    'localField': 'questions',
                    'foreignField': '_id',
                    'as': 'question',
                    'pipeline': [
                        {
                            '$project': {
                                'correctAnswer': 1,
                                'marks': 1,
                                'negativeMarks': 1
                            }
                        }
                    ]
                }
            }, {
                '$project': {
                    'question': { '$arrayElemAt': ['$question', 0] }
                }
            }
        ]);

        if (!questions || questions.length === 0) {
            throw new ApiError(404, "Exam paper not found or no questions available");
        }

        const answers = await AnswerSheet.aggregate([
            {
                '$match': {
                    '_id': new ObjectId(answerSheetId)
                }
            }, {
                '$unwind': '$answers'
            }, {
                '$lookup': {
                    'from': 'answerkeys',
                    'localField': 'answers',
                    'foreignField': '_id',
                    'as': 'answer',
                    'pipeline': [
                        {
                            '$project': {
                                'question': 1,
                                'studentAnswer': 1
                            }
                        }
                    ]
                }
            }, {
                '$project': {
                    'answer': { '$arrayElemAt': ['$answer', 0] }
                }
            }
        ]);

        if (!answers || answers.length === 0) {
            throw new ApiError(404, "Answer sheet not found or no answers available");
        }

        const answerSheet = await AnswerSheet.findById(answerSheetId);

        if (answerSheet.student.toString() !== req.student._id.toString()) {
            throw new ApiError(400, "You are not the owner of this sheet");
        }

        if (answerSheet.isSubmitted) {
            throw new ApiError(400, "Answer sheet already submitted");
        }

        let questionMap = {};
        questions.forEach(element => {
            questionMap[element.question._id.toString()] = element.question;
        });

        let positiveMarks = 0;
        let negativeMarks = 0;
        let questionsAttempted = 0;

        answers.forEach(element => {
            const question = questionMap[element.answer.question.toString()];
            if (question) {
                questionsAttempted++;
                if (question.correctAnswer === element.answer.studentAnswer) {
                    positiveMarks += question.marks;
                } else {
                    negativeMarks += question.negativeMarks;
                }
            }
        });

        const totalMarks = positiveMarks - negativeMarks;
        const result = {
            positiveMarks,
            negativeMarks,
            totalMarks,
            questionsAttempted
        };

        answerSheet.positiveMarks = positiveMarks;
        answerSheet.negativeMarks = negativeMarks;
        answerSheet.totalAnswergiven = questionsAttempted;
        answerSheet.isSubmitted = true;
        await answerSheet.save();

        await updateResult(examPaperId, req.student, answerSheet);

        return res.status(200).json(new ApiResponse(200, answerSheet, "Result calculated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});
