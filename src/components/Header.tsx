import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false);

  const chatbotButtonClick = () => {
    router.push("/chatbot")
  }
  const logoButtonClick = () => {
    router.push("/main")
  }


  const mypageButtonClick = () => {
    router.push("/mypage/modify")
  }

  const logoutButtonClick = () => {
    router.push("/")
    //로그아웃 구현
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // 50px 이상 내리면 작아짐
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col">

      <button
        className="ml-[30px] mr-[30px] cursor-pointer flex items-center justify-center w-fit relative group p-0 leading-none"
        onClick={logoButtonClick}
      >
        {/* 기본 로고 */}
        <h1
          className={`flex flex-row text-[#447959] absolute top-0 left-0 z-10 leading-none transition-all duration-500 
          ${isScrolled ? "text-[100px]" : "text-[200px]"}`}
        >
          {isScrolled ? (
            <>F<span className="opacity-0">OR;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R&nbsp;&nbsp;&nbsp;</>
          ) : (
            <>F<span className="opacity-0">OR;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R&nbsp;&nbsp;&nbsp;</>
          )}
        </h1>

        {/* Hover 시 FOR; REST */}
        <h1 className="absolute top-0 left-0 text-[200px] text-[#447959] flex z-20 leading-none">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[0ms]">F</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[20ms]">O</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[40ms]">R</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[60ms]">;</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[80ms]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[100ms]">R</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[120ms]">E</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[140ms]">S</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[160ms]">T</span>
        </h1>
      </button>

      <div className="w-full flex flex-row justify-between px-[30px] mt-[230px] text-[30px]">
        <div>
          <button onClick={chatbotButtonClick} className="text-[#447959]">
            chatty!
          </button>
          <button onClick={mypageButtonClick} className="ml-[30px]">
            MyPage
          </button>
        </div>

        <div>
          <button className="text-[#9A9A9A]" onClick={logoutButtonClick}>
            Logout
          </button>
        </div>
      </div>

      <div className="mt-[20px] w-full mx-[30px] justify-between border-t border-black" />
    </div>
  );
}

export default Header;