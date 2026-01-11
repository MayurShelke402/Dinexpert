import express from 'express';
// Import the io instance for socket communication
import {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
  getTableByQRCode,
  startOrderSession,
  updateTableStatus
} from '../controllers/tableController.js';

const router = express.Router();

router.post('/', createTable);           // Create a new table
router.get('/', getAllTables);           // List all tables
router.get('/:id', getTableById);        // Get one table
router.put('/:id', updateTable);         // Update a table
router.delete('/:id', deleteTable);      // Delete a table
router.get('/qrcode/:code', getTableByQRCode); // Get table by QR code
router.post('/tables/start-session', startOrderSession); // Start session by QR code
router.put("/:id/status", updateTableStatus);


export default router;
