import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../styles/Header.css";

const Header = () => {
  return (
    <header className="bg-primary text-white py-3">
      <div className="container d-flex justify-content-center align-items-center">
        <div className="d-flex align-items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ height: "50px", marginRight: "20px" }}
            />
          </Link>
        </div>
        <nav className="d-flex">
          <Link to="/" className="text-white text-decoration-none mx-3">
            TÌM VÉ
          </Link>
          <Link to="/infoseat" className="text-white text-decoration-none mx-3">
            THÔNG TIN ĐẶT VÉ
          </Link>
          <Link
            to="/returnticket"
            className="text-white text-decoration-none mx-3"
          >
            TRẢ VÉ
          </Link>

          <div className="dropdown">
            <Link
              to="#"
              className="text-white text-decoration-none mx-3 dropdown-toggle"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              TIN TỨC
            </Link>
            <ul
              className="dropdown-menu bg-primary border-0"
              aria-labelledby="dropdownMenuLink"
            >
              <li>
                <Link
                  className="dropdown-item text-white"
                  to="/blogs/atgt-duong-sat"
                >
                  ATGT Đường Sắt
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item text-white"
                  to="/blogs/trong-nganh"
                >
                  Trong Ngành
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item text-white"
                  to="/blogs/khuyen-mai"
                >
                  Khuyến Mãi
                </Link>
              </li>
            </ul>
          </div>

          <div className="dropdown">
            <Link
              to="#"
              className="text-white text-decoration-none mx-3 dropdown-toggle"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              THÔNG TIN
            </Link>
            <ul
              className="dropdown-menu bg-primary border-0"
              aria-labelledby="dropdownMenuLink"
            >
              <li>
                <Link className="dropdown-item text-white" to="/rules">
                  CÁC QUY ĐỊNH
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-white" to="/">
                  HƯỚNG DẪN
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-white" to="/contact">
                  LIÊN HỆ
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
