import React, { useEffect, useState } from "react";
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import Course_Card from "./Course_Card";
import { SwiperOptions } from "swiper/types/swiper-options";

function Course_Slider({ Courses }: { Courses: any[] }) {
  useEffect(() => {
    const swiperParams : SwiperOptions = {
      slidesPerView: 1,
      spaceBetween: 25,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      freeMode: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1024: {
          slidesPerView: 3,
        },
      },
    };

   new Swiper('.swiper', swiperParams);
  }, []);

  return (
    <>
      {Courses?.length ? (
        <div className="swiper-container swiper max-h-[30rem]">
          <div className="swiper-wrapper">
            {Courses.map((course: any, i: number) => (
              <div className="swiper-slide" key={i}>
                <Course_Card course={course} Height={"h-[250px]"} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  );
}

export default Course_Slider;
