import { useRouter } from "next/router";
import { useState } from "react";
import Header from "@/components/Header";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [headerHeight, setHeaderHeight] = useState(150);

  return (
    <>
      {router.pathname !== "/" && (
        <Header headerHeight={headerHeight} setHeaderHeight={setHeaderHeight} />
      )}
      <div style={{ paddingTop: router.pathname !== "/" ? headerHeight : 0 }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}