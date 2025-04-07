"use client"; // 클라이언트 컴포넌트로 지정

import GoogleLoginWrapper from "@/components/GoogleLoginButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import instance from "@/lib/axios";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 페이지 이동 버튼
  const testButtonClick = () => {
    router.push("/main");
  };

  useEffect(() => {
    // 로그인 상태 확인
    fetch("http://13.124.10.41:3001/user", {
      method: "GET",
      credentials: "include", // ← 쿠키 포함해서 요청 보내기
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user); // 로그인 상태 유지
        }
      })
      .catch((err) => {
        console.error("인증 상태 확인 실패", err);
      });
  }, []);

  return (
    <div className="bg-[#447959] h-screen absolute top-0 w-screen">
      <h1 className="text-white text-[40px] font-bold">
        FOR;
      </h1>
      
      <div className="flex mt-[130px] items-center flex-col" >



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

      <h1 className="text-white text-[40px] font-bold">
        REST
      </h1>
    </div>
  );

}