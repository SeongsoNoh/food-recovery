import LiveList from "@/components/live-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { usePathname } from "next/navigation";

export default async function Live() {
  const session = await getSession();
  return <LiveList />;
}
