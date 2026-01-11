import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate a QR code for a table, and optionally save it to disk.
 * 
 * @param {string} qrCodeValue - unique string stored in Table.qrCodeValue
 * @param {number|string} tableNumber - the table number/name, used as file name
 * @returns {Promise<{url: string, qrCodeDataURL: string, qrCodeFilePath: string}>}
 */
export const generateQRCode = async (qrCodeValue, tableNumber) => {
  const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

  const url = `${baseUrl}/order/table/${qrCodeValue}`;

  // Generate QR code as PNG buffer
  const qrCodeBuffer = await QRCode.toBuffer(url);

  const fileName = `table-${tableNumber}.png`;
  const filePath = path.join(process.cwd(), 'qrcodes', fileName);

  // Save to disk
  await fs.writeFile(filePath, qrCodeBuffer);

  // Also generate base64 for inline use
  const qrCodeDataURL = `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;

  return {
    url,
    qrCodeDataURL,
    qrCodeFilePath: filePath
  };
};
