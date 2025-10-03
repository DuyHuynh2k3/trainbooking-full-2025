import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "../../styles/Breadcrum.css";

export default function Breadcrumb({ category, title }) {
  const location = useLocation();

  // Map slug -> tên hiển thị
  const categoryMap = {
    "khuyen-mai": "Khuyến Mãi",
    "trong-nganh": "Trong Ngành",
    "noi-bo": "Nội Bộ",
    "atgt-duong-sat": "ATGT Đường Sắt",
  };

  const displayCategory = category ? categoryMap[category] || category : null;

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit", fontSize: "18px" }}>
              Trang chủ
            </Link>

            {/* Luôn hiển thị "Tin Tức" nếu URL bắt đầu bằng /blogs */}
            {location.pathname.startsWith("/blogs") && (
              <Link to="/blogs" style={{ textDecoration: "none", color: "inherit", fontSize: "18px" }}>
                Tin Tức
              </Link>
            )}

            {/* Hiển thị category nếu có */}
            {displayCategory && (
              <Link 
                to={`/blogs/${category}`} 
                style={{ textDecoration: "none", color: "inherit", fontSize: "18px" }}
              >
                {displayCategory}
              </Link>
            )}

            {/* Hiển thị title nếu có */}
            {title && (
              <span style={{ fontSize: "18px", fontWeight: "bold", color: "inherit" }}>
                {title}
              </span>
            )}
          </Breadcrumbs>
        </div>
      </div>
    </div>
  );
}
