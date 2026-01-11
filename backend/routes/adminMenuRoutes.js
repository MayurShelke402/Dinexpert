// Backend: routes/menuItemRoutes.js
import express from 'express';
import { 
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  patchMenuItem,
  deleteMenuItem,
  searchMenuItems,
  updateMenuItemImages
} from '../controllers/adminMenuController.js';
import { upload } from '../utils/multer.js';

import { createMenuItem } from '../controllers/menuController.js';
// import { protect, adminOnly } from '../middleware/authMiddleware.js'; // Your auth middleware

const router = express.Router();

// Public routes (for customers)
router.put('/upload/:itemId', upload.array('images', 5), updateMenuItemImages);
router.get('/all', getMenuItems); // Get all menu items
router.get('/search', searchMenuItems); // Search menu items
router.get('/:id', getMenuItem); // Get single item



router.post('/create', createMenuItem); // Create new item
router.put('/update/:id', updateMenuItem); // Full update
router.patch('/patch/:id', patchMenuItem); // Partial update (e.g., toggle availability)
router.delete('/delete/:id', deleteMenuItem); // Delete item

export default router;
