"use client";

import MapApi from "@/components/mapApi";
import { addAddress } from "./action";

export default function Map() {
  const clickAction = async () => {
    const address = document.getElementById("mapAddress")?.textContent;
    const detailAddress = document.getElementById("landAddress")?.textContent;
    try {
      await addAddress({ address, detailAddress });
      alert("위치가 추가 되었습니다.");
    } catch (error) {
      console.error("fail addAddress");
    }
  };
  return (
    <div className="p-5 flex flex-col gap-3">
      <MapApi />
      <button
        className="w-full bg-main-button p-3 rounded-md text-white"
        onClick={clickAction}
      >
        선택완료
      </button>
    </div>
  );
}
