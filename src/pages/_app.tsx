import { useRouter } from "next/router";
import Header from "@/components/Header";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      {/* App 파일에 컴포넌트 넣으면 모든 페이지에 자동으로 배치됨*/}
      {router.pathname !== "/" && <Header />}
      <Component {...pageProps} />
    </>
  );
}
