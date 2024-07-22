import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phone: {
        type: String,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["M", "F", "Other"],
    },
    dob: {
        type: Date,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    rollno: {
        type: String,
        required: true,
        unique: [true, "Roll no must be unique"],
    },
    image: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
});

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

studentSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

studentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

studentSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const Student = mongoose.model("Student", studentSchema);
