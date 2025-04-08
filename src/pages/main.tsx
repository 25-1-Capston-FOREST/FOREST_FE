import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Leisure from "@/components/Leisure";

interface Activity {
  activity_id: number;
  activity_type: string;
  title: string;
  image_url: string;
}


export default function Main() {
  const router = useRouter()
  const [isSortPopupOpen, setIsSortPopupOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/data/activities.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text(); // JSON 파싱 전에 먼저 응답을 텍스트로 확인
      })
      .then((text) => {
        console.log("서버 응답:", text); // JSON이 올바르게 오는지 확인
        return JSON.parse(text); // 직접 JSON 변환
      })
      .then((data) => {
        console.log("불러온 데이터:", data);
        setActivities(data);
      })
      .catch((error) => console.error("Error fetching activities:", error));
  }, []);


  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) => prev.includes(category)
      ? prev.filter((c) => c !== category)
      : [...prev, category]);
  };

  const filteredActivities =
    selectedCategories.length > 0
      ? activities.filter((a) => selectedCategories.includes(a.activity_type))
      : activities;

  const toggleSortPopup = () => {
    setIsSortPopupOpen(!isSortPopupOpen);
  }

  return (
    <div>

      <div className="w-full flex flex-row mt-[10px] items-center">
        <div className="flex flex-row items-center ml-[30px] text-[25px]">
          {/* 카테고리 버튼 */}
          {["MOVIE", "PERFORMANCE", "EXHIBITION"].map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`w-[108px] rounded-[20px] py-2 text-white text-center text-left 
              ${selectedCategories.includes(category)
                  ? "bg-[#447959]"
                  : "bg-[#D0D0D0]"
                } ${index > 0 ? "ml-[10px]" : ""}`}
            >
              {category === "MOVIE"
                ? "영화"
                : category === "PERFORMANCE"
                  ? "공연"
                  : "전시"}
            </button>
          ))}
        </div>


        <div className="ml-[400px]">
          {/* 정렬버튼 */}
          <button className="border-[#000000]  border rounded-[10px] w-[149px] h-[55px]"
            onClick={toggleSortPopup}>
            정렬
          </button>

          {isSortPopupOpen && (
            <div className="mt-2 w-[90px] bg-white border border-gray-300 rounded-lg shadow-custom absolute left-[1160px] top-[270px]">
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                추천순
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                시간순
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                거리순
              </button>
            </div>
          )}
        </div>

        {/* 검색창 */}
        <div className="w-[480px] h-[59px] items-center border border-[#000000] text-[14px] ml-[80px] mr-[30px]">
          <textarea className="resize-none w-[450px] h-[59px] bg-transparent text-[14px] outline-none px-[30px] py-[19px]"
            placeholder="Search">
          </textarea>
        </div>
      </div>


      {/* 여가 목록  */}
      <div>
        <div className="mt-[70px] grid grid-cols-4 gap-10 px-10">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <Leisure
                key={activity.activity_id}
                activity_type={activity.activity_type}
                title={activity.title}
                image_url={activity.image_url}
              />
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">해당 카테고리에 활동이 없습니다.</p>
          )}
        </div>
      </div>

    </div >
  );
}
