import crypto from 'crypto';
import Table from '../models/Table.js';

export const generateQRCodeValue = async () => {
  let value;
  let exists = true;

  while (exists) {
    value = crypto.randomBytes(4).toString('hex'); // e.g., 'a3f9bc12'
    exists = await Table.exists({ qrCodeValue: value });
  }

  return value;
};
