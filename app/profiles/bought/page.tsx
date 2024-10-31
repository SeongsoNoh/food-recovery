import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import getSession from "@/lib/session";

async function getInitialBought() {
  const session = await getSession();
  const purchases = await db.purchase.findMany({
    where: {
      userId: session.id,
    },
    include: {
      product: {
        select: {
          title: true,
          price: true,
          created_at: true,
          photo: true,
          id: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const products = purchases.map((purchase) => purchase.product);
  return products;
}

export type InitialBought = Prisma.PromiseReturnType<typeof getInitialBought>;
export default async function Bought() {
  const initialBought = await getInitialBought();
  return (
    <div>
      <ProductList initialProducts={initialBought} />
    </div>
  );
}
