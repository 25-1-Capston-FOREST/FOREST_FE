import MypageSidebar from "@/components/Mypagebar";
import { useEffect, useState } from "react";
import { getWishlist, deleteWish, postWish } from "@/lib/api/wish";
import Image from "next/image";

export default function Myleisure() {
  const [selectedTab, setSelectedTab] = useState("찜 목록");
  const [bookmarkedLeisure, setBookmarkedLeisure] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        console.log("찜 목록 응답", res);
        setBookmarkedLeisure(res.data);
        console.log("실제 배열인가?", Array.isArray(res.data), res.data);

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
        <ul className="mt-4">
          {Array.isArray(getCurrentList()) && getCurrentList().length > 0 ? (
            getCurrentList().map((item) => (
              <li key={item.wish_id ?? item.activity_id} className="w-[1300px] mx-auto border-b flex space-x-4 items-center">
                {/* 이미지 */}
                {item.detailedInfo?.image_url ? (
                  <Image
                    src={item.detailedInfo.image_url}
                    alt="이미지"
                    width={227}
                    height={303}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-[227px] h-[303px] bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded">
                    No Image
                  </div>
                )}

                {/* 텍스트 정보 */}
                <div>
                  <p className="text-[36px] font-bold">{item.detailedInfo?.title ?? "제목 없음"}</p>
                  <p className="text-sm text-gray-600">{item.activity_type}</p>
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
