import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/TicketPrint.css";

const TicketPrint = () => {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();

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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const ticketId = queryParams.get("ticket_id");
    const email = queryParams.get("email");
    const phoneNumber = queryParams.get("phoneNumber");

    // Kiểm tra xem các thông tin có đầy đủ không
    if (!ticketId || !email || !phoneNumber) {
      setError(
        "Thiếu thông tin để tra cứu vé. Vui lòng quay lại và nhập đầy đủ."
      );
      return;
    }

    const fetchTicket = async () => {
      try {
        // Thay đổi phần khai báo backendUrl
        const backendUrl =
          process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
        const response = await fetch(
          `${backendUrl}/api/infoSeat?ticket_id=${ticketId}&email=${email}&phoneNumber=${phoneNumber}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không tìm thấy vé");
        }
        const data = await response.json();
        setTicket(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTicket();
  }, [location]);

  const handlePrint = () => {
    window.print();
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mt-5">
        <p>Đang tải thông tin vé...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 ticket-print">
      <h3 className="text-center mb-4">THÔNG TIN VÉ TÀU</h3>
      <div className="card shadow">
        <div className="card-body">
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
                <td>{ticket.customer?.fullName}</td>
                <td>{ticket.customer?.passport}</td>
                <td>{DisplayName[ticket.passenger_type]}</td>
                <td>
                  {seatTypeDisplayName[ticket.seatType] ||
                    ticket.seatType ||
                    "Không xác định"}
                </td>
                <td>
                  Tàu: {ticket.trainName || "Không xác định"} <br />
                  Đi từ: {ticket.fromStationName || "Không xác định"}{" "}
                  {ticket.departTime || "Không xác định"} đến{" "}
                  {ticket.toStationName || "Không xác định"}{" "}
                  {ticket.arrivalTime || "Không xác định"}
                  <br />
                  Toa - Ghế: {ticket.coach_seat || "Không xác định"}
                </td>
                <td>{ticket.price}</td>
                <td>
                  {ticket.payment_status === "Paid"
                    ? "Đã thanh toán"
                    : ticket.payment_status === "Pending"
                    ? "Chờ thanh toán"
                    : "Không xác định"}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-end">
            <strong>Tổng tiền: {ticket.price} VNĐ</strong>
          </div>

          {ticket.qr_code_url ? (
            <div className="text-center mt-4">
              <img
                src={ticket.qr_code_url}
                alt="QR Code"
                style={{ width: "150px", height: "150px" }}
                className="img-thumbnail"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/150?text=QR+Error";
                }}
              />
              <p className="mt-2">Quét mã QR để kiểm tra vé</p>
            </div>
          ) : (
            <p className="mt-3 text-danger text-center">Mã QR không khả dụng</p>
          )}

          <div className="text-center mt-4">
            <button onClick={handlePrint} className="btn btn-success">
              <i className="bi bi-printer"></i> In PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPrint;
