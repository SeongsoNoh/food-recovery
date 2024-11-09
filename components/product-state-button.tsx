"use client";

import { updateProductState } from "@/app/chats/[id]/action";
import { useEffect, useState } from "react";

interface productStateProps {
  product: any;
  sessionUserId: number;
  buyerId: number | undefined;
}

export default function ProductStateButton({
  product,
  sessionUserId,
  buyerId,
}: productStateProps) {
  const [productState, setProductState] = useState(product.state);
  const updateState = async (state: number) => {
    await updateProductState(product.id, state, buyerId);
  };

  useEffect(() => {
    updateState(productState);
  }, [productState]);
  return (
    <div className="">
      {/* 상태가 거래완료가 아닐때 표출 거래완료 시 다르게 표출 */}
      {/* state 
                1 = 판매중(default)
                2 = 예약중
                3 = 판매완료
            */}
      {productState === 1 ? (
        product?.userId === sessionUserId ? (
          <button
            onClick={() => setProductState(2)}
            className="bg-sub-button p-2 text-sm rounded-md font-semibold"
          >
            예약하기
          </button>
        ) : null
      ) : productState === 2 ? (
        <div className="flex gap-2">
          <button
            onClick={() => setProductState(3)}
            className="bg-main-button p-2 text-sm text-white rounded-md font-semibold"
          >
            {product?.userId === sessionUserId ? "판매완료" : "구매완료"}
          </button>
          {product?.userId === sessionUserId ? (
            <button
              onClick={() => setProductState(1)}
              className="bg-sub-button p-2 text-sm rounded-md font-semibold"
            >
              예약취소
            </button>
          ) : null}
        </div>
      ) : productState === 3 ? (
        product?.buyerId === sessionUserId ? (
          <button className="bg-sub-button p-2 text-sm rounded-md font-semibold">
            판매자 평가
          </button>
        ) : null
      ) : null}
    </div>
  );
}
