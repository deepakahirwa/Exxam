import mongoose, { Schema } from "mongoose";

const examPaperSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    syllabus: {
        type: String,
       
        trim: true,
    },
    totalMarks: {
        type: Number,
       
    },
    duration: {
        type: Number, // Duration in minutes
        
    },
    scheduleDate: {
        type: Date,
      
    },
    
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
       
    }],
    eligibleStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Assuming you have a Student model
       
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin', // Assuming you have a User model for admins
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin', // Assuming the same User model for teachers
        required: true,
    },
    appearedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Assuming you have a Student model
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

export const ExamPaper = mongoose.model("ExamPaper", examPaperSchema);
