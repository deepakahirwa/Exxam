import mongoose, { Schema } from "mongoose";

const answerSheetSchema = new Schema({
    examPaper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamPaper',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    positiveMarks: {
        type: Number,
        required: true,
    },
    negativeMarks: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerKey',
        required: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // automatically manages createdAt and updatedAt
});

export const AnswerSheet = mongoose.model("AnswerSheet", answerSheetSchema);
