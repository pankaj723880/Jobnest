const multer = require('multer');
const path = require('path');

// Configure multer storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'resume') {
            uploadPath += 'resumes/';
        } else if (file.fieldname === 'photo') {
            uploadPath += 'photos/';
        } else {
            uploadPath += 'documents/';
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filters
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'photo') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for profile photo!'), false);
        }
    } else if (file.fieldname === 'resume') {
        if (file.mimetype === 'application/pdf' || file.mimetype.includes('msword') || file.mimetype.includes('officedocument')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, or DOCX files are allowed for resume!'), false);
        }
    } else {
        cb(null, true);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Export single file upload middleware
const uploadSingle = (fieldName) => {
    return upload.single(fieldName);
};

// Export multiple file upload if needed
const uploadMultiple = upload.array('documents', 5);

module.exports = { uploadSingle, uploadMultiple };
