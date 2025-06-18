import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import MypageSidebar from "@/components/Mypagebar";
import { getWishlist, deleteWish, postWish } from "@/lib/api/wish";
import { postBooking, getBookedActivities } from "@/lib/api/book";
import { getPlannedlist, getCompletedlist } from "@/lib/api/useractivities";
import { postReview } from "@/lib/api/review";

export default function Myleisure() {
  const router = useRouter();
  const { tab } = router.query;
  const [selectedTab, setSelectedTab] = useState("Wish List");
  const [bookmarkedLeisure, setBookmarkedLeisure] = useState([]);
  const [reservedLeisure, setReservedLeisure] = useState([]);
  const [finishedLeisure, setFinishedLeisure] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const starRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [reviewText, setReviewText] = useState("");
  const [selectedUserActivityId, setSelectedUserActivityId] = useState<string | null>(null);

  // 별점 핸들러
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !starRef.current) return;
    const rect = starRef.current.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width)); // 바깥 클릭 방지

    const percent = offsetX / rect.width;
    const newRating = Math.round(percent * 10) / 2; // 0.5 단위 반올림
    setRating(Math.min(5, Math.max(0, newRating)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (typeof tab === "string") {
      setSelectedTab(tab);
    }
  }, [tab]);

  const TYPE_MAP: { [key: string]: string } = {
    MOVIE: "영화",
    PERFORMANCE: "공연",
    EXHIBITION: "전시",
  };

  const getCurrentList = () => {
    switch (selectedTab) {
      case "Wish List":
        return bookmarkedLeisure;
      case "Planned Leisure":
        return reservedLeisure;
      case "Completed Leisure":
        return finishedLeisure;
      default:
        return [];
    }
  };

  const handleToggleWish = async (item) => {
    try {
      if (item.isWished) {
        console.log("삭제할 wish_id:", item.wish_id);
        await deleteWish(item.wish_id);
        alert("찜이 해제되었습니다!");
      } else {
        console.log("추가할 activity_id:", item.activity_id);
        await postWish(item.activity_id);
        alert("찜에 추가되었습니다!");
      }
      // 목록 새로고침
      if (selectedTab === "Wish List") {
        const res = await getWishlist();
        console.log("Wish List 응답:", res);
        setBookmarkedLeisure(
          res.data.map((item) => ({
            ...item,
            isWished: true,
          }))
        );
      }
    } catch (error) {
      console.error("찜 처리 실패", error);
      alert("찜 처리에 실패했어요 😢");
    }
  };


  useEffect(() => {
    const fetchReservedLeisure = async () => {
      try {
        const res = await getPlannedlist();
        console.log("Planned Leisure 응답", res);
        setReservedLeisure(res.data);
      } catch (error) {
        console.error("Planned Leisure 불러오기 실패", error);
      }
    };

    if (selectedTab === "Planned Leisure") {
      fetchReservedLeisure();
    }
  }, [selectedTab]);


  useEffect(() => {
    const fetchFinishedLeisure = async () => {
      try {
        const res = await getCompletedlist();
        console.log("Completed Leisure 응답", res);
        setFinishedLeisure(res.data);
      } catch (error) {
        console.error("Completed Leisure 불러오기 실패", error);
      }
    };

    if (selectedTab === "Completed Leisure") {
      fetchFinishedLeisure();
    }
  }, [selectedTab]);


  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        //로컬용
        //const res = await fetch("/data/activities.json")
        // setBookmarkedLeisure(
        // ~~
        //const data = await res.json();
        //setBookmarkedLeisure(data)

        //배포용
        const res = await getWishlist();
        console.log("Wish List 응답", res);
        setBookmarkedLeisure(
          res.data.map((item) => ({
            ...item,
            isWished: true,
          }))
        );

      } catch (error) {
        console.error("Wish List 불러오기 실패", error);
      }
    };

    if (selectedTab === "Wish List") {
      fetchWishlist();
    }
  }, [selectedTab]);

  const formatDate = (date: string) => {
    if (!date) return "";
    if (/^\d{8}$/.test(date)) {
      return `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`;
    }
    return date;
  };

  const handleBook = async (activityId: number) => {
    try {
      // 임시 예약 날짜,
      const reserveDate = "2025-03-05 00:00:00";

      const res = await postBooking(activityId, reserveDate);
      console.log("예약 성공!", res);
      alert("예약이 완료되었습니다!");

      if (selectedTab === "Planned Leisure") {
        const refreshed = await getPlannedlist();
        setReservedLeisure(refreshed.data);
      }
    } catch (error) {
      console.error("예약 실패", error);
      alert("예약에 실패했어요 😢");
    }
  };

  const handleLeisureClick = (item) => {
    const activityId = item.detailedInfo?.activity_id;
    if (activityId) {
      router.push(`/leisure_details?activity_id=${activityId}`);
    } else {
      alert("activity_id가 존재하지 않습니다.");
    }
  };

  const handleReview = (userActivityId: string) => {
    setSelectedUserActivityId(userActivityId);
    setShowReviewModal(true);
  };

  // 저장 핸들러
  const handleReviewSave = async () => {
    try {
      await postReview(selectedUserActivityId, rating, reviewText);
      console.log("리뷰 저장 성공!");

      alert("리뷰가 저장되었습니다!");

      // UI 상태 초기화
      setShowReviewModal(false);
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("리뷰 저장 실패:", error);
      alert("리뷰 저장에 실패했어요 😢");
    }
  };

  return (
    <div>
      <MypageSidebar />
      <div className="">
        <div className="mx-10 mt-6">
          <h2 className="text-[15px] font-semibold mb-4 px-2">
            {selectedTab === "Wish List" && "찜 목록"}
            {selectedTab === "Planned Leisure" && "예정된 여가"}
            {selectedTab === "Completed Leisure" && "완료된 여가"}
          </h2>
        </div>
        {/* 리스트 출력 */}
        <ul className="flex mx-10 my-2 justify-center flex-col gap-4">
          {Array.isArray(getCurrentList()) && getCurrentList().length > 0 ?
            (
              getCurrentList().map((item) => (
                <li
                  key={item.wish_id ?? item.activity_id}
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg shadow-sm bg-white"
                >
                  {item.detailedInfo?.image_url ? (
                    <img
                      src={item.detailedInfo.image_url}
                      alt="이미지"
                      className="w-24 h-32 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-24 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded-md">
                      No Image
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <button
                        className="text-lg font-bold hover:underline"
                        onClick={() => handleLeisureClick(item)}
                      >
                        {item.detailedInfo?.title ?? "제목 없음"}
                      </button>

                      <div className="mt-1 text-sm text-gray-500">
                        <p>
                          {item.activity_type === "MOVIE"
                            ? "영화관 "
                            : item.activity_type === "PERFORMANCE"
                              ? item.detailedInfo?.location ?? "지역 정보 없음 "
                              : item.activity_type === "EXHIBITION"
                                ? item.detailedInfo?.location ?? "장소 정보 없음 "
                                : ""}
                        </p>
                        <p>
                          {item.activity_type === "MOVIE"
                            ? `${formatDate(item.detailedInfo?.open_dt) ?? "개봉일 정보 없음"} ~`
                            : item.activity_type === "PERFORMANCE" || item.activity_type === "EXHIBITION"
                              ? `${item.detailedInfo?.start_date ?? "시작일 정보 없음"} ~ ${item.detailedInfo?.end_date ?? "종료일 정보 없음"}`
                              : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="text-sm text-gray-600">⭐ 평균 평점 5</div>

                      <div className="flex gap-2 text-sm">
                        {selectedTab === "Wish List" && (
                          <button
                            onClick={() => handleBook(item.activity_id)}
                            className="bg-[#447959] hover:bg-[#356246] text-white px-4 py-1 rounded-full"
                          >
                            일정 등록하기
                          </button>
                        )}

                        {selectedTab === "Planned Leisure" && (
                          <button
                            onClick={() => alert("일정 변경 기능은 구현 예정입니다!")}
                            className="bg-[#447959] hover:bg-[#356246] text-white px-4 py-1 rounded-full"
                          >
                            일정 변경하기
                          </button>
                        )}

                        {selectedTab === "Completed Leisure" && (
                          <button
                            onClick={() => handleReview(item.user_activity_id)}
                            className="bg-[#447959] hover:bg-[#356246] text-white px-4 py-1 rounded-full"
                          >
                            리뷰 작성하기
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleWish(item)}
                          className={`px-4 py-1 rounded-full border ${item.isWished ? "bg-black text-white" : "text-black border-black"
                            }`}
                        >
                          {item.isWished ? "찜 해제" : "찜하기"}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">
                로딩 중...
              </p>
            )}
        </ul>
      </div>

      {showReviewModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-md w-[450px] h-[300px] border border-gray-300">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-3 right-3 text-gray-400 text-xl hover:text-gray-600"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-3">리뷰 작성하기</h2>
            <div
              ref={starRef}
              className="flex mb-4 w-[150px] cursor-pointer select-none gap-1.5"
              onMouseDown={handleMouseDown}
            >
              {[1, 2, 3, 4, 5].map((index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                >
                  <defs>
                    <linearGradient id={`half-${index}`}>
                      <stop
                        offset={
                          rating >= index
                            ? "100%"
                            : rating >= index - 0.5
                              ? "50%"
                              : "0%"
                        }
                        stopColor="#FACC15"
                      />
                      <stop
                        offset={
                          rating >= index
                            ? "100%"
                            : rating >= index - 0.5
                              ? "50%"
                              : "0%"
                        }
                        stopColor="#D1D5DB"
                        stopOpacity="1"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${index})`}
                    d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.956
                        1.476 8.268L12 18.896l-7.412 4.634
                        1.476-8.268-6.064-5.956 8.332-1.151z"
                  />
                </svg>
              ))}
            </div>

            <textarea
              className="w-full h-[120px] border border-gray-300 rounded-lg p-2 mb-3 text-sm resize-none"
              placeholder="후기를 입력하세요."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <div className="flex justify-end mt-auto">
              <button
                onClick={handleReviewSave}
                className="justify-center items-center text-center bg-[#2D2D2D] hover:bg-[#1d1d1d] text-white text-sm rounded-md w-[130px] h-[34px]"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

