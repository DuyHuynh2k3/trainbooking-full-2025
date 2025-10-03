// src/services/qrService.js
import QRCode from "qrcode";

export default class QRService {
  static async generateForTicket(ticket) {
    try {
      const qrContent = JSON.stringify({
        ticketId: ticket.ticket_id,
        train: ticket.trainID,
        from: ticket.from_station_id,
        to: ticket.to_station_id,
        date: ticket.travel_date,
        seat: ticket.coach_seat,
        passenger: ticket.fullName,
        passport: ticket.passport,
      });
      console.log("QR Content:", qrContent);

      // Tạo QR code dạng base64 data URL (local)
      const qrDataUrl = await QRCode.toDataURL(qrContent, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      console.log("QR Code generated locally as base64");

      return {
        qrUrl: qrDataUrl, // base64 data URL
        qrContent: qrContent,
      };
    } catch (error) {
      console.error("QR Generation Error:", error);
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  // Method mới để generate QR trực tiếp (không lưu)
  static async generateQRCodeDirect(content) {
    try {
      const qrDataUrl = await QRCode.toDataURL(content, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "H",
      });
      return qrDataUrl;
    } catch (error) {
      console.error("Direct QR Generation Error:", error);
      throw error;
    }
  }

  // Method mới để tạo QR code cho email (dạng base64 không có prefix)
  static async generateQRCodeForEmail(content) {
    try {
      // Tạo QR code dạng buffer trước
      const qrBuffer = await QRCode.toBuffer(content, {
        width: 150, // Nhỏ hơn cho email
        margin: 1,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Chuyển buffer thành base64 string (không có data URL prefix)
      const base64String = qrBuffer.toString("base64");

      return base64String;
    } catch (error) {
      console.error("QR Generation for Email Error:", error);
      throw error;
    }
  }
}
