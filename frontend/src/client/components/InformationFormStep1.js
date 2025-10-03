import React, { useState, useRef } from "react";
import HorizontalLinearStepper from "./Steper";
import "../../styles/InformationForm.css";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import zalopayLogo from "../../assets/img/logo-dvtt-ZLP.png";
import momoLogo from "../../assets/img/logo-dvtt-MOM.png";
import bankLogo from "../../assets/img/logo-dvtt-SML.png";
import atmLogo from "../../assets/img/the-noi-dia.png";
import visaLogo from "../../assets/img/the-quoc-te-no-jcb.png";
import uncheckLogo from "../../assets/img/checkbox-unchecked.svg";
import checkLogo from "../../assets/img/checkbox.svg";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import { useLocation } from "react-router-dom";
import useStore from "../../store/trains";
import TripInfo from "./TripInfo";

const steps = [
  "Nhập thông tin hành khách",
  "Xác nhận thông tin",
  "Thanh toán",
  "Hoàn tất",
];

const InformationFormStep1 = ({ onNext, onBack, formData, updateFormData }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { station, setstation, isRound } = useStore();

  const passengerNameRef = useRef(null);
  const passengerTypeRef = useRef(null);
  const idNumberRef = useRef(null);
  const fullNameRef = useRef(null);
  const termsRef = useRef(null);

  const location = useLocation();
  const storedCart = JSON.parse(localStorage.getItem("cartTickets")) || [];
  const [cartTickets, setCartTickets] = useState(
    location.state?.cartTickets || storedCart
  );

  console.log(
    "📥 Dữ liệu nhận được trong InformationFormStep1.js:",
    cartTickets
  );

  const seatTypeDisplayName = {
    soft: "Ngồi mềm",
    hard_sleeper_4: "Nằm khoang 4",
    hard_sleeper_6: "Nằm khoang 6",
  };

  const requiredFields = {
    passengerName: "Họ tên hành khách",
    passengerType: "Đối tượng",
    idNumber: "Số giấy tờ",
    fullName: "Họ và tên người đặt",
    terms: "Điều khoản",
    paymentMethod: "Phương thức thanh toán",
  };
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    let firstInvalidField = null;

    Object.keys(requiredFields).forEach((field) => {
      // Tạo key động
      let fieldKey = field.includes("passengerName")
        ? `passengerName-0`
        : field;
      fieldKey = field.includes("passengerType") ? `passengerType-0` : fieldKey;
      fieldKey = field.includes("idNumber") ? `idNumber-0` : fieldKey;

      const value = formData.passengerInfo[fieldKey];
      console.log(`Kiểm tra trường ${fieldKey}:`, value);

      if (
        field !== "terms" &&
        field !== "paymentMethod" &&
        (!value || value.trim() === "")
      ) {
        tempErrors[fieldKey] = `${requiredFields[field]} là bắt buộc`;
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = fieldKey;
        }
      } else if (field === "terms" && !formData.passengerInfo.terms) {
        tempErrors[field] = `${requiredFields[field]} là bắt buộc`;
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      } else if (
        field === "paymentMethod" &&
        !formData.passengerInfo.paymentMethod
      ) {
        tempErrors[field] = `${requiredFields[field]} là bắt buộc`;
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    setErrors(tempErrors);

    if (!isValid && firstInvalidField) {
      const fieldRefs = {
        "passengerName-0": passengerNameRef,
        "passengerType-0": passengerTypeRef,
        "idNumber-0": idNumberRef,
        fullName: fullNameRef,
        terms: termsRef,
        paymentMethod: null,
      };
      const targetRef = fieldRefs[firstInvalidField]?.current;
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: "smooth", block: "center" });
        targetRef.focus();
      }
    }

    return isValid;
  };

  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  const handleDeletePassenger = (index) => {
    // Cập nhật danh sách vé
    setCartTickets((prevTickets) => prevTickets.filter((_, i) => i !== index));

    // Cập nhật formData (nếu cần)
    updateFormData({
      ...formData,
      passengerInfo: Object.fromEntries(
        Object.entries(formData.passengerInfo).filter(
          ([key]) => !key.includes(`-${index}`)
        )
      ),
    });

    // Cập nhật localStorage
    localStorage.setItem("cartTickets", JSON.stringify(cartTickets));
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleCardClick = (cardType) => {
    if (selectedCard === cardType) {
      setSelectedCard(null);
      updateFormData({
        passengerInfo: {
          ...formData.passengerInfo,
          paymentMethod: "napas", // Reset về giá trị mặc định của Napas
        },
      });
    } else {
      setSelectedCard(cardType);
      updateFormData({
        passengerInfo: {
          ...formData.passengerInfo,
          paymentMethod: cardType === "atm" ? "atm" : "visa", // Lưu giá trị tương ứng
        },
      });
    }
    console.log(
      "Selected paymentMethod:",
      formData.passengerInfo.paymentMethod
    ); // Kiểm tra giá trị
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    console.log(`ID: ${id}, Giá trị nhập vào: ${value}`);
    console.log("Dữ liệu formData trước cập nhật:", formData.passengerInfo);
    updateFormData({
      passengerInfo: {
        ...formData.passengerInfo,
        [id]: type === "checkbox" ? checked : value,
      },
    });

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
    console.log("✅ Dữ liệu sau cập nhật:", formData.passengerInfo);
  };

  const handleNextLocal = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        console.log("🚀 Trip Info Before Navigate:", formData.tripInfo);
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
        onNext({
          cartTickets,
          passengerInfo: formData.passengerInfo,
          tripInfo: formData.tripInfo,
        }); // Truyền formData sang bước tiếp theo
      }, 1000);
    }
  };

  const handleBackLocal = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    onBack();
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    updateFormData({
      passengerInfo: {
        ...formData.passengerInfo,
        paymentMethod: selectedMethod,
      },
    });

    // Reset selectedCard nếu chọn phương thức khác Napas
    if (selectedMethod !== "napas") {
      setSelectedCard(null);
    }

    if (errors.paymentMethod) {
      setErrors((prev) => ({ ...prev, paymentMethod: null }));
    }
  };

  const handleConfirmFinish = () => {
    setOpenConfirmDialog(true);
  };

  const handleFinishConfirmed = () => {
    setOpenConfirmDialog(false);
    handleNextLocal();
  };

  const errorStyle = {
    borderColor: "red",
    boxShadow: "0 0 5px red",
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption"></Typography>;
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you're finished
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          </React.Fragment>
        )}
      </Box>
      <div className="card custom-card">
        <div className="card-header custom-card-header">
          <h4 style={{ color: "#E55A05" }}>THÔNG TIN GIỎ VÉ</h4>
        </div>
        <div className="card-body">
          <p
            className="custom-note"
            style={{ fontSize: "16px", color: "#3A87AD", fontWeight: "400" }}
          >
            Các vé có biểu tượng là các vé bị hết thời gian tạm giữ. Xin vui
            lòng loại bỏ các vé này khỏi danh sách vé đặt mua trước khi thực
            hiện giao dịch thanh toán tiền. Quý khách vui lòng điền đầy đủ,
            chính xác tất cả các thông tin về hành khách đi tàu bao gồm: Họ tên
            đầy đủ, số giấy tờ tùy thân (Số chứng minh nhân dân hoặc số hộ chiếu
            hoặc số giấy phép lái xe đường bộ được pháp luật Việt Nam công nhận
            hoặc ngày tháng năm sinh nếu là trẻ em hoặc thẻ sinh viên nếu là
            sinh viên). Để đảm bảo an toàn, minh bạch trong quá trình bán vé các
            thông tin này sẽ được nhân viên soát vé kiểm tra trước khi lên tàu
            theo đúng các quy định của Tổng công ty Đường sắt Việt Nam.
          </p>

          <table className="table custom-table">
            <thead>
              <tr>
                <th style={{ width: "300px" }}>Họ tên</th>
                <th>Thông tin chỗ</th>
                <th>Giá vé</th>
                <th>Giảm đối tượng</th>
                <th>Khuyến mãi</th>
                <th>Bảo hiểm</th>
                <th>Thành tiền (VNĐ)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartTickets.length > 0 ? (
                cartTickets.map((ticket, index) => (
                  <tr key={index}>
                    <td>
                      <div className="mb-2 d-flex align-items-center">
                        <span className="labelspan" style={{ width: "120px" }}>
                          Họ tên
                        </span>
                        <div style={{ width: "100%" }}>
                          <Tooltip
                            title="Vui lòng nhập họ tên hành khách"
                            placement="right"
                          >
                            <input
                              type="text"
                              className={`form-control custom-input ${
                                errors.passengerName ? "is-invalid" : ""
                              }`}
                              style={errors.passengerName ? errorStyle : {}}
                              placeholder="Thông tin hành khách"
                              id={`passengerName-${index}`}
                              onChange={(e) => {
                                console.log(
                                  `Nhập vào: ID = ${e.target.id}, Giá trị = ${e.target.value}`
                                );
                                handleInputChange(e);
                              }}
                              value={
                                formData.passengerInfo?.[
                                  `passengerName-${index}`
                                ] || ""
                              }
                            />
                          </Tooltip>
                          {errors[`passengerName-${index}`] && (
                            <div className="invalid-feedback">
                              {errors[`passengerName-${index}`]}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Đối tượng hành khách */}
                      <div className="mb-2 d-flex align-items-center">
                        <span className="labelspan" style={{ width: "120px" }}>
                          Đối tượng
                        </span>
                        <div style={{ width: "100%" }}>
                          <select
                            className={`form-control custom-input ${
                              errors[`passengerType-${index}`]
                                ? "is-invalid"
                                : ""
                            }`}
                            style={
                              errors[`passengerType-${index}`] ? errorStyle : {}
                            }
                            id={`passengerType-${index}`}
                            onChange={handleInputChange}
                            value={
                              formData.passengerInfo?.[
                                `passengerType-${index}`
                              ] || ""
                            }
                          >
                            <option value="">Chọn đối tượng</option>
                            <option value="0">Người lớn</option>
                            <option value="1">Trẻ em</option>
                            <option value="2">Người cao tuổi</option>
                            <option value="3">Sinh viên</option>
                          </select>
                          {errors[`passengerType-${index}`] && (
                            <div className="invalid-feedback">
                              {errors[`passengerType-${index}`]}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Số giấy tờ */}
                      <div className="mb-2 d-flex align-items-center">
                        <span className="labelspan" style={{ width: "120px" }}>
                          Số giấy tờ
                        </span>
                        <div style={{ width: "100%" }}>
                          <Tooltip
                            title="Vui lòng nhập số CMND hoặc Hộ chiếu hợp lệ"
                            placement="right"
                          >
                            <input
                              type="text"
                              className={`form-control custom-input ${
                                errors[`idNumber-${index}`] ? "is-invalid" : ""
                              }`}
                              style={
                                errors[`idNumber-${index}`] ? errorStyle : {}
                              }
                              id={`idNumber-${index}`}
                              onChange={handleInputChange}
                              value={
                                formData.passengerInfo?.[`idNumber-${index}`] ||
                                ""
                              }
                            />
                          </Tooltip>
                          {errors[`idNumber-${index}`] && (
                            <div className="invalid-feedback">
                              {errors[`idNumber-${index}`]}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-start">
                        <TripInfo
                          stationtype={
                            ticket.tripType === "return"
                              ? "Chiều Về"
                              : "Chiều Đi"
                          }
                        />
                        <div className="text-start">
                          {" "}
                          <p
                            className="m-0 text-dark fw-normal ms-1"
                            style={{ fontSize: "16px" }}
                          >
                            Tàu: {ticket.trainName}
                          </p>
                          <p
                            className="m-0 text-dark fw-normal ms-1"
                            style={{ fontSize: "16px" }}
                          >
                            Toa: {ticket.car}
                          </p>
                          <p
                            className="m-0 text-dark fw-normal ms-1"
                            style={{ fontSize: "16px" }}
                          >
                            {" "}
                            Ghế: {ticket.seat}
                          </p>
                          <p
                            className="m-0 text-dark fw-normal ms-1"
                            style={{ fontSize: "16px" }}
                          >
                            Loại:{" "}
                            {seatTypeDisplayName[ticket.seatType] ||
                              ticket.seatType}
                            .
                          </p>
                          <p
                            className="m-0 text-dark fw-normal ms-1"
                            style={{ fontSize: "16px" }}
                          >
                            Thời gian chạy:{" "}
                            {(() => {
                              const fromStation = ticket.departureStation
                                .toLowerCase()
                                .trim();
                              const toStation = ticket.arrivalStation
                                .toLowerCase()
                                .trim();

                              const departureStop = ticket.train_stop?.find(
                                (stop) =>
                                  stop.station.station_name
                                    .toLowerCase()
                                    .trim() === fromStation
                              );
                              const arrivalStop = ticket.train_stop?.find(
                                (stop) =>
                                  stop.station.station_name
                                    .toLowerCase()
                                    .trim() === toStation
                              );

                              if (departureStop && arrivalStop) {
                                return (
                                  <>
                                    {isValidDate(departureStop.departure_time)
                                      ? new Date(
                                          departureStop.departure_time
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          timeZone: "UTC",
                                        })
                                      : "Giờ xuất phát không hợp lệ"}{" "}
                                    -{" "}
                                    {isValidDate(arrivalStop.arrival_time)
                                      ? new Date(
                                          arrivalStop.arrival_time
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          timeZone: "UTC",
                                        })
                                      : "Giờ đến không hợp lệ"}
                                  </>
                                );
                              } else {
                                return "Không có lịch trình tàu";
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{ticket.price.toLocaleString()} VND</td>
                    <td>0</td>
                    <td>Không có khuyến mãi</td>
                    <td>1,000 VND</td>
                    <td>{(ticket.price + 1000).toLocaleString()} VND</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeletePassenger(index)}
                      >
                        Xóa vé
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Chưa có vé nào được chọn
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="table-info">
              <tr
                style={{
                  borderTop: "2px solid #CCCCCC",
                  fontSize: "17px",
                  fontWeight: "400",
                }}
              >
                <td colSpan={6} style={{ textAlign: "right" }}>
                  Tổng tiền
                </td>
                <td>
                  {cartTickets
                    .reduce((total, ticket) => total + ticket.price + 1000, 0)
                    .toLocaleString()}{" "}
                  VND
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Phần thông tin người đặt vé */}
      <div className="card custom-card mt-4">
        <div className="card-header custom-card-header">
          <h4 style={{ color: "#E55A05" }}>Thông tin người đặt vé</h4>
        </div>
        <div className="card-body">
          <span style={{ color: "#3A87AD" }}>
            Quý khách vui lòng điền đầy đủ và chính xác các thông tin về người
            mua vé dưới đây. Các thông tin này sẽ được sử dụng để xác minh người
            mua vé và lấy vé tại ga trước khi lên tàu theo đúng các quy định của
            Tổng công ty Đường sắt Việt Nam.
          </span>
          <form>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="fullName" className="form-label custom-label">
                  Họ và tên*
                </label>
                <input
                  ref={fullNameRef}
                  type="text"
                  className={`form-control custom-input ${
                    errors.fullName ? "is-invalid" : ""
                  }`}
                  style={errors.fullName ? errorStyle : {}}
                  id="fullName"
                  onChange={handleInputChange}
                  value={formData.passengerInfo.fullName || ""}
                />
                {errors.fullName && (
                  <div className="invalid-feedback">{errors.fullName}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="idNumber" className="form-label custom-label">
                  Số CMND/Hộ chiếu*
                </label>
                <input
                  type="text"
                  className={`form-control custom-input ${
                    errors.idNumber ? "is-invalid" : ""
                  }`}
                  style={errors.idNumber ? errorStyle : {}}
                  id="idNumber"
                  onChange={handleInputChange}
                  value={formData.passengerInfo.idNumber || ""}
                />
                {errors.idNumber && (
                  <div className="invalid-feedback">{errors.idNumber}</div>
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="email" className="form-label custom-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control custom-input"
                  id="email"
                  onChange={handleInputChange}
                  value={formData.passengerInfo.email || ""}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="confirmEmail"
                  className="form-label custom-label"
                >
                  Xác nhận email
                </label>
                <input
                  type="email"
                  className="form-control custom-input"
                  id="confirmEmail"
                  onChange={handleInputChange}
                  value={formData.passengerInfo.confirmEmail || ""}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label custom-label">
                  Số di động
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  id="phone"
                  onChange={handleInputChange}
                  value={formData.passengerInfo.phone || ""}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Phần thông tin xuất hóa đơn điện tử */}
      <div className="card custom-card mt-4">
        <div className="card-header custom-card-header">
          <h4 style={{ color: "#E55A05" }}>Thông tin xuất hóa đơn điện tử</h4>
        </div>
        <div className="card-body">
          <form>
            <div className="row mb-3">
              <div className="col-md-6">
                <label
                  htmlFor="companyName"
                  className="form-label custom-label"
                >
                  Tên Công ty/Đơn vị
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  id="companyName"
                  onChange={handleInputChange}
                  value={formData.passengerInfo.companyName || ""}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="taxCode" className="form-label custom-label">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  id="taxCode"
                  onChange={handleInputChange}
                  value={formData.passengerInfo.taxCode || ""}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="address" className="form-label custom-label">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  id="address"
                  onChange={handleInputChange}
                  value={formData.passengerInfo.address || ""}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Phần phương thức thanh toán */}
      <div className="card custom-card mt-4">
        <div className="card-header custom-card-header">
          <h4 style={{ color: "#E55A05" }}>Phương thức thanh toán</h4>
        </div>
        <div className="card-body">
          <FormControl style={{ width: "100%" }}>
            <RadioGroup
              aria-labelledby="payment-method-label"
              name="payment-method"
              onChange={handlePaymentMethodChange}
              value={formData.passengerInfo.paymentMethod || ""}
            >
              <div className="payment-method-container">
                <FormControlLabel
                  value="zalo"
                  control={<Radio />}
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={zalopayLogo}
                        alt="Zalo Logo"
                        style={{ marginRight: "10px" }}
                      />
                      <div>
                        <div>
                          Thanh toán trực tuyến qua công thanh toán ZaloPay
                        </div>
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          - Thanh toán bằng hình thức Quét mã QR sử dụng ví điện
                          tử ZaloPay
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
              <div className="payment-method-container">
                <FormControlLabel
                  value="momo"
                  control={<Radio />}
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={momoLogo}
                        alt="Momo Logo"
                        style={{ marginRight: "10px" }}
                      />
                      <div>
                        <div>Thanh toán trực tuyến qua ví điện tử MoMo</div>
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          - Nhập mã MOMODSVN giảm đến 100k tại mục Ưu đãi
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            </RadioGroup>
            {errors.paymentMethod && (
              <div className="invalid-feedback d-block">
                {errors.paymentMethod}
              </div>
            )}
          </FormControl>
          <div className="mt-3">
            <div className="form-check">
              <input
                ref={termsRef}
                className={`form-check-input ${
                  errors.terms ? "is-invalid" : ""
                }`}
                type="checkbox"
                id="terms"
                onChange={handleInputChange}
                checked={formData.passengerInfo.terms || false}
              />
              <label className="form-check-label" htmlFor="terms">
                Tôi đã đọc kỹ và đồng ý tuân thủ tất cả các quy định mua vé trực
                tuyến, các chương trình khuyến mại của Tổng công ty đường sắt
                Việt Nam và chịu trách nhiệm về tính xác thực của các thông tin
                trên.
              </label>
              {errors.terms && (
                <div className="invalid-feedback d-block">{errors.terms}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Di chuyển các nút Next và Back xuống dưới cùng */}
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={activeStep === 0}
          onClick={handleBackLocal}
          sx={{
            mr: 1,
            width: "150px",
          }}
        >
          Quay lại
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {isStepOptional(activeStep) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSkip}
            sx={{
              mr: 1,
              width: "150px",
            }}
          >
            Bỏ qua
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={
            activeStep === steps.length - 1
              ? handleConfirmFinish
              : handleNextLocal
          }
          disabled={
            Object.keys(errors).length > 0 ||
            !formData.passengerInfo.terms ||
            !formData.passengerInfo.paymentMethod ||
            isSubmitting
          }
          sx={{
            width: "150px",
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : activeStep === steps.length - 1 ? (
            "Hoàn tất"
          ) : (
            "Tiếp theo"
          )}
        </Button>
      </Box>

      {/* Dialog xác nhận hoàn tất */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Xác nhận hoàn tất</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hoàn tất quá trình đặt vé không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Hủy</Button>
          <Button onClick={handleFinishConfirmed} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hiển thị trạng thái thanh toán */}
      {paymentStatus === "success" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Thanh toán thành công!
        </Alert>
      )}
      {paymentStatus === "failed" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Thanh toán thất bại. Vui lòng thử lại.
        </Alert>
      )}
    </div>
  );
};

export default InformationFormStep1;
