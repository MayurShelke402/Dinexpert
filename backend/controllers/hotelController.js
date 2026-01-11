import Hotel from '../models/Hotel.js';
import slugify from '../utils/slugify.js';
import fs from 'fs';


// Update as per your multer setup

// ✅ Create Hotel
export const createHotel = async (req, res, next) => {
  try {
    const { name, location, contactNumber, email, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Hotel name is required' });
    }

    const existing = await Hotel.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Hotel already exists' });
    }

    const logo = req.file?.path || '';

    const hotel = new Hotel({
      name,
      slug: slugify(name),
      location,
      contactNumber,
      email,
      description,
      logo,
    });

    await hotel.save();

    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

// 🔁 Get All Hotels
export const getAllHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};

// 📍 Get Hotel by Slug
export const getHotelBySlug = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

// ✏️ Update Hotel
export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    const { name, location, contactNumber, email, description } = req.body;

    // If new logo uploaded, remove old one
    if (req.file?.filename) {
      if (hotel.logo) {
        const oldPath = path.join(uploadPath, hotel.logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      hotel.logo = req.file.filename;
    }

    hotel.name = name || hotel.name;
    hotel.slug = slugify(name || hotel.name);
    hotel.location = location || hotel.location;
    hotel.contactNumber = contactNumber || hotel.contactNumber;
    hotel.email = email || hotel.email;
    hotel.description = description || hotel.description;

    await hotel.save();

    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

// ❌ Delete Hotel
export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    // Remove logo file
    if (hotel.logo) {
      const logoPath = path.join(uploadPath, hotel.logo);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }

    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).lean();
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

