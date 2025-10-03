
import useStore from "../../store/trains";

// TripInfo.jsx
const TripInfo = ({ stationtype }) => {
  const { station } = useStore((state) => state);

  const formatDate = (date) => {
    if (!date) return null;
    const dateObj = new Date(date);
    if (isNaN(dateObj)) return null;

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <h5 className="card-title text-main m-0" style={{ fontWeight: "bold", fontSize: "16px" }}>
      <i className="bi bi-list"></i>
      {stationtype === "Chiều Đi"
        ? `Chiều đi: ngày ${formatDate(station.departureDate)} từ ${station.departureStation} đến ${station.arrivalStation}`
        : `Chiều về: ngày ${formatDate(station.returnDate)} từ ${station.arrivalStation} đến ${station.departureStation}`}
    </h5>
  );
};

export default TripInfo;
