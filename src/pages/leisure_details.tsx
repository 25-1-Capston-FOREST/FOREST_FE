import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { postBooking } from "@/lib/api/book";
import { getDetail } from "@/lib/api/detail";
import { getWishlist, deleteWish, postWish } from "@/lib/api/wish";
import KakaoMapImage from "@/components/KakaoMapImage";
import { getActivityReview } from "@/lib/api/review";

interface PerformanceDetail {
  performance_id: string;
  activity_id: string;
  performance_cd: string;
  title: string;
  image_url: string;
  start_date: string;
  end_date: string;
  time: string;
  region: string;
  location: string;
  runtime: string;
  cost: string;
  cast: string;
  genre: string;
  story: string;
  link: string;
  status: string;
  isWished?: boolean;
  wish_id?: string;
  latitude: number;
  longitude: number;
}

interface MovieDetail {
  activity_id: string;
  movie_id: string;
  movie_cd: string;
  title: string;
  image_url: string;
  open_dt: string;
  show_tm: string;
  genre_nm: string;
  director: string;
  actors: string;
  isWished?: boolean;
  wish_id?: string;
  latitude: number;
  longitude: number;
}

interface ExhibitionDetail {
  activity_type: string;
  exhibition_id: string;
  activity_id: string;
  title: string;
  image_url: string;
  start_date: string;
  end_date: string;
  location: string;
  contents: string;
  price: string;
  url: string;
  isWished?: boolean;
  wish_id?: string;
  latitude: number;
  longitude: number;
}

interface Activity {
  activity_id: string;
  activity_type: string;
  detail: PerformanceDetail | MovieDetail | ExhibitionDetail;
  isWished?: boolean;
  wish_id?: string;
}
// pages/detail.tsx


// 인터페이스 생략 (이전 코드와 동일)

