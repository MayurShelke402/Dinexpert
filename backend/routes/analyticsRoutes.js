// routes/analyticsRoutes.js
import express from 'express';
import { 
  getAnalytics, 
  getDailySummary, 
  getPeakHours 
} from '../controllers/analyticsController.js';
// import { protect, adminOnly } from '../middleware/authMiddleware.js'; // Your auth middleware

const router = express.Router();

// Protected admin routes
// router.use(protect); // Require authentication
// router.use(adminOnly); // Require admin role

// Main analytics endpoint
router.get('/', getAnalytics);

// Daily summary
router.get('/daily', getDailySummary);

// Peak hours analysis
router.get('/peak-hours', getPeakHours);

export default router;
