import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";

export default function RulesPage() {
  return (
    <div className="d-flex flex-column" style={{ backgroundColor: "#f7f7f7" }}>
      <Header />
      <Carousel />
      <main className="mt-4">
        <div className="container-fluid mt-2">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-9">
              <div className="card shadow">
                <div className="card-header text-primary">
                  <h5
                    className="m-0 d-flex align-items-center"
                    style={{ gap: "5px" }}
                  >
                    CÁC QUY ĐỊNH
                  </h5>
                </div>
                <div className="card-body p-1">
                  <div className="list-group list-group-flush">
                    <a
                      href="/PDF/QuyDinhMuaVeTauTrucTuyen.pdf"
                      target="_blank"
                      className="list-group-item list-group-item-action"
                    >
                      QUY ĐỊNH MUA VÉ TÀU TRỰC TUYẾN
                    </a>
                    <a
                      href="/PDF/ChinhSachBaoMatThongTin.pdf"
                      target="_blank"
                      className="list-group-item list-group-item-action"
                    >
                      CHÍNH SÁCH BẢO MẬT THÔNG TIN
                    </a>
                    <a
                      href="/PDF/QuyDinhVanChuyen.pdf"
                      target="_blank"
                      className="list-group-item list-group-item-action"
                    >
                      QUY ĐỊNH VẬN CHUYỂN
                    </a>
                    <a
                      href="/PDF/DieuKienSuDung.pdf"
                      target="_blank"
                      className="list-group-item list-group-item-action"
                    >
                      ĐIỀU KIỆN SỬ DỤNG
                    </a>
                    <a
                      href="/PDF/QuyTrinhHoanTienVeTaiKhoan.pdf"
                      target="_blank"
                      className="list-group-item list-group-item-action"
                    >
                      QUY TRÌNH HOÀN TIỀN VỀ TÀI KHOẢN
                    </a>
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
