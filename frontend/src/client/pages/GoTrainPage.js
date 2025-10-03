import React, { useState, useRef } from "react";
import Header from "../components/Header";
import { MdOutlineAccessTime } from "react-icons/md";
import { TbCircleNumber1, TbCircleNumber2 } from "react-icons/tb";

// Danh sách các ga
const stations = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế", "Nha Trang", "Cần Thơ", 
  "Bắc Ninh", "Bắc Giang", "Vinh", "Bình Dương", "Thanh Hóa", "Lào Cai", 
  "Vũng Tàu", "Quảng Ninh", "Hải Phòng", "Hải Dương", "Long An", "Bình Thuận"
  // Thêm các ga khác vào đây
];

export default function GoTrainPage() {
  const [gaDi, setGaDi] = useState(""); // Lưu Ga đi
  const [gaDen, setGaDen] = useState(""); // Lưu Ga đến
  const [filteredStations, setFilteredStations] = useState(stations);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const gaDenInputRef = useRef(); // Sử dụng ref để chuyển focus vào ô Ga đến

  const handleGaDiChange = (e) => {
    setGaDi(e.target.value);
  };

  const handleGaDenChange = (e) => {
    setGaDen(e.target.value);
    // Lọc danh sách ga khi người dùng nhập vào ô Ga đến
    const searchTerm = e.target.value.toLowerCase();
    setFilteredStations(stations.filter(station => station.toLowerCase().includes(searchTerm)));
    setIsDropdownOpen(true);
  };

  const handleStationSelect = (station) => {
    setGaDi(station);  // Thay vì set Ga đến, ta sẽ set Ga đi
    setIsDropdownOpen(false); // Đóng dropdown khi người dùng chọn ga

    // Chuyển focus sang ô "Ga đến"
    gaDenInputRef.current.focus();
  };

  // Hàm để tạo các nút bấm cho các tỉnh
  const renderStationButtons = () => {
    return stations.map((station, index) => (
      <button
        key={index}
        className="btn btn-outline-primary m-1"
        onClick={() => handleStationSelect(station)} // Khi click sẽ gán vào Ga đi
      >
        {station}
      </button>
    ));
  };

  return (
    <div className="d-flex flex-column" style={{ backgroundColor: "#f7f7f7" }}>
      <Header />
      <main className="mt-4">
        <div className="container-fluid mt-2">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-header text-primary">
                  <h5 className="m-0 d-flex align-items-center" style={{ gap: "5px" }}>
                    <MdOutlineAccessTime /> Thông tin hành trình
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    {/* Ga đi */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="gaDi" className="form-label d-flex align-items-center">
                        <TbCircleNumber1 style={{ height: "20px", marginRight: "8px" }} />
                        Ga đi
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="gaDi"
                        placeholder="Nhập ga đi"
                        value={gaDi}
                        onChange={handleGaDiChange}
                      />
                    </div>

                    {/* Ga đến */}
                    <div className="col-md-6 mb-3 position-relative">
                      <label htmlFor="gaDen" className="form-label d-flex align-items-center">
                        <TbCircleNumber2 style={{ height: "20px", marginRight: "8px" }} />
                        Ga đến
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="gaDen"
                        placeholder="Nhập ga đến"
                        value={gaDen}
                        onChange={handleGaDenChange}
                        ref={gaDenInputRef} // Gắn ref để chuyển focus
                      />
                      {isDropdownOpen && (
                        <div className="dropdown-menu show" style={{ position: "absolute", zIndex: 1, width: "100%" }}>
                          {filteredStations.map((station, index) => (
                            <button
                              key={index}
                              className="dropdown-item"
                              onClick={() => handleStationSelect(station)} // Khi click sẽ gán vào Ga đi
                            >
                              {station}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    {/* Hóa đơn */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="hoaDuoi" className="form-label d-flex align-items-center">
                        Hóa đơn
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="hoaDuoi"
                        placeholder="Hóa đơn"
                        disabled
                      />
                    </div>

                    {/* Ngày */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="ngay" className="form-label d-flex align-items-center">
                        Ngày
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="ngay"
                        placeholder="Ngày"
                        disabled
                      />
                    </div>

                    {/* Hiển thị các nút bấm cho các tỉnh */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <h5>Chọn Ga đi từ danh sách</h5>
                      <div className="d-flex flex-wrap">
                        {renderStationButtons()}
                      </div>
                    </div>
                  </div>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
