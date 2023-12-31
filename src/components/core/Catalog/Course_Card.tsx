import React, { useEffect, useState } from "react"
// Icons
import { FaRegStar, FaStar } from "react-icons/fa"
import ReactStars from 'react-stars'
import { Link } from "react-router-dom"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"

function Course_Card({ course , Height } : { course : any, Height : string }) {
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReview)
    setAvgReviewCount(count)
  }, [course])
  // console.log("count............", avgReviewCount)
  console.log(course);

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              {/* <ReactStars
                count={5}
                size={20}
                value={avgReviewCount || 0}
                edit={false}
                color2="#ffd700"
              /> */}
              <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
              <span className="text-richblack-400">
                {course?.ratingAndReview?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Course_Card
