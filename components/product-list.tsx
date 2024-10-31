"use client";

import { InitialProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import {
  getMoreProducts,
  getMoreProductsBought,
  getMoreProductsLoved,
  getMoreProductsSold,
} from "@/app/(tabs)/home/action";
import { usePathname } from "next/navigation";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const pathname = usePathname();

  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (
          element.isIntersecting &&
          trigger.current &&
          !isLoading &&
          !isLastPage
        ) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          let newProducts = [];
          if (pathname === "/profiles/loved") {
            newProducts = await getMoreProductsLoved(page + 1);
          } else if (pathname === "/profiles/sold") {
            newProducts = await getMoreProductsSold(page + 1);
          } else if (pathname === "/profiles/bought") {
            newProducts = await getMoreProductsBought(page + 1);
          } else {
            newProducts = await getMoreProducts(page + 1);
          }
          if (newProducts.length !== 0) {
            setProducts((prev) => {
              const newProductIds = newProducts.map((product) => product.id);
              const filteredProducts = prev.filter(
                (product) => !newProductIds.includes(product.id)
              );
              return [...filteredProducts, ...newProducts];
            });
            setPage((prev) => prev + 1);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page, isLoading, isLastPage]);
  return (
    <div className="p-5 flex flex-col gap-4">
      {products.length === 0 && <p>상품이 없습니다.</p>}
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          className="text-sm font-semibold bg-main-button text-white w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "Load more"}
        </span>
      ) : null}
    </div>
  );
}
