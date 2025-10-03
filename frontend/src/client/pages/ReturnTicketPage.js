import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import ReturnTicket from "../components/ReturnTicket";
import "bootstrap/dist/css/bootstrap.min.css";

const ReturnTicketPage = () => {
  return (
    <div className="d-flex flex-column" style={{backgroundColor:"#f7f7f7"}}>
      <Header />
      <Carousel />
      <main className="">
        <ReturnTicket />
       </main>
      <Footer />
    </div>
  );
};


export default ReturnTicketPage;