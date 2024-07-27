import mongoose, { Schema } from "mongoose";
// import {mongoose} from "mongoose-paginate-v2"
const answerKeySchema = new Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    studentAnswer: {
        type: String,
        // required: true,
    },
    noOfVisits: {
        type: Number,
        default: 0,
    },
    actualTimeSpent: {
        type: Number, // Time spent in seconds
        // required: true,
    },
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

export const AnswerKey = mongoose.model("AnswerKey", answerKeySchema);
