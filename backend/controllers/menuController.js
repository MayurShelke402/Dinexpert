import MenuItem from '../models/MenuItem.js';
import slugify from '../utils/slugify.js';
import fs from 'fs';
import csv from 'csv-parser';
import {storage} from '../utils/cloudinary.js';
import mongoose from 'mongoose';
import Category from '../models/Category.js';


// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Get all menu items with filters & pagination
export const getAllMenuItems = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || DEFAULT_PAGE, 1);
    const limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const {
      keyword,
      category,
      vegOrNonVeg,
      minPrice,
      maxPrice,
      tags,
      sortBy = 'createdAt',
      order = 'desc',
      hotelId,
    } = req.query;

    const query = {};

    // 🔹 Hotel filter
    if (hotelId) {
      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({ success: false, message: "Invalid hotelId" });
      }
      query.hotel = hotelId;
    }

    // 🔍 Keyword search (name or description)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // 🏷️ Category by name or ObjectId
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

    // 🥦 Veg or Non-Veg
    if (vegOrNonVeg) {
      query.vegOrNonVeg = vegOrNonVeg;
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // 🏷️ Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      query.tags = { $all: tagArray };
    }

    // 🔃 Sorting
    const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

    // 📦 Fetch data and total count
    const [items, total] = await Promise.all([
      MenuItem.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        // .populate('hotel') // Optional: only if frontend needs hotel info
        .lean(),
      MenuItem.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        items,
      },
    });
  } catch (err) {
    next(err);
  }
};


// Get single menu item by slug
export const getMenuItemBySlug = async (req, res, next) => {
  try {
   
    const item = await MenuItem.findOne({ slug: req.params.slug }).populate("category", "name").lean()
    

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};



export const createMenuItem = async (req, res, next) => {
  try {
    console.log("req11",req);
    
    let categoryId = req.body.category;
    const hotelId = req.body.hotel;
    const slug = slugify(req.body.name);

    // If category is not an ObjectId, try to resolve by name
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      const foundCategory = await Category.findOne({ name: new RegExp(`^${categoryId}$`, 'i') });
      if (!foundCategory) {
        return res.status(400).json({ error: "Category not found" });
      }
      categoryId = foundCategory._id;
    }

    // Collect uploaded Cloudinary image URLs
    const uploadedImages = req.files?.map(file => file.path) || [];

    const newItem = new MenuItem({
      ...req.body,
      slug,
      category: categoryId,
      images: uploadedImages,
      hotel: hotelId,
    });

    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    next(err);
  }
};

// Update menu item
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

// Get grouped menu by category
export const getMenuGroupedByCategory = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ isAvailable: true }).lean();

    const grouped = items.reduce((acc, item) => {
      const cat = item.category || 'Uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    res.json({ success: true, data: grouped });
  } catch (err) {
    next(err);
  }
};

// Bulk delete
export const bulkDeleteMenuItems = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid IDs' });
    }

    const result = await MenuItem.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
};

// Bulk update availability
export const bulkUpdateAvailability = async (req, res, next) => {
  try {
    const { ids, isAvailable } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid IDs' });
    }

    const result = await MenuItem.updateMany(
      { _id: { $in: ids } },
      { $set: { isAvailable } }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    next(err);
  }
};

export const bulkCreateMenuItems = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required.' });
    }

    const csvFilePath = req.file.path; 
    const localImageFolder = path.join(process.cwd(), 'uploads/menu-images');

    const menuItems = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        menuItems.push(row);
      })
      .on('end', async () => {
        const results = [];

        for (const item of menuItems) {
          try {
            const imageFilenames = item.imageFilenames
              ? item.imageFilenames.split(',').map(f => f.trim())
              : [];

            const uploadedImages = [];

            for (const filename of imageFilenames) {
              const imagePath = path.join(localImageFolder, filename);

              const uploadResult = await storage.uploader.upload(imagePath, {
                folder: 'hotel-menu-items',
              });

              uploadedImages.push(uploadResult.secure_url);
            }

            const menuItem = new MenuItem({
              name: item.name,
              slug: slugify(item.name),
              description: item.description,
              price: parseFloat(item.price),
              category: item.category,
              vegOrNonVeg: item.vegOrNonVeg,
              tags: item.tags ? item.tags.split(',').map(t => t.trim()) : [],
              timeRequired: item.timeRequired,
              images: uploadedImages,
            });

            results.push(menuItem);
          } catch (err) {
            console.error(`Failed to process item ${item.name}:`, err);
          }
        }

        await MenuItem.insertMany(results);

        res.json({ message: 'Bulk upload completed.', inserted: results.length });
      });
  } catch (err) {
    next(err);
  }
};

export const searchMenuItems = async (req, res, next) => {
 
  
  try {
    const { q = "" } = req.query;

    if (!q.trim()) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const items = await MenuItem.find({
      name: { $regex: q, $options: "i" }, // case-insensitive partial match
    })
      .select("name slug images") // only essential fields
      .limit(6) // limit results for performance
      .lean();

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};