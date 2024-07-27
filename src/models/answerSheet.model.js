import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2"
import { type } from "os";


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
        // required: true,
    },
    negativeMarks: {
        type: Number,
        // required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    totalAnswergiven: {
        type: Number,
        default: 0
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerKey',
        // required: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isSubmitted :{
        type:Boolean,
        default:false
    },
}, {
    timestamps: true, // automatically manages createdAt and updatedAt
});

answerSheetSchema.plugin(mongooseAggregatePaginate)

export const AnswerSheet = mongoose.model("AnswerSheet", answerSheetSchema);
