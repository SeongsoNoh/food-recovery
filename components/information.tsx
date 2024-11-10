"use client";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function Information() {
  const [isVisible, setIsVisible] = useState(false);

  // 정보 창의 표시/숨김 상태 전환
  const toggleInfo = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="relative inline-block top-0.5 w-full">
      {/* Information Icon */}
      <button onClick={toggleInfo} className="cursor-pointer -left-10">
        <InformationCircleIcon className="size-5 text-neutral-600" />
      </button>

      {/* 정보 창 */}
      {isVisible && (
        <div className="absolute -top-3 left-8 bg-white border border-main-button rounded-md px-4 py-3  shadow-lg z-100">
          <div className="absolute top-3 right-full -mr-2 transform custom-rotate w-4 h-4 bg-white border-t border-r border-main-button"></div>
          <div
            className="absolute top-1 right-1 cursor-pointer"
            onClick={toggleInfo}
          >
            <XMarkIcon className="size-8" />
          </div>

          <div className="text-sm flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="flex">
                <StarIcon className="size-5 text-yellow-400" />
                (기본)
              </span>
              <span>• 첫 거래를 성공적으로 완료했을 때 부여됩니다.</span>
              <span>
                • 기본 신뢰도를 나타내며, 고객의 만족도가 높진 않더라도 거래를
                성사한 판매자입니다.
              </span>
            </div>
            <div className="flex flex-col">
              <span className="flex">
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                (적당히 만족)
              </span>
              <span>
                • 평균 별점 3.0 이상이고 거래 10회 이상을 성공적으로 완료한
                경우에 부여됩니다.
              </span>
              <span>
                • 고객 피드백에서 약속된 시간 내 배송 또는 기본적인 서비스
                만족도를 받은 판매자.
              </span>
            </div>
            <div className="flex flex-col">
              <span className="flex">
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                (좋은경험)
              </span>
              <span>
                • 평균 별점 4.0 이상이고, 거래 20회 이상을 성공적으로 완료한
                경우.{" "}
              </span>
              <span>
                • 리뷰에서 정확한 제품 설명과 일관된 품질에 대한 칭찬이 다수
                포함되어야 합니다.
              </span>
              <span>• 응대가 친절하고 신속하다는 피드백을 받은 경우.</span>
            </div>
            <div className="flex flex-col">
              <span className="flex">
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                (높은 신뢰도)
              </span>
              <span>
                • 평균 별점 4.5 이상이고, 거래 50회 이상을 성공적으로 완료한
                경우.{" "}
              </span>
              <span>
                • 고객이 제품 품질과 서비스에 대해 일관되게 높은 만족도를 표시한
                판매자.
              </span>
              <span>
                • 반복 구매율이 높은 고객층을 보유하며, 재구매 의사가 높은
                판매자.
              </span>
            </div>
            <div className="flex flex-col">
              <span className="flex">
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                <StarIcon className="size-5 text-yellow-400" />
                (최고의 신뢰와 품질)
              </span>
              <span>
                • 평균 별점 4.8 이상을 유지하며, 거래 100회 이상을 완료한 경우.{" "}
              </span>
              <span>
                • 고객 리뷰에서 탁월한 품질과 고객 만족도를 극찬받는 판매자.
              </span>
              <span>
                • 특정 이벤트나 시즌별 특별 서비스 등을 제공하여, 푸쉐린
                가이드의 최고 평가를 받을 자격이 충분한 경우.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
