import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import instance from "@/lib/axios";
import Cookies from "js-cookie";


const GoogleCallback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const code = searchParams.get("code");
      console.log("구글에서 받은 code:", code);
      if (!code) {
        router.push("/"); // ❌ 인가 코드가 없으면 메인으로 이동
        return;
      }

      try {
        const res = await instance.post("/auth/google", { code });
        console.log("응답 결과:", res);

        // JWT 쿠키에서 토큰 확인
        const token = Cookies.get("jwt");
        if (token) {
          setIsLogin(true); // 로그인 상태 변경
          setUserName(res.data.name || "사용자"); // 사용자 이름 설정
        }

        router.push("/main"); // ✅ 로그인 성공 후 홈으로 이동
      } catch (error) {
        console.error("서버 인증 실패", error);
        router.push("/");
      }
    };

    handleGoogleAuth();
  }, [searchParams, router]);

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await instance.post("/logout");

      // JWT 삭제 및 상태 초기화
      Cookies.remove("jwt");
      setIsLogin(false);
      setUserName("");

      console.log("로그아웃 성공");
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div>
      {isLogin ? (
        <div>
          <p>{userName}님, 환영합니다!</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <p>로그인 처리 중...</p>
      )}
    </div>
  );
};

export default GoogleCallback;