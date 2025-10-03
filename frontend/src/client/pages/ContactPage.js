import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";

export default function ContactPage() {
  return (
    <div className="d-flex flex-column" style={{ backgroundColor: "#f7f7f7" }}>
      <Header />
      <Carousel />
      <main className="mt-4">
        <div className="container mt-2">
          <div className="row d-flex justify-content-center">
            <div className="col-md-10">
              <div className="card shadow">
                <div className="card-body p-4">
                  <div className="row">
                    {/* Left Section */}
                    <div className="col-md-7">
                      <h4 className="text-primary">Thông tin liên hệ</h4>
                      <h5 className="mt-4 text-danger">Tổng công ty Đường sắt Việt Nam</h5>
                      <p>Số 118 Lê Duẩn, Hoàn Kiếm, Hà Nội.</p>
                      <p>Điện thoại: 19006469</p>
                      <p>
                        Email: <a href="/">dsvn@vr.com.vn</a>
                      </p>
                      <p>
                        Giấy chứng nhận DKDK số 113642 theo QD thành lập số
                        973/QD-TTg ngày 25/06/2010 của Thủ tướng Chính phủ.
                      </p>
                      <p>
                        Mã số doanh nghiệp: 0100105052, đăng ký lần đầu ngày
                        26/07/2010, đăng ký thay đổi lần 4 ngày 27/06/2014 tại Sở
                        KHDT Thành phố Hà Nội.
                      </p>
                    </div>

                    {/* Right Section */}
                    <div className="col-md-3 offset-md-2">
                      <h5 className="text-danger">Tổng đài hỗ trợ khách hàng</h5>
                      <p>Hotline: 19006469</p>
                      <p>Khu vực miền Bắc: 1900 0109</p>
                      <p>Khu vực miền Nam: 1900 1520</p>
                      <div className="d-flex flex-column">
                        <p>
                          Email:{" "}
                          <a href="/">support1@dsvn.vn</a>
                        </p>
                        <p>
                          Email:{" "}
                          <a href="/">support2@dsvn.vn</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
