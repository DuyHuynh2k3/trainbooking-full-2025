import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "../../styles/Carousel.css";

import image1 from "../../assets/img/8.jpg";
import image2 from "../../assets/img/9.jpg";
import image3 from "../../assets/img/10.jpg";
import bn1 from "../../assets/img//4.jpg";
import bn2 from "../../assets/img/5.jpg";

const Carousel = () => {
  const [animate, setAnimate] = useState(false);

  return (
    <div className="container-fluid mt-2">
      <div className="row d-flex justify-content-center">
        {/* Carousel bên trái */}
        <div className="col-lg-7 p-0">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={1000} // Giảm thời gian chuyển slide xuống (800ms)
            onSlideChange={() => {
              setAnimate(false);
              setTimeout(() => setAnimate(true), 50); // reset rồi bật lại animation
            }}
            className="mySwiper"
          >
            {[image1, image2, image3].map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className={`img-fluid ${animate ? "zoomOut" : ""}`}
                  style={{ height: "310px", width: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Banner bên phải */}
        <div className="col-lg-2 d-flex flex-column">
          <div className="mb-2">
            <img
              src={bn1}
              className="img-fluid"
              alt="Banner 1"
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
          </div>
          <div>
            <img
              src={bn2}
              className="img-fluid"
              alt="Banner 2"
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
