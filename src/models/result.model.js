import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    examPaper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamPaper',
        required: true,
    },
    highestScore: {
        type: Number,
        default: 0, // Default to 0 to handle cases where no scores have been recorded yet
    },
    lowestScore: {
        type: Number,
        default: Infinity, // Default to Infinity to ensure any valid score will be lower
    },
    averageScore: {
        type: Number,
        default: 0, // Default to 0 to handle cases where no scores have been recorded yet
    },
    totalStudents: {
        type: Number,
        default: 0, // Default to 0 to handle cases where no students have been recorded yet
    },
}, {
    timestamps: true, // automatically manages createdAt and updatedAt
});

export const Result = mongoose.model('Result', resultSchema);
