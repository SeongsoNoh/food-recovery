import db from "@/lib/db";
import getSession from "@/lib/session";

// const session = await getSession();
async function getChats() {
  const session = await getSession();
  const chats = db.message.groupBy({
    by: ["chatRoomId"],
    where: {
      NOT: {
        userId: session.id,
      },
    },
  });
}

export default async function ChatUnRead() {
  const chats = await getChats();
  return (
    <div className="absolute px-1 py-0.5 ml-6 top-2 bg-main-button rounded-full text-xs">
      10
    </div>
  );
}
