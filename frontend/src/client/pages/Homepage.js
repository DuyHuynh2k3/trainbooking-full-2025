import React from "react";
import Header from "../components/Header";
import BookForm from "../components/BookForm";
import Policies from "../components/Policies";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatbaseWidget from "../components/ChatbaseWidget";

const HomePage = () => {
  return (
    <div className="d-flex flex-column" style={{backgroundColor:"#f7f7f7"}}>
      <Header />
      <Carousel />
      <main className="">
        <BookForm />
        <Policies />
      </main>
      <Footer />
      <ChatbaseWidget />
    </div>
  );
};


export default HomePage;
