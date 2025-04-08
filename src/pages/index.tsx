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
    fetch("https://capston-forest.duckdns.org/user", {
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
    <div className="overflow-hidden bg-[#447959] h-screen absolute top-0 w-screen">
      <h1 className="absolute top-[-70px] text-white text-[200px] font-bold">
        FOR;
      </h1>
      <div className="flex mt-[200px] items-center flex-col" >
        <div className="space-y-6">
          <GoogleLoginWrapper />

          <button className="text-[18px] font-semibold mt-[20px] flex bg-white w-[353px] h-[67px] rounded-[6px] flex-row items-center justify-between"
            onClick={testButtonClick}>
            <Image src="/images/logo_kakao.svg" alt="logo" width={23} height={23} className="absolute ml-3.5">
            </Image>
            <h6 className="px-[3px] flex-1">
              Sign in with Kakao
            </h6>
          </button>

          <button className="text-[18px] font-semibold mt-[20px] flex bg-white w-[353px] h-[67px] rounded-[6px] flex-row items-center justify-between">
            <Image src="/images/logo_naver.svg" alt="logo" width={23} height={23} className="absolute ml-3.5">
            </Image>
            <h6 className="px-[3px] flex-1">
              Sign in with Naver
            </h6>
          </button>


        </div>
      </div>

      <h1 className=" absolute bottom-[-50px] w-full text-right text-white text-[200px] font-bold ">
        REST
      </h1>
    </div>
  );

}