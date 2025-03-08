import Image from "next/image";

interface LeisureProps {
  activity_type: string;
  title: string;
  image_url: string;
}


const Leisure: React.FC<LeisureProps> = ({ activity_type, title, image_url }) => {
  return (
    <div>
      <Image src={image_url} alt={title} width={200} height={266} />
      <div className="flex flex-row">
        <div>{activity_type}</div> {/* 영화, 공연, 전시 중 하나 */}
        {/* 찜X일경우 */}
        <Image src="/images/icon_circleheart.png" alt="빈하트" width={24} height={24} />
        {/* 찜O일 경우 */}
        {/* <Image src="/images/icon_circleheart_color.png" alt="색칠된된하트" width={24} height={24}></Image> */}
      </div>

      <div>{title}</div> {/* 여가 이름 */}
    </div>
  );
};




// const Leisure: React.FC<LeisureProps> = ({ activityType, title, imageUrl }) => {
//   return (
//     <div>
//       <Image src={imageUrl} alt={title} width={200} height={266} />
//       <div className="flex flex-row">
//         <div>{activityType}</div> {/* 영화, 공연, 전시 중 하나 */}
//         {/* 찜X일경우 */}
//         <Image src="/images/icon_circleheart.png" alt="빈하트" width={24} height={24} />
//         {/* 찜O일 경우 */}
//         {/* <Image src="/images/icon_circleheart_color.png" alt="색칠된된하트" width={24} height={24}></Image> */}

//       </div>
//       <div>{title}</div> {/* 여가 이름 */}
//     </div>
//   );
// };

export default Leisure;