export default function Detail() {
  const router = useRouter();
  const { activity_id } = router.query;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const extractURL = (link: string) => {
    const match = link.match(/https?:\/\/[^\s]+/);
    return match ? match[0] : null;
  };

  const TYPE_MAP: { [key: string]: string } = {
    MOVIE: "영화",
    PERFORMANCE: "공연",
    EXHIBITION: "전시",
  };

  const handleBook = async (activityId: number) => {
    try {
      const reserveDate = "2025-03-05 00:00:00";
      await postBooking(activityId, reserveDate);
      alert("예약이 완료되었습니다!");
    } catch (error) {
      console.error("예약 실패", error);
      alert("예약에 실패했어요 😢");
    }
  };

  const handleToggleWish = async () => {
    if (!activity || !activity.detail) return;
    try {
      if (activity.detail.isWished) {
        if (!activity.detail.wish_id) return;
        await deleteWish(activity.detail.wish_id);
      } else {
        await postWish(activity.activity_id);
      }

      const updated = await getDetail(activity_id as string);
      setActivity(updated.data);
    } catch (error) {
      console.error("찜 처리 실패", error);
      alert("찜 처리에 실패했어요 😢");
    }
  };

  useEffect(() => {
    if (!activity_id || typeof activity_id !== "string") return;

    const fetchData = async () => {
      try {
        const activityRes = await getDetail(activity_id);
        setActivity(activityRes.data);
        const reviewRes = await getActivityReview(activity_id);
        setReviews(Array.isArray(reviewRes) ? reviewRes : reviewRes.reviews || []);
      } catch (error) {
        console.error("데이터 로딩 실패", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchData();
  }, [activity_id]);

  if (!activity || !activity.detail) return <div>로딩 중...</div>;
  const detail = activity.detail;

  const averageRating = reviews.length
    ? (
      reviews.reduce((sum, r) => sum + parseFloat(r.rate), 0) / reviews.length
    ).toFixed(1)
    : "정보 없음";

  return (

    <div className="mx-10 mt-[3px]">
      <div className="flex gap-8">
        {/* 포스터 */}
        <div className="min-w-[331px]">
          <Image
            src={detail.image_url}
            alt="썸네일"
            width={331}
            height={445}
            className="rounded-lg"
          />
        </div>

        {/* 오른쪽 컨테이너 */}
        <div className="flex flex-col flex-1 gap-4">
          {/* 상세정보 + 버튼과 카카오맵 영역을 가로로 배치 */}
          <div className="flex gap-4">
            {/* 상세정보 + 버튼 (세로 스택) */}
            <div className="flex flex-col justify-between flex-1 text-[13px] text-gray-700">
              {/* 상세정보 */}
              <div className="space-y-2">
                {activity.activity_type === "MOVIE" && (
                  <>
                    <p>개봉일: {(detail as MovieDetail).open_dt}</p>
                    <p>러닝 타임: {(detail as MovieDetail).show_tm}분</p>
                    <p>감독: {(detail as MovieDetail).director}</p>
                    <p>출연진: {(detail as MovieDetail).actors || "정보 없음"}</p>
                    <p>장르: {(detail as MovieDetail).genre_nm}</p>
                  </>
                )}
                {activity.activity_type === "EXHIBITION" && (
                  <>
                    <p>전시장: {(detail as ExhibitionDetail).location}</p>
                    <p>
                      전시 기간: {(detail as ExhibitionDetail).start_date} ~{" "}
                      {(detail as ExhibitionDetail).end_date}
                    </p>
                    <p>입장료: {(detail as ExhibitionDetail).price}</p>
                    <p>내용: {(detail as ExhibitionDetail).contents || "설명 없음"}</p>
                  </>
                )}
                {activity.activity_type === "PERFORMANCE" && (
                  <>
                    <p>일시: {(detail as PerformanceDetail).time}</p>
                    <p>러닝타임: {(detail as PerformanceDetail).runtime}</p>
                    <p>출연진: {(detail as PerformanceDetail).cast || "정보 없음"}</p>
                    <p>장르: {(detail as PerformanceDetail).genre}</p>
                    <p>티켓 가격: {(detail as PerformanceDetail).cost}</p>
                  </>
                )}
              </div>

              {/* 버튼 */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => handleBook(Number(activity.activity_id))}
                  className="text-sm border border-[#447959] text-[#447959] w-[152px] h-[30px] rounded-[20px]"
                >
                  일정 등록하기
                </button>
                <button
                  onClick={handleToggleWish}
                  className={`border w-[90px] h-[30px] rounded-[20px] text-sm ${detail.isWished
                    ? "bg-black text-white"
                    : "text-black border-black"
                    }`}
                >
                  {detail.isWished ? "찜 해제" : "찜하기"}
                </button>
              </div>
            </div>

            {/* 카카오맵 - 상세정보+버튼 높이와 같도록 */}
            <div className="w-[300px]">
              {/* 고정 높이 맞추기 위해 부모 높이를 상세정보+버튼 높이로 맞춤 */}
              {/* 'relative'를 쓰고 height 지정 후, KakaoMapImage가 그 안에 꽉 차도록 */}
              <div className="relative h-full min-h-[300px]">
                {activity.activity_type === "PERFORMANCE" &&
                  detail.latitude &&
                  detail.longitude ? (
                  <KakaoMapImage
                    la={detail.latitude}
                    lo={detail.longitude}
                  />
                ) : (
                  <div className="text-sm text-gray-500 flex items-center justify-center h-full">
                    {activity.activity_type === "MOVIE" ||
                      activity.activity_type === "EXHIBITION"
                      ? "지도는 제공하지 않습니다."
                      : "위치 정보 없음"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 리뷰 영역 - 오른쪽 상세정보+버튼+카카오맵 아래에 가로 전체 사용 */}
          <div className="border-t pt-4">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.755 4.635 1.122 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="font-semibold">평균 평점 {averageRating}</span>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-2">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="min-w-[240px] max-w-[240px] h-[150px] border rounded-lg p-3 shadow-sm bg-white flex-shrink-0"
                >
                  <p className="text-sm mb-2">⭐ {review.rate}</p>
                  <p className="text-gray-700 text-sm line-clamp-4">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );



}
