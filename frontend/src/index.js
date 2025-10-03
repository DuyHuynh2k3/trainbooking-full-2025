import React from "react";
import ReactDOM from "react-dom/client"; // Import đúng module từ React 18+
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Tạo root container
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render ứng dụng
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
