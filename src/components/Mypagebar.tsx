import Link from "next/link";
import { useRouter } from "next/router";

const MypageSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Profile", path: "/mypage/profile" },
    { name: "My Leisure", path: "/mypage/myleisure" },
    { name: "Review", path: "/mypage/myreview" },
    { name: "Delete Account", path: "/mypage/delete" }
  ];

  return (
      <div className="mt-[-10px] w-full flex flex-row justify-between items-center px-[35px] text-[16px]">
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