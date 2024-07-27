import { Student } from '../models/student.model.js';
import { uplaodOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
    // console.log(userId);
    try {
        const user = await Student.findById(userId);
        // console.log("generateAccessAndRefreshTokens", user);
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Internal server error while generating tokens");
    }
};

// Create a new student
export const createStudent = async (req, res) => {
    const { name, email, password, phone, address, gender, dob, course, rollno } = req.body;
    try {
        if ([name, email, password, phone, address, gender, dob].some((field) => field?.trim() === "")) {
            console.log("sdfghbfdsdfgvh");
            throw new ApiError(400, "All fields are required");
        }

        const existingStudent = await Student.findOne({ $or: [{ phone }, { email }] });
        // console.log(existingStudent);
        if (existingStudent) {
            throw new ApiError(409, "User already exists with this email or phone number");
        }

        const imagePath = req.files?.avatar[0]?.path;
        const image = await uplaodOnCloudinary(imagePath);
        // console.log(image.url);
        if (!image) {
            throw new ApiError(400, "Avatar is required for registration");
        }

        const student = await Student.create({
            name, email, password, phone, address, gender, dob, course, rollno, image: image.url
        });
        // console.log(student);
        return res.status(200).json(new ApiResponse(200, student, "Student registered successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong with the server");
    }
};

// Get all students
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find().select("-password -refreshToken");
        return res.status(200).json(new ApiResponse(200, students, "Students retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong with the server");
    }
};

// Get a single student by ID
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select("-password -refreshToken");
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        return res.status(200).json(new ApiResponse(200, student, "Student profile retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};

// Update a student
export const updateStudent = async (req, res) => {
    const { name, email, phone, address, gender, dob, course } = req.body;

    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        // Ensure the user is authorized to update this student (adjust logic as needed)
        if (student._id.toString() !== req.student._id.toString()) {
            throw new ApiError(400, "You are not authorized to update this student");
        }

        student.name = name || student.name;
        student.email = email || student.email;
        student.phone = phone || student.phone;
        student.address = address || student.address;
        student.gender = gender || student.gender;
        student.dob = dob || student.dob;
        student.course = course || student.course;

        if (req.files?.avatar) {
            const imagePath = req.files.avatar[0].path;
            const image = await uplaodOnCloudinary(imagePath);
            student.image = image.url || student.image;
        }

        await student.save();
        return res.status(200).json(new ApiResponse(200, student, "Student updated successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};

// Delete a student
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        return res.status(200).json(new ApiResponse(200, null, "Student deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};

// Student login
export const loginStudent = async (req, res) => {
    const { email, phone, password } = req.body;
    // console.log(email, password);
    if (!email || !password) {
        throw new ApiError(400, "Please enter email and password");
    }
    try {
        const student = await Student.findOne({ $or: [{ email }, { phone }] });
        // console.log(student);
        if (!student) {
            throw new ApiError(400, "Student does not exist");
        }

        const isPasswordValid = await student.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid email or password");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(student._id);
        const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken");

        return res.status(200)
            .cookie("studentAccessToken", accessToken, { httpOnly: true, secure: true })
            .cookie("studentRefreshToken", refreshToken, { httpOnly: true, secure: true })
            .json(new ApiResponse(200, { student: loggedInStudent, accessToken, refreshToken }, "Student logged in successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};

// Student logout
export const logoutStudent = async (req, res) => {
    await Student.findByIdAndUpdate(req.student._id, { $set: { refreshToken: undefined } }, { new: true });

    return res.status(200)
        .clearCookie("studentAccessToken", { httpOnly: true, secure: true })
        .clearCookie("studentRefreshToken", { httpOnly: true, secure: true })
        .json(new ApiResponse(200, {}, "Student logged out successfully"));
};
