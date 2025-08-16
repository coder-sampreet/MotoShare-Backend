import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, "../../public/temp");

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const allowedTypes = /jpeg|jpg|png|webp/;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
    }
};

const limits = {
    fileSize: 10 * 1024 * 1024,
};

const upload = multer({
    storage,
    fileFilter,
    limits,
});

const uploadAvatar = upload.single("avatar"); // For user avatar
const uploadVehicleImages = upload.array("images", 6); // Max 6 images
export default upload;
export { uploadAvatar, uploadVehicleImages };
