import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current file directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../public/uploads/temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'pdf-' + uniqueSuffix + ext);
  }
});

// PDF file filter
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Create the multer instance with configuration
const uploadPDF = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: pdfFilter
});

// Middleware for single PDF upload
export const singlePDFUpload = uploadPDF.single('file');

// Middleware for multiple PDF uploads
export const multiplePDFUpload = uploadPDF.array('files', 10); // Max 10 files

// Middleware for cleaning up temporary files after processing
export const cleanupTemp = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up temporary file:', error);
  }
};

// Middleware that automatically cleans up files after the response is sent
export const autoCleanupMiddleware = (req, res, next) => {
  const originalEnd = res.end;
  const originalJson = res.json;
  const filesToCleanup = [];

  // Add files to cleanup list
  if (req.file) {
    filesToCleanup.push(req.file.path);
  }
  
  if (req.files && Array.isArray(req.files)) {
    req.files.forEach(file => filesToCleanup.push(file.path));
  }

  // Override res.end
  res.end = function(...args) {
    filesToCleanup.forEach(filePath => {
      cleanupTemp(filePath);
    });
    return originalEnd.apply(this, args);
  };

  // Override res.json
  res.json = function(...args) {
    filesToCleanup.forEach(filePath => {
      cleanupTemp(filePath);
    });
    return originalJson.apply(this, args);
  };

  next();
};