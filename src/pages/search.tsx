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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [results, setResults] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!keyword || typeof keyword !== "string") return;

    setQuery(keyword); 

    const fetchActivity = async () => {
      setIsLoading(true);
      //로컬용
      // const res = await fetch("/data/activities.json");
      // const json = await res.json();

      //배포용//
      try {
        const data = await getSearch(keyword);
        const converted: Activity[] = data.map((item: any) => ({
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


        //setResults(data.data);

        // 이미 필터링된 데이터를 타입에 맞게 변환해서 results에 저장
        // const converted: Activity[] = json.map((item: any) => ({
        //   activity_id: item.activity_id,
        //   activity_type: item.type,
        //   detail: {
        //     title: item.title,
        //     image_url: item.image_url,
        //     start_date: item.start_date,
        //     end_date: item.end_date,
        //   },
        // }));
        // setResults(converted);
      } catch (error) {
        console.error("검색 정보 불러오기 실패", error);
        alert("검색 정보를 불러오는 데 실패했어요 😢");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [keyword]);


  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?keyword=${query}`);
      }
    }
  };
  const filteredActivities =
    selectedCategories.length > 0
      ? results.filter((a) => selectedCategories.includes(a.activity_type))
      : results;


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
        <div className="w-[480px] h-[30px] rounded-[10px] items-center flex flex-row border border-[#000000] text-[14px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            className="w-[450px] h-[38px] bg-transparent text-[14px] outline-none px-[10px] py-[0px]"
          />
        </div>
      </div>

      <div
        className="relative"
        style={{
          paddingTop: `10px`,
          backgroundColor: "white",
          minHeight: "100vh",
        }}        >
        {/* 여가 목록  */}
        <div className="w-full mt-[5px] flex justify-center">
          <div className="max-w-[1500px] w-full px-[50px]">
            <div className="">
              {isLoading ? (
                <p>검색 중...</p>
              ) : results.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-5 gap-x-[35px] gap-y-[20px] justify-items-center">
                  {filteredActivities.map((activity) => (
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
      </div>

    </div>

  );
}