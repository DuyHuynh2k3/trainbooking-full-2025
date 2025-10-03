import React from "react";
import "../../styles/Policies.css";
const Policies = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-9">
          <div className="card shadow-sm" style={{ border: "none" }}>
            <div className="card-body">
              <h1 className="mb-4 d-flex justify-content-center text-polici">
                QUY ĐỊNH ĐỔI, TRẢ VÉ TẾT ẤT TỴ 2025
              </h1>
              <h4>
                1. Thời gian cao điểm Tết: Mức khấu trừ đối với vé trả lại, đổi
                vé là 30% giá tiền in trên Thẻ lên tàu hoả (vé).
              </h4>
              <ul>
                <li>
                  Từ ngày 21/01/2025 đến ngày 31/01/2025: đối với đoàn tàu số
                  chẵn.
                </li>
                <li>
                  Từ ngày 02/02/2025 đến ngày 09/02/2025: đối với đoàn tàu số
                  lẻ.
                </li>
                <li>
                  Từ ngày 23/01/2025 đến ngày 27/01/2025: đối với đoàn tàu số lẻ
                  có ga đi là ga Hà Nội và có ga đến là ga Đồng Hới.
                </li>
                <li>
                  Từ ngày 31/01/2025 đến ngày 09/02/2025: đối với đoàn tàu có ga
                  đi từ ga Đồng Hới đến ga Phù Lý và có ga đến là ga Hà Nội.
                </li>
              </ul>
              <p>
                Hành khách đổi, trả vé cá nhân: chậm nhất trước giờ tàu chạy là
                24 giờ.
              </p>
              <p>
                Hành khách trả vé tập thể: chậm nhất trước giờ tàu chạy là 48
                giờ.
              </p>

              <h4>
                2. Ngoài thời gian quy định tại điểm (1.) nêu trên, mức khấu trừ
                phí, thời gian đổi, trả vé thực hiện như sau:
              </h4>
              <ul>
                <li>
                  Đổi vé: Vé cá nhân đổi trước giờ tàu chạy 24 giờ trở lên, lệ
                  phí là 20.000 đồng/vé; không áp dụng đổi vé đối với vé tập
                  thể.
                </li>
                <li>Trả vé:</li>
                <ul>
                  <li>
                    Vé cá nhân: Trả vé trước giờ tàu chạy từ 4 giờ đến dưới 24
                    giờ, lệ phí là 20% giá vé; từ 24 giờ trở lên lệ phí là 10%
                    giá vé.
                  </li>
                  <li>
                    Vé tập thể: Trả vé trước giờ tàu chạy từ 24 giờ đến dưới 72
                    giờ, lệ phí là 20% giá vé; từ 72 giờ trở lên lệ phí là 10%
                    giá vé.
                  </li>
                </ul>
              </ul>

              <h4>3. Hình thức trả vé:</h4>
              <p>
                - Khi hành khách mua vé và thanh toán online qua website bán vé
                của Ngành Đường sắt, app bán vé hoặc các ứng dụng khác thì có
                thể trả vé online qua các website bán vé của Ngành Đường sắt
                hoặc đến trực tiếp nhà ga.
              </p>
              <p>
                - Khi hành khách mua vé bằng các hình thức khác, muốn đổi, trả
                vé hành khách đến trực tiếp nhà ga kèm theo giấy tờ tùy thân bản
                chính của người đi tàu (hoặc người mua vé) cho nhân viên đường
                sắt. Đồng thời, thông tin trên thẻ đi tàu phải trùng khớp với
                giấy tờ tùy thân của hành khách.
              </p>

              <p className="mt-4">Trân trọng cảm ơn!</p>

              <div
                className="alert alert-info mt-3"
                style={{ fontSize: "18px" }}
              >
                <strong>Chú ý:</strong> Để xem chính sách giá vé và quy định đổi
                trả, Quý khách hàng vui lòng bấm vào <a href="/">đây</a>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
