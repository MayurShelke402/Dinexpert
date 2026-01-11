import Category from "../models/Category.js";
import Order from "../models/Order.js";
import slugify from "../utils/slugify.js";
import fs from "fs";

// CREATE
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file?.path;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).json({ error: "Category already exists" });

    const slug = slugify(name, { lower: true });

    const category = new Category({ name, slug, image });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// READ ALL
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ Order: -1 });
   
    
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// READ ONE
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;
    const newSlug = name ? slugify(name, { lower: true }) : undefined;

    const updatedFields = {
      ...(name && { name }),
      ...(newSlug && { slug: newSlug }),
      ...(req.file?.path && { image: req.file.path }),
    };

    const updated = await Category.findOneAndUpdate({ slug }, updatedFields, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "Category not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndDelete({ slug });

    if (!category) return res.status(404).json({ error: "Category not found" });

    if (category.image && fs.existsSync(category.image)) {
      fs.unlinkSync(category.image); // Delete image from disk
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
