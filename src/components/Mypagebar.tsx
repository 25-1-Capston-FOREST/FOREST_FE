import Link from "next/link";
import { useRouter } from "next/router";

const MypageSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "개인정보 수정", path: "/mypage/modify" },
    { name: "나의 여가", path: "/mypage/myleisure" },
    { name: "내가 쓴 리뷰", path: "/mypage/myreview" },
    { name: "회원 탈퇴", path: "/mypage/delete" }
  ];

  return (
      <div className="mt-[10px] w-full flex flex-row justify-between items-center px-[30px] text-[16px]">
        {menuItems.map((item, index) => (
          <div key={item.path}>
            <Link href={item.path}>
              <button
                className={`flex flex-row text-[16px] px-4 
            ${router.pathname === item.path ? "text-[#000000]" : "text-[#9A9A9A]"}
              `}>
                <span>{item.name} </span>
              </button>
            </Link>
          </div>
        ))}
  
    </div>
  );
};
export default MypageSidebar;