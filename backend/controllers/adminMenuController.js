// Backend: controllers/menuItemController.js
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';

// Get all menu items
// Get all menu items with populated category
export const getMenuItems = async (req, res, next) => {
  try {
    const { hotelId, category, isAvailable } = req.query;
    const query = {};
    if (hotelId) query.hotel = hotelId;
    
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ name: new RegExp(`^${category}$`, 'i') });
        if (!foundCategory) {
          return res.status(400).json({ success: false, message: `Category "${category}" not found.` });
        }
        query.category = foundCategory._id;
      }
    }

    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

    // ✅ Add .populate('category') to get category details instead of just ID
    const menuItems = await MenuItem.find(query)
      .populate('category', 'name') // ✅ Populate category with only 'name' field
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length
    });
  } catch (error) {
    next(error);
  }
};

// Get single menu item with populated category
export const getMenuItem = async (req, res, next) => {
  try {
    // ✅ Add .populate('category') here too
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('category', 'name'); // ✅ Get category name

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};


// Create menu item
export const createMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      data: menuItem,
      message: 'Menu item created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update menu item (full update)
export const updateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem,
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Patch menu item (partial update)
export const patchMenuItem = async (req, res, next) => {
  try {
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem,
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search menu items
export const searchMenuItems = async (req, res, next) => {
  try {
    const { hotelId, q } = req.query;

    const query = { hotelId };
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }

    const menuItems = await MenuItem.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItemImages = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    // Get Cloudinary URLs from uploaded files
    const imageUrls = req.files.map(file => file.path);

    // Update menu item with new images
    const menuItem = await MenuItem.findByIdAndUpdate(
      itemId,
      { $set: { images: imageUrls } },
      { new: true }
    ).populate('category', 'name');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Images updated successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Error updating menu item images:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};