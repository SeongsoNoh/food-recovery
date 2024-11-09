"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { saveMessage, updateMessagesAsRead } from "@/app/chats/[id]/action";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SUPABASE_PUBLICK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucnljeWx5dWt1aGV4dG9mYW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5Mzg4NzAsImV4cCI6MjA0MjUxNDg3MH0.NEcW3xmCMw0dEz6-wdHkar09QatrUUnRs0w7Px5LcKs";
const SUPABASE_URL = "https://mnrycylyukuhextofami.supabase.co";

const client = createClient(SUPABASE_URL, SUPABASE_PUBLICK_KEY!);

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  usernmae: string;
  avatar: string;
}
export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  usernmae,
  avatar,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        isRead: false,
        created_at: new Date(),
        userId,
        user: {
          username: "string",
          avatar: "xxx",
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        isRead: false,
        created_at: new Date(),
        userId,
        user: {
          usernmae,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };
  /* supabase channel.on으로 message 수신 시 DB에서 isRead를 true로 변경 */
  const markLastMessageAsRead = async (lastMessageId: number) => {
    // console.log(lastMessageId);
    await updateMessagesAsRead(chatRoomId, userId);
    // console.log("update messages as read successfully");
  };

  /* 수신확인 시 broadcast를 보냄 */
  const sendReceipt = () => {
    // console.log("message-receipt");
    channel.current?.send({
      type: "broadcast",
      event: "message-receipt",
      payload: {},
    });
  };

  /* useEffect내 코드는 판매자와 구매자 모두에게 적용됨, 즉 둘 다 동일한 채널에 있게됨 */
  // 시작할 때와 chatRoomId가 변경될 때만 useEffect가 작동하도록 함
  useEffect(() => {
    sendReceipt();
    // 채팅방은 아무나 접근할 수 없어야 하기 때문에 고유하면서 아무도 추측할 수 없는 랜덤string으로 해야함
    // 채널에 참여
    // useRef를 사용하면서 const로 channel을 이미 생성하였으므로, 여기서는 const를 삭제하고 .current를 붙여줘야 함
    // TypeScript 에러가 발생하는 이유는 channel이 type이 지정되지 않은 ref라고 판단하기 때문임
    // useRef를 선언하는 곳에서 channel이 받을 type을 지정해주면 TypeScript 에러를 없앨 수 있음, 아래 channel의 return value의 type을 확인하여 useRef에 타입을 명시해 줄 것
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLICK_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        // setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
        const newMessage = payload.payload;
        // messages state를 변경하여 수신받은 message를 보여줌
        setMessages((prevMsgs) => [...prevMsgs, newMessage]);
        // DB에서 isRead를 true로 변경. 즉, 읽음처리
        markLastMessageAsRead(newMessage.id);
        // 수신했음을 알리는 broadcast 보내기
        sendReceipt();
      })
      .on("broadcast", { event: "message-receipt" }, () => {
        // 마지막 메시지의 isRead를 true로 변경하여 state가 UI에 적용되도록 함
        setMessages((prevMsgs) => {
          if (prevMsgs.length === 0) return prevMsgs;

          return prevMsgs.map((msg, index) =>
            index === prevMsgs.length - 1 ? { ...msg, isRead: true } : msg
          );
        });
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);
  /* 메시지가 보내지면 마지막 메시지 위치로 자동 이동 */
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (userId === lastMessage.userId) scrollToBottom();
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-250px)]">
      <div className="overflow-y-auto p-5 flex-1 flex-col justify-end gap-5 border-neutral-200 rounded-3xl shadow-lg bg-white">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`py-2 flex gap-2 items-stretch ${
              message.userId === userId ? "justify-end" : ""
            }`}
          >
            {message.userId === userId ? (
              <div
                className={`flex flex-col ${
                  index === messages.length - 1
                    ? "justify-between"
                    : "justify-end"
                } items-end`}
              >
                {index === messages.length - 1 && (
                  <span className="text-xs">
                    {message.isRead ? "읽음" : "전송됨"}
                  </span>
                )}
                {/* <span className="text-xs">
                {message.isRead ? "읽음" : "전송됨"}
            </span> */}
                <span className="text-xs">
                  {formatToTimeAgo(message.created_at.toString())}
                </span>
              </div>
            ) : null}
            {message.userId === userId ? null : message.user.avatar === null ? (
              <div className="size-8 rounded-full bg-neutral-400 flex items-center justify-center">
                {message.user.username.slice(0, 1)}
              </div>
            ) : (
              <Image
                src={message.user.avatar!}
                alt="{message.user.username}"
                width={50}
                height={50}
                className="size-8 rounded-full"
              />
            )}

            <div
              className={`flex flex-col gap-1 ${
                message.userId === userId ? "items-end" : ""
              }`}
            >
              <span
                className={`${
                  message.userId === userId
                    ? "bg-main-button text-white"
                    : "bg-main-color"
                } p-2.5 rounded-md font-normal`}
              >
                {message.payload}
              </span>
              {/* <span className="text-xs">
                {formatToTimeAgo(message.created_at.toString())}
              </span> */}
            </div>
            {message.userId === userId ? null : (
              <div className="flex flex-col justify-end">
                {/* <span className="text-xs">
                  {message.isRead ? "읽음" : "전송됨"}
                </span> */}
                <span className="text-xs">
                  {formatToTimeAgo(message.created_at.toString())}
                </span>
              </div>
            )}
          </div>
        ))}
        {messages.length > 1 ? <div ref={bottomRef} /> : null}
      </div>
      <div className="fixed bottom-0 flex items-center justify-center right-0 w-full p-5 bg-white">
        <form className="flex relative w-full" onSubmit={onSubmit}>
          <input
            required
            onChange={onChange}
            value={message}
            className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-main-button border-none placeholder:text-neutral-400"
            type="text"
            name="message"
            placeholder="Write a message..."
          />
          <button className="absolute right-0">
            <ArrowUpCircleIcon className="size-10 text-main-button transition-colors hover:text-main-button" />
          </button>
        </form>
      </div>
    </div>
  );
}
