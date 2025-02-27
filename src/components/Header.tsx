import Image from "next/image";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter()
  const chatbotButtonClick = () => {
    router.push("/")
    //챗봇페이지 구현 + 연결 필요요
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


  return (
    <div className="flex items-center justify-between mt-[40px] px-[50px]">
      <button onClick={chatbotButtonClick}>
        <Image src="/images/icon_chatbot.svg" alt="챗봇 아이콘" width={30} height={30}></Image>
      </button>

      <button className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
        onClick={logoButtonClick} >
        <Image src="/images/logo_forrest.png" alt="logo" width={50} height={50} >
        </Image>
        <h1 className="text-[#4C8362] font-bold text-[32px] ml-[20px]">
          For-rest
        </h1>
      </button>

      <div>
        <button className="mr-[15px]"
        onClick={logoutButtonClick}>
          <Image src="/images/icon_logout.svg" alt="로그아웃 아이콘" width={30} height={30}></Image>
        </button>

        <button onClick={mypageButtonClick}>
          <Image src="/images/icon_mypage.svg" alt="마이페이지 아이콘" width={30} height={30}></Image>
        </button>
      </div>

    </div>
  );
}

export default Header;