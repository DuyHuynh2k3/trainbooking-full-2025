// src/components/InfoSeat.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiAlignJustify } from "react-icons/fi";
import "../../styles/InfoSeat.css";

const InfoSeat = ({ cart, onAddToCart }) => {
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState("");
  console.log("hah", ticketInfo);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticketId && !email && !phoneNumber) {
      setError(
        "Vui lòng nhập ít nhất một thông tin (mã đặt chỗ, email hoặc số điện thoại)."
      );
      return;
    }

    try {
      // Sử dụng URL tuyệt đối của backend Vercel
      // Thay đổi phần khai báo backendUrl
      const backendUrl =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
      const response = await fetch(
        `${backendUrl}/api/infoSeat?ticket_id=${ticketId}&email=${email}&phoneNumber=${phoneNumber}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi không xác định từ server");
      }

      const data = await response.json();
      console.log("API response:", data);
      setTicketInfo(data);
      setError("");
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setError(
        error.message || "Lỗi kết nối đến server hoặc dữ liệu không hợp lệ."
      );
      setTicketInfo(null);
    }
  };

  const handlePrintTicket = () => {
    if (!ticketInfo) {
      alert("Vui lòng tra cứu thông tin vé trước khi in!");
      return;
    }
    const printUrl = `/ticket-print?ticket_id=${ticketInfo.ticket_id}&email=${email}&phoneNumber=${phoneNumber}`;
    window.open(printUrl, "_blank");
  };

  return (
    <div className="container-fluid mt-2">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-9">
          <div className="card shadow">
            <div className="card-header text-primary">
              <h5
                className="m-0 d-flex align-items-center"
                style={{ gap: "5px" }}
              >
                <i className="bi bi-list"></i> <FiAlignJustify />
                TRA CỨU THÔNG TIN ĐẶT VÉ
              </h5>
            </div>
            <div className="card-body">
              <p className="m-0">
                Để tra cứu thông tin, quý khách vui lòng nhập chính xác ít nhất
                một thông tin bên dưới.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label htmlFor="ticketId" className="form-label">
                    Mã đặt chỗ (Mã vé)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ticketId"
                    placeholder="Nhập mã đặt chỗ"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
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
                  <label htmlFor="phoneNumber" className="form-label">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Nhập số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-start align-items-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginRight: "7px" }}
                  >
                    Tra cứu
                  </button>
                  <Link
                    to="/forgetseat"
                    className="text-primary text-decoration-none"
                  >
                    Quên mã đặt chỗ?
                  </Link>
                </div>
              </form>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              {ticketInfo && (
                <div className="mt-3">
                  <h5>Thông Tin Vé</h5>
                  {console.log(
                    "QR Code URL in InfoSeat:",
                    ticketInfo.qr_code_url
                  )}
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
                        <td>{ticketInfo.fullName}</td>
                        <td>{ticketInfo.passport || "N/A"}</td>
                        <td>{DisplayName[ticketInfo.passenger_type]}</td>
                        <td>
                          {seatTypeDisplayName[ticketInfo.seatType] ||
                            ticketInfo.seatType ||
                            "Không xác định"}
                        </td>
                        <td>
                          {ticketInfo.train?.train_name || "Không xác định"}
                          <br />
                          {(() => {
                            const departureStop = ticketInfo.train_stop?.find(
                              (stop) =>
                                stop.station.station_name
                                  .toLowerCase()
                                  .trim() ===
                                (ticketInfo.tripType === "return"
                                  ? ticketInfo.to_station?.station_name
                                      .toLowerCase()
                                      .trim()
                                  : ticketInfo.from_station?.station_name
                                      .toLowerCase()
                                      .trim())
                            );

                            const arrivalStop = ticketInfo.train_stop?.find(
                              (stop) =>
                                stop.station.station_name
                                  .toLowerCase()
                                  .trim() ===
                                (ticketInfo.tripType === "return"
                                  ? ticketInfo.from_station?.station_name
                                      .toLowerCase()
                                      .trim()
                                  : ticketInfo.to_station?.station_name
                                      .toLowerCase()
                                      .trim())
                            );

                            return (
                              <>
                                {departureStop && departureStop.departure_time
                                  ? new Date(
                                      departureStop.departure_time
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      timeZone: "UTC",
                                    })
                                  : ticketInfo.departTime || "Không xác định"}
                                {" - "}
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
                        <td>{ticketInfo.price.toLocaleString()} VNĐ</td>
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
                  <div className="text-end">
                    <strong>
                      Tổng tiền: {ticketInfo.price.toLocaleString()} VNĐ
                    </strong>
                  </div>

                  <div className="mt-3 text-center">
                    <button
                      onClick={handlePrintTicket}
                      className="btn btn-success"
                    >
                      <i className="bi bi-printer"></i> In vé (PDF)
                    </button>
                    {ticketInfo.qr_code_url ? (
                      <div className="mt-3 text-center">
                        <img
                          src={ticketInfo.qr_code_url}
                          alt="QR Code"
                          style={{ width: "150px", height: "150px" }}
                          className="img-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            // Sử dụng fallback local thay vì external URL
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%236c757d'%3EQR Code%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <p className="mt-2">Quét mã QR để kiểm tra vé</p>
                      </div>
                    ) : (
                      <p className="mt-3 text-warning">Đang tạo mã QR...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSeat;
