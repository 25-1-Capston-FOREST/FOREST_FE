import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}
//
export interface KakaoMapProps {
  la: number;
  lo: number;
}

const KakaoMapImage: React.FC<KakaoMapProps> = ({ la, lo }) => {
  useEffect(() => {

    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error("window.kakao.maps가 없습니다!");
        return;
      }

      window.kakao.maps.load(() => {
        console.log("kakao.maps.load 콜백 실행됨");

        const container = document.getElementById("map");
        if (!container) {
          console.error("map 컨테이너가 없습니다!");
          return;
        }

        const options = {
          center: new window.kakao.maps.LatLng(la, lo),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(la, lo),
        });

        marker.setMap(map);
        console.log("지도와 마커 생성 완료");
      });
    };

    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );

    if (!existingScript) {
      console.log("스크립트가 없어서 새로 추가함");
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
      script.async = true;

      script.onload = () => {
        console.log("스크립트 로드 완료, loadMap 실행");
        loadMap();
      };

      script.onerror = () => {
        console.error("스크립트 로드 실패");
      };

      document.head.appendChild(script);
    } else {
      console.log("스크립트가 이미 존재함");

      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        console.log("kakao.maps.load 즉시 실행");
        loadMap();
      } else {
        const checkKakaoMaps = setInterval(() => {
          if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
            console.log("window.kakao.maps.load 확인됨, loadMap 실행");
            clearInterval(checkKakaoMaps);
            loadMap();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkKakaoMaps);
          if (!window.kakao || !window.kakao.maps) {
            console.error("window.kakao.maps 로딩 타임아웃");
          }
        }, 10000);
      }
    }
  }, [la, lo]);

  return (
    <div
      id="map"
      style={{ width: "400px", height: "247px", backgroundColor: "#eee" }}
    />
  );
};

export default KakaoMapImage;
