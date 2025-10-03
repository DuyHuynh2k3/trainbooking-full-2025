import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function Paginition({ postsPerPage, totalPosts }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Tính tổng số trang
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Lấy số trang từ URL (mặc định là 1 nếu không có ?page=)
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;

  // Hàm chuyển trang
  const handleChange = (event, value) => {
    navigate(`?page=${value}`);
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-lg-9 mt-2 d-flex justify-content-center">
          <Stack spacing={2}>
            {/* Pagination component */}
            <Pagination
              count={totalPages}  // Số trang động
              page={currentPage}   // Trang hiện tại từ URL
              onChange={handleChange}
              color="primary"
            />
          </Stack>
        </div>
      </div>
    </div>
  );
}
