import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const passengerTypeEnum = {
  0: "Adult",
  1: "Child",
  2: "Senior",
  3: "Student",
};

const parseUTCTime = (dateStr, timeStr) => {
  if (!timeStr) return new Date(dateStr);

  const [hours, minutes] = timeStr.split(":");
  const date = new Date(dateStr);
  date.setUTCHours(parseInt(hours));
  date.setUTCMinutes(parseInt(minutes));
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
};

async function sendBookingEmail(tickets, booking, email) {
  try {
    console.log(
      `Would send email to: ${email} for booking: ${booking.booking_id}`
    );
    console.log(`Tickets to include in email:`, tickets.length);

    let htmlContent = `
      <h1>Xác nhận đặt vé tàu</h1>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      <h3>Thông tin đặt vé (Mã đặt: ${booking.booking_id}):</h3>
      <ul>
    `;

    tickets.forEach((ticket) => {
      const ticketId = ticket.ticket_id;
      const fullName = ticket.fullName || "Không có";
      const passport = ticket.passport || "Không có";
      const phoneNumber = ticket.phoneNumber || "Không có";
      const passengerType = ticket.passenger_type || "Không có";
      const travelDateFormatted = ticket.travel_date
        ? new Date(ticket.travel_date).toISOString().split("T")[0]
        : "Không có";
      const fromStation =
        ticket.station_ticket_from_station_idTostation?.station_name ||
        "Không có";
      const toStation =
        ticket.station_ticket_to_station_idTostation?.station_name ||
        "Không có";
      const trainName = ticket.train?.train_name || "Không có";
      const departTime = ticket.departTime
        ? new Date(ticket.departTime).toISOString().split("T")[1].slice(0, 5)
        : "Không có";
      const arrivalTime = ticket.arrivalTime
        ? new Date(ticket.arrivalTime).toISOString().split("T")[1].slice(0, 5)
        : "Không có";
      const price = ticket.price?.toString() || "0";
      const seatType = ticket.seatType || "Không có";
      const coachSeat = ticket.coach_seat || "Không có";
      const qrCodeUrl = ticket.qr_code_url || "Không có";

      htmlContent += `
        <li>
          <p><strong>Mã vé:</strong> ${ticketId}</p>
          <p><strong>Họ tên hành khách:</strong> ${fullName}</p>
          <p><strong>Số CMND/Hộ chiếu:</strong> ${passport}</p>
          <p><strong>Số điện thoại:</strong> ${phoneNumber}</p>
          <p><strong>Đối tượng:</strong> ${passengerType}</p>
          <p><strong>Ngày đi:</strong> ${travelDateFormatted}</p>
          <p><strong>Ga đi:</strong> ${fromStation}</p>
          <p><strong>Ga đến:</strong> ${toStation}</p>
          <p><strong>Tên tàu:</strong> ${trainName}</p>
          <p><strong>Giờ khởi hành:</strong> ${departTime}</p>
          <p><strong>Giờ đến:</strong> ${arrivalTime}</p>
          <p><strong>Loại ghế:</strong> ${seatType}</p>
          <p><strong>Vị trí ghế:</strong> ${coachSeat}</p>
          <p><strong>Giá vé:</strong> ${price} VND</p>
          ${
            qrCodeUrl !== "Không có"
              ? `<p><img src="${qrCodeUrl}" alt="QR Code" style="width: 100px; height: 100px;"></p>`
              : ""
          }
        </li>
      `;
    });
    htmlContent += `</ul>`;

    // Gửi email thật nếu có API key
    if (process.env.EMAIL_API_KEY) {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.EMAIL_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "Hệ thống đặt vé tàu",
            email: "no-reply@trainbooking.com",
          },
          to: [{ email }],
          subject: "Xác nhận đặt vé tàu thành công",
          htmlContent,
        }),
      });

      const responseData = await response.json();
      console.log("Phản hồi từ Brevo:", response.status, responseData);

      if (!response.ok) {
        console.error("Lỗi từ Brevo API:", responseData);
        throw new Error(responseData.message || "Gửi email thất bại");
      }

      console.log("Email gửi thành công:", responseData);
    } else {
      console.log("Không có EMAIL_API_KEY, bỏ qua gửi email thật");
    }

    return true;
  } catch (error) {
    console.error("Lỗi khi gửi email:", error.message, error.stack);
    // Không throw error để không ảnh hưởng đến booking
    return false;
  }
}

