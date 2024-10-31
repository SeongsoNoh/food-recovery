import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import getSession from "@/lib/session";

async function getInitialLikes() {
  const session = await getSession();
  const favs = await db.fav.findMany({
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

  const products = favs.map((fav) => fav.product);
  return products;
}

export type InitialLikes = Prisma.PromiseReturnType<typeof getInitialLikes>;
export default async function Loved() {
  const initialLikes = await getInitialLikes();
  return (
    <div>
      <ProductList initialProducts={initialLikes} />
    </div>
  );
}
