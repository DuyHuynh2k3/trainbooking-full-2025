import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "../../styles/SeatSelect.css";
import headtrain from "../../assets/img/train1.png";
import train from "../../assets/img/train2.png";
import Tooltip from "@mui/material/Tooltip";

const SeatSelect = ({
  selectedSeat,
  setSelectedSeat,
  seatPrice,
  selectedCar,
  setSelectedCar,
  selectedSeatType,
  cars = [],
  allSeats,
  trainName,
  onAddToCart,
  departureDate,
}) => {
  const [seatsData, setSeatsData] = useState([]);

  const seatTypeLabels = {
    soft: "Ngồi mềm",
    hard_sleeper_4: "Nằm khoang 4",
    hard_sleeper_6: "Nằm khoang 6",
  };

  const filteredCars = cars.filter((car) => car.seatType === selectedSeatType);

  const carsWithHeadTrain = [
    ...filteredCars,
    { id: 0, type: "Đầu tàu", seatType: "Đầu tàu", name: trainName },
  ];

  useEffect(() => {
    if (filteredCars.length > 0) {
      setSelectedCar(filteredCars[0].id);
    }
  }, [selectedSeatType]);

  useEffect(() => {
    if (selectedCar && allSeats) {
      const seatTypeData = allSeats.find(
        (st) => st.seat_type === selectedSeatType
      );
      const coachData = seatTypeData?.coaches.find(
        (c) => c.coach === selectedCar
      );

      const seats = Array(48)
        .fill(null)
        .map((_, index) => {
          const seatNumber = (index + 1).toString().padStart(2, "0");
          const realSeat = coachData?.seat_numbers?.find(
            (s) => s.seat_number === seatNumber
          );
          return realSeat || null;
        });

      setSeatsData(seats);
    }
  }, [selectedCar, allSeats, selectedSeatType]);

  const handleSeatSelect = (seatNumber) => {
    if (selectedSeat === seatNumber) {
      setSelectedSeat(null);
      onAddToCart(null);
    } else {
      setSelectedSeat(seatNumber);
      const ticket = {
        trainName,
        seat: seatNumber,
        price: seatPrice,
        car: selectedCar,
        seatType: selectedSeatType,
        departureDate,
      };
      onAddToCart(ticket);
    }
  };

  const seatRows = [];
  for (let i = 0; i < 6; i++) {
    seatRows.push(seatsData.slice(i * 8, (i + 1) * 8));
  }

  return (
    <div className="container mt-2">
      <div className="seat-select-container">
        <div className="row d-flex justify-content-center align-items-center mb-3">
          <div className="col-12 pt-3">
            {carsWithHeadTrain.map((car) => (
              <div
                key={car.id}
                className="et-car-block ng-scope"
                onClick={() => car.id !== 0 && setSelectedCar(car.id)}
              >
                <div
                  className={
                    car.id === 0
                      ? "et-car-icon headtrain-right"
                      : `et-car-icon ${
                          selectedCar === car.id
                            ? "et-car-icon-selected"
                            : "et-car-icon-avaiable"
                        }`
                  }
                >
                  <Tooltip
                    title={`Toa số ${car.id === 0 ? "Đầu máy" : car.id} - ${
                      seatTypeLabels[selectedSeatType]
                    } điều hòa`}
                    placement="top"
                  >
                    <img
                      src={car.id === 0 ? headtrain : train}
                      alt={`Car ${car.id}`}
                      className="train-car"
                    />
                  </Tooltip>
                </div>
                <span className="text-primary">
                  {car.id === 0 ? car.name : car.id}
                </span>
              </div>
            ))}
            <p className="mt-2 fw-bold text-primary">
              Toa số {selectedCar}: {seatTypeLabels[selectedSeatType]} điều hòa
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 text-center et-car-floor">
          <div className="et-col-1-18 et-car-floor-full-height">
            <div className="et-bed-way et-full-width"></div>
            <div className="et-bed-way et-full-width text-center small ng-binding">
              Tầng 3
            </div>
            <div className="et-bed-way et-full-width text-center small ng-binding">
              Tầng 2
            </div>
            <div className="et-bed-way et-full-width text-center small ng-binding">
              Tầng 1
            </div>
          </div>

          <div className="et-col-8-9">
            <div className="et-bed-way et-full-width et-text-sm">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((comp) => (
                <div key={comp} className="et-col-1-8 text-center ng-binding">
                  Khoang {comp}
                </div>
              ))}
            </div>

            {seatRows.map((row, rowIndex) => (
              <div key={rowIndex} className="seat-floor">
                {row.map((seat, seatIndex) => (
                  <div
                    key={seatIndex}
                    className="et-col-1-16 et-seat-h-35 ng-isolate-scope"
                  >
                    <div
                      className={`et-bed-${
                        seatIndex % 2 === 0 ? "left" : "right"
                      }`}
                    >
                      <div className="et-bed-router">
                        <div className="et-bed-illu">
                          {seat ? (
                            seat.is_available ? (
                              <Button
                                className={`seat ${
                                  selectedSeat === seat.seat_number
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSeatSelect(seat.seat_number)
                                }
                                style={{
                                  backgroundColor:
                                    selectedSeat === seat.seat_number
                                      ? "orange"
                                      : "#fff",
                                  color: "black",
                                  border: "1px solid black",
                                }}
                              >
                                {seat.seat_number}
                              </Button>
                            ) : (
                              <Button
                                className="seat booked"
                                disabled
                                style={{
                                  backgroundColor: "#ffcdd2",
                                  color: "black",
                                  border: "1px solid black",
                                  cursor: "not-allowed",
                                }}
                              >
                                {seat.seat_number}
                                <span className="booked-badge">Đã đặt</span>
                              </Button>
                            )
                          ) : (
                            <div className="seat-empty"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelect;
