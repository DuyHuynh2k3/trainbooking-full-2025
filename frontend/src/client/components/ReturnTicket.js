// src/components/ReturnTicket.js
import React, { useState } from "react";
import { Steps, message } from "antd";
import "../../styles/ReturnTicket.css";
import { FiAlignJustify } from "react-icons/fi";

const steps = [
  { title: "Chọn vé trả" },
  { title: "Xác nhận" },
  { title: "Trả vé" },
  { title: "Hoàn tất" },
];

const ReturnTicket = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingCode, setBookingCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketInfo, setTicketInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Thay đổi phần khai báo backendUrl
  const backendUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

  const seatTypeDisplayName = {
    soft: "Ngồi mềm",
    hard_sleeper_4: "Nằm khoang 4",
    hard_sleeper_6: "Nằm khoang 6",
  };

  const DisplayName = {
    Adult: "Người lớn",
    Child: "Trẻ em",
    Senior: "Người cao tuổi",
    Student: "Sinh viên",
  };

  const validateInput = () => {
    if (!bookingCode && !email && !phone) {
      message.error(
        "Vui lòng cung cấp ít nhất một thông tin (mã đặt chỗ, email hoặc số điện thoại)"
      );
      return false;
    }

    if (bookingCode && isNaN(parseInt(bookingCode))) {
      message.error("Mã đặt chỗ không hợp lệ");
      return false;
    }

    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error("Email không hợp lệ");
      return false;
    }

    // Validate phone format (ví dụ: 10 chữ số)
    if (phone && !/^\d{10}$/.test(phone)) {
      message.error("Số điện thoại không hợp lệ (phải có 10 chữ số)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    setLoading(true);

    try {
      // Sử dụng URL tuyệt đối
      let query = bookingCode
        ? `${backendUrl}/api/infoSeat?ticket_id=${bookingCode}`
        : `${backendUrl}/api/infoSeat?email=${email}&phoneNumber=${phone}`;

      const response = await fetch(query);
      const data = await response.json();

      if (response.ok) {
        setTicketInfo(data);
        message.success("Tra cứu thông tin vé thành công");
        setCurrentStep(currentStep + 1);
      } else {
        message.error(data.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi tra cứu thông tin vé:", error);
      message.error("Lỗi khi tra cứu thông tin vé: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnTicket = async () => {
    if (!bookingCode && !email && !phone) {
      message.error(
        "Vui lòng cung cấp ít nhất một thông tin (mã đặt chỗ, email hoặc số điện thoại)"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/return-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket_id: bookingCode,
          email: email,
          phoneNumber: phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message);
        setCurrentStep(currentStep + 1);
      } else {
        message.error(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu trả vé:", error);
      message.error("Lỗi khi gửi yêu cầu trả vé: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="bookingCode" className="form-label">
                Mã đặt chỗ
              </label>
              <input
                type="text"
                className="form-control"
                id="bookingCode"
                placeholder="Nhập mã đặt chỗ"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="phone" className="form-label">
                Điện thoại
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginRight: "7px" }}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Tra cứu"}
              </button>
              <a href="/" className="text-primary text-decoration-none">
                Quên mã đặt chỗ?
              </a>
            </div>
          </form>
        );
      case 1:
        return (
          <div>
            <div className="mb-2">
              <label htmlFor="bookingCode" className="form-label">
                Mã đặt chỗ
              </label>
              <input
                type="text"
                className="form-control"
                id="bookingCode"
                placeholder="Nhập mã đặt chỗ"
                value={bookingCode}
                readOnly
              />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Nhập email"
                value={email}
                readOnly
              />
            </div>
            <div className="mb-2">
              <label htmlFor="phone" className="form-label">
                Điện thoại
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder="Nhập số điện thoại"
                value={phone}
                readOnly
              />
            </div>

            <h5>Thông Tin Vé</h5>
            {ticketInfo && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Số CMND/ Hộ chiếu</th>
                    <th>Đối tượng</th>
                    <th>Loại chỗ</th>
                    <th>Thông tin vé</th>
                    <th>Thành tiền (VNĐ)</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{ticketInfo.fullName || "Không xác định"}</td>
                    <td>{ticketInfo.passport || "N/A"}</td>
                    <td>
                      {DisplayName[ticketInfo.passenger_type] ||
                        "Không xác định"}
                    </td>
                    <td>
                      {seatTypeDisplayName[ticketInfo.seatType] ||
                        ticketInfo.seatType ||
                        "Không xác định"}
                    </td>

                    <td>
                      Tàu: {ticketInfo.trainName || "Không xác định"} <br />
                      {(() => {
                        const departureStop = ticketInfo.train_stop?.find(
                          (stop) =>
                            stop.station.station_name.toLowerCase().trim() ===
                            (ticketInfo.tripType === "return"
                              ? ticketInfo.toStationName.toLowerCase().trim()
                              : ticketInfo.fromStationName.toLowerCase().trim())
                        );

                        const arrivalStop = ticketInfo.train_stop?.find(
                          (stop) =>
                            stop.station.station_name.toLowerCase().trim() ===
                            (ticketInfo.tripType === "return"
                              ? ticketInfo.fromStationName.toLowerCase().trim()
                              : ticketInfo.toStationName.toLowerCase().trim())
                        );

                        return (
                          <>
                            Đi từ:{" "}
                            {ticketInfo.fromStationName || "Không xác định"}{" "}
                            {departureStop && departureStop.departure_time
                              ? new Date(
                                  departureStop.departure_time
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "UTC",
                                })
                              : ticketInfo.departTime || "Không xác định"}{" "}
                            Đến: {ticketInfo.toStationName || "Không xác định"}{" "}
                            {arrivalStop && arrivalStop.arrival_time
                              ? new Date(
                                  arrivalStop.arrival_time
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "UTC",
                                })
                              : ticketInfo.arrivalTime || "Không xác định"}
                          </>
                        );
                      })()}
                      <br />
                      Toa - Ghế: {ticketInfo.coach_seat || "Không xác định"}
                    </td>
                    <td>
                      {ticketInfo.price
                        ? ticketInfo.price.toLocaleString()
                        : "Không xác định"}{" "}
                      VNĐ
                    </td>
                    <td>
                      {ticketInfo.payment_status === "Paid"
                        ? "Đã thanh toán"
                        : ticketInfo.payment_status === "Pending"
                        ? "Chờ thanh toán"
                        : "Không xác định"}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            <div className="text-end">
              <strong>
                Tổng tiền:{" "}
                {ticketInfo?.price
                  ? ticketInfo.price.toLocaleString()
                  : "Không xác định"}{" "}
                VNĐ
              </strong>
            </div>
            <div className="mt-3">
              <button
                onClick={handleReturnTicket}
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Trả vé"}
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h5>Trả vé thành công</h5>
            <p>Vé của bạn đã được trả thành công.</p>
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn btn-primary"
            >
              Tiếp tục
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <h5>Hoàn tất</h5>
            <p>Quy trình trả vé đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <Steps current={currentStep} items={steps} />

      <div className="row d-flex justify-content-center mt-4">
        <div className="col-lg-12">
          <div className="card shadow">
            <div className="card-header text-primary">
              <h5
                className="m-0 d-flex align-items-center"
                style={{ gap: "5px" }}
              >
                <i className="bi bi-list"></i> <FiAlignJustify />
                TRẢ VÉ TRỰC TUYẾN
              </h5>
              <div
                className="alert alert-info mt-3"
                style={{ fontSize: "18px", textAlign: "justify" }}
              >
                <strong>Chú ý:</strong> Trả vé trực tuyến chỉ áp dụng với trường
                hợp khách hàng đã thanh toán trực tuyến (qua cổng thanh toán, ví
                điện tử, app ngân hàng) và có điền email khi mua vé. Nếu quý
                khách thanh toán bằng tiền mặt, ATM, chuyển khoản hoặc trả vé
                khi có sự cố bãi bỏ tàu, vui lòng thực hiện thủ tục tại các nhà
                ga, đại lý bán vé.
              </div>
            </div>
            <div className="card-body">{renderStepContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnTicket;
