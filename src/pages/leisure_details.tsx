import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { postBooking } from "@/lib/api/book";
import { getDetail } from "@/lib/api/detail";
import { getWishlist, deleteWish, postWish } from "@/lib/api/wish";
import KakaoMapImage from "@/components/KakaoMapImage";

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
  latitude: number;
  longitude: number;
}

interface MovieDetail {
  activity_id: string;
  movie_id: string;
  movie_cd: string;
  title: string;
  image_url: string;
  open_dt: string;
  show_tm: string;
  genre_nm: string;
  director: string;
  actors: string;
  isWished?: boolean;
  wish_id?: string;
  latitude: number;
  longitude: number;
}

interface ExhibitionDetail {
  activity_type: string;
  exhibition_id: string;
  activity_id: string;
  title: string;
  image_url: string;
  start_date: string;
  end_date: string;
  location: string;
  // area: string; 
  contents: string;
  price: string;
  url: string;
  isWished?: boolean;
  wish_id?: string;
  latitude: number;
  longitude: number;
}

interface Activity {
  activity_id: string;
  activity_type: string;
  detail: PerformanceDetail | MovieDetail | ExhibitionDetail;
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
    <div className="mx-10 mt-[3px] w-max-auto">

      <div>
        <div className="flex flex-row ml-[10px] items-center gap-3">
          <p className="flex flex-row items-center justify-center text-white w-[46px] h-[24px] rounded-[14px] text-[14px] bg-[#447959] pt-[2px]">{TYPE_MAP[activity.activity_type] ?? "기타"}</p>
          <h1 className="flex flex-row items-center justify-center text-[21px] font-bold">{detail.title}</h1>

          {(() => {
            switch (activity.activity_type) {
              case "MOVIE": {
                const movie = detail as MovieDetail;
                return (
                  <>
                    <p className="text-[#757575] text-[16px]">
                      {(detail as MovieDetail).open_dt}~
                    </p>
                  </>
                );
              }

              case "EXHIBITION": {
                const exhibition = detail as ExhibitionDetail;
                return (
                  <>
                    <p className="ml-[6px] font-bold text-[#757575] text-[16px]">
                      {(detail as ExhibitionDetail).location || null}
                    </p>
                    <p className="text-[#757575] text-[16px]">
                      {(detail as ExhibitionDetail).start_date}~
                    </p>
                  </>
                );
              }
              case "PERFORMANCE": {
                const performance = detail as PerformanceDetail;

                return (
                  <>
                    <p className="ml-[6px] font-bold text-[#757575] text-[16px]">
                      {(detail as PerformanceDetail).location ||
                        (detail as PerformanceDetail).region ||
                        null}
                    </p>
                    <p className="text-[#757575] text-[16px]">
                      {(detail as PerformanceDetail).start_date} ~ {(detail as PerformanceDetail).end_date}
                    </p>
                  </>

                );
              }
            }
          })()}

        </div>

        <div className="ml-[10px] mt-[10px] flex flex-row">
          <div>
            <Image
              src={detail.image_url}
              alt="공연 이미지"
              width={331}
              height={445}
            />
          </div>

          <div className="flex flex-col mx-auto px-1">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <div className="flex mt-[4px] flex-col gap-[6px] text-[13px] w-[651px] h-[125px] text-gray-700">
                  {(() => {
                    switch (activity.activity_type) {
                      case "MOVIE": {
                        const movie = detail as MovieDetail;
                        return (
                          <>
                            <p>개봉일: {movie.open_dt}</p>
                            <p>러닝 타임: {movie.show_tm}분</p>
                            <p>감독: {movie.director}</p>
                            <p>출연진: {movie.actors || "정보 없음"}</p>
                            <p>장르: {movie.genre_nm}</p>
                          </>
                        );
                      }

                      case "EXHIBITION": {
                        const exhibition = detail as ExhibitionDetail;
                        return (
                          <>
                            <p>전시장: {exhibition.location || null}</p>
                            <p>전시 기간: {exhibition.start_date} ~ {exhibition.end_date}</p>
                            <p>입장료: {exhibition.price}</p>
                            <p>내용: {exhibition.contents || "설명 없음"}</p>
                          </>
                        );
                      }

                      case "PERFORMANCE": {
                        const performance = detail as PerformanceDetail;
                        return (
                          <>
                            <p>일시: {performance.time}</p>
                            <p>러닝타임: {performance.runtime}</p>
                            <p>출연진: {performance.cast || "정보 없음"}</p>
                            <p>장르: {performance.genre}</p>
                            <p>티켓 가격: {performance.cost}</p>
                          </>
                        );
                      }

                      default:
                        return (
                          <>
                            <p>정보 없음</p>
                          </>
                        );
                    }
                  })()}



