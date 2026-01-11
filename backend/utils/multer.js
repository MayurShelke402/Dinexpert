import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

export const upload = multer({ storage });

export const uploadCategoryImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["images/jpeg", "images/png", "images/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

