import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export interface LeisureProps {
  activity_type: string;
  title: string;
  image_url: string;
}

const Leisure: React.FC<LeisureProps> = ({ activity_type, title, image_url }) => {
  const [activities, setActivities] = useState<LeisureProps[]>([]);
  useEffect(() => {
    setActivities([{ activity_type, title, image_url }]); // 초기 값 설정
  }, [activity_type, title, image_url]); // props가 변경될 때마다 업데이트
  const router = useRouter()

  const detailClick = () => {
    router.push("/leisure_details")
  }

  return (
    <div>
      <button onClick={detailClick}>
        <Image src={image_url} alt={title} width={200} height={266} />
      </button>

      <div className="flex flex-row justify-between mt-[8px]">
        <div >
          {activities.map((activity, index) => {
            switch (activity.activity_type) {
              case "MOVIE":
                return <div key={index} className="font-normal flex justify-center pt-[3px] bg-[#FFA7A7] text-white text-[15px] w-[41px] h-[24px] rounded-[10px]">영화</div>;
              case "PERFORMANCE":
                return <div key={index} className="font-normal flex justify-center pt-[3px] bg-[#FFD34F] text-white text-[15px] w-[41px] h-[24px] rounded-[10px]">공연</div>;
              case "EXHIBITION":
                return <div key={index} className="font-normal flex justify-center pt-[3px] bg-[#A0B5FF] text-white text-[15px] w-[41px] h-[24px] rounded-[10px]">전시</div>;
              default:
                return <div key={index}>??</div>;
            }
          })}
        </div>

        <div>
          {/* 찜X일경우 */}
          <Image src="/images/icon_circleheart.png" alt="빈하트" width={24} height={24} />
          {/* 찜O일 경우 */}
          {/* <Image src="/images/icon_circleheart_color.png" alt="색칠된된하트" width={24} height={24}></Image> */}
        </div>

      </div>

      <div className="mt-[6px]">{title}</div>

      {/* 별점 */}
      <Image src="/images/icon_star.svg" alt="별" width={15} height={15} />

    </div>
  );
};


export default Leisure;


