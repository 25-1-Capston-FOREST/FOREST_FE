import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Leisure from "@/components/Leisure";
import { getRecommendation } from "@/lib/api/recommend";

interface ActivityDetail {
  title: string;
  image_url: string;
  start_date: string;
  end_date: string;
}

interface Activity {
  activity_id: string;
  activity_type: string;
  detail: ActivityDetail;
}

export default function Main() {
  const router = useRouter();
  const [isSortPopupOpen, setIsSortPopupOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        //const res = await getRecommendation();
        const res = await fetch("/data/activities.json");

        const data = await res.json();
        console.log("추천 리스트:", data);

        const mappedActivities: Activity[] = data.recommendations.map((item: any) => ({
          activity_id: item.activity_id,
          activity_type: item.activity_type,
          detail: {
            title: item.detail.title,
            image_url: item.detail.image_url || "/default-image.jpg",
            start_date: item.detail.start_date,
            end_date: item.detail.end_date,
          },
        }));

        setActivities(mappedActivities);
      } catch (error) {
        console.error("추천 리스트를 불러오는 중 오류 발생:", error);
      }
    };
    fetchRecommendations();
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredActivities =
    selectedCategories.length > 0
      ? activities.filter((a) => selectedCategories.includes(a.activity_type))
      : activities;

  const toggleSortPopup = () => {
    setIsSortPopupOpen(!isSortPopupOpen);
  };

  return (
    <div>
      <div className="w-full flex flex-row items-center">
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
          <button
            className="border-[#000000]  border rounded-[10px] w-[149px] h-[55px]"
            onClick={toggleSortPopup}
          >
            정렬
          </button>

          {/* 정렬 팝업 (현재는 주석 처리됨) */}
          {/* {isSortPopupOpen && (
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
          )} */}
        </div>

        {/* 검색창 */}
        <div className="w-[480px] h-[59px] items-center border border-[#000000] text-[14px] ml-[80px] mr-[30px]">
          <textarea
            className="resize-none w-[450px] h-[59px] bg-transparent text-[14px] outline-none px-[30px] py-[19px]"
            placeholder="Search"
          ></textarea>
        </div>
      </div>

      {/* 여가 목록  */}
      <div className="w-full mt-[210px] px-[70px]">
        <div className="flex flex-wrap justify-between gap-x-[50px] gap-y-[80px] justify-start">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <Leisure
                key={activity.activity_id}
                activity_id={activity.activity_id} 
                activity_type={activity.activity_type}
                title={activity.detail.title}
                image_url={activity.detail.image_url}
                start_date={activity.detail.start_date}
                end_date={activity.detail.end_date}
              />
            ))
          ) : (
            <p className="w-full text-center text-gray-500">
              해당 카테고리에 활동이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}