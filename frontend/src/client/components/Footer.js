import React from "react";
import fb from "../../assets/img/facebook.png";
import td from "../../assets/img/icon-ksg-website.png";
import ytb from "../../assets/img/icon-youtube.png";
import mb from "../../assets/img/Member.png";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer mt-5 ">
      <div className="container">
        <div className="row text-light">
          {/* Cột Tra cứu */}
          <div className="col-lg-4 mb-4">
            <h5 className="footer-heading">TRA CỨU</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#timve" className="footer-link">
                  Tìm vé
                </a>
              </li>
              <li>
                <a href="#thongtin" className="footer-link">
                  Thông tin đặt chỗ
                </a>
              </li>
              <li>
                <a href="#giotau" className="footer-link">
                  Giờ tàu - Giá vé
                </a>
              </li>
              <li>
                <a href="#quydinh" className="footer-link">
                  Các quy định
                </a>
              </li>
            </ul>
          </div>

          {/* Cột Thông tin liên hệ */}
          <div className="col-lg-4 mb-4">
            <h5 className="footer-heading">THÔNG TIN LIÊN HỆ</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#huongdan" className="footer-link">
                  Hướng dẫn
                </a>
              </li>
              <li>
                <a href="#lienhe" className="footer-link">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#dangky" className="footer-link">
                  Đăng ký hội viên
                </a>
              </li>
            </ul>
          </div>

          {/* Cột Theo dõi chúng tôi */}
          <div className="col-lg-4 mb-2">
            <h5 className="footer-heading">THEO DÕI CHÚNG TÔI</h5>
            <div className="social-icons mb-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={fb}
                  className="img-fluid"
                  alt="Banner 1"
                  style={{ width: "", height: "50px" }}
                />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={td}
                  className="img-fluid"
                  alt="Banner 1"
                  style={{ width: "", height: "50px" }}
                />
              </a>
              <a
                href="https://website.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={ytb}
                  className="img-fluid"
                  alt="Banner 1"
                  style={{ width: "", height: "50px" }}
                />
              </a>
              <a
                href="https://member.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={mb}
                  className="img-fluid"
                  alt="Banner 1"
                  style={{ width: "", height: "50px" }}
                />
              </a>
            </div>
            <p className="hotline">
              Hotline: <span>1900 0109</span>
            </p>
          </div>
        </div>

        <div className="row text-light">
          <div className="col text-center">
            <p>
              Tổng công ty Đường sắt Việt Nam. Số 118 Lê Duẩn, Hoàn Kiếm, Hà
              Nội. Điện thoại: 19006469. Email: dsvn@vr.com.vn.
              <br />
              Giấy chứng nhận ĐKKD số 113642 theo QĐ thành lập số 973/QĐ-TTg
              ngày 25/06/2010 của Thủ tướng Chính phủ.
              <br />
              Mã số doanh nghiệp: 0100105052, đăng ký lần đầu ngày 26/07/2010,
              đăng ký thay đổi lần 4 ngày 27/06/2014 tại Sở KHĐT Thành phố Hà
              Nội.
            </p>
            <p>© Copyright by FPT Technology Solutions</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
