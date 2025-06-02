import MypageSidebar from "@/components/Mypagebar"
import { getUserReview } from "@/lib/api/review"
import { useEffect, useState } from "react"

interface DetailedInfo {
  performance_id: string
  activity_id: string
  performance_cd: string
  title: string
  image_url: string
  start_date: string
  end_date: string
  time: string
  region: string
  location: string
  runtime: string
  cost: string
  cast: string
  genre: string
  story: string
  link: string
  status: string
  keywords: string[] | null
}

interface Review {
  review_id: string
  user_activity_id: string
  user_id: string
  activity_id: string
  content: string
  created_at: string
  updated_at: string
  activity_type: string
  detailedInfo: DetailedInfo
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const res = await getUserReview()
        if (res?.success) {
          console.log("사용자 리뷰 리스트:", res.data)
          setReviews(res.data)
        } else {
          console.warn("리뷰 불러오기 실패:", res?.message)
        }
      } catch (error) {
        console.error("리뷰 리스트를 불러오는 중 오류 발생:", error)
      }
    }

    fetchUserReviews()
  }, [])

  return (
    <div className="flex flex-col">
      <MypageSidebar />

      <div className="flex flex-col mx-10 my-6">
        <h1 className="text-[15px] font-semibold mb-4">내가 작성한 리뷰</h1>

        {reviews.length === 0 ? (
          <p>작성한 리뷰가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map(review => (
              <li
                key={review.review_id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={review.detailedInfo.image_url}
                    alt={review.detailedInfo.title}
                    className="w-24 h-32 object-cover rounded-md"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{review.detailedInfo.title}</h2>
                    <p className="text-sm text-gray-500">
                      {review.detailedInfo.location} | {review.detailedInfo.start_date} ~ {review.detailedInfo.end_date}
                    </p>
                    <p className="mt-2 text-gray-800">{review.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      작성일: {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
