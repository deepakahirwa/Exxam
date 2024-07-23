import { Admin } from '../models/admin.model.js';
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        // Retrieve user by ID
        const user = await Admin.findById(userId);

        // Ensure user exists
        if (!user) {
            throw new Error("User not found");
        }

        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Update user's refresh token
        user.refreshToken = refreshToken;

        // Save user (skip validation)
        await user.save({ validateBeforeSave: false });

        // Return tokens
        return { accessToken, refreshToken };
    } catch (error) {
        // Handle errors
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Internal server error while generating tokens");
    }
};

// Create a new admin
export const createAdmin = async (req, res) => {
    const { name, email, password, phone, address, gender, dob, role, subject } = req.body;
    const isAdmin = req.admin;
    // if (isAdmin.role != "superadmin") {
    //     throw new ApiError(400, "You are not super admin for creating admin");
    // }
    try {
        if ([name, email, password, phone, address, gender, dob].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }
        const Existedadmin = await Admin.findOne({ $or: [{ phone }, { email }] });
        if (Existedadmin) {
            throw new ApiError(409, "User already exists with email or phone");
        }

        const imagePath = req.files?.avatar[0]?.path;
        const image = await uplaodOnCloudinary(imagePath);
        if (!image) {
            throw new ApiError(400, "Avatar is required for registration");
        }

        const admin = await Admin.create({ name, email, password, phone, address, gender, dob, role, subject, image: image.url });
        if (!admin) {
            throw new ApiError(500, "Something went wrong with the server");
        }
        return res.status(200).json(new ApiResponse(200, admin, "User registered successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};

// Get all admins
export const getAdmins = async (req, res) => {
    const isAdmin = req.admin;
    if (isAdmin.role != "superadmin") {
        throw new ApiError(400, "You are not super admin for getting admin");
    }
    try {
        const admins = await Admin.find().select("-password -refreshToken");
        return res.status(200).json(new ApiResponse(200, admins, "Admin profiles retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong with the server");
    }
};

// Get a single admin by ID
export const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select("-password -refreshToken");
        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }
        return res.status(200).json(new ApiResponse(200, admin, "Admin profile retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};

// Update an admin
export const updateAdmin = async (req, res) => {
    const { name, email, phone, address, gender, dob, role, subject } = req.body;

    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }

        if (admin._id.toString() !== req.admin._id.toString()) {
            throw new ApiError(400, "You are not authorized to update this admin");
        }

        const updateData = {
            name: name || admin.name,
            email: email || admin.email,
            phone: phone || admin.phone,
            address: address || admin.address,
            gender: gender || admin.gender,
            dob: dob || admin.dob,
            role: role || admin.role,
            subject: subject || admin.subject
        };

        if (req.files?.avatar) {
            const imagePath = req.files.avatar[0].path;
            const image = await uplaodOnCloudinary(imagePath);
            updateData.avatar = image.url || admin.avatar;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedAdmin) {
            throw new ApiError(500, "Failed to update admin");
        }


        return res.status(200).json(new ApiResponse(200, updatedAdmin, "Admin updated successfully"));
    } catch (error) {
        console.error("Error updating admin:", error);
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};


// Delete an admin
export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }
        return res.status(200).json(new ApiResponse(200, null, "Admin deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};

// Admin login
export const loginAdmin = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        const admin = await Admin.findOne({ $or: [{ email }, { phone }] });
        if (!admin) {
            throw new ApiError(400, "User does not exist");
        }
        const isPasswordValid = await admin.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid email or password");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(admin._id);
        const loggedInUser = await Admin.findById(admin._id).select("-password -refreshToken");
        const options = {
            httpOnly: true,
            secure: true,
        };

        return res.status(200)
            .cookie("adminaccessToken", accessToken, options)
            .cookie("adminrefreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong with the server");
    }
};

// Admin logout
export const logoutAdmin = async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.admin._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
        .clearCookie("adminaccessToken", options)
        .clearCookie("adminrefreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
};
