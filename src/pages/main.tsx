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
              mappedDetail.start_date = detail.start_date; // ✅ 고쳤음!
              mappedDetail.end_date = detail.end_date || "";
            } else if (activity.activity_type === "EXHIBITION") {
              mappedDetail.start_date = detail.start_date; // ✅ 고쳤음!
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

  return (
    <div
      className="relative"
      style={{
        paddingTop: `10px`,
        backgroundColor: "white",
        minHeight: "100vh",
      }}        >
      <div className=" w-full flex flex-row items-center">
        <div className="flex flex-row items-center ml-[45px] text-[18px]">
          {/* 카테고리 버튼 */}
          {["MOVIE", "PERFORMANCE", "EXHIBITION"].map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`w-[110px] rounded-[20px] py-2 text-white text-center text-left 
              ${selectedCategories.includes(category)
                  ? "bg-[#447959]"
                  : "bg-[#D0D0D0]"
                } ${index > 0 ? "ml-[20px]" : ""}`}
            >
              {category === "MOVIE"
                ? "영화"
                : category === "PERFORMANCE"
                  ? "공연"
                  : "전시"}
            </button>
          ))}

          <button
            className="justify-left items-center px-[15px] py-[2px] flex flex-row text-[17px] ml-[30px] border border-black rounded-[10px] w-[143px] h-[40px]"
          >
            추천순
          </button>
        </div>

        <div className="ml-[320px]">
          {/* 정렬버튼 */}
          {/* 정렬 팝업 (현재는 주석 처리됨) */}
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
        <div className="w-[480px] h-[40px] rounded-[10px] items-center border border-[#000000] text-[14px] ml-[100px] mr-[45px]">
          <textarea
            className="resize-none w-[450px] h-[59px] bg-transparent text-[14px] outline-none px-[0px] py-[10px] px-[10px]"
            placeholder="Search"
          ></textarea>
        </div>
      </div>

      {/* 여가 목록  */}

      <div className="w-full mt-[30px] flex justify-center">
        <div className="max-w-[1500px] w-full px-[70px]">
          <div className="grid grid-cols-4 gap-x-[50px] gap-y-[80px] justify-items-center">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => {
                const detail = activity.detail || {};
                console.log("activity.detail 안에 뭐가 있는지:", detail);
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