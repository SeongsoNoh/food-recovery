import { searchAddressToCoordinate } from "@/lib/searchAddressToCoordinate";
import { searchCoordinateToAddress } from "@/lib/searchCoordinateToAddress";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { IoMdLocate } from "react-icons/io";

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
  const [nmap, setNmap] = useState<NaverMap>(null);

  useEffect(() => {
    if (typeof myLocation !== "string") {
      const mapInstance = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(
          myLocation.latitude,
          myLocation.longitude
        ),
        zoom: 16,
        zoomControl: true,
        size: { width: 600, height: 700 },
        logoControl: false,
        mapDataControl: false,
      });

      mapInstance.addListener("click", function (e) {
        searchCoordinateToAddress(e.coord, mapInstance);
      });
      setNmap(mapInstance);
    }
  }, [myLocation]);

  const clickMyLocation = () => {
    if (typeof myLocation !== "string") {
      const userLocation = new naver.maps.LatLng(
        myLocation.latitude,
        myLocation.longitude
      );
      // nmap!.setZoom(16);
      nmap!.setCenter(userLocation);
    }
  };

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
      (e.target as HTMLElement).previousElementSibling as HTMLElement
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
    <div className="flex flex-col gap-5 items-center ">
      <form
        onSubmit={handleSubmit}
        className="flex relative w-full items-center"
      >
        <input
          onKeyDown={handleKeydown}
          type="text"
          placeholder="(예:순천시)"
          className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-main-button border-none placeholder:text-neutral-400 px-2"
        />
        <button onClick={handleClick} className="absolute right-3">
          <MagnifyingGlassIcon className="size-7 text-neutral-400 transition-colors hover:text-main-button" />
        </button>
      </form>
      <div id="map">
        <button
          onClick={clickMyLocation}
          className="flex justify-center items-center absolute w-[40px] h-[35px] top-[10px] left-[110px] border-none outline outline-[0.5px] outline-white bg-white shadow-md z-10 [&>p]:hover:top-[45px] [&>p]:hover:block"
        >
          <IoMdLocate className="locateIcon" size={21} />
        </button>
      </div>
    </div>
  );
}
