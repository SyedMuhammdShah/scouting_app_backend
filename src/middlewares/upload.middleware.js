const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const path = require("path");
const fs = require("fs");

// S3 Client configuration
const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || "fsn1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .jpg and .png format allowed!"), false);
    }
};

let storage;

if (process.env.STORAGE_TYPE === "S3") {
    // S3 Storage (Direct upload)
    storage = multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET || "footballscouting",
        acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `profiles/${uniqueSuffix}${path.extname(file.originalname)}`);
        },
    });
} else if (process.env.STORAGE_TYPE === "MEMORY") {
    // Memory Storage (Direct to memory, then handle manually in controller if needed)
    storage = multer.memoryStorage();
} else {
    // Local Volume Storage
    const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, "../../uploads");
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        },
    });
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
});

module.exports = upload;
