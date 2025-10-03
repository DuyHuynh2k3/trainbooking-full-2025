import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./client/pages/Homepage";
import InfoSeatPage from "./client/pages/InfoSeatPage";
import ReturnTicketPage from "./client/pages/ReturnTicketPage";
import RulesPage from "./client/pages/RulesPage";
import GoTrain from "./client/pages/GoTrainPage";
import BookingTicket from "./client/pages/BookingTicket";
import ContactPage from "./client/pages/ContactPage";
import HomeBlogPage from "./client/pages/BlogPage/HomeBlogPage";
import BlogDetailPage from "./client/pages/BlogPage/BlogDetailPage";
import HomePageResult from "./client/pages/HomePageResult";
import ForgetInfoSeatPage from "./client/pages/ForgetInfoSeatPage";
import TicketPrint from "./client/components/TicketPrint";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/resultticket" element={<HomePageResult />} />
      <Route path="/infoseat" element={<InfoSeatPage />} />
      <Route path="/ticket-print" element={<TicketPrint />} />
      <Route path="/returnticket" element={<ReturnTicketPage />} />
      <Route path="/forgetseat" element={<ForgetInfoSeatPage />} />
      <Route path="/rules" element={<RulesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/gotrain" element={<GoTrain />} />
      <Route path="/bookingticket" element={<BookingTicket />} />
      {/* Routes cho Blog */}
      <Route path="/blogs/:category" element={<HomeBlogPage />} />
       {/* Route mặc định (xem tất cả blog) */}
       <Route path="/blogs" element={<HomeBlogPage />} />
        {/* Route chi tiết blog */}
      <Route path="/blog/:id" element={<BlogDetailPage />} />
    </Routes>
  );
};

export default AppRoutes;
