import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
    questionText: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
        // Assuming multiple choice with 4 options
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        index: true,
        // to allow efficient searching by tags
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium",
    },
    marks: {
        type: Number,
        required: true,
    },
    negativeMarks: {
        type: Number,
        required: true,
        default: 0,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
        // Assuming you have a User model
    },
    images: {
        type: [String],
        // Array of image URLs
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
    timestamps: true,
    // automatically manages createdAt and updatedAt
});

function arrayLimit(val) {
    return val.length <= 4;
    // Limit the number of options to 4
}

export const Question = mongoose.model("Question", questionSchema);
