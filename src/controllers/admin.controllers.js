import {Admin} from '../models/admin.model.js';
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



// Create a new admin
export const createAdmin = async (req, res) => {
    const { name, email, password, phone, address, gender, dob, role,subject} = req.body;
    const isAdmin = req.admin;
    // if(isAdmin.role!=="superadmin"){
    //     throw new ApiError(400,"your are not super admin for creating admin");
    // }
    try {
        if (
            [name, email, password, phone, address, gender, dob,].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are reuired");
        }
        const Existedadmin = await Admin.findOne({$or:[{phone},{email}]});
        if (Existedadmin) {
            throw new ApiError(409, "User exist already with email or username");
        }

         const imagepath = req.files?.avatar[0]?.path;
         const image = await uplaodOnCloudinary(imagepath);
        if (!image) {
            throw new ApiError(400, "Avatar is must for register");
        }
        const admin = await Admin.create({ name, email, password, phone, address, gender, dob, role, subject,image:image.url });
        if (!admin) {
            throw new ApiError(500, "Someting is went wrong with server");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, admin, "user registerd successfully"));
    
    } catch (error) {
        throw new ApiError(500, "Someting is went wrong with server");
    }
};


// Get all admins
export const getAdmins = async (req, res) => {
    const isAdmin = req.admin;
    if(isAdmin.role!=="superadmin"){
        throw new ApiError(400,"your are not super admin for getting admin");
    }
    try {
        const admins = await Admin.find().select("-password");
        return ApiResponse(200,admins,"these are all admins")
    } catch (error) {
        throw new ApiError(500, "Someting is went wrong with server");
    }
};



