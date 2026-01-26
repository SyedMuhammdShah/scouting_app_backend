const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

// S3 Client configuration for Hetzner
const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || "fsn1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true, // Required for many S3-compatible providers
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .jpg and .png format allowed!"), false);
    }
};

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET || "footballscouting",
        acl: "public-read", // Make sure this is supported/intended
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `profiles/${uniqueSuffix}${path.extname(file.originalname)}`);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
});

module.exports = upload;
