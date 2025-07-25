import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
      state: true,
    },
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Product() {
  const initialProducts = await getInitialProducts();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className=" flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8"
      >
        <PlusCircleIcon className="size-16" />
      </Link>
    </div>
  );
}
