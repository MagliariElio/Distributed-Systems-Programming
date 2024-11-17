'use strict';

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ErrorResponse = require('../utils/ErrorsPage');

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const filename = file.fieldname + '-' + uniqueSuffix + fileExtension;
        cb(null, filename);
    }
});

const uploadImg = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 * 1024 },  // limit of 1 GB
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            const error = new Error(ErrorResponse.ERROR_IMAGE_FILE_TYPE);
            error.status = 415;
            return cb(error, false);
        }
    }
}).single('image');


module.exports.uploadImg = uploadImg;