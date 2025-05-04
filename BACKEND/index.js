import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/Database/connect.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import cookieParser from 'cookie-parser';
// Import PDF routes (convert to ES module format)
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pdfRoutes from './src/routes/pdfRoutes.js';

// Get current file directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.timeout = 5 * 60 * 1000; // 5 minutes

// Enable keep-alive connections
app.keepAliveTimeout = 65000; // 65 seconds
app.headersTimeout = 66000; // 66 seconds

// Increase the payload size limit if processing large PDFs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the public directory
app.use('/uploads', express.static(join(__dirname, 'public/uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the PDF Lab API');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pdf', pdfRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
});