// Hàm khóa ghế đơn giản (không dùng Redis)
async function lockSeat(trainID, coachSeat, travelDate) {
  console.log(
    `Locking seat: ${coachSeat} for train ${trainID} on ${travelDate}`
  );
  return true;
}

async function releaseSeat(lockKey) {
  console.log(`Releasing lock: ${lockKey}`);
}

export async function POST(request) {
  let transaction;
  try {
    console.log("📦 Received booking request");

    const { customerData, ticketDataList, paymentData } = await request.json();

    console.log("Customer data:", customerData);
    console.log("Ticket count:", ticketDataList?.length);
    console.log("Payment data:", paymentData);

    // Validate required data
    if (!customerData?.passport || !ticketDataList?.length) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Thông tin người đặt và vé là bắt buộc",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    transaction = await prisma.$transaction(async (prisma) => {
      // 1. Create or update customer
      const customer = await prisma.customer.upsert({
        where: { passport: customerData.passport },
        update: {
          fullName: customerData.fullName,
          email: customerData.email,
          phoneNumber: customerData.phoneNumber,
        },
        create: {
          passport: customerData.passport,
          fullName: customerData.fullName,
          email: customerData.email,
          phoneNumber: customerData.phoneNumber,
        },
      });

      console.log("✅ Customer created/updated:", customer.passport);

      // 2. Create booking
      const booking = await prisma.booking.create({
        data: {
          customer_passport: customer.passport,
          email: customerData.email,
          phoneNumber: customerData.phoneNumber,
          fullName: customerData.fullName,
        },
      });

      console.log("✅ Booking created:", booking.booking_id);

      // 3. Create tickets
      const createdTickets = [];
      const cacheKeysToDelete = new Set();

      for (const ticketData of ticketDataList) {
        console.log("Processing ticket:", ticketData);

        // Khóa ghế (đơn giản hóa)
        const lockKey = `lock:${ticketData.trainID}:${ticketData.coach_seat}:${ticketData.travel_date}`;
        const lockAcquired = await lockSeat(
          ticketData.trainID,
          ticketData.coach_seat,
          ticketData.travel_date
        );

        if (!lockAcquired) {
          throw new Error(
            `Ghế ${ticketData.coach_seat} đang được xử lý bởi người khác`
          );
        }

        try {
          // Kiểm tra ghế trước khi đặt
          if (ticketData.coach_seat) {
            const [coach, seat_number] = ticketData.coach_seat.split("-");
            const seat = await prisma.seattrain.findFirst({
              where: {
                trainID: ticketData.trainID,
                coach: coach,
                seat_number: seat_number,
                travel_date: new Date(ticketData.travel_date),
              },
            });

            if (!seat) {
              throw new Error(`Không tìm thấy ghế ${ticketData.coach_seat}`);
            }

            if (!seat.is_available) {
              throw new Error(`Ghế ${ticketData.coach_seat} đã được đặt`);
            }

            // Cập nhật trạng thái ghế
            await prisma.seattrain.update({
              where: { seatID: seat.seatID },
              data: { is_available: false },
            });

            console.log(
              `✅ Seat ${ticketData.coach_seat} updated to unavailable`
            );

            // Thêm cache key để xóa (nếu có cache)
            const cacheKey = `seats:${ticketData.trainID}:${ticketData.travel_date}:${ticketData.from_station_id}:${ticketData.to_station_id}`;
            cacheKeysToDelete.add(cacheKey);
          }

          // Kiểm tra và tạo customer cho ticketData.passport nếu cần
          let ticketCustomer = customer;
          if (
            ticketData.passport &&
            ticketData.passport !== customer.passport
          ) {
            console.log(
              `Creating/updating customer for passport: ${ticketData.passport}`
            );
            ticketCustomer = await prisma.customer.upsert({
              where: { passport: ticketData.passport },
              update: {
                fullName: ticketData.fullName || customer.fullName,
                email: ticketData.email || customer.email,
                phoneNumber: ticketData.phoneNumber || customer.phoneNumber,
              },
              create: {
                passport: ticketData.passport,
                fullName: ticketData.fullName || customer.fullName,
                email: ticketData.email || customer.email,
                phoneNumber: ticketData.phoneNumber || customer.phoneNumber,
              },
            });
          }

          // Tạo ticket data - QUAN TRỌNG: KHÔNG có trường passport trong ticket
          const ticketCreateData = {
            fullName: ticketData.fullName,
            phoneNumber: ticketData.phoneNumber,
            email: ticketData.email,
            seatType: ticketData.seatType,
            q_code:
              ticketData.q_code ||
              `QR_${Math.random().toString(36).substr(2, 9)}`,
            coach_seat: ticketData.coach_seat,
            travel_date: new Date(ticketData.travel_date),
            departTime: parseUTCTime(
              ticketData.travel_date,
              ticketData.departTime
            ),
            arrivalTime: parseUTCTime(
              ticketData.travel_date,
              ticketData.arrivalTime
            ),
            price: parseFloat(ticketData.price) || 0,
            payment_status: "Paid",
            refund_status: "None",
            passenger_type:
              passengerTypeEnum[ticketData.passenger_type] || "Adult",
            journey_segments: ticketData.journey_segments || JSON.stringify([]),
            tripType: ticketData.tripType || "oneway",
            booking: {
              connect: { booking_id: booking.booking_id },
            },
            train: {
              connect: { trainID: ticketData.trainID },
            },
            station_ticket_from_station_idTostation: {
              connect: { station_id: ticketData.from_station_id },
            },
            station_ticket_to_station_idTostation: {
              connect: { station_id: ticketData.to_station_id },
            },
            // QUAN TRỌNG: Set customer connection thay vì passport field
            customer: {
              connect: { passport: ticketCustomer.passport },
            },
          };

          // Thêm seatID nếu có
          if (ticketData.seatID) {
            ticketCreateData.seattrain = {
              connect: { seatID: ticketData.seatID },
            };
          }

          const ticket = await prisma.ticket.create({
            data: ticketCreateData,
            include: {
              station_ticket_from_station_idTostation: {
                select: { station_name: true },
              },
              station_ticket_to_station_idTostation: {
                select: { station_name: true },
              },
              train: { select: { train_name: true } },
              customer: { select: { passport: true } },
            },
          });

          createdTickets.push(ticket);
          console.log(
            `✅ Ticket created: ${ticket.ticket_id} for customer: ${ticketCustomer.passport}`
          );
        } finally {
          // Giải phóng khóa
          await releaseSeat(lockKey);
        }
      }

      // 4. Create payment records
      if (paymentData) {
        for (const ticket of createdTickets) {
          await prisma.payment_ticket.create({
            data: {
              ticket_id: ticket.ticket_id,
              payment_method: paymentData.payment_method,
              payment_amount:
                parseFloat(paymentData.payment_amount) || ticket.price,
              payment_status: "Success",
              payment_date: new Date(paymentData.payment_date || Date.now()),
            },
          });
        }
        console.log("✅ Payment records created");
      }

      // 5. Send email (async - không block booking)
      sendBookingEmail(createdTickets, booking, customerData.email)
        .then((success) => {
          if (success) console.log("✅ Email sent successfully");
          else console.log("⚠️ Email sending failed but booking completed");
        })
        .catch((emailError) => {
          console.error("Email error:", emailError);
        });

      return {
        booking,
        tickets: createdTickets,
      };
    });

    console.log("🎉 Booking completed successfully");

    return new NextResponse(
      JSON.stringify({
        success: true,
        booking_id: transaction.booking.booking_id,
        ticket_ids: transaction.tickets.map((t) => t.ticket_id),
        message: "Đặt vé thành công",
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("❌ Booking error:", {
      message: error.message,
      stack: error.stack,
    });

    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error.message || "Lỗi hệ thống khi đặt vé",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
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
