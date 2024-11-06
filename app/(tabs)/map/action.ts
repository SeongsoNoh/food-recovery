"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

interface AddressProps {
  address: string | "" | null | undefined;
  detailAddress: string | "" | null | undefined;
}

export async function addAddress({ address, detailAddress }: AddressProps) {
  const session = await getSession();
  const userId = session.id!;
  if (userId) {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        address,
        detailAddress,
      },
    });
  }
  redirect(`/home`);
}
