import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import getSession from "@/lib/session";

async function getInitialSold() {
  const session = await getSession();
  const sales = await db.sale.findMany({
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

  const products = sales.map((sale) => sale.product);
  return products;
}

export type InitialSold = Prisma.PromiseReturnType<typeof getInitialSold>;
export default async function Sold() {
  const initialSold = await getInitialSold();
  return (
    <div>
      <ProductList initialProducts={initialSold} />
    </div>
  );
}
