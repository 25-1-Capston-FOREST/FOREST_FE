import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const [scrollLevel, setScrollLevel] = useState(0);
  const [fontSize, setFontSize] = useState(200);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 150;
      const minSize = 70;
      const maxSize = 200;

      const clampedScroll = Math.min(scrollY, maxScroll);
      const newSize = maxSize - ((maxSize - minSize) * (clampedScroll / maxScroll));

      setFontSize(newSize); // 즉시 적용
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const chatbotButtonClick = () => router.push("/chatbot");
  const logoButtonClick = () => router.push("/main");
  const mypageButtonClick = () => router.push("/mypage/myleisure");
  const logoutButtonClick = () => router.push("/");

  const getTextStyle = () => ({
    fontSize: `${fontSize}px`,
    marginTop: '5px',
  });

  return (
    <div className="w-full z-10">
      <div
        className="absolute top-[-20px] px-[20px] w-full group cursor-pointer pointer-events-auto"
        onClick={logoButtonClick}
      >
        {/* 로고 전체 hover 범위 확보 */}
        <div className="fixed left-0 w-full">
          {/* F ↔ FOR; */}
          <div className="relative group cursor-pointer pointer-events-auto" onClick={logoButtonClick}>
            <h1
              className="relative font-semibold text-[#447959] leading-none transition-all duration-100 ease-linear"
              style={getTextStyle()}
            >
              <span className="block opacity-100 group-hover:opacity-0 transition-opacity duration-100 ease-linear">
                F
              </span>
              {/* FOR; 호버 애니메이션 */}
              <span className="absolute inset-0 flex items-center justify-start pointer-events-none pl-[20px]">
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear delay-[20ms]" style={getTextStyle()}>F</span>
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear delay-[40ms]" style={getTextStyle()}>O</span>
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear delay-[60ms]" style={getTextStyle()}>R</span>
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear delay-[80ms]" style={getTextStyle()}>;</span>
              </span>
            </h1>
          </div>

          {/* R ↔ REST */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 group cursor-pointer pointer-events-auto">
            <h1
              className="relative font-semibold text-[#447959] leading-none transition-all duration-100 ease-linear"
              style={getTextStyle()}
            >
              <span className="block opacity-100 group-hover:opacity-0 transition-opacity duration-100 ease-linear">
                R
              </span>
              {/* REST 호버 애니메이션 */}
              <span className="absolute inset-0 flex items-center pointer-events-none ml-[20px]">
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear delay-[100ms]" style={getTextStyle()}>R</span>
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear delay-[120ms]" style={getTextStyle()}>E</span>
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear delay-[140ms]" style={getTextStyle()}>S</span>
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear delay-[160ms]" style={getTextStyle()}>T</span>
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div
        className={`w-full flex flex-row justify-between px-[40px] text-[20px] transition-all duration-200 mt-[180px] `}
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
  );
};

export default Header;