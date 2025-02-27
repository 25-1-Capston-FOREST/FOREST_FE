import Link from "next/link";
import { useRouter } from "next/router";

const MypageSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "개인정보 수정", path: "/mypage/modify" },
    { name: "나의 여가", path: "/mypage/myleisure" },
    { name: "내가 쓴 리뷰", path: "/mypage/myreview" },
    { name: "회원 탈퇴", path: "/mypage/delete" },
  ];

  return (
    <div className="fixed left-[50px] top-[216px] w-[207px] h-[238px] pl-[15px] rounded-[17px] text-[16px] border shadow-custom">


      {menuItems.map((item, index) => (
        <div key={item.path}>
          <Link href={item.path}>


            <button
              className={`flex flex-col py-[20px] text-[13px] w-[130px] px-4 text-left rounded-lg 
            ${router.pathname === item.path ? "text-[#4C8362] font-bold" : "text-[#9A9A9A]"}
              `}>
              <span>{item.name} </span>
            </button>
          </Link>

          {index !== menuItems.length - 1 && <hr className="border-t border-gray-300 w-[207px] absolute left-0" />}
        </div>
      ))}
    </div>

  );
};
export default MypageSidebar;