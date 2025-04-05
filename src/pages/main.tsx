import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Leisure from "@/components/Leisure";
import { useEffect } from "react";


interface Activity {
  activity_id: number;
  activity_type: string;
  title: string;
  image_url: string;
}

export default function Main() {
  const router = useRouter()
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [isDatePopupOpen, setIsDatePopupOpen] = useState(false);
  const [isSortPopupOpen, setIsSortPopupOpen] = useState(false);
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

  const searchButtonClick = () => {
    router.push("/search_result")
  }

  const toggleCategoryPopup = () => {
    setIsCategoryPopupOpen(!isCategoryPopupOpen);
  }

  const toggleDatePopup = () => {
    setIsDatePopupOpen(!isDatePopupOpen);
  }

  const toggleSortPopup = () => {
    setIsSortPopupOpen(!isSortPopupOpen);
  }

  const deleteClick = () => {
  }


  return (
    <div>
      <h2 className="flex flex-row justify-center mt-[00px] text-[18px] text-green-900">
        
      </h2>

      <div className="flex flex-row items-center">
        <div className="w-[1012px] h-[59px] mx-auto flex flex-row mt-[15px] items-center bg-[#EBEBEB] rounded-[17px] pl-[10px] py-[19px] text-[14px] shadow-custom">
          <textarea className="resize-none w-[940px] h-[59px] bg-transparent text-[14px] outline-none px-[30px] py-[19px] font-bold"
            placeholder="어떤 여가를 더 원하시나요?">
          </textarea>

          <button onClick={searchButtonClick}>
            <Image src="/images/icon_search.svg" alt="logo" width={30} height={30} className="flex">
            </Image>
          </button>
        </div>
      </div>

      <div className="font-bold mt-[0px] flex flex-row items-center justify-center px-[290px]">

        <div className="absolute left-[270px] top-[230px]">
          <button
            onClick={toggleCategoryPopup}
            className="shadow-custom w-[108px] border border-[#EBEBEB] rounded-[10px] text-[#9A9A9A] px-4 py-2 ">
            카테고리
          </button>

          {isCategoryPopupOpen && (
            <div className="text-[15px] mt-2 w-[108px] bg-white border border-[#EBEBEB] rounded-[10px] shadow-custom">
              <div className="flex flex-row">

                <div className="px-4 py-2 text-left">
                  영화
                </div>

                <button>
                  <Image src="/images/icon_delete.svg" alt="delete button" width={15} height={15} ></Image>
                </button>

              </div>

              <div className="flex flex-row border-t">

                <div className="px-4 py-2 text-left">
                  공연
                </div>
                <button>
                  <Image src="/images/icon_delete.svg" alt="delete button" width={15} height={15} ></Image>
                </button>
              </div>

              <div className="flex flex-row border-t">

                <div className="px-4 py-2 text-left">
                  전시
                </div>
                <button>
                  <Image src="/images/icon_delete.svg" alt="delete button" width={15} height={15} ></Image>
                </button>
              </div>

            </div>
          )}
        </div>


        <div className="flex flex-row">
          <div>
            <button className="shadow-custom w-[90px] border border-[#EBEBEB] rounded-[17%] text-[#9A9A9A] px-4 py-2 absolute left-[1030px] top-[230px]"
              onClick={toggleDatePopup}>
              일정
            </button>

            {isDatePopupOpen && (
              <div className=" mt-2 w-[300px] bg-gray-100 border border-[#EBEBEB] rounded-[10px] shadow-custom absolute left-[820px] top-[270px]">
                캘린더 보일 예정
              </div>
            )}
          </div>

          <div>

            <button className="shadow-custom w-[90px] border border-[#EBEBEB] rounded-[17%] text-[#9A9A9A] px-4 py-2 absolute left-[1160px] top-[230px]"
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

        </div>

        <div>
          <div className="flex flex-row mt-[70px] grid grid-cols-4 gap-10">
            {activities.map((activity) => (
              <Leisure
                key={activity.activity_id}
                activity_type={activity.activity_type}
                title={activity.title}
                image_url={activity.image_url}
              />

            ))}

          </div>

        </div>
      </div>


    </div >

  );
}
