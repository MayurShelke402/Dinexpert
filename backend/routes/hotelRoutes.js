import express from 'express';
import { upload } from "../utils/multer.js";
import {
  createHotel,
  getAllHotels,
  getHotelBySlug,
  updateHotel,
  deleteHotel,
  getHotelById
} from "../controllers/hotelController.js";

const router = express.Router();

// In route
router.post('/create', upload.single('logo'), createHotel);

router.get('/getall', getAllHotels);
router.get('/:slug', getHotelBySlug);
router.put('/:slug', upload.single('logo'), updateHotel);
router.delete('/:slug', deleteHotel);
router.get('/id/:id', getHotelById);

export default router;
