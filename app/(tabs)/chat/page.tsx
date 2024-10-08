import { getChatRooms, getUser } from "./action";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";
import { unstable_cache as nextCache } from "next/cache";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import ChatRoomsList from "@/components/chat-rooms-list";
import { notFound } from "next/navigation";

export type InitialChatRooms = Prisma.PromiseReturnType<typeof getChatRooms>;

export default async function Chat() {
  const session = await getSession();

  const getCachedChatRooms = nextCache(getChatRooms, ["chatroom-list"], {
    tags: ["chatroom-list"],
  });

  const initialChatRooms = await getChatRooms(session.id!);

  const user = await getUser();
  if (!user) {
    return notFound();
  }
  return (
    <>
      <h2 className="text-2xl text-center pt-4">채팅</h2>{" "}
      <ChatRoomsList initialChatRooms={initialChatRooms} user={user} />{" "}
    </>
  );
  // return (
  //   <div className="p-10 flex flex-col gap-5">
  //     {chatRooms.map((chatRoom) => (
  //       <Link
  //         href={`/chats/${chatRoom.id}`}
  //         key={chatRoom.id}
  //         className="flex justify-between mb-10 gap-20 *:text-white"
  //       >
  //         <div className="flex gap-20">
  //           <div className="relative">
  //             <div className="absolute z-10 -top-3 -left-3 size-12 rounded-full bg-neutral-700">
  //               {chatRoom.users[0] === undefined ? (
  //                 <div className="size-12 rounded-full bg-neutral-400 flex items-center justify-center">
  //                   <Image
  //                     src={user.avatar!}
  //                     alt={user.username.slice(0, 1)}
  //                     width={50}
  //                     height={50}
  //                     className="rounded-full"
  //                   />
  //                 </div>
  //               ) : chatRoom.users[0].avatar === null ? (
  //                 <div className="size-12 rounded-full bg-neutral-400 flex items-center justify-center">
  //                   {chatRoom.users[0].username.slice(0, 1)}
  //                 </div>
  //               ) : (
  //                 <Image
  //                   src={chatRoom.users[0].avatar!}
  //                   alt={chatRoom.users[0].username}
  //                   width={50}
  //                   height={50}
  //                   className="rounded-full"
  //                 />
  //               )}
  //             </div>
  //             <div className="absolute z-20 top-4 left-4 size-12 rounded-md  border-2 border-neutral-900 overflow-hidden">
  //               <Image
  //                 src={`${chatRoom.product.photo}/smaller`}
  //                 alt="No photo"
  //                 fill
  //                 className="object-cover z-30"
  //               />
  //             </div>
  //           </div>
  //           <div className="flex flex-col gap-2 *:rounded-md">
  //             <div className="flex items-end gap-2">
  //               <span>
  //                 {chatRoom.users[0] === undefined
  //                   ? "나와의 채팅"
  //                   : chatRoom.users[0].username}
  //               </span>
  //               <span className="text-neutral-500 text-sm">
  //                 {chatRoom.Messages[0] === undefined
  //                   ? null
  //                   : formatToTimeAgo(
  //                       chatRoom.Messages[0].created_at.toString()
  //                     )}
  //               </span>
  //             </div>
  //             <div>
  //               <span>
  //                 {chatRoom.Messages[0] === undefined
  //                   ? "메시지가 없습니다."
  //                   : chatRoom.Messages[0].payload}
  //               </span>
  //             </div>
  //           </div>
  //         </div>
  //         {chatRoom.Messages[0] === undefined ||
  //         chatRoom.Messages[0].isRead ? null : (
  //           <div className="flex items-center justify-center">
  //             <span className="px-2.5 pt-1 pb-1 text-xs bg-orange-500 rounded-xl">
  //               {chatRoom._count.Messages}
  //             </span>
  //           </div>
  //         )}
  //       </Link>
  //     ))}
  //   </div>
  // );
}
