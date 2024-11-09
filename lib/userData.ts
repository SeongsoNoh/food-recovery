"use server";

import db from "./db";
import getSession from "./session";

export default async function UserData() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
        address: true,
        detailAddress: true,
      },
    });
    if (user) return user;
  }
}
