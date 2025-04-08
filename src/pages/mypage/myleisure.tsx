import MypageSidebar from "@/components/Mypagebar";
import { useEffect, useState } from "react";
import { getWishlist, deleteWish, postWish } from "@/lib/api/wish";
import Image from "next/image";
import { postBooking } from "@/lib/api/book";

export default function Myleisure() {
  const [selectedTab, setSelectedTab] = useState("찜 목록");
  const [bookmarkedLeisure, setBookmarkedLeisure] = useState([]);
  const TYPE_MAP: { [key: string]: string } = {
    MOVIE: "영화",
    PERFORMANCE: "공연",
    EXHIBITION: "전시",
  };
  const isWishlisted = (activityId: number) => {
    return bookmarkedLeisure.some((item) => item.activity_id === activityId);
  };

  const handleToggleWish = async (item) => {
    try {
      if (item.isWished) {
        await deleteWish(item.wish_id);
        alert("찜이 해제되었습니다!");
      } else {
        await postWish(item.activity_id);
        alert("찜에 추가되었습니다!");
      }
    } catch (error) {
      console.error("찜 처리 실패", error);
      alert("찜 처리에 실패했어요 😢");
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        //const res = await fetch("/data/activities.json")
        console.log("찜 목록 응답", res);
        setBookmarkedLeisure(res.data);
        //const data = await res.json();
        //setBookmarkedLeisure(data)
      } catch (error) {
        console.error("찜 목록 불러오기 실패", error);
      }
    };

    if (selectedTab === "찜 목록") {
      fetchWishlist();
    }
  }, [selectedTab]);

  const getCurrentList = () => {
    switch (selectedTab) {
      case "찜 목록":
        return bookmarkedLeisure;
      // 나머지 예정된 여가, 완료된 여가
      default:
        return [];
    }
  };
  const handleBook = async (activityId: number) => {
    try {
      // 임시 예약 날짜, 이후 사용자 입력으로 변경 가능
      const reserveDate = "2025-03-05 00:00:00";

      const res = await postBooking(activityId, reserveDate);
      console.log("예약 성공!", res);
      alert("예약이 완료되었습니다!");
    } catch (error) {
      console.error("예약 실패", error);
      alert("예약에 실패했어요 😢");
    }
  };

  const renderLeisureTitle = (item) => {
    if (!item) return "정보 없음";

    const { detailedInfo, activity_type } = item;

    if (detailedInfo?.title) return detailedInfo.title;

    switch (activity_type) {
      case "MOVIE":
        return "영화 정보 없음";
      case "PERFORMANCE":
        return "공연 정보 없음";
      case "EXHIBITION":
        return "전시 정보 없음";
      default:
        return "제목 없음";
    }
  };
  return (
    <div className="mt-[10px]">
      <MypageSidebar />
      <div className="">
        {/* 탭 메뉴 */}
        <div className="flex flex-col ml-[520px] py-[3px] gap-0.5">
          {["찜 목록", "예정된 여가", "완료된 여가"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`text-left w-[80px] text-[13px] ${selectedTab === tab
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
                  <p className="text-[24px] font-bold">{item.detailedInfo?.title ?? "제목 없음"}</p>

                  {/* 장소 */}
                  <p className="text-[20px] whitespace-pre-line">
                    {item.activity_type === "MOVIE"
                      ? "\n"
                      : item.activity_type === "PERFORMANCE"
                        ? item.detailedInfo?.region ?? "지역 정보 없음"
                        : item.activity_type === "EXHIBITION"
                          ? item.detailedInfo?.location ?? "장소 정보 없음"
                          : ""}
                  </p>

                  {/* 기간 */}
                  <p className="text-[16px] mb-[14px]">
                    {item.activity_type === "MOVIE"
                      ? `${item.detailedInfo?.open_dt ?? "개봉일 정보 없음"} ~`
                      : item.activity_type === "PERFORMANCE" || item.activity_type === "EXHIBITION"
                        ? `${item.detailedInfo?.start_date ?? "시작일 정보 없음"} ~ ${item.detailedInfo?.end_date ?? "종료일 정보 없음"}`
                        : ""}
                  </p>

                  <div className="w-full flex items-center justify-between">
                    {/* 별점 */}
                    <div className="flex flex-row items-center gap-1 text-[17px]">
                      <Image src="/images/icon_star.svg" alt="별" width={24} height={24} />
                      <Image src="/images/icon_star.svg" alt="별" width={24} height={24} />
                      <Image src="/images/icon_star.svg" alt="별" width={24} height={24} />
                      <Image src="/images/icon_star.svg" alt="별" width={24} height={24} />
                      <Image src="/images/icon_star.svg" alt="별" width={24} height={24} />
                      <p className="pt-[3px] ml-[6px]">평균 평점 5</p>
                    </div>

                    {/* 버튼 모음*/}
                    <div className="flex flex-row">

                      <button
                        onClick={() => handleBook(item.activity_id)}
                        className="bg-[#447959] hover:bg-[#356246] text-white w-[128px] h-[41px] rounded-[20px]"
                      >
                        일정 등록하기
                      </button>

                      <button onClick={() => handleToggleWish(item)}>
                        <Image
                          src={
                            item.isWished
                              ? "/images/icon_heart_filled.svg"
                              : "/images/icon_heart.svg"
                          }
                          alt="하트"
                          width={27}
                          height={27}
                        />
                      </button>
                    </div>
                  </div>

                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">리스트가 비어 있습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
