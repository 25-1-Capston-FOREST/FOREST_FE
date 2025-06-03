import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Leisure from "@/components/Leisure";
import { getRecommendation } from "@/lib/api/recommend";

interface ActivityDetail {
  title: string;
  image_url: string;
  start_date?: string; // 영화일 경우 undefined
  end_date?: string;
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
  const [query, setQuery] = useState("");


  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await getRecommendation();
        console.log("추천 리스트:", res);

        // res가 바로 배열일 경우, 바로 그 배열을 사용
        if (Array.isArray(res)) {
          const mappedActivities = res.map((activity: any) => {
            let detail = activity.detail;

            let mappedDetail: ActivityDetail = {
              title: detail.title,
              image_url: detail.image_url,
            };

            if (activity.activity_type === "MOVIE") {
              mappedDetail.start_date = detail.open_dt;
              mappedDetail.end_date = detail.opsnm_dt || "";
            } else if (activity.activity_type === "PERFORMANCE") {
              mappedDetail.start_date = detail.start_date; 
              mappedDetail.end_date = detail.end_date || "";
            } else if (activity.activity_type === "EXHIBITION") {
              mappedDetail.start_date = detail.start_date; 
              mappedDetail.end_date = detail.end_date || "";
            }
            return {
              activity_id: activity.activity_id,
              activity_type: activity.activity_type,
              detail: mappedDetail,
            };
          });

          console.log("매핑된 액티비티:", mappedActivities);
          setActivities(mappedActivities);
        } else {
          console.error("추천 리스트 데이터는 배열이어야 합니다:", res);
        }
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
  const headerHeight = 150;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?keyword=${query}`);
      }
    }
  };

  return (
    <div
      className="relative"
      style={{
        paddingTop: `10px`,
        backgroundColor: "white",
        minHeight: "100vh",
      }}        >
      <div className="justify-between mt-[-10px] mx-[45px] flex flex-row items-center">
        <div className="flex flex-row items-center text-[15px]">
          {/* 카테고리 버튼 */}
          {["MOVIE", "PERFORMANCE", "EXHIBITION"].map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`w-[80px] rounded-[20px] py-1 text-white text-center text-left 
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

        {/* 검색창 */}
        <div className="flex flex-row w-[500px] h-[30px] rounded-[10px] items-center flex flex-row text-[14px]">
          <Image src="/images/icon_search.svg" alt="검색 아이콘" width={25} height={25} />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            className="rounded-[10px] border border-[#000000] flex flex-row items-center ml-[15px] w-[450px] h-[30px] bg-transparent text-[14px] outline-none px-[10px] py-[0px]"
          />
        </div>
      </div>

      {/* 여가 목록  */}

      <div className="w-full mt-[20px] flex justify-center">
        <div className="max-w-[1500px] w-full px-[50px]">
          <div className="grid grid-cols-5 gap-x-[35px] gap-y-[20px] justify-items-center">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => {
                const detail = activity.detail || {};
                return (
                  <Leisure
                    key={activity.activity_id}
                    activity_id={activity.activity_id}
                    activity_type={activity.activity_type}
                    title={activity.detail.title || "제목 없음"}
                    image_url={activity.detail.image_url || "/default-image.jpg"}
                    start_date={activity.detail.start_date || "미정"}
                    end_date={activity.detail.end_date || "미정"}
                  />
                );
              })
            ) : (
              <p className="w-full text-center text-gray-500">
                해당 카테고리에 추천 활동이 없습니다.
                <p className="h-[500px]">
                </p>
                <p>
                  d
                </p>
                <p className="h-[500px]">
                </p>
                <p>
                  d
                </p>

              </p>

            )}
          </div>
        </div>
      </div >
    </div >

  );
}