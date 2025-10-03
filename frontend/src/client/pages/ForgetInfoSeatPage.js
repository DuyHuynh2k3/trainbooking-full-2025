import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import ForgetInfoSeat from "../components/ForgetInfoSeat";

const ForgetInfoSeatPage = () => {
  return (
    <div className="d-flex flex-column" style={{ backgroundColor: "#f7f7f7" }}>
      <Header />
      <Carousel />
      <main className="mt-4">
        <ForgetInfoSeat />
      </main>
      <Footer />
    </div>
  );
};

export default ForgetInfoSeatPage;
