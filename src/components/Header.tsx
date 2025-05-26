import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface HeaderProps {
  headerHeight: number;
  setHeaderHeight: React.Dispatch<React.SetStateAction<number>>;
}

const Header = ({ headerHeight, setHeaderHeight }: HeaderProps) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const minHeight = 60;
      const maxHeight = 150;
      const maxScroll = 150;

      const newHeight =
        scrollY > maxScroll
          ? minHeight
          : maxHeight - ((maxHeight - minHeight) * (scrollY / maxScroll));

      setHeaderHeight((prev) =>
        Math.abs(prev - newHeight) < 1 ? prev : newHeight
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setHeaderHeight]);

  const fontSize = (headerHeight / 150) * 200;

  const getTextStyle = (): React.CSSProperties => ({
    fontSize: `${fontSize}px`,
    marginTop: "5px",
    transition: "font-size 150ms ease-out",
    lineHeight: 1,
    width: "80px",
    textAlign: "left" as React.CSSProperties['textAlign'],
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  });
  const getHoverSpan = (chars: string[], startDelay: number) =>
    chars.map((char, i) => (
      <span
        key={char + i}
        className="inline-block transition-opacity ease-linear"
        style={{
          opacity: hovered ? 1 : 0,
          transitionDuration: "150ms",
          transitionProperty: "opacity",
          transitionDelay: `${startDelay + i * 5}ms`,
        }}
      >
        {char}
      </span>
    ));

  const chatbotButtonClick = () => router.push("/chatbot");
  const logoButtonClick = () => router.push("/main");
  const mypageButtonClick = () => router.push("/mypage/myleisure");
  const logoutButtonClick = () => router.push("/");

  return (
    <header
      className="px-10 flex-col items-start fixed top-0 w-full z-10 bg-white"
      style={{
        height: `${headerHeight}px`,
        minHeight: `${headerHeight}px`,
        transition: "height 150ms ease-out",
      }}
    >
      <div
        className="relative z-10 h-full flex items-center cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={logoButtonClick}
      >
        {/* FOR; 왼쪽 */}
        <div
          className="left-[-15px] relative pointer-events-none"
          style={{ position: "absolute" }}
        >
          <h1
            className="height-auto relative font-semibold text-[#447959] leading-none flex items-center"
            style={getTextStyle()}
          >
            <span className="block">F</span>
            <span className="absolute inset-0 flex items-center justify-start pointer-events-none">
              {getHoverSpan(["F", "O", "R", ":"], 0)}
            </span>
          </h1>
        </div>

        {/* REST 중앙 */}
        <div
          className="relative pointer-events-none"
          style={{
            position: "absolute",
            left: "65%",
            transform: "translateX(-50%)",
          }}
        >
          <h1
            className="relative font-semibold text-[#447959] leading-none flex items-center"
            style={{
              fontSize: `${fontSize}px`,
              transition: "font-size 150ms ease-out",
              lineHeight: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span className="block">R</span>
            <span className="absolute inset-0 flex items-center pointer-events-none pl-[0px]">
              {getHoverSpan(["R", "E", "S", "T"], 150)}
            </span>
          </h1>
        </div>
      </div>

      {/* 버튼 영역 위 간격 */}
      <div className="flex height-[20px] bg-white" />

      {/* 버튼 영역 */}
      <div className="relative z-30 border-t border-[#9A9A9A]" />
      <div className="my-[6px] justify-center flex bg-white w-full flex flex-row justify-between px-[30px] text-[20px] transition-all duration-200">
        <div>
          <button
            onClick={chatbotButtonClick}
            className="pointer-events-auto text-[#447959]"
          >
            chatty!
          </button>
          <button
            onClick={mypageButtonClick}
            className="pointer-events-auto ml-[30px]"
          >
            MyPage
          </button>
        </div>
        <div>
          <button
            className="pointer-events-auto text-[#9A9A9A]"
            onClick={logoutButtonClick}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="border-t border-[#9A9A9A]" />
    </header>
  );
};

export default Header;