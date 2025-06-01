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
      const res = await postBooking(activityId, reserveDate);
      console.log("예약 성공!", res);
      alert("예약이 완료되었습니다!");
    } catch (error) {
      console.error("예약 실패", error);
      alert("예약에 실패했어요 😢");
    }
  };

  const handleToggleWish = async () => {
    try {
      if (!activity || !activity.detail) return;

      if (activity.detail.isWished) {
        if (!activity.detail.wish_id) {
          console.error("wish_id가 없습니다 ❌");
          alert("찜 해제에 실패했어요 😢");
          return;
        }

        await deleteWish(activity.detail.wish_id);
        alert("찜이 해제되었습니다!");
      } else {
        await postWish(activity.activity_id);
        alert("찜에 추가되었습니다!");
      }

      if (activity_id && typeof activity_id === "string") {
        const updated = await getDetail(activity_id);
        setActivity({
          ...updated.data,
          detail: {
            ...updated.data.detail,
            isWished: updated.data.detail.isWished,
            wish_id: updated.data.detail.wish_id,
          },
        });
      }
    } catch (error) {
      console.error("찜 처리 실패 ❌", error);
      alert("찜 처리에 실패했어요 😢");
    }
  };

  useEffect(() => {
    if (!activity_id || typeof activity_id !== "string") return;

    const fetchActivity = async () => {
      try {
        const data = await getDetail(activity_id);
        setActivity(data.data);
      } catch (error) {
        console.error("여가 정보 불러오기 실패", error);
        alert("여가 정보를 불러오는 데 실패했어요 😢");
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await getActivityReview(activity_id as string);
        console.log("API 응답 데이터:", data); // ← 여기를 꼭 확인!
        setReviews(Array.isArray(data) ? data : data.reviews || []);
      } catch (error) {
        console.error("리뷰 불러오기 실패", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchActivity();
    fetchReviews();
  }, [activity_id]);

  if (!activity || !activity.detail) {
    return <div>로딩 중...</div>;
  }

  const detail = activity.detail;

  const averageRating = reviews.length
    ? (
      reviews.reduce((sum, review) => sum + parseFloat(review.rate), 0) / reviews.length
    ).toFixed(1)
    : "정보 없음";

  return (
    <div className="mx-10 mt-[3px] w-max-auto">
      <div>
        <div className="flex flex-row ml-[10px] items-center gap-3">
          <p className="flex items-center justify-center text-white w-[46px] h-[24px] rounded-[14px] text-[14px] bg-[#447959] pt-[2px]">
            {TYPE_MAP[activity.activity_type] ?? "기타"}
          </p>
          <h1 className="text-[21px] font-bold">{detail.title}</h1>
          {activity.activity_type === "MOVIE" && (
            <p className="text-[#757575] text-[16px]">{(detail as MovieDetail).open_dt}~</p>
          )}
          {activity.activity_type === "EXHIBITION" && (
            <>
              <p className="ml-[6px] font-bold text-[#757575] text-[16px]">{(detail as ExhibitionDetail).location}</p>
              <p className="text-[#757575] text-[16px]">{(detail as ExhibitionDetail).start_date}~</p>
            </>
          )}
          {activity.activity_type === "PERFORMANCE" && (
            <>
              <p className="ml-[6px] font-bold text-[#757575] text-[16px]">{(detail as PerformanceDetail).location}</p>
              <p className="text-[#757575] text-[16px]">
                {(detail as PerformanceDetail).start_date} ~ {(detail as PerformanceDetail).end_date}
              </p>
            </>
          )}
        </div>

        <div className="ml-[10px] mt-[10px] flex flex-row items-start justify-start gap-5">
          <div className="flex items-start justify-center h-full">
            <Image
              src={detail.image_url}
              alt="썸네일"
              width={331}
              height={0}
              className="h-auto object-contain max-h-[550px]"
            />
          </div>
          <div className="flex flex-col mx-auto px-1">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <div className="flex mt-[4px] flex-col gap-[6px] text-[13px] w-[651px] h-[125px] text-gray-700">
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
                      <p>전시 기간: {(detail as ExhibitionDetail).start_date} ~ {(detail as ExhibitionDetail).end_date}</p>
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

                  {/* 예약 버튼 */}
                  <div className="text-[#757575] mt-4 mb-2">
                    {activity.activity_type === "MOVIE" && (
                      <p>영화의 예매 페이지는 제공하지 않습니다.</p>
                    )}
                    {activity.activity_type === "EXHIBITION" && (
                      <button
                        onClick={() => {
                          const url = extractURL((detail as ExhibitionDetail).url);
                          if (url) window.open(url, "_blank");
                          else alert("유효한 링크가 없습니다");
                        }}
                        className="underline text-blue-600"
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
                        className="underline text-blue-600"
                      >
                        공연 예약 페이지로 이동하기
                      </button>
                    )}
                  </div>

                  {/* 버튼 영역 */}
                  <div className="flex flex-row gap-3 mt-2">
                    <button
                      onClick={() => handleBook(Number(activity.activity_id))}
                      className="text-sm border border-[#447959] text-[#447959] px-4 py-[2px] rounded-[20px]"
                    >
                      일정 등록하기
                    </button>
                    <button
                      onClick={handleToggleWish}
                      className={`text-sm px-4 py-[2px] rounded-[20px] border ${detail.isWished ? "bg-black text-white border-black" : "text-black border-black"
                        }`}
                    >
                      {detail.isWished ? "찜 해제" : "찜하기"}
                    </button>
                  </div>

                </div>

                <div className="mr-[10px]">
                  {activity.activity_type === "PERFORMANCE" ? (
                    detail.latitude && detail.longitude ? (
                      <KakaoMapImage la={detail.latitude} lo={detail.longitude} />
                    ) : (
                      <div className="w-[400px] h-[247px] bg-[#D9D9D9] flex items-center justify-center text-[#888] text-sm">
                        위치 정보 없음
                      </div>
                    )
                  ) : (
                    <div className="text-[#757575] w-[300px] mt-[55px]">
                      영화관/전시장 지도는 제공하지 않습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 리뷰 영역 */}
              <div className="mt-4 border-t pt-4">
                {/* 평균 평점*/}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.755 4.635 1.122 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-semibold">평균 평점 {averageRating}</span>
                </div>

                {/* 리뷰 카드 리스트 */}
                <div className="flex overflow-x-auto space-x-4 pb-2">
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
      </div>
    </div>
  );
}
