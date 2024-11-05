import { searchAddressToCoordinate } from "@/lib/searchAddressToCoordinate";
import { searchCoordinateToAddress } from "@/lib/searchCoordinateToAddress";
import { useEffect, useRef, useState } from "react";

type NaverMap = naver.maps.Map | null;
type Coord = { latitude: number; longitude: number } | "";

const useGetCurrentLocation = () => {
  const [myLocation, setMyLocation] = useState<Coord>("");
  useEffect(() => {
    const success = (position: { [key: string]: any }) => {
      setMyLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const error = () => {
      setMyLocation({ latitude: 37.3595316, longitude: 127.1052133 });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  return myLocation;
};

export default function MapApi() {
  const myLocation = useGetCurrentLocation();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [nmap, setNmap] = useState<NaverMap>(null);
  const [showMap, setShowMap] = useState<boolean>(false);

  useEffect(() => {
    if (mapRef.current && typeof myLocation !== "string") {
      const mapInstance = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(
          myLocation.latitude,
          myLocation.longitude
        ),
        zoomControl: true,
        size: { width: 600, height: 700 },
      });

      // init 이벤트 후에 사용자 정의 컨트롤을 추가
      naver.maps.Event.once(mapInstance, "init", function () {
        // 사용자 정의 컨트롤 버튼 생성
        const locationButton = document.createElement("div");
        locationButton.className = "custom-control";
        locationButton.innerText = "내 위치";
        // locationButton.style.position = "relative";
        // locationButton.style.zIndex = "999";
        locationButton.style.backgroundColor = "#fff";
        locationButton.style.border = "1px solid #ccc";
        locationButton.style.padding = "8px";
        locationButton.style.cursor = "pointer";
        locationButton.style.boxShadow = "0px 2px 4px rgba(0,0,0,0.15)"; // 버튼에 그림자 추가

        // 내 위치로 이동하는 기능 추가
        locationButton.onclick = () => {
          console.log("클릭되낭????");
          if (typeof myLocation !== "string") {
            const userLocation = new naver.maps.LatLng(
              myLocation.latitude,
              myLocation.longitude
            );
            mapInstance.setCenter(userLocation);
          }
        };

        // CustomControl 생성 및 지도에 추가

        const customControl = new naver.maps.CustomControl(
          locationButton.outerHTML,
          {
            position: naver.maps.Position.TOP_RIGHT,
          }
        );
        customControl.setMap(mapInstance);

        setNmap(mapInstance);

        // 지도 클릭 시 좌표에 대한 주소 검색
        naver.maps.Event.addListener(mapInstance, "click", function (e) {
          searchCoordinateToAddress(e.coord, mapInstance);
        });
      });
    }
  }, [showMap, myLocation]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputValue = (e.target as HTMLElement).querySelector("input")
      ?.value as string;
    if (nmap) {
      searchAddressToCoordinate(inputValue, nmap);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const inputValue = (
      (e.target as HTMLElement).parentNode as HTMLElement
    ).querySelector("input")?.value as string;
    if (nmap) {
      searchAddressToCoordinate(inputValue, nmap);
    }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && (e.target as HTMLInputElement).value === "") {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          onKeyDown={handleKeydown}
          type="text"
          placeholder="(예:잠실)"
          className="bg-transparent rounded-md w-2/3 h-10 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-main-button border-none placeholder:text-neutral-400 px-2"
        />
        <button
          onClick={handleClick}
          type="button"
          className="bg-main-button text-white p-2 rounded-md w-1/3"
        >
          주소 검색
        </button>
      </form>
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}
