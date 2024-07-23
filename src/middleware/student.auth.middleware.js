import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyStudentJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const student = await Student.findById(decodedToken?._id).select("-refreshToken -password");

        if (!student) {
            throw new ApiError(401, "Invalid access token");
        }

        req.student = student;
        next();
    } catch (error) {
        throw new ApiError(500, error.message || "Error during JWT verification");
    }
});

export { verifyStudentJWT };
