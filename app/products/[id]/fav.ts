"use server";
import db from "@/lib/db";

interface FavProductProps {
  productId: number;
  userId: number;
}

export default async function FavProduct({
  productId,
  userId,
}: FavProductProps) {
  const existFav = await db.fav.findUnique({
    where: {
      userId_productId: {
        productId,
        userId,
      },
    },
  });
  console.log(existFav);
  if (existFav) {
    await db.fav.delete({
      where: { id: existFav.id },
    });
  } else {
    console.log("durlfh???");
    await db.fav.create({
      data: {
        productId,
        userId,
      },
    });
  }
}
