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

const mapRef = useRef<HTMLElement | null>(null);
const myLocation = useGetCurrentLocation();
let nmap: naver.maps.Map;

const initMap = () => {
  if (typeof myLocation !== "string") {
    nmap = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(myLocation.latitude, myLocation.longitude), // 초기 위치 (서울)
      zoomControl: true,
      size: { width: 500, height: 500 },
      // scaleControl: false,
      // mapDataControl: false,
      // logoControlOptions: {
      //   position: naver.maps.Position.BOTTOM_LEFT,
      // },
    });
    naver.maps.Event.addListener(nmap, "click", function (e) {
      searchCoordinateToAddress(e.coord, nmap as naver.maps.Map);
    });
  }
};
useEffect(() => {
  initMap();
}, [mapRef, myLocation]);

export default function Map() {
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  const [showMap, setShowMap] = useState(false);
  const [map, setMap] = useState<NaverMap>(null); // map의 타입 정의
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (showMap) {
      const mapInstance = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.5665, 126.978), // 초기 위치 (서울)
        zoom: 10,
        scaleControl: false,
        mapDataControl: false,
        logoControlOptions: {
          position: naver.maps.Position.BOTTOM_LEFT,
        },
      });

      setMap(mapInstance);

      // 지도 클릭 이벤트 리스너 추가
      naver.maps.Event.addListener(mapInstance, "click", function (e) {
        const lat = e.coord.lat();
        const lng = e.coord.lng();
        setLocation({ lat, lng });
        // setShowMap(false); // 위치 선택 후 지도 숨기기
      });
    }
  }, [showMap]);

  const handleSearch = () => {
    if (map && searchTerm) {
      naver.maps.Service.geocode(
        { query: searchTerm },
        function (status, response) {
          if (status === naver.maps.Service.Status.OK) {
            const addresses = response.v2.addresses; // 검색된 주소
            if (addresses.length > 0) {
              const lat = Number(addresses[0].y); // 위도
              const lng = Number(addresses[0].x); // 경도
              setLocation({ lat, lng });
              map.setCenter(new naver.maps.LatLng(lat, lng)); // 검색된 위치로 이동
              setShowMap(false); // 검색 결과 선택 후 지도 숨기기
            } else {
              alert("검색 결과가 없습니다.");
            }
          } else {
            alert("검색 실패: " + status);
          }
        }
      );
    } else {
      alert("검색어를 입력해주세요.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setShowMap(!showMap)}
        className="bg-main-button text-white p-3 rounded-md"
      >
        지도 검색하기
      </button>
      {showMap && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              name="map"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="장소를 검색하세요"
              className="bg-transparent rounded-md w-2/3 h-10 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-main-button border-none placeholder:text-neutral-400 px-2"

              // style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <button
              onClick={handleSearch}
              className="bg-main-button text-white p-2 rounded-md w-1/3"
            >
              검색
            </button>
          </div>
          <div id="map" style={{ width: "100%", height: "400px" }}></div>
        </div>
      )}
      {location.lat && location.lng && (
        <p>
          선택된 위치: 위도 {location.lat}, 경도 {location.lng}
        </p>
      )}
    </div>
  );
}
