"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function addAssessment(
  productId: number,
  saleId: number,
  rating: number
) {
  const session = await getSession();
  const userId = session.id!;
  await db.sale.update({
    where: {
      id: {
        productId,
        userId: saleId,
      },
      purchaseId: userId,
    },
    data: {
      assessment: rating,
    },
  });
  redirect(`/home`);
}
