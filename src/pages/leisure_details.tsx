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
      <div className="flex flex-col gap-4">
        {/* 상단 정보 */}
        <div className="flex items-center gap-3 ml-[10px]">
          <p className="bg-[#447959] text-white w-[46px] h-[24px] rounded-[14px] text-[14px] flex items-center justify-center pt-[2px]">
            {TYPE_MAP[activity.activity_type] ?? "기타"}
          </p>
          <h1 className="text-[21px] font-bold">{detail.title}</h1>
          {activity.activity_type === "MOVIE" && (
            <p className="text-[#757575] text-[16px]">{(detail as MovieDetail).open_dt}~</p>
          )}
          {activity.activity_type === "EXHIBITION" && (
            <>
              <p className="ml-[6px] font-bold text-[#757575]">{(detail as ExhibitionDetail).location}</p>
              <p className="text-[#757575]">{(detail as ExhibitionDetail).start_date}~</p>
            </>
          )}
          {activity.activity_type === "PERFORMANCE" && (
            <>
              <p className="ml-[6px] font-bold text-[#757575]">{(detail as PerformanceDetail).location}</p>
              <p className="text-[#757575]">
                {(detail as PerformanceDetail).start_date} ~ {(detail as PerformanceDetail).end_date}
              </p>
            </>
          )}
        </div>

        {/* 메인 레이아웃 */}
        <div className="flex gap-8 justify-between">
          {/* 포스터 영역 (세로 전체 높이 고정) */}
          <div className="min-w-[331px] flex justify-center">
            <Image
              src={detail.image_url}
              alt="썸네일"
              width={331}
              height={445}
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col justify-between">

            <div className="flex flex-row mx-10 w-[1400px] justify-between">
              {/* 상세정보 + 버튼 */}
              <div className="flex flex-col justify-between flex-grow min-h-[260px]">
                <div className="text-[13px] text-gray-700 space-y-2 mb-4">
                  {/* 상세정보 - 기존 조건문 유지 */}
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

                {/* 버튼 영역 */}
                <div className="space-y-2">
                  <div className="text-[#757575]">
                    {activity.activity_type === "MOVIE" &&
                      "영화의 예매 페이지는 제공하지 않습니다."}
                    {activity.activity_type === "EXHIBITION" && (
                      <button
                        onClick={() => {
                          const url = extractURL((detail as ExhibitionDetail).url);
                          if (url) window.open(url, "_blank");
                          else alert("유효한 링크가 없습니다");
                        }}
                        className="underline text-sm"
                      >
                        전시 예약 페이지로 이동하기
                      </button>
                    )}
                    {activity.activity_type === "PERFORMANCE" && (
                      <button
                        onClick={() => {
                          const url = extractURL((detail as PerformanceDetail).link);
                          if (url) window.open(url, "_blank");
                          else alert("유효한 링크가 없습니다");
                        }}
                        className="underline text-sm"
                      >
                        공연 예약 페이지로 이동하기
                      </button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleBook(Number(activity.activity_id))}
                      className="text-sm border border-[#447959] text-[#447959] w-[152px] h-[30px] rounded-[20px]"
                    >
                      일정 등록하기
                    </button>
                    <button
                      onClick={handleToggleWish}
                      className={`border w-[90px] h-[30px] rounded-[20px] text-sm ${detail.isWished ? "bg-black text-white" : "text-black border-black"
                        }`}
                    >
                      {detail.isWished ? "찜 해제" : "찜하기"}
                    </button>
                  </div>
                </div>
              </div>

              {/* 카카오맵 */}
              <div className="min-w-[280px] min-h-[260px]">
                {activity.activity_type === "PERFORMANCE" && detail.latitude && detail.longitude ? (
                  <KakaoMapImage la={detail.latitude} lo={detail.longitude} />
                ) : (
                  <div className="text-sm text-gray-500">
                    {activity.activity_type === "MOVIE" || activity.activity_type === "EXHIBITION"
                      ? "지도는 제공하지 않습니다."
                      : "위치 정보 없음"}
                  </div>
                )}
              </div>
            </div>


            {/* 리뷰 영역 */}
            <div className="mt-6 border-t pt-4 flex overflow-x-auto gap-4 max-w-auto mx-10">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="min-w-[240px] max-w-[240px] h-[150px] border rounded-lg p-3 shadow-sm bg-white flex-shrink-0"
                >
                  <p className="text-sm mb-2">⭐ {review.rate}</p>
                  <p className="text-gray-700 text-sm line-clamp-4">{review.content}</p>
                </div>
              ))}
            </div>
          </div>



        </div>



      </div>
    </div>
  );
}