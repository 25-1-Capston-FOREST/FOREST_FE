import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [headerHeight, setHeaderHeight] = useState(150);
  const showHeader = router.pathname !== "/";

  // 기본 최소 확보 공간 (스크롤 줄었을 때)
  const minHeaderHeight = 60;

  // paddingTop을 항상 headerHeight에 따라 반영
  const [paddingTop, setPaddingTop] = useState(minHeaderHeight);

  useEffect(() => {
    setPaddingTop(headerHeight);
  }, [headerHeight]);

  return (
    <>
      {showHeader && (
        <Header
          headerHeight={headerHeight}
          setHeaderHeight={setHeaderHeight}
        />
      )}

      <main
        style={{
          marginTop: showHeader ? `200px` : "0px",
          transition: "padding-top 150ms ease-out",
        }}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
}
