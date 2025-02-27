import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Main() {
  const router = useRouter()
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [isDatePopupOpen, setIsDatePopupOpen] = useState(false);
  const [isSortPopupOpen, setIsSortPopupOpen] = useState(false);

  const searchButtonClick = () => {
    router.push("/search_result")
  }

  const toggleCategoryPopup = () => {
    setIsCategoryPopupOpen(!isCategoryPopupOpen);
  }

  const deleteClick = () => {
    
  }


  return (
    <div>
      <h2 className="flex flex-row justify-center mt-[20px] text-[18px] text-green-900">
        ㅇㅇㅇ 님을 위해 준비했습니다!
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

      <div className="font-bold mt-[20px] flex flex-row justify-between items-center px-[290px]">

        <div>
          <button
            onClick={toggleCategoryPopup}
            className="shadow-custom w-[108px] border border-[#EBEBEB] rounded-[10px] text-[#9A9A9A] px-4 py-2">
            카테고리
          </button>

          {isCategoryPopupOpen && (
            <div className="text-[15px] mt-2 w-[108px] h-[95px] bg-white border border-[#EBEBEB] rounded-[10px] shadow-custom">
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
            <button className="shadow-custom w-[80px] border border-[#EBEBEB] rounded-[17%] text-[#9A9A9A] px-4 py-2 mr-[30px]">
              일정
            </button>

            {isCategoryPopupOpen && (
              <div className=" mt-2 w-[108px] bg-white border border-[#EBEBEB] rounded-[10px] shadow-custom">
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  영화
                </button>
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  공연
                </button>
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  전시
                </button>
              </div>
            )}
          </div>

          <div>

            <button className="shadow-custom w-[80px] border border-[#EBEBEB] rounded-[17%] text-[#9A9A9A] px-4 py-2">
              정렬
            </button>

            {isCategoryPopupOpen && (
              <div className=" left-0 mt-2 w-[108px] bg-white border border-gray-300 rounded-lg shadow-custom">
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  옵션 1
                </button>
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  옵션 2
                </button>
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  옵션 3
                </button>
              </div>
            )}

          </div>

        </div>

      </div>


    </div >

  );
}
