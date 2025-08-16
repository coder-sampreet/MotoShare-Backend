import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import env from "../config/env.config.js";
import logger from "../config/logger.config.js";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath, options) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, options);
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        throw new Error("Failed to upload image: " + error.message);
    } finally {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            logger.debug("Local file cleanup failed:", err);
        }
    }
};

const uploadAvatar = (filePath) =>
    uploadImage(filePath, {
        folder: "motoshare/avatars",
        crop: "fill",
        gravity: "face",
        width: 300,
        height: 300,
    });

const uploadVehicleImage = (filePath) =>
    uploadImage(filePath, {
        folder: "motoshare/vehicles",
        crop: "fill",
        width: 1280,
        height: 720,
    });

const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error("Failed to delete image: " + error.message);
    }
};

export { uploadAvatar, uploadVehicleImage, deleteImage };
