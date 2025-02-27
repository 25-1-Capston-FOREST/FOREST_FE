import GoogleLoginWrapper from "@/components/GoogleLoginButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import jwtDecode from "jwt-decode";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 페이지 이동 버튼
  const testButtonClick = () => {
    router.push("/main");
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        // JWT 토큰을 디코딩해서 사용자 정보를 추출
        const decoded = jwtDecode(token); // 자동으로 Base64 URL-safe 처리
        setUser(decoded);
      } catch (error) {
        console.error("JWT 디코딩 실패", error);
        localStorage.removeItem("jwt"); // 잘못된 토큰 삭제
      }
    }
  }, []);


  return (

    <div className="flex mt-[130px] items-center flex-col" >
      <Image src="/images/logo_forrest.png" alt="logo" width={100} height={100} >
      </Image>
      <h1 className="text-green-900 text-[40px] font-bold">
        For-rest
      </h1>

      <div className="mt-[30px] space-y-6">

        <button className="flex bg-[#FFEB34] w-[348px] h-[50px] rounded-[17px] flex-row items-center justify-between"
          onClick={testButtonClick}>
          <Image src="/images/logo_kakao.svg" alt="logo" width={50} height={50} className="absolute ml-0.5">
          </Image>
          <h6 className="px-[3px] flex-1">
            카카오톡으로 로그인하기
          </h6>
        </button>
        <GoogleLoginWrapper />


        <button className="flex bg-[#00C746] w-[348px] h-[50px] rounded-[17px] flex-row items-center justify-between">
          <Image src="/images/logo_naver.svg" alt="logo" width={40} height={40} className="absolute ml-1.5">
          </Image>
          <h6 className="px-[3px] flex-1">
            네이버로 로그인하기
          </h6>
        </button>

      </div>
    </div>
  );

}