                  {(() => {
                    switch (activity.activity_type) {
                      case "MOVIE": {
                        return (
                          <div
                            className="text-[#757575] w-[300px] mt-[55px]"
                          >
                            영화의 예매 페이지는 제공하지 않습니다.
                          </div>
                        );
                      }

                      case "EXHIBITION": {
                        const exhibition = detail as ExhibitionDetail;
                        return (
                          <>
                            <button
                              onClick={() => {
                                const url = extractURL(exhibition.url);
                                if (url) {
                                  window.open(url, "_blank");
                                } else {
                                  alert("유효한 링크가 없습니다");
                                }
                              }}
                              className="w-[155px] mt-[55px] cursor-pointer underline"
                            >
                              전시 예약 페이지로 이동하기
                            </button>
                          </>
                        );
                      }

                      case "PERFORMANCE": {
                        const performance = detail as PerformanceDetail;
                        return (
                          <button
                            onClick={() => {
                              const link = extractURL(performance.link);
                              if (link) {
                                window.open(link, "_blank");
                              } else {
                                alert("유효한 링크가 없습니다");
                              }
                            }}
                            className="w-[155px] mt-[55px] cursor-pointer underline"
                          >
                            공연 예약 페이지로 이동하기
                          </button>
                        );
                      }

                      default:
                        return (
                          <>
                            ㅇㅇ
                          </>
                        );
                    }
                  })()}
                </div>

                <div className="flex flex-row mt-[90px]">
                  <button
                    onClick={() => handleBook(Number(activity.activity_id))}
                    className="text-[14px] border border-[#447959] text-[#447959] w-[152px] h-[25px] rounded-[20px]"
                  >
                    일정 등록하기
                  </button>

                  <button onClick={() => handleToggleWish(activity)}
                    className={`flex flex-row items-center justify-center ml-[15px] border border-black w-[90px] h-[25px] rounded-[20px] ${detail.isWished ? "bg-[#000000] text-white" : "border-black text-black"
                      }`}>
                    <span className="text-[14px]">
                      {detail.isWished ? "찜 해제" : "찜하기"}
                    </span>
                  </button>
                </div>

              </div>


              <div className="mr-[10px]">

                {(() => {
                  switch (activity.activity_type) {
                    case "MOVIE": {
                      return (
                        <div
                          className="text-[#757575] w-[300px] mt-[55px]"
                        >
                          영화관의 지도 사진은 제공하지 않습니다.
                        </div>
                      );
                    }
                    case "PERFORMANCE": {
                      return (
                        <>
                          {detail.latitude && detail.longitude ? (
                            <KakaoMapImage
                              la={Number(detail.latitude)}
                              lo={Number(detail.longitude)}
                            />
                          ) : (
                            <div className="w-[331px] h-[287px] bg-[#D9D9D9] flex items-center justify-center text-[#888] text-sm">
                              위치 정보 없음
                            </div>
                          )
                          }
                        </>
                      );
                    }

                  }
                })()}

              </div>

            </div>

            <div className="mt-[40px] bg-[#EBEBEB] w-[1050px] h-[150px] flex flex-row items-center justify-center">
              리뷰 내용 구현 예정
            </div>

          </div>

        </div>
      </div >
    </div >
  );
}
