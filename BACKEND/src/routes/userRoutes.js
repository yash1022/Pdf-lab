import express from 'express';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/Authorization.js';
import { autoCleanupMiddleware, singlePDFUpload } from '../middleware/Fileupload.js';
// User controller will be imported once created
// import { getUserProfile, updateUserProfile, deleteUser } from '../controllers/userController.js';

const router = express.Router();





export default router;