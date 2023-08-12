import React, { useEffect, useState } from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
//import { FreeMode, Pagination } from "swiper";
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import Course_Card from "./Course_Card"

function Course_Slider({ Courses  } : { Courses: any}) {
  return (
    <>
      {Courses?.length ? (
        <Swiper>
          {Courses?.map((course : any, i : number) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default Course_Slider
