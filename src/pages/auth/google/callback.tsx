import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const GoogleCallback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const code = searchParams.get("code");
      if (!code) {
        router.push("/"); // ❌ 인가 코드가 없으면 메인으로 이동
        return;
      }

      try {
        const res = await axios.post("http://localhost:3001/auth/google", { code });
        localStorage.setItem("jwt", res.data.token);
      } catch (error) {
        console.error("서버 인증 실패", error);
      }

      router.push("/"); // ✅ 로그인 성공 후 메인 페이지로 이동
    };

    handleGoogleAuth();
  }, [searchParams, router]);

  return null; // 👀 아무것도 안 뜨고 자동으로 이동함
};

export default GoogleCallback;