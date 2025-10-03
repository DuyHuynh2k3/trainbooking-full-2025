// src/app/api/send-booking-code/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(request) {
  try {
    console.log(
      "EMAIL_API_KEY:",
      process.env.EMAIL_API_KEY ? "Có API key" : "Không có API key"
    );

    const { email } = await request.json();
    console.log("Email nhận được:", email);

    if (!email) {
      return new NextResponse(JSON.stringify({ error: "Email là bắt buộc" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(JSON.stringify({ error: "Email không hợp lệ" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Tìm booking
    const bookings = await prisma.booking.findMany({
      where: { email },
      orderBy: { created_at: "desc" },
      take: 1,
      include: {
        tickets: {
          select: {
            ticket_id: true,
            fullName: true,
            passport: true,
            phoneNumber: true,
            passenger_type: true,
            travel_date: true,
            from_station_id: true,
            to_station_id: true,
            trainID: true,
            departTime: true,
            arrivalTime: true,
            price: true,
            seatType: true,
            coach_seat: true,
            station_ticket_from_station_idTostation: {
              select: { station_name: true },
            },
            station_ticket_to_station_idTostation: {
              select: { station_name: true },
            },
            train: {
              select: { train_name: true },
            },
          },
        },
      },
    });

    if (!bookings.length || !bookings[0].tickets.length) {
      return new NextResponse(
        JSON.stringify({ error: "Không tìm thấy vé nào với email này" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const booking = bookings[0];
    const tickets = booking.tickets;

    // Tạo nội dung email đơn giản
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #E55A05; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">THÔNG TIN ĐẶT VÉ</h1>
          <p style="margin: 5px 0 0 0;">GoTicket - Đồng hành cùng hành trình của bạn</p>
        </div>
        
        <div style="padding: 20px;">
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #E55A05; margin: 0 0 10px 0;">Mã đặt vé: <strong>${booking.booking_id}</strong></h3>
            <p style="margin: 5px 0; color: #666;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          </div>
    `;

    // Xử lý từng vé
    tickets.forEach((ticket, index) => {
      const travelDate = ticket.travel_date.toISOString().split("T")[0];
      const departTime = ticket.departTime
        .toISOString()
        .split("T")[1]
        .substring(0, 5);
      const arrivalTime = ticket.arrivalTime
        .toISOString()
        .split("T")[1]
        .substring(0, 5);

      htmlContent += `
        <div style="border: 2px solid #E55A05; padding: 15px; margin: 15px 0; border-radius: 8px;">
          <h3 style="color: #E55A05; margin: 0 0 10px 0;">Vé ${
            index + 1
          } - Mã: ${ticket.ticket_id}</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Hành khách:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                ticket.fullName
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>CMND/Passport:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                ticket.passport || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Điện thoại:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                ticket.phoneNumber || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tuyến đường:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                ticket.station_ticket_from_station_idTostation.station_name
              } → ${
        ticket.station_ticket_to_station_idTostation.station_name
      }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tàu:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                ticket.train.train_name
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Ngày đi:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${travelDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Giờ khởi hành:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${departTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Giờ đến:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${arrivalTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Ghế:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                ticket.coach_seat
              } (${ticket.seatType})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Giá vé:</strong></td>
              <td style="padding: 8px 0;"><strong style="color: #E55A05;">${parseFloat(
                ticket.price
              ).toLocaleString("vi-VN")} VND</strong></td>
            </tr>
          </table>
        </div>
      `;
    });

    htmlContent += `
          <div style="background: #e9f7ef; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #155724; margin: 0 0 10px 0;">Hướng dẫn sử dụng vé:</h4>
            <ul style="color: #155724; margin: 0; padding-left: 20px;">
              <li>Mang theo CMND/Passport khi lên tàu</li>
              <li>Có mặt tại ga trước 30 phút</li>
              <li>Xuất trình mã vé khi check-in</li>
              <li>In email này hoặc hiển thị trên điện thoại</li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #666; margin-top: 20px;">
            <p>Mọi thắc mắc vui lòng liên hệ:</p>
            <p><strong>Hotline: 1900 0000 | Email: support@goticket.click</strong></p>
          </div>
        </div>
        
        <div style="background: #2c3e50; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">© 2024 GoTicket. All rights reserved.</p>
        </div>
      </div>
    `;

    // Gửi email
    console.log("Sending email via Brevo...");

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.EMAIL_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "GoTicket Support",
          email: "deathgunvn2003@gmail.com",
        },
        to: [{ email }],
        subject: `Thông Tin Đặt Vé - Mã ${booking.booking_id}`,
        htmlContent: htmlContent,
      }),
    });

    const responseData = await response.json();
    console.log("Phản hồi từ Brevo:", response.status, responseData);

    if (!response.ok) {
      console.error("Lỗi từ Brevo API:", responseData);
      throw new Error(responseData.message || "Gửi email thất bại");
    }

    console.log("Email gửi thành công!");
    return new NextResponse(
      JSON.stringify({
        message: "Thông tin vé đã được gửi đến email của bạn!",
        booking_id: booking.booking_id,
        tickets_count: tickets.length,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Lỗi khi gửi email:", error.message);
    return new NextResponse(
      JSON.stringify({
        error: error.message || "Gửi email thất bại, vui lòng thử lại",
      }),
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
