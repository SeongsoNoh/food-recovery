"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

export async function saveMessage(payload: string, chatRoomId: string) {
  const sesssion = await getSession();
  const message = await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: sesssion.id!,
    },
    select: {
      id: true,
    },
  });
}
