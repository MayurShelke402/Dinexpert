import express from 'express';
import {
  getAllMenuItems,
  getMenuItemBySlug,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuGroupedByCategory,
  bulkDeleteMenuItems,
  bulkUpdateAvailability,
  bulkCreateMenuItems,
  searchMenuItems
} from '../controllers/menuController.js'
import { menuItemValidator } from '../validators/menuValidation.js';
import {upload} from '../utils/multer.js';
import validateRequest from '../middleware/reqValidator.js';



const router = express.Router();

// Get all menu items (optionally grouped later)
router.get('/all', getAllMenuItems);

// Get one menu item by slug
router.get('/item/:slug', getMenuItemBySlug);

// Create a new menu item
router.post('/create',upload.array('images', 5),validateRequest, createMenuItem
);

// Update menu item by ID
router.put('/update/:id',menuItemValidator,upload.array('images', 5),validateRequest, updateMenuItem);

// Delete menu item by ID
router.delete('/delete/:id', deleteMenuItem);

router.get('/grouped',getMenuGroupedByCategory);

router.post('/bulk-delete',bulkDeleteMenuItems);

router.post('/bulk-update',bulkUpdateAvailability);

router.post('/bulk', upload.single('file'), bulkCreateMenuItems);

router.get("/search", searchMenuItems);

export default router;
