import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { postBooking } from "@/lib/api/book";
import { getDetail } from "@/lib/api/detail";

interface PerformanceDetail {
  performance_id: string;
  activity_id: string;
  performance_cd: string;
  title: string;
  image_url: string;
  start_date: string;
  end_date: string;
  time: string;
  region: string;
  location: string;
  runtime: string;
  cost: string;
  cast: string;
  genre: string;
  story: string;
  link: string;
  status: string;
}

interface Activity {
  activity_id: string;
  activity_type: string;
  detail: PerformanceDetail;
}

export default function Detail() {
  const router = useRouter();
  const { activity_id } = router.query;

  const [activity, setActivity] = useState<Activity | null>(null);

  const TYPE_MAP: { [key: string]: string } = {
    MOVIE: "영화",
    PERFORMANCE: "공연",
    EXHIBITION: "전시",
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




  useEffect(() => {
    if (!activity_id) return;
    // const fetchActivity = async () => {
    //   try {
    //     const res = await fetch("/data/activities.json");
    //     const json = await res.json();

    //     setActivity(json);
    //   } catch (error) {
    //     console.error("여가 정보 불러오기 실패", error);
    //     alert("여가 정보를 불러오는 데 실패했어요 😢");
    //   }
    // };

    const fetchActivity = async () => {
      try {
        const data = await getDetail(Number(activity_id));
        setActivity(data);
      } catch (error) {
        console.error("여가 정보 불러오기 실패", error);
        alert("여가 정보를 불러오는 데 실패했어요 😢");
      }
    };

    fetchActivity();
  }, [activity_id]);

  if (!activity) {
    return <div>로딩 중...</div>;
  }

  const detail = activity.detail;

  return (
    <div className="p-10">

      <div>
        <div className="flex flex-row ml-[10px] items-center gap-6 mb-3">
          <p className="text-lg text-gray-600">{TYPE_MAP[activity.activity_type] ?? "기타"}</p>
          <h1 className="text-3xl mt-2 font-bold">{detail.title}</h1>
        </div>
        <div className="flex flex-row gap-[30px] text-[#757575] text-[18px] mb-[10px]">
          <p className="font-bold">{detail.region}  {detail.location}</p>
          <p className="">{detail.start_date} ~ {detail.end_date}</p>
        </div>
      </div>

      <div className="flex flex-col mx-auto bg-[#F5F5F5] rounded-[10px] w-[1440px] h-[1350px] p-4">
        <div className="flex flex-row">
          <div className="ml-[50px]">
            <Image
              src={detail.image_url}
              alt="공연 이미지"
              width={563}
              height={761}
              className="rounded-md"
            />
          </div>

          <div className="flex flex-col mb-6 ml-[70px] gap-[20px] pt-[20px] ">
            <p>일시: {detail.time}</p>
            <p>러닝타임: {detail.runtime}</p>
            <p>출연진: {detail.cast || "정보 없음"}</p>

            <p className="bg-[#EBEBEB] w-[595px] h-[375px] flex flex-row items-center justify-center"> 카카오맵 API 구현 예정</p>
            <p>장르: {detail.genre}</p>

            <div>
              <button
                onClick={() => handleBook(Number(activity.activity_id))}
                className="mr-[10px] bg-[#447959] hover:bg-[#356246] text-white w-[128px] h-[41px] rounded-[20px]"
              >
                일정 등록하기
              </button>


              {/* <button onClick={() => handleToggleWish(item)}>
              <Image
                src={
                  item.isWished
                    ? "/images/icon_heart.svg"
                    : "/images/icon_emptyheart.svg"
                }
                alt="하트"
                width={27}
                height={27}
              />
            </button> */}

              <button>
                <Image
                  src={
                    "/images/icon_heart.svg"}
                  alt="하트"
                  width={27}
                  height={27}
                />
              </button>
            </div>
          </div>


        </div>
        <div className="mt-[30px] bg-[#EBEBEB] w-full h-[375px] flex flex-row items-center justify-center">
          리뷰 내용 구현 예정
        </div>



        {/* //<p className="mt-4 whitespace-pre-line">{detail.story || "설명 없음"}</p> */}
      </div>


    </div >
  );
}
