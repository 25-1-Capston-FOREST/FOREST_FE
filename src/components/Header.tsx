import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const [scrollLevel, setScrollLevel] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollLevel(2);
      } else if (window.scrollY > 50) {
        setScrollLevel(1);
      } else {
        setScrollLevel(0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const chatbotButtonClick = () => router.push("/chatbot");
  const logoButtonClick = () => router.push("/main");
  const mypageButtonClick = () => router.push("/mypage/myleisure");
  const logoutButtonClick = () => router.push("/");

  const getTextSize = () => {
    if (scrollLevel === 2) return "text-[70px] mt-[5px]";
    if (scrollLevel === 1) return "text-[130px]";
    return "text-[200px]";
  };

  const getButtonMarginTop = () => {
    if (scrollLevel === 2) return "mt-[100px]";
    if (scrollLevel === 1) return "mt-[150px]";
    return "mt-[200px]";
  };

  return (
    <div className="relative w-full z-10">
      <div className="fixed top-[-10px] left-0 w-full bg-white z-10 pointer-events-none">
        <div
          className="group cursor-pointer pointer-events-auto"
          onClick={logoButtonClick}
        >
          {/* 로고 전체 hover 범위 확보 */}
          <div className="fixed top-[-10px] left-0 w-full h-[200px] z-20">
            {/* F - 왼쪽 고정 */}
            <div className="absolute left-[50px] top-0 group cursor-pointer pointer-events-auto" onClick={logoButtonClick}>
              <div className="relative">
                <h1 className={`font-semibold text-[#447959] leading-none transition-all duration-400 ${getTextSize()}`}>F</h1>
                <h1 className={`font-semibold absolute top-0 left-0 text-[#447959] flex leading-none pointer-events-none ${getTextSize()}`}>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[20ms]">F</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[40ms]">O</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[60ms]">R</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[80ms]">;</span>
                </h1>
              </div>
            </div>

            {/* R - 가운데 정렬 */}
            <div className="absolute mx-[170px] left-1/2 top-0 transform -translate-x-1/2 group cursor-pointer pointer-events-auto">
              <div className="relative">
                <h1 className={`font-semibold text-[#447959] leading-none transition-all duration-400 ${getTextSize()}`}>R</h1>
                <h1 className={`absolute font-semibold top-0 left-0 text-[#447959] flex leading-none pointer-events-none ${getTextSize()}`}>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-[100ms]">R</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-[120ms]">E</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-[140ms]">S</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-[160ms]">T</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div
          className={`w-full flex flex-row justify-between px-[30px] text-[23px] transition-all duration-200 ${getButtonMarginTop()}`}
        >
          <div>
            <button onClick={chatbotButtonClick} className="pointer-events-auto text-[#447959]">
              chatty!
            </button>
            <button onClick={mypageButtonClick} className="pointer-events-auto ml-[30px]">
              MyPage
            </button>
          </div>
          <div>
            <button className="pointer-events-auto text-[#9A9A9A]" onClick={logoutButtonClick}>
              Logout
            </button>
          </div>
        </div>

        <div className="mt-[10px] mx-6 border-t border-black" />
      </div>
    </div>
  );
};

export default Header;