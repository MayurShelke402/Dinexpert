import express from 'express';
import {io} from '../index.js'; // Import the io instance for socket communication
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrdersByHotel
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/create', createOrder);             // Customer places order
router.get('/all', getAllOrders);            // Admin view all
router.get('/get/:id', getOrderById);         // Get one
router.patch('/update/:id/status', updateOrderStatus);  // Change status
router.delete('/delete/:id', deleteOrder);
router.get('/history', getOrdersByHotel);

export default router;
