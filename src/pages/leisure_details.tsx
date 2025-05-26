// pages/leisure_details.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { postBooking } from "@/lib/api/book";
import { getDetail } from "@/lib/api/detail";
import { getWishlist, deleteWish, postWish } from "@/lib/api/wish";

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
  isWished?: boolean;
  wish_id?: string;
}

interface Activity {
  activity_id: string;
  activity_type: string;
  detail: PerformanceDetail;
  isWished?: boolean;
  wish_id?: string;
}

export default function Detail() {
  const router = useRouter();
  const { activity_id } = router.query;

  const [activity, setActivity] = useState<Activity | null>(null);

  const extractURL = (link: string) => {
    const match = link.match(/https?:\/\/[^\s]+/);
    return match ? match[0] : null;
  };

  const TYPE_MAP: { [key: string]: string } = {
    MOVIE: "영화",
    PERFORMANCE: "공연",
    EXHIBITION: "전시",
  };

  const handleBook = async (activityId: number) => {
    try {
      const reserveDate = "2025-03-05 00:00:00";
      const res = await postBooking(activityId, reserveDate);
      console.log("예약 성공!", res);
      alert("예약이 완료되었습니다!");
    } catch (error) {
      console.error("예약 실패", error);
      alert("예약에 실패했어요 😢");
    }
  };

  const handleToggleWish = async (item: Activity) => {
    try {
      if (item.isWished) {
        await deleteWish(item.wish_id!);
        alert("찜이 해제되었습니다!");
      } else {
        await postWish(item.activity_id);
        alert("찜에 추가되었습니다!");
      }

      if (activity_id && typeof activity_id === "string") {
        const updated = await getDetail(activity_id);
        // 여기서도 똑같이 복사
        setActivity({
          ...updated.data,
          isWished: updated.data.detail.isWished,
          wish_id: updated.data.detail.wish_id,
        });
      }
    } catch (error) {
      console.error("찜 처리 실패 ❌", error);
      alert("찜 처리에 실패했어요 😢");
    }
  };

  useEffect(() => {
    if (!activity_id || typeof activity_id !== "string") return; if (!activity_id) return;
    console.log(activity_id)
    //로컬용
    const fetchActivity = async () => {
      try {
        const res = await fetch("/data/activities.json");
        const json = await res.json();

        setActivity(json.data);
        console.log(activity)
      } catch (error) {
        console.error("여가 정보 불러오기 실패", error);
        alert("여가 정보를 불러오는 데 실패했어요 😢");
      }
    };
    //배포용
    // const fetchActivity = async () => {
    //   try {
    //     const data = await getDetail(activity_id);
    //     console.log("받은 데이터:", data);
    //     setActivity(data.data);
    //   } catch (error) {
    //     console.error("여가 정보 불러오기 실패", error);
    //     alert("여가 정보를 불러오는 데 실패했어요 😢");
    //   }
    // };

    fetchActivity();
  }, [activity_id]);

  if (!activity || !activity.detail) {
    return <div>로딩 중...</div>;
  }

  const detail = activity.detail;

  return (
    <div className="mx-10 pt-[10px] w-max-auto">

      <div>
        <div className="flex flex-row ml-[10px] items-center gap-3">
          <p className="flex flex-row items-center justify-center text-white w-[46px] h-[24px] rounded-[14px] text-[14px] bg-[#447959] pt-[2px]">{TYPE_MAP[activity.activity_type] ?? "기타"}</p>
          <h1 className="text-[23px] font-bold">{detail.title}</h1>
          <p className="ml-[6px] font-bold text-[#757575] text-[16px]">
            {detail.location ? detail.location : detail.region}
          </p>
          <p className="text-[#757575] text-[16px]">{detail.start_date} ~ {detail.end_date}</p>
        </div>
      </div>

      <div className="ml-[10px] mt-[15px] flex flex-row">
        <div>
          <Image
            src={detail.image_url}
            alt="공연 이미지"
            width={361}
            height={445}
          />
        </div>

        <div className="flex flex-col mx-auto px-1">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <div className="flex mt-[10px] flex-col gap-[6px] text-[13px] justify-center w-[611px] h-[228px] text-gray-700">
                <p>일시: {detail.time}</p>
                <p>러닝타임: {detail.runtime}</p>
                <p>출연진: {detail.cast || "정보 없음"}</p>
                <p>장르: {detail.genre}</p>
                <p>가격: {detail.cost}</p>
                {detail.story?.trim() && (
                  <p>내용: {detail.story}</p>
                )}

                <button
                  onClick={() => {
                    const url = extractURL(detail.link);
                    if (url) {
                      window.open(url, "_blank");
                    } else {
                      alert("유효한 링크가 없습니다");
                    }
                  }}
                  className="w-[155px] mt-[30px] cursor-pointer underline"
                >
                  여가 예약 페이지로 이동하기
                </button>


                <div className="flex flex-row mt-[40px]">
                  <button
                    onClick={() => handleBook(Number(activity.activity_id))}
                    className="border font-bold  border-[#447959] hover:bg-[#356246] text-[#447959] w-[182px] h-[23px] rounded-[20px]"
                  >
                    일정 등록하기
                  </button>

                  <button onClick={() => handleToggleWish(activity)}
                    className="ml-[15px] border border-black w-[80px] h-[23px] rounded-[20px] ">
                    <span className={`text-[14px] font-bold${detail.isWished ? "bg-[#000000] text-white" : "border-black text-black"
                      }`}>
                      {detail.isWished ? "찜 해제" : "찜하기"}
                    </span>
                  </button>
                </div>

              </div>

            </div>


            <div className="mr-[10px]">

              <Image src="/images/image_jido.svg" alt="카카오맵" width={301} height={287}/>

            </div>
          </div>
          <div className="mt-[60px] bg-[#EBEBEB] w-[910px] h-[190px] flex flex-row items-center justify-center">
            리뷰 내용 구현 예정
          </div>
        </div>

      </div>
    </div >
  );
}
