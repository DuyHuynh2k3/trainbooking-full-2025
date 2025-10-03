// src/app/api/infoSeat/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import QRService from "@/services/qrService";

const prisma = new PrismaClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticket_id = searchParams.get("ticket_id");
    const email = searchParams.get("email");
    const phoneNumber = searchParams.get("phoneNumber");

    // Validate inputs
    if (!ticket_id && !email && !phoneNumber) {
      return new NextResponse(
        JSON.stringify({
          error:
            "Vui lòng cung cấp ít nhất một thông tin (mã vé, email hoặc số điện thoại)",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    let ticket;

    // Tìm vé (giữ nguyên logic tìm kiếm)
    if (ticket_id) {
      const ticketId = parseInt(ticket_id);
      if (isNaN(ticketId)) {
        return new NextResponse(
          JSON.stringify({ error: "Mã vé không hợp lệ" }),
          { status: 400, headers: corsHeaders }
        );
      }

      ticket = await prisma.ticket.findUnique({
        where: { ticket_id: ticketId },
        include: {
          customer: true,
          train: true,
          station_ticket_from_station_idTostation: true,
          station_ticket_to_station_idTostation: true,
        },
      });

      if (!ticket) {
        return new NextResponse(
          JSON.stringify({ error: "Không tìm thấy vé với mã vé này." }),
          { status: 404, headers: corsHeaders }
        );
      }

      // Validate email/phone nếu có
      if (email && ticket.email?.toLowerCase() !== email.toLowerCase()) {
        return new NextResponse(
          JSON.stringify({ error: "Email không khớp với vé này." }),
          { status: 400, headers: corsHeaders }
        );
      }

      if (phoneNumber && ticket.phoneNumber !== phoneNumber) {
        return new NextResponse(
          JSON.stringify({ error: "Số điện thoại không khớp với vé này." }),
          { status: 400, headers: corsHeaders }
        );
      }
    } else {
      // Tìm theo email hoặc phoneNumber
      const conditions = [];
      if (email) {
        conditions.push({ email: email.toLowerCase() });
      }
      if (phoneNumber) {
        conditions.push({ phoneNumber: phoneNumber });
      }

      ticket = await prisma.ticket.findFirst({
        where: {
          OR: conditions,
        },
        include: {
          customer: true,
          train: true,
          station_ticket_from_station_idTostation: true,
          station_ticket_to_station_idTostation: true,
        },
      });

      if (!ticket) {
        return new NextResponse(
          JSON.stringify({
            error:
              "Không tìm thấy thông tin vé. Vui lòng kiểm tra lại email hoặc số điện thoại.",
          }),
          { status: 404, headers: corsHeaders }
        );
      }
    }

    // Xử lý QR code - LUÔN tạo mới trong local development
    console.log("Generating QR code locally for ticket:", ticket.ticket_id);

    let qrCodeUrl;
    try {
      const { qrUrl } = await QRService.generateForTicket(ticket);
      qrCodeUrl = qrUrl; // base64 data URL
      console.log("QR Code generated successfully");
    } catch (qrError) {
      console.error("Failed to generate QR code:", qrError);
      // Tạo fallback QR content đơn giản
      const fallbackContent = `Ticket: ${ticket.ticket_id}, Passenger: ${ticket.fullName}`;
      qrCodeUrl = await QRService.generateQRCodeDirect(fallbackContent);
    }

    // Format response
    const formattedTicket = {
      ticket_id: ticket.ticket_id,
      fullName: ticket.fullName,
      passport: ticket.passport || "N/A",
      phoneNumber: ticket.phoneNumber,
      email: ticket.email,
      coach_seat: ticket.coach_seat,
      trainName: ticket.train?.train_name,
      trainID: ticket.trainID,
      seatType: ticket.seatType,
      price: parseFloat(ticket.price),
      payment_status: ticket.payment_status,
      passenger_type: ticket.passenger_type,
      travel_date: format(new Date(ticket.travel_date), "dd/MM/yyyy"),
      departTime: ticket.departTime.toISOString().split("T")[1].substring(0, 5),
      arrivalTime: ticket.arrivalTime
        .toISOString()
        .split("T")[1]
        .substring(0, 5),
      fromStationName:
        ticket.station_ticket_from_station_idTostation?.station_name,
      toStationName: ticket.station_ticket_to_station_idTostation?.station_name,
      qr_code_url: qrCodeUrl, // base64 data URL
      tripType: ticket.tripType || "oneway",
    };

    console.log("Returning ticket with QR code");

    return new NextResponse(JSON.stringify(formattedTicket), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return new NextResponse(
      JSON.stringify({ error: "Lỗi hệ thống", details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
