import Image from "next/image";
import Router, { useRouter } from "next/router";

const Leisure = () => {
  const router = useRouter()

  return (
    <div>
      <Image src="/images/temp_poster.svg" alt="영화포스터" width={200} height={266}></Image>
      <div className="flex flex-row">
        <div>
          {/* 영화/공연/전시 중 카테고리 */}
        </div>
        {/* 찜X일경우 */}
        <Image src="/images/icon_circleheart.png" alt="빈하트" width={24} height={24}></Image>
        {/* 찜O일 경우 */}
        {/* <Image src="/images/icon_circleheart_color.png" alt="색칠된된하트" width={24} height={24}></Image> */}

      </div>



      {/* 찜버튼 */}
      {/* 여가 이름 */}
      {/* 여가평점을 별로 표시 */}

    </div>
  );
}

export default Leisure;