import MypageSidebar from "@/components/MypageSidebar";
import { useEffect, useState } from "react";
import { getWishlist, deleteWish, postWish } from "@/lib/api/wish";

export default function Myleisure() {
  const [selectedTab, setSelectedTab] = useState("찜 목록");
  const [bookmarkedLeisure, setBookmarkedLeisure] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        console.log("찜 목록 응답", res.data.data); // 여기 잘 들어오는지 확인용
        setBookmarkedLeisure(res.data.data); // 요거 중요!
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

  return (
    <div className=" ml-[400px] mt-[30px]">

      <MypageSidebar />
      <div className="p-6">
        {/* 탭 메뉴 */}
        <div className="flex space-x-4 border-b pb-2">
          {["찜 목록", "예정된 여가", "완료된 여가"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 text-lg font-semibold ${selectedTab === tab ? "border-b-4 border-blue-500 text-blue-500" : "text-gray-600"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 리스트 출력 */}
        <ul className="mt-4">
          {getCurrentList().length > 0 ? (
            getCurrentList().map((item) => (
              <li key={item.wish_id} className="p-2 border-b">
                {item.detailedInfo.title}
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