import Table from '../models/Table.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import hotel from '../models/Hotel.js';


import { generateQRCodeValue } from '../utils/generateQRCodeValue.js';
import { generateQRCode } from '../helper/qrcodeHelper.js';

export const createTable = async (req, res, next) => {
  try {
    const { number, capacity, hotel } = req.body;

    if (!number || !hotel) {
      return res.status(400).json({ message: 'Table number and hotel are required' });
    }

    const existing = await Table.findOne({ number, hotel });
    if (existing) {
      return res.status(400).json({ message: `Table ${number} already exists for this hotel` });
    }

    const qrCodeValue = await generateQRCodeValue(); // You can include table number or hotel in QR if needed

    const table = new Table({
      number,
      qrCodeValue,
      capacity,
      hotel
    });

    await table.save();

    const { url, qrCodeDataURL, qrCodeFilePath } = await generateQRCode(qrCodeValue, number);

    res.status(201).json({
      ...table.toObject(),
      qrCodeLink: url,
      qrCodeImage: qrCodeDataURL,
      qrCodeFile: qrCodeFilePath
    });
  } catch (err) {
    next(err);
  }
};

export const getTableByQRCode = async (req, res, next) => {
  try {
    const { code: qrCodeValue } = req.params;

    const table = await Table.findOne({ qrCodeValue }).populate('hotel');
    if (!table) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }

    
    if (!table.hotel) {
      return res.status(500).json({ message: 'Hotel not found for this table' });
    }

    res.json({
      table: {
        id: table._id,
        number: table.number,
        capacity: table.capacity,
        isOccupied: table.isOccupied,
        qrCodeValue: table.qrCodeValue
      },
      hotel: {
        id: table.hotel._id,
        name: table.hotel.name,
        slug: table.hotel.slug,
        logo: table.hotel.logo
      }
    });
  } catch (err) {
    next(err);
  }
};



export const getAllTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.json(tables);
  } catch (err) {
    next(err);
  }
};

export const getTableById = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (err) {
    next(err);
  }
};

export const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (err) {
    next(err);
  }
};

export const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ message: 'Table deleted' });
  } catch (err) {
    next(err);
  }
};

export const startOrderSession = async (req, res, next) => {
  try {
    const { qrCodeValue } = req.body;

    if (!qrCodeValue) {
      return res.status(400).json({ message: 'qrCodeValue is required' });
    }

    const table = await Table.findOne({ qrCodeValue }).populate('hotel');
    if (!table) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }

    const activeOrder = await Order.findOne({
      table: table._id,
      status: { $in: ['Pending', 'Preparing'] },
    });

    res.json({
      table: {
        _id: table._id,
        number: table.number,
        capacity: table.capacity,
        isOccupied: table.isOccupied,
        qrCodeValue: table.qrCodeValue,
      },
      hotel: {
        _id: table.hotel._id,
        name: table.hotel.name,
        logo: table.hotel.logo,
        address: table.hotel.address,
        contact: table.hotel.contact,
      },
      activeOrderId: activeOrder ? activeOrder._id : null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTableStatus = async (req, res) => {
  try {
    const { isOccupied } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { isOccupied },
      { new: true }
    );

    if (!table) return res.status(404).json({ message: "Table not found" });

    io.emit("tableUpdated", table);

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
