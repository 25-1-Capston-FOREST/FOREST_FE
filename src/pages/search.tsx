import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Leisure from "@/components/Leisure";
import { getSearch } from "@/lib/api/search";

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
export default function Search() {
  const router = useRouter();
  const { keyword } = router.query;
  const [isSortPopupOpen, setIsSortPopupOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [results, setResults] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!keyword || typeof keyword !== "string") return;
    console.log("키워드는: " + keyword);

    const fetchActivity = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/data/activities.json");
        const json = await res.json();

        // 이미 필터링된 데이터를 타입에 맞게 변환해서 results에 저장
        const converted: Activity[] = json.map((item: any) => ({
          activity_id: item.activity_id,
          activity_type: item.type,
          detail: {
            title: item.title,
            image_url: item.image_url,
            start_date: item.start_date,
            end_date: item.end_date,
          },
        }));

        setResults(converted);
      } catch (error) {
        console.error("여가 정보 불러오기 실패", error);
        alert("여가 정보를 불러오는 데 실패했어요 😢");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [keyword]);

  return (
    <div>
      {/* 여가 목록  */}
      <div className="w-full mt-[30px] flex justify-center">
        <div className="max-w-[1500px] w-full px-[70px]">
          <div className="grid grid-cols-4 gap-x-[50px] gap-y-[35px] justify-items-center"></div>
          {isLoading ? (
            <p>검색 중...</p>
          ) : results.length === 0 ? (
            <p>검색 결과가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((activity) => (
                <Leisure
                  key={activity.activity_id}
                  activity_id={activity.activity_id}
                  activity_type={activity.activity_type}
                  title={activity.detail.title || "제목 없음"}
                  image_url={activity.detail.image_url || "/default-image.jpg"}
                  start_date={activity.detail.start_date || "미정"}
                  end_date={activity.detail.end_date || "미정"}
                />
              ))}
            </div>
          )}

        </div>
      </div>

    </div >
  );
}