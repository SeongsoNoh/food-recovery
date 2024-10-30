"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function favProduct(productId: number) {
  // await new Promise((r) => setTimeout(r, 10000));
  const session = await getSession();
  try {
    await db.fav.create({
      data: {
        productId,
        userId: session.id!,
      },
    });
    revalidateTag(`fav-status-${productId}`);
  } catch (e) {}
}

export async function disfavProduct(productId: number) {
  // await new Promise((r) => setTimeout(r, 10000));
  try {
    const session = await getSession();
    await db.fav.delete({
      where: {
        id: {
          productId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`fav-status-${productId}`);
  } catch (e) {}
}
