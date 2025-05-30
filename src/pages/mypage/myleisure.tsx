import MypageSidebar from "@/components/Mypagebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getWishlist, deleteWish, postWish } from "@/lib/api/wish";
import Image from "next/image";
import { postBooking, getBookedActivities } from "@/lib/api/book";

export default function Myleisure() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Wish List");
  const [bookmarkedLeisure, setBookmarkedLeisure] = useState([]);
  const [reservedLeisure, setReservedLeisure] = useState([]);
  const [finishedLeisure, setFinishedLeisure] = useState([]);

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
        const res = await getBookedActivities();
        console.log("예약된 여가 응답:", res);
        setReservedLeisure(res.data);
      } catch (error) {
        console.error("예약된 여가 불러오기 실패", error);
      }
    };

    if (selectedTab === "Planned Leisure") {
      fetchReservedLeisure();
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


  const handleBook = async (activityId: number) => {
    try {
      // 임시 예약 날짜,
      const reserveDate = "2025-03-05 00:00:00";

      const res = await postBooking(activityId, reserveDate);
      console.log("예약 성공!", res);
      alert("예약이 완료되었습니다!");
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

  const handleReview=() => {

  };
  
  return (
    <div>
      <MypageSidebar />
      <div className="">
        {/* 탭 메뉴 */}
        <div className="flex flex-col ml-[472px] my-[3px]">
          {["Wish List", "Planned Leisure", "Completed Leisure"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`text-left mx-[8px] text-[12.5px] ${selectedTab === tab
                ? "text-[#000000]"
                : "text-[#9A9A9A]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 리스트 출력 */}
        <ul className="flex mx-auto mt-4 w-[1300px] justify-center flex-col gap-8">
          {Array.isArray(getCurrentList()) && getCurrentList().length > 0 ? (
            getCurrentList().map((item) => (
              <li key={item.wish_id ?? item.activity_id} className="pb-[15px] flex justify-center w-[1300px] mx-auto border-b flex items-center">
                {item.detailedInfo?.image_url ? (
                  <img
                    src={item.detailedInfo.image_url}
                    alt="이미지"
                    width={127}
                    height={170}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-[127px] h-[170px] bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}

                <div className="ml-[60px] w-[785px] h-[170px]">
                  {/* 여가 유형 */}
                  <p className="mb-[10px] flex items-center justify-center w-[38px] h-[23px] bg-[#447959] text-[#FFFFFF] rounded-[10px] text-[12px]">
                    {TYPE_MAP[item.activity_type] ?? "기타"}
                  </p>

                  {/* 제목 */}
                  <button
                    className="text-[21px] font-bold"
                    onClick={() => handleLeisureClick(item)}
                  >
                    {item.detailedInfo?.title ?? "제목 없음"}
                  </button>

                  {/* 장소 */}
                  <p className="text-[16px] whitespace-pre-line">
                    {item.activity_type === "MOVIE"
                      ? "\n"
                      : item.activity_type === "PERFORMANCE"
                        ? item.detailedInfo?.location ?? "지역 정보 없음"
                        : item.activity_type === "EXHIBITION"
                          ? item.detailedInfo?.location ?? "장소 정보 없음"
                          : ""}
                  </p>

                  {/* 기간 */}
                  <p className="text-[14px] mb-[14px]">
                    {item.activity_type === "MOVIE"
                      ? `${item.detailedInfo?.open_dt ?? "개봉일 정보 없음"} ~`
                      : item.activity_type === "PERFORMANCE" || item.activity_type === "EXHIBITION"
                        ? `${item.detailedInfo?.start_date ?? "시작일 정보 없음"} ~ ${item.detailedInfo?.end_date ?? "종료일 정보 없음"}`
                        : ""}
                  </p>

                  <div className="w-full flex items-center justify-between">
                    {/* 별점 */}
                    <div className="flex flex-row items-center gap-1 text-[17px]">
                      <Image src="/images/icon_star.svg" alt="별" width={20} height={20} />
                      <Image src="/images/icon_star.svg" alt="별" width={20} height={20} />
                      <Image src="/images/icon_star.svg" alt="별" width={20} height={20} />
                      <Image src="/images/icon_star.svg" alt="별" width={20} height={20} />
                      <Image src="/images/icon_star.svg" alt="별" width={20} height={20} />
                      <p className="pt-[3px] ml-[6px]">평균 평점 5</p>
                    </div>

                    {/* 버튼 모음*/}
                    <div className="flex flex-row">
                      {selectedTab === "Wish List" && (
                        <button
                          onClick={() => handleBook(item.activity_id)}
                          className="mr-[10px] bg-[#447959] hover:bg-[#356246] text-white w-[128px] h-[41px] rounded-[20px]"
                        >
                          일정 등록하기
                        </button>
                      )}

                      {selectedTab === "Planned Leisure" && (
                        <button
                          onClick={() => alert("일정 변경 기능은 구현 예정입니다!")}
                          className="mr-[10px] bg-[#447959] hover:bg-[#356246] text-white w-[128px] h-[41px] rounded-[20px]"
                        >
                          일정 변경하기
                        </button>
                      )}

                      {selectedTab === "Completed Leisure" && (
                        <button
                          onClick={() => handleReview()}
                          className="mr-[10px] bg-[#447959] hover:bg-[#356246] text-white w-[128px] h-[41px] rounded-[20px]"
                        >
                          리뷰 작성하기
                        </button>
                      )}

                      <button onClick={() => handleToggleWish(item)}
                        className="">
                        찜 버튼
                      </button>
                    </div>
                  </div>

                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">
            <button onClick={handleReview}>
              테스트
            </button>
            리스트가 비어 있습니다.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}

