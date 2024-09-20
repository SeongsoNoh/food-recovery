"use server";
import db from "@/lib/db";
import { redirect } from "next/navigation";

interface DeleteProductProps {
  productId: number;
  userId: number;
}

export default async function DeleteProduct({
  productId,
  userId,
}: DeleteProductProps) {
  if (productId) {
    await db.product.delete({
      where: {
        id: productId,
        userId,
      },
    });
  }
  redirect(`/home`);
}
