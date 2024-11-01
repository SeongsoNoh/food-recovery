import { searchAddressToCoordinate } from "@/lib/searchAddressToCoordinate";
import { searchCoordinateToAddress } from "@/lib/searchCoordinateToAddress";
import { useEffect, useRef, useState } from "react";

// naver.maps.Map의 타입을 import하여 사용 (타입스크립트 사용시)
type NaverMap = naver.maps.Map | null;
type Coord = { latitude: number; longitude: number } | "";

const useGetCurrentLocation = () => {
  const [myLocation, setMyLocation] = useState<Coord>("");
  useEffect(() => {
    // 성공했다면 상태 값에 사용자 현재 위치 좌표 저장
    // position은 nested Object이기 때문에 [key: string]: any 타입으로 지정해 줌.
    const success = (position: { [key: string]: any }) => {
      setMyLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    // 실패했다면 상태 값에 Default 좌표 저장
    const error = () => {
      setMyLocation({ latitude: 37.3595316, longitude: 127.1052133 });
    };

    if (navigator.geolocation) {
      // 위치 가져오기
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  // 다른 곳에서 사용할 수 있도록 myLocation을 반환해준다.
  return myLocation;
};

export default function Map() {
  const myLocation = useGetCurrentLocation();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [nmap, setNmap] = useState<NaverMap>(null);
  const [showMap, setShowMap] = useState<boolean>(false); // 지도의 표시 여부 상태

  //   const initMap = () => {
  //     if (typeof myLocation !== "string") {
  //       nmap = new naver.maps.Map("map", {
  //         center: new naver.maps.LatLng(
  //           myLocation.latitude,
  //           myLocation.longitude
  //         ), // 초기 위치 (서울)
  //         zoomControl: true,
  //         size: { width: 500, height: 500 },
  //         // scaleControl: false,
  //         // mapDataControl: false,
  //         // logoControlOptions: {
  //         //   position: naver.maps.Position.BOTTOM_LEFT,
  //         // },
  //       });
  //       naver.maps.Event.addListener(nmap, "click", function (e) {
  //         searchCoordinateToAddress(e.coord, nmap as naver.maps.Map);
  //       });
  //     }
  //   };
  //   useEffect(() => {
  //     initMap();
  //   }, [mapRef, myLocation]);

  useEffect(() => {
    // if (mapRef.current && typeof myLocation !== "string") {
    if (mapRef.current && typeof myLocation !== "string") {
      const mapInstance = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(
          myLocation.latitude,
          myLocation.longitude
        ), // 초기 위치
        zoomControl: true,
        size: { width: 400, height: 400 },
      });
      setNmap(mapInstance);

      naver.maps.Event.addListener(mapInstance, "click", function (e) {
        searchCoordinateToAddress(e.coord, mapInstance);
      });
    }
  }, [showMap, myLocation]); // myLocation 변경 시 지도 초기화

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
    <div className="flex flex-col gap-2 items-center">
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
      <div ref={mapRef} />
    </div>
  );
}
