export default function GetAvgRating(ratingArr : any) {
    if (ratingArr?.length === 0) return 0
    
    const totalReviewCount = ratingArr?.reduce((acc : any, curr : any) => {
      acc += curr.rating
      return acc
    }, 0)
  
    const multiplier = Math.pow(10, 1)
    const avgReviewCount =
      Math.round((totalReviewCount / ratingArr?.length) * multiplier) / multiplier
  
    return avgReviewCount
  }
  