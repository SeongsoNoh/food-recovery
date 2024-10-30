import ProfileForm from "@/components/profileForm";
import db from "@/lib/db";
import { User } from "@prisma/client";

export default async function ProfileDetail({
  params,
}: {
  params: { id: string };
}) {
  const userDetail: User | null = await db.user.findUnique({
    where: {
      id: Number(params.id),
    },
  });
  return <ProfileForm userDetail={userDetail!} />;
}
