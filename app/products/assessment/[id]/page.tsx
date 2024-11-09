import AssessmentButton from "@/components/assessment-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Product } from "@prisma/client";

export default async function assessment({
  params,
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      username: true,
    },
  });
  return (
    <AssessmentButton
      product={product as Product & { user: { id: number; username: string } }}
      user={user!}
    />
  );
}
