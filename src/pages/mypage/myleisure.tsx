import MypageSidebar from "@/components/MypageSidebar";
import { useState } from "react";



export default function Myleisure() {
  const [selectedTab, setSelectedTab] = useState("찜 목록");
  const bookmarkedLeisure = [
    { id: 1, title: "해변 캠핑" },
    { id: 2, title: "등산 여행" }
  ];

  const upcomingLeisure = [
    { id: 3, title: "다이빙 체험" },
    { id: 4, title: "요가 클래스" }
  ];

  const completedLeisure = [
    { id: 5, title: "스키 여행" },
    { id: 6, title: "공연 관람" }
  ];

  const getCurrentList = () => {
    switch (selectedTab) {
      case "찜 목록":
        return bookmarkedLeisure;
      case "예정된 여가":
        return upcomingLeisure;
      case "완료된 여가":
        return completedLeisure;
      default:
        return [];
    }
  };

  return (
    <div>

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
            getCurrentList().map((item) => <li key={item.id} className="p-2 border-b">{item.title}</li>)
          ) : (
            <p className="text-gray-500">리스트가 비어 있습니다.</p>
          )}
        </ul>
      </div>



    </div>
  );

}