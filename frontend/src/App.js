// src/App.js (FRONTEND)
import React, { useEffect, useState } from "react";
import AppRoutes from "./Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // QUAN TRỌNG: Backend chạy trên port 3000
    const backendUrl =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

    console.log("Frontend: Đang gọi API đến:", `${backendUrl}/api/hello`);

    fetch(`${backendUrl}/api/hello`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Frontend: Kết nối backend thành công!", data);
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setMessage("Lỗi kết nối đến backend");
      });
  }, []);

  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;
