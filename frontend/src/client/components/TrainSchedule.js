// src/components/TrainSchedule.js
import React, { useEffect, useState } from "react";
import icon from "../../assets/img/train-icon.png";
import "../../styles/TrainSchedule.css";
import { BsArrowRight } from "react-icons/bs";
import SeatSelect from "./SeatSelect";
import TripInfo from "./TripInfo";
import useStore from "../../store/trains";
import SeatSelectHardSleeper6 from "./SeatSelectHardSleeper6";
import SeatSelectHardSleeper4 from "./SeatSelectHardSleeper4";
import SeatSelectSoftSeat from "./SeatSelectSoftSeat";

const TrainSchedule = ({
  onAddToCart,
  trains,
  trainsReturn,
  loading,
  loadingReturn,
  error,
}) => {
  const { station } = useStore();
  const { departureStation, arrivalStation, departureDate, returnDate } =
    station;
  const isRoundTrip = station.ticketType === "roundTrip";

  // Trạng thái lưu thông tin ghế đang được chọn cho từng chuyến tàu
  const [selectedSeats, setSelectedSeats] = useState({});
  const [selectedSeatsReturn, setSelectedSeatsReturn] = useState({});
  const [selectedSeatPrices, setSelectedSeatPrices] = useState({});
  const [selectedSeatPricesReturn, setSelectedSeatPricesReturn] = useState({});
  const [selectedCarDeparture, setSelectedCarDeparture] = useState(null);
  const [selectedCarReturn, setSelectedCarReturn] = useState(null);
  const [selectedSeatTypeDeparture, setSelectedSeatTypeDeparture] =
    useState(null);
  const [selectedSeatTypeReturn, setSelectedSeatTypeReturn] = useState(null);
  const [enrichedTrains, setEnrichedTrains] = useState([]);
  const [enrichedTrainsReturn, setEnrichedTrainsReturn] = useState([]);

  // Thay đổi phần khai báo backendUrl
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

  const seatTypeDisplayName = {
    soft: "Ngồi mềm",
    hard_sleeper_4: "Nằm khoang 4",
    hard_sleeper_6: "Nằm khoang 6",
  };

  function isValidDate(date) {
    return date && !isNaN(new Date(date).getTime());
  }

  const fetchSeatAvailability = async ({
    trainID,
    travelDate,
    fromStationID,
    toStationID,
  }) => {
    try {
      const query = new URLSearchParams({
        trainID,
        travel_date: travelDate,
        from_station_id: fromStationID,
        to_station_id: toStationID,
      });

      const url = `${backendUrl}/api/seats?${query.toString()}`;
      console.log("Fetching seat availability from:", url);

      const res = await fetch(url);
      console.log("Response status:", res.status);

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          throw new Error(`HTTP ${res.status}: Không thể lấy dữ liệu ghế`);
        }
        throw new Error(
          errorData.error || `HTTP ${res.status}: Lỗi khi lấy dữ liệu ghế`
        );
      }

      const data = await res.json();
      console.log("Seat Availability Data:", data);

      return data.map((seatType) => ({
        ...seatType,
        coaches: seatType.coaches.map((coach) => ({
          ...coach,
          seat_numbers: coach.seat_numbers.map((seat) => ({
            ...seat,
            is_available:
              typeof seat.is_available === "boolean" ? seat.is_available : true,
          })),
        })),
      }));
    } catch (error) {
      console.error("Lỗi khi fetch seat availability:", {
        message: error.message,
        stack: error.stack,
      });
      return [];
    }
  };

  // Chiều đi
  useEffect(() => {
    async function loadSeatsForAllTrains() {
      const results = {};
      const normalize = (str) => str?.toLowerCase().trim();

      await Promise.all(
        trains.map(async (train) => {
          const departureStationID = train.train_stop.find(
            (stop) =>
              normalize(stop.station.station_name) ===
              normalize(station.departureStation)
          )?.station.station_id;

          const arrivalStationID = train.train_stop.find(
            (stop) =>
              normalize(stop.station.station_name) ===
              normalize(station.arrivalStation)
          )?.station.station_id;

          if (!departureStationID || !arrivalStationID) {
            console.warn(
              `❗Không tìm thấy station ID cho tàu ${train.train_name}`
            );
            results[train.trainID] = [];
            return;
          }

          const seats = await fetchSeatAvailability({
            trainID: train.trainID,
            travelDate: station.departureDate,
            fromStationID: departureStationID,
            toStationID: arrivalStationID,
          });

          results[train.trainID] = seats;
        })
      );

      const trainsWithSeats = trains.map((train) => ({
        ...train,
        seats: results[train.trainID] || [],
      }));

      setEnrichedTrains(trainsWithSeats);
    }

    if (Array.isArray(trains) && trains.length > 0 && station) {
      console.log("🚆 Bắt đầu fetch ghế cho chiều đi...");
      loadSeatsForAllTrains();
    } else {
      setEnrichedTrains([]);
    }
  }, [trains, station]);

  // Chiều về (khứ hồi)
  useEffect(() => {
    async function loadSeatsForAllTrainsReturn() {
      const results = {};
      const normalize = (str) => str?.toLowerCase().trim();

      await Promise.all(
        trainsReturn.map(async (train) => {
          const departureStationID = train.train_stop.find(
            (stop) =>
              normalize(stop.station.station_name) ===
              normalize(station.arrivalStation)
          )?.station.station_id;

          const arrivalStationID = train.train_stop.find(
            (stop) =>
              normalize(stop.station.station_name) ===
              normalize(station.departureStation)
          )?.station.station_id;

          if (!departureStationID || !arrivalStationID) {
            console.warn(
              `Không tìm thấy station ID chiều về cho tàu ${train.train_name}`
            );
            results[train.trainID] = [];
            return;
          }

          const seats = await fetchSeatAvailability({
            trainID: train.trainID,
            travelDate: station.returnDate,
            fromStationID: departureStationID,
            toStationID: arrivalStationID,
          });

          results[train.trainID] = seats;
        })
      );

      const trainsWithSeatsReturn = trainsReturn.map((train) => ({
        ...train,
        seats: results[train.trainID] || [],
      }));

      setEnrichedTrainsReturn(trainsWithSeatsReturn);
    }

    if (
      Array.isArray(trainsReturn) &&
      trainsReturn.length > 0 &&
      station.ticketType === "roundTrip"
    ) {
      console.log("🚆 Bắt đầu fetch ghế cho chiều về...");
      loadSeatsForAllTrainsReturn();
    } else {
      setEnrichedTrainsReturn([]);
    }
  }, [trainsReturn, station]);

  const handleSeatClick = (trainId, seatType, seatPrice, e, tripType) => {
    e.preventDefault();

    const normalizedTripType = tripType === "return" ? "return" : "oneway";

    if (normalizedTripType === "return") {
      setSelectedSeatsReturn((prev) => ({
        ...prev,
        [trainId]: prev[trainId] === seatType ? null : seatType,
      }));
      setSelectedSeatPricesReturn((prev) => ({
        ...prev,
        [trainId]: seatPrice,
      }));
      setSelectedSeatTypeReturn(seatType);
    } else {
      setSelectedSeats((prev) => ({
        ...prev,
        [trainId]: prev[trainId] === seatType ? null : seatType,
      }));
      setSelectedSeatPrices((prev) => ({
        ...prev,
        [trainId]: seatPrice,
      }));
      setSelectedSeatTypeDeparture(seatType);
    }

    console.log(
      `Đã chọn ghế loại ${seatType} cho ${
        normalizedTripType === "return" ? "chiều về" : "chiều đi"
      }`
    );
  };

  const renderSeatComponent = (train, stationtype = "Chiều Đi") => {
    if (!Array.isArray(train.seats) || train.seats.length === 0) {
      return <p>Không có ghế khả dụng cho chuyến tàu này.</p>;
    }

    const dynamicCars = [];
    if (Array.isArray(train.seats)) {
      train.seats.forEach((seatType) => {
        if (Array.isArray(seatType.coaches)) {
          seatType.coaches.forEach((coach) => {
            if (!dynamicCars.some((c) => c.id === coach.coach)) {
              dynamicCars.push({
                id: coach.coach,
                name: `Toa ${coach.coach}`,
                seatType: seatType.seat_type,
              });
            }
          });
        }
      });
    }

    if (dynamicCars.length === 0) {
      return <p>Không có toa nào khả dụng cho loại ghế này.</p>;
    }

    dynamicCars.sort((a, b) => b.id.localeCompare(a.id));

    const schedule = train.schedule?.[0];
    const departTime = schedule?.departTime;
    const arrivalTime = schedule?.arrivalTime;

    const isReturn = stationtype === "Chiều Về";
    const tripType = isReturn ? "return" : "oneway";

    const selectedSeat = isReturn
      ? selectedSeatsReturn[train.trainID]
      : selectedSeats[train.trainID];

    const setSelectedSeat = (seat) => {
      if (isReturn) {
        setSelectedSeatsReturn((prev) => ({
          ...prev,
          [train.trainID]: seat,
        }));
      } else {
        setSelectedSeats((prev) => ({
          ...prev,
          [train.trainID]: seat,
        }));
      }
    };

    const trainid = train.trainID;
    const seatPrice = isReturn
      ? selectedSeatPricesReturn[train.trainID]
      : selectedSeatPrices[train.trainID];

    const seatTypeToRender = isReturn
      ? selectedSeatTypeReturn
      : selectedSeatTypeDeparture;

    const selectedCar = isReturn ? selectedCarReturn : selectedCarDeparture;
    const setSelectedCar = isReturn
      ? setSelectedCarReturn
      : setSelectedCarDeparture;

    const componentProps = {
      trainid,
      stationtype,
      selectedSeat,
      setSelectedSeat,
      seatPrice,
      selectedCar,
      setSelectedCar,
      selectedSeatType: seatTypeToRender,
      cars: dynamicCars,
      trainName: train.train_name,
      departTime,
      arrivalTime,
      tripType,
      onAddToCart: (ticketData) => {
        const ticketWithTripType = {
          ...ticketData,
          tripType,
          price: seatPrice,
          departureDate:
            tripType === "return" ? station.returnDate : station.departureDate,
          departureStation:
            tripType === "return"
              ? station.arrivalStation
              : station.departureStation,
          arrivalStation:
            tripType === "return"
              ? station.departureStation
              : station.arrivalStation,
          selectedSeatType: seatTypeToRender,
          departTime,
          arrivalTime,
          train_stop: train.train_stop,
        };
        onAddToCart(ticketWithTripType);
      },
      allSeats: train.seats,
    };

    switch (seatTypeToRender) {
      case "hard_sleeper_6":
        return <SeatSelectHardSleeper6 {...componentProps} />;
      case "hard_sleeper_4":
        return <SeatSelectHardSleeper4 {...componentProps} />;
      case "soft":
        return <SeatSelectSoftSeat {...componentProps} />;
      default:
        return <SeatSelect {...componentProps} />;
    }
  };

  if (loading || loadingReturn) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-fluid mt-2">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-6 p-0">
          {/* Phần lịch trình chiều đi */}
          <div className="card shadow mb-4">
            <div className="card-header text-primary d-flex justify-content-between p-2">
              <TripInfo stationtype={"Chiều Đi"} />
              <div className="text-primary" style={{ fontWeight: "bold" }}>
                <strong>{Array.isArray(trains) ? trains.length : 0}</strong> Tàu
                chiều đi còn vé cho ngày này
              </div>
            </div>
            <div className="card-body">
              <form className="">
                {Array.isArray(enrichedTrains) && enrichedTrains.length > 0 ? (
                  enrichedTrains.map((train) => (
                    <div key={train.trainID} className="card shadow-sm mb-4">
                      <div className="card-body shadow-lg">
                        <div className="d-flex align-items-center border-bottom mt-1">
                          <div style={{ position: "relative" }}>
                            <img
                              alt="Train icon"
                              src={icon}
                              width="100"
                              className="mr-4"
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "30px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                color: "black",
                                fontWeight: "bold",
                                padding: "5px 10px",
                                borderRadius: "5px",
                              }}
                            >
                              {train.train_name}
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <p className="text-muted tongtime">
                                {train.duration}
                              </p>
                              <p className="text-warning giamgia">
                                {train.discount || "Không có giảm giá"}
                              </p>
                            </div>
                            {(() => {
                              const departureStop = train.train_stop.find(
                                (stop) =>
                                  stop.station.station_name
                                    .toLowerCase()
                                    .trim() ===
                                  station.departureStation.toLowerCase().trim()
                              );
                              const arrivalStop = train.train_stop.find(
                                (stop) =>
                                  stop.station.station_name
                                    .toLowerCase()
                                    .trim() ===
                                  station.arrivalStation.toLowerCase().trim()
                              );

                              if (departureStop && arrivalStop) {
                                return (
                                  <>
                                    <div className="d-flex justify-content-between">
                                      <div className="font-weight-bold gadi">
                                        {isValidDate(
                                          departureStop.departure_time
                                        )
                                          ? new Date(
                                              departureStop.departure_time
                                            ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              timeZone: "UTC",
                                            })
                                          : "Giờ xuất phát không hợp lệ"}
                                      </div>
                                      <span className="text-center">
                                        <BsArrowRight className="muiten" />
                                      </span>
                                      <div className="font-weight-bold gaden">
                                        {isValidDate(arrivalStop.arrival_time)
                                          ? new Date(
                                              arrivalStop.arrival_time
                                            ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              timeZone: "UTC",
                                            })
                                          : "Giờ đến không hợp lệ"}
                                      </div>
                                    </div>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <p>Không có lịch trình tàu</p>
                                  </>
                                );
                              }
                            })()}

                            <div className="d-flex justify-content-between text-muted mt-1">
                              <div className="gadi1">
                                {train.schedule && train.schedule.length > 0
                                  ? isValidDate(train.schedule[0]?.departTime)
                                    ? `${new Date(
                                        train.schedule[0]?.departTime
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                      })} từ ${
                                        train.train_stop.find(
                                          (stop) =>
                                            stop.station.station_name
                                              .toLowerCase()
                                              .trim() ===
                                            station.departureStation
                                              .toLowerCase()
                                              .trim()
                                        )?.station?.station_name
                                      }`
                                    : "Ngày xuất phát không hợp lệ"
                                  : "Không có thông tin lịch trình xuất phát"}
                              </div>
                              <div className="gaden1">
                                {train.schedule && train.schedule.length > 0
                                  ? isValidDate(train.schedule[0]?.arrivalTime)
                                    ? `${new Date(
                                        train.schedule[0]?.arrivalTime
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                      })} đến ${
                                        train.train_stop.find(
                                          (stop) =>
                                            stop.station.station_name
                                              .toLowerCase()
                                              .trim() ===
                                            station.arrivalStation
                                              .toLowerCase()
                                              .trim()
                                        )?.station?.station_name
                                      }`
                                    : "Ngày đến không hợp lệ"
                                  : "Không có thông tin lịch trình đến"}
                              </div>
                            </div>
                            <a
                              href="/"
                              className="chitietkm text-primary"
                              style={{ textDecoration: "none" }}
                            >
                              Chi tiết khuyến mãi
                            </a>
                          </div>
                        </div>
                        <div className="row mt-4">
                          {Array.isArray(train.seats) &&
                          train.seats.length > 0 ? (
                            train.seats.map((seat, index) => (
                              <div
                                className="col p-0"
                                key={index}
                                style={{
                                  border: "1px solid orange",
                                  height: "70px",
                                }}
                              >
                                <button
                                  className="btn border-0 seattype p-0"
                                  onClick={(e) =>
                                    handleSeatClick(
                                      train.trainID,
                                      seat.seat_type,
                                      seat.price,
                                      e,
                                      "oneway"
                                    )
                                  }
                                >
                                  {seatTypeDisplayName[seat.seat_type] ||
                                    seat.seat_type}
                                </button>
                                <button
                                  className="btn border-0 seatprice p-0"
                                  onClick={(e) =>
                                    handleSeatClick(
                                      train.trainID,
                                      seat.seat_type,
                                      seat.price,
                                      e,
                                      "oneway"
                                    )
                                  }
                                >
                                  Từ {seat.price.toLocaleString()}đ
                                </button>
                                <button
                                  className="btn border-0 seatavailabel p-0"
                                  onClick={(e) =>
                                    handleSeatClick(
                                      train.trainID,
                                      seat.seat_type,
                                      seat.price,
                                      e,
                                      "oneway"
                                    )
                                  }
                                  style={{
                                    backgroundColor: "#f5f5f5",
                                    height: "68px",
                                  }}
                                >
                                  {seat.available} Chỗ còn
                                </button>
                              </div>
                            ))
                          ) : (
                            <p>Không có dữ liệu ghế</p>
                          )}
                        </div>
                        {selectedSeats[train.trainID] && (
                          <div className="row mt-4">
                            <div className="col text-center">
                              {renderSeatComponent(train, "Chiều Đi")}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Không có tàu nào khả dụng cho chiều đi.</p>
                )}
              </form>
            </div>
          </div>
          {isRoundTrip && (
            <div className="card shadow mb-4">
              <div className="card-header text-primary d-flex justify-content-between p-2">
                <TripInfo stationtype={"Chiều Về"} />
                <div className="text-primary" style={{ fontWeight: "bold" }}>
                  <strong>
                    {Array.isArray(trainsReturn) ? trainsReturn.length : 0}
                  </strong>{" "}
                  Tàu chiều về còn vé cho ngày này
                </div>
              </div>

              <div className="card-body">
                <form>
                  {Array.isArray(enrichedTrainsReturn) &&
                  enrichedTrainsReturn.length > 0 ? (
                    enrichedTrainsReturn.map((train) => (
                      <div key={train.trainID} className="card shadow-sm mb-4">
                        <div className="card-body shadow-lg">
                          <div className="d-flex align-items-center border-bottom mt-1">
                            <div style={{ position: "relative" }}>
                              <img
                                alt="Train icon"
                                src={icon}
                                width="100"
                                className="mr-4"
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  top: "30px",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  color: "black",
                                  fontWeight: "bold",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                }}
                              >
                                {train.train_name}
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between">
                                <p className="text-muted tongtime">
                                  {train.duration}
                                </p>
                                <p className="text-warning giamgia">
                                  {train.discount || "Không có giảm giá"}
                                </p>
                              </div>
                              {(() => {
                                const departureStop = train.train_stop.find(
                                  (stop) =>
                                    stop.station.station_name
                                      .toLowerCase()
                                      .trim() ===
                                    station.arrivalStation.toLowerCase().trim()
                                );
                                const arrivalStop = train.train_stop.find(
                                  (stop) =>
                                    stop.station.station_name
                                      .toLowerCase()
                                      .trim() ===
                                    station.departureStation
                                      .toLowerCase()
                                      .trim()
                                );

                                if (departureStop && arrivalStop) {
                                  return (
                                    <>
                                      <div className="d-flex justify-content-between">
                                        <div className="font-weight-bold gadi">
                                          {isValidDate(
                                            departureStop.departure_time
                                          )
                                            ? new Date(
                                                departureStop.departure_time
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                timeZone: "UTC",
                                              })
                                            : "Giờ xuất phát không hợp lệ"}
                                        </div>
                                        <span className="text-center">
                                          <BsArrowRight className="muiten" />
                                        </span>
                                        <div className="font-weight-bold gaden">
                                          {isValidDate(arrivalStop.arrival_time)
                                            ? new Date(
                                                arrivalStop.arrival_time
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                timeZone: "UTC",
                                              })
                                            : "Giờ đến không hợp lệ"}
                                        </div>
                                      </div>
                                    </>
                                  );
                                } else {
                                  return (
                                    <>
                                      <p>Không có lịch trình tàu</p>
                                    </>
                                  );
                                }
                              })()}
                              <div className="d-flex justify-content-between text-muted mt-1">
                                <div className="gadi1">
                                  {train.schedule && train.schedule.length > 0
                                    ? isValidDate(train.schedule[0]?.departTime)
                                      ? `${new Date(
                                          train.schedule[0]?.departTime
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                        })} từ ${
                                          train.train_stop.find(
                                            (stop) =>
                                              stop.station.station_name
                                                .toLowerCase()
                                                .trim() ===
                                              station.arrivalStation
                                                .toLowerCase()
                                                .trim()
                                          )?.station?.station_name
                                        }`
                                      : "Ngày xuất phát không hợp lệ"
                                    : "Không có thông tin lịch trình xuất phát"}
                                </div>
                                <div className="gaden1">
                                  {train.schedule && train.schedule.length > 0
                                    ? isValidDate(
                                        train.schedule[0]?.arrivalTime
                                      )
                                      ? `${new Date(
                                          train.schedule[0]?.arrivalTime
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                        })} đến ${
                                          train.train_stop.find(
                                            (stop) =>
                                              stop.station.station_name
                                                .toLowerCase()
                                                .trim() ===
                                              station.departureStation
                                                .toLowerCase()
                                                .trim()
                                          )?.station?.station_name
                                        }`
                                      : "Ngày đến không hợp lệ"
                                    : "Không có thông tin lịch trình đến"}
                                </div>
                              </div>
                              <a
                                href="/"
                                className="chitietkm text-primary"
                                style={{ textDecoration: "none" }}
                              >
                                Chi tiết khuyến mãi
                              </a>
                            </div>
                          </div>

                          <div className="row mt-4">
                            {Array.isArray(train.seats) &&
                            train.seats.length > 0 ? (
                              train.seats.map((seat, index) => (
                                <div
                                  className="col p-0"
                                  key={index}
                                  style={{
                                    border: "1px solid orange",
                                    height: "70px",
                                  }}
                                >
                                  <button
                                    className="btn border-0 seattype p-0"
                                    onClick={(e) =>
                                      handleSeatClick(
                                        train.trainID,
                                        seat.seat_type,
                                        seat.price,
                                        e,
                                        "return"
                                      )
                                    }
                                  >
                                    {seatTypeDisplayName[seat.seat_type] ||
                                      seat.seat_type}
                                  </button>
                                  <button
                                    className="btn border-0 seatprice p-0"
                                    onClick={(e) =>
                                      handleSeatClick(
                                        train.trainID,
                                        seat.seat_type,
                                        seat.price,
                                        e,
                                        "return"
                                      )
                                    }
                                  >
                                    Từ {seat.price.toLocaleString()}đ
                                  </button>
                                  <button
                                    className="btn border-0 seatavailabel p-0"
                                    onClick={(e) =>
                                      handleSeatClick(
                                        train.trainID,
                                        seat.seat_type,
                                        seat.price,
                                        e,
                                        "return"
                                      )
                                    }
                                    style={{
                                      backgroundColor: "#f5f5f5",
                                      height: "68px",
                                    }}
                                  >
                                    {seat.available} Chỗ còn
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p>Không có dữ liệu ghế</p>
                            )}
                          </div>

                          {selectedSeatsReturn?.[train.trainID] && (
                            <div className="row mt-4">
                              <div className="col text-center">
                                {renderSeatComponent(train, "Chiều Về")}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Không có dữ liệu tàu chiều về</p>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="col-lg-3"></div>
      </div>
    </div>
  );
};

export default TrainSchedule;
