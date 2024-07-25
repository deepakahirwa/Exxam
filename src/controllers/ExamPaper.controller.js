import { ExamPaper } from "../models/examPaper.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Question } from "../models/question.model.js"

// Create an exam paper
export const createExamPaper = asyncHandler(async (req, res) => {
    const { title, description, subject, syllabus, totalMarks, duration, scheduleDate, questions, eligibleStudents, teacher } = req.body;
    const createdBy = req.admin._id;
    if (!title || !description || !subject || !teacher) {
        throw new ApiError(404, "title ,description and subjectis requires")
    }
    try {
        const examPaper = new ExamPaper({
            title,
            description,
            subject,
            syllabus,
            totalMarks,
            duration,
            scheduleDate,
            questions,
            eligibleStudents,
            createdBy,
            teacher,
        });

        await examPaper.save();
        return res.status(201).json(new ApiResponse(201, examPaper, "Exam Paper created successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong with the server"));
    }
});

// Get all exam papers
export const getExamPapers = asyncHandler(async (req, res) => {
    try {
        const examPapers = await ExamPaper.find({createdBy:req.admin._id}).select("-questions -appearedStudents -eligibleStudents");
        if (!examPapers) {
            throw new ApiError(404, "Exam Paper not found");
        }
        return res.status(200).json(new ApiResponse(200, examPapers, "Exam Papers fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong with the server"));
    }
});

// Get a single exam paper by ID
export const getExamPaperById = asyncHandler(async (req, res) => {
    try {
        const examPaper = await ExamPaper.findById(req.params.id).select("-questions -appearedStudents -eligibleStudents");

        if (!examPaper) {
            throw new ApiError(404, "Exam Paper not found");
        }
        return res.status(200).json(new ApiResponse(200, examPaper, "Exam Paper fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong with the server"));
    }
});
    
// Update an exam paper
export const updateExamPaper = asyncHandler(async (req, res) => {
    const { title, description, subject, syllabus, totalMarks, duration, scheduleDate, questions, eligibleStudents, teacher } = req.body;
    try {
        const examPaper = await ExamPaper.findById(req.params.id);
        if (!examPaper) {
            throw new ApiError(404, "Exam Paper not found");
        }
        if(examPaper.createdBy.toString()!=req.admin._id.toString()){
            throw new ApiError(403, "You are not authorized to update this exam paper");
        }

        examPaper.title = title || examPaper.title;
        examPaper.description = description || examPaper.description;
        examPaper.subject = subject || examPaper.subject;
        examPaper.syllabus = syllabus || examPaper.syllabus;
        examPaper.totalMarks = totalMarks || examPaper.totalMarks;
        examPaper.duration = duration || examPaper.duration;
        examPaper.scheduleDate = scheduleDate || examPaper.scheduleDate;
        examPaper.questions = questions || examPaper.questions;
        examPaper.eligibleStudents = eligibleStudents || examPaper.eligibleStudents;
        examPaper.teacher = teacher || examPaper.teacher;

        await examPaper.save();
        return res.status(200).json(new ApiResponse(200, examPaper, "Exam Paper updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong with the server"));
    }
});

// Delete an exam paper
export const deleteExamPaper = asyncHandler(async (req, res) => {
   
    try {
        const examPaper = await ExamPaper.findById(req.params.id);
   

        if (!examPaper) {
            throw new ApiError(404, "Exam Paper not found");
        }
        if(examPaper.createdBy.toString()!=req.admin._id.toString()){
            throw new ApiError(403, "You are not authorized to delete this exam paper");
        }
        await ExamPaper.findByIdAndDelete(examPaper._id);
        return res.status(200).json(new ApiResponse(200, null, "Exam Paper deleted successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong with the server"));
    }
});

// Add a question to an exam paper
export const addQuestionToExamPaper = asyncHandler(async (req, res) => {
    try {
        const { examPaperId, questionId } = req.params;

        // console.log('ExamPaper ID:', examPaperId);
        // console.log('Question ID:', questionId);

        const examPaper = await ExamPaper.findById(examPaperId);
        console.log('ExamPaper:', examPaper);

        if (!examPaper) {
            throw new ApiError(404, "Exam paper not found");
        }

        const question = await Question.findById(questionId);
        console.log('Question:', question);

        if (!question) {
            throw new ApiError(404, "Question not found");
        }

        // console.log('Question Created By:', question.createdBy);
        // console.log('Admin ID:', req.admin._id);
        // console.log('ExamPaper Created By:', examPaper.createdBy);

        // Ensure the admin is authorized to add this question
        if (question.createdBy.toString() !== req.admin._id.toString() || examPaper.createdBy.toString() !== req.admin._id.toString()) {
            // console.log("Admin is not authorized");
            throw new ApiError(403, "You are not authorized to add this question to this exam");
        }

        if (!examPaper.questions.includes(questionId)) {
            // console.log("Adding question to exam paper");

            examPaper.questions.push(questionId);
            await examPaper.save();
            return res.status(200).json(new ApiResponse(200, examPaper, "Question added to exam paper successfully"));
        }

        console.log("Question already added to the exam paper");

        return res.status(200).json(new ApiResponse(200, null, "Question already added"));

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

// Remove a question from an exam paper
export const removeQuestionFromExamPaper = asyncHandler(async (req, res) => {
    try {
        const { examPaperId, questionId } = req.params;

        // console.log('ExamPaper ID:', examPaperId);
        // console.log('Question ID:', questionId);

        const examPaper = await ExamPaper.findById(examPaperId);
        // console.log('ExamPaper:', examPaper);

        if (!examPaper) {
            throw new ApiError(404, "Exam paper not found");
        }

        const question = await Question.findById(questionId);
        // console.log('Question:', question);

        if (!question) {
            throw new ApiError(404, "Question not found");
        }

        // console.log('Question Created By:', question.createdBy);
        // console.log('Admin ID:', req.admin._id);
        // console.log('ExamPaper Created By:', examPaper.createdBy);

        // Ensure the admin is authorized to remove this question
        if (question.createdBy.toString() !== req.admin._id.toString() || examPaper.createdBy.toString() !== req.admin._id.toString()) {
            // console.log("Admin is not authorized");
            throw new ApiError(403, "You are not authorized to remove this question from this exam");
        }

        const questionIndex = examPaper.questions.indexOf(questionId);
        if (questionIndex === -1) {
            throw new ApiError(404, "Question not found in this exam paper");
        }

        // console.log("Removing question from exam paper");
        examPaper.questions.splice(questionIndex, 1);
        await examPaper.save();

        return res.status(200).json(new ApiResponse(200, examPaper, "Question removed from exam paper successfully"));
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json(new ApiError(500, error.message || "Something went wrong"));
    }
});

