import fs from "fs/promises";

/**
 * Middleware to auto-cleanup uploaded files (multer) if an error occurs in previous middleware.
 * Should be placed after multer and before your error handler.
 * Handles both single and multiple file uploads.
 */
const cleanupUploadedFiles = async (err, req, res, next) => {
    // Helper to delete a file if it exists
    const deleteFile = async (filePath) => {
        if (!filePath) return;
        try {
            await fs.unlink(filePath);
        } catch (e) {
            // File might already be deleted or not exist, ignore
        }
    };

    // Single file (e.g., upload.single)
    if (req.file && req.file.path) {
        await deleteFile(req.file.path);
    }

    // Multiple files (e.g., upload.array)
    if (Array.isArray(req.files)) {
        for (const file of req.files) {
            if (file && file.path) {
                await deleteFile(file.path);
            }
        }
    }

    // Multer field uploads (e.g., upload.fields)
    if (
        req.files &&
        typeof req.files === "object" &&
        !Array.isArray(req.files)
    ) {
        for (const key in req.files) {
            if (Array.isArray(req.files[key])) {
                for (const file of req.files[key]) {
                    if (file && file.path) {
                        await deleteFile(file.path);
                    }
                }
            }
        }
    }

    // Pass the error to the next error handler
    next(err);
};

export default cleanupUploadedFiles;
