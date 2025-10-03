import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import InfoSeat from "../components/InfoSeat";
import "bootstrap/dist/css/bootstrap.min.css";

const InfoSeatPage = () => {
  return (
    <div className="d-flex flex-column" style={{backgroundColor:"#f7f7f7"}}>
      <Header />
      <Carousel />
      <main className="mt-4">
        <InfoSeat />
       </main>
      <Footer />
    </div>
  );
};


export default InfoSeatPage;