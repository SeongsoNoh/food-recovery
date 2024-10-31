import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import getSession from "@/lib/session";

async function getInitialLife() {
  const session = await getSession();
  const lifes = await db.post.findMany({
    where: {
      userId: session.id,
    },

    orderBy: {
      created_at: "desc",
    },
  });

  return lifes;
}

export default async function Loved() {
  return <div></div>;
}
