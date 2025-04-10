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
  const handleToggleWish = async (item: Activity) => {
    try {
      if (item.isWished) {
        console.log("삭제할 wish_id:", item.wish_id);
        await deleteWish(item.wish_id!);
        alert("찜이 해제되었습니다!");
      } else {
        console.log("추가할 activity_id:", item.activity_id);
        await postWish(item.activity_id);
        alert("찜에 추가되었습니다!");
      }

      // 데이터 다시 불러오기
      if (activity_id && typeof activity_id === "string") {
        const updated = await getDetail(activity_id);
        setActivity(updated.data);
      }

    } catch (error) {
      console.error("찜 처리 실패", error);
      alert("찜 처리에 실패했어요");
    }
  };

  useEffect(() => {
    if (!activity_id || typeof activity_id !== "string") return; if (!activity_id) return;
    console.log(activity_id)
    // const fetchActivity = async () => {
    //   try {
    //     const res = await fetch("/data/activities.json");
    //     const json = await res.json();

    //     setActivity(json.data);
    //     console.log(activity)
    //   } catch (error) {
    //     console.error("여가 정보 불러오기 실패", error);
    //     alert("여가 정보를 불러오는 데 실패했어요 😢");
    //   }
    // };

    const fetchActivity = async () => {
      try {
        const data = await getDetail(activity_id);
        console.log("받은 데이터:", data);
        setActivity(data.data);
      } catch (error) {
        console.error("여가 정보 불러오기 실패", error);
        alert("여가 정보를 불러오는 데 실패했어요 😢");
      }
    };

    fetchActivity();
  }, [activity_id]);

  if (!activity || !activity.detail) {
    return <div>로딩 중...</div>;
  }

  const detail = activity.detail;


  return (
    <div className="p-10 pt-[10px] mt-[230px]">

      <div>
        <div className="flex flex-row ml-[10px] items-center gap-6 mb-3">
          <p className="flex flex-row items-center justify-center text-white w-[58px] h-[30px] rounded-[10px] text-[14px] bg-[#447959] pt-[2px] mt-[7px]">{TYPE_MAP[activity.activity_type] ?? "기타"}</p>
          <h1 className="text-[30px] mt-2 font-bold">{detail.title}</h1>
        </div>
        <div className="items-center justify-left flex flex-row gap-[14px] text-[#757575] text-[18px] mb-[10px]">
          <p className="ml-[6px] font-bold">
            {detail.location ? detail.location : detail.region}
          </p>
          <p className="">{detail.start_date} ~ {detail.end_date}</p>
        </div>
      </div>

      <div className="flex flex-col mx-auto bg-[#F5F5F5] rounded-[10px] mx-350 h-[1150px] p-4">
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

          <div className="font-bold flex flex-col mb-6 gap-[6px] pt-[10px] justify-center w-full max-w-[700px] mx-auto text-gray-700">
            <p>일시: {detail.time}</p>
            <p>러닝타임: {detail.runtime}</p>
            <p>출연진: {detail.cast || "정보 없음"}</p>
            <p>장르: {detail.genre}</p>
            <p>가격: {detail.cost}</p>
            {detail.story?.trim() && (
              <p>내용: {detail.story}</p>
            )}

            <Image src="/images/image_jido.svg" alt="카카오맵" width={705} height={375} />


            <div className="flex flex-row mt-[20px]">
              <button
                onClick={() => handleBook(Number(activity.activity_id))}
                className="font-bold mr-[30px] bg-[#447959] hover:bg-[#356246] text-white w-[150px] h-[45px] rounded-[20px]"
              >
                일정 등록하기
              </button>


              <button onClick={() => handleToggleWish(activity)}>
                <Image
                  src={
                    detail.isWished
                      ? "/images/icon_heart.svg"
                      : "/images/icon_emptyheart.svg"
                  }
                  alt="하트"
                  width={33}
                  height={33}
                />
              </button>

              {/* <button>
                <Image
                  src={
                    "/images/icon_heart.svg"}
                  alt="하트"
                  width={27}
                  height={27}
                />
              </button> */}
            </div>


            <div
              onClick={() => {
                const url = extractURL(detail.link);
                if (url) {
                  window.open(url, "_blank");
                } else {
                  alert("유효한 링크가 없습니다");
                }
              }}
              className="mt-[30px] cursor-pointer text-blue-600 underline"
            >
              여가 예약 페이지로 이동하기
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
