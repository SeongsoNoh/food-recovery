import DeleteButton from "@/components/delete-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { HeartIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { unstable_cache as nextCache, revalidateTag } from "next/cache";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  console.log("product");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

async function getProductTitle(id: number) {
  console.log("title");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title", "product-detail"],
});

// 반드시 이름이 generateMetadata여야 함. 예약어
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  // id에 문자열 string이 들어오는 경우 오류처리
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  // db에 없는 product id이면 notFound 페이지 보여주기
  if (!product) {
    return notFound();
  }
  // 소유자인지 확인
  const isOwner = await getIsOwner(product.userId);

  const createChatRoom = async () => {
    "use server";
    let room;
    const session = await getSession();
    // 이미 chatroom이 존재하는지 확인
    const roomsAlreadyExist = await db.chatRoom.findMany({
      where: {
        productId: product.id,
        users: {
          some: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
    if (roomsAlreadyExist) {
      room = roomsAlreadyExist[0];
      console.log("AlreadyExistRoom", room);
    }
    if (!room) {
      // chatroom 생성
      room = await db.chatRoom.create({
        data: {
          users: {
            // users relationship 연결
            connect: [
              {
                // 판매자 id
                id: product.userId,
              },
              {
                // 로그인 유저 id
                id: session.id,
              },
            ],
          },
          product: {
            connect: {
              id: product.id,
            },
          },
        },
        // 반환할 값 선택
        select: {
          id: true,
        },
      });
    }
    redirect(`/chats/${room.id}`);
  };

  return (
    <div>
      <div className="relative aspect-square border-b border-neutral-300">
        <Image
          fill
          src={product.photo}
          className="object-cover"
          alt={product.title}
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-300">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
        <div>{/* <h3>등급(예: 수박게임-블루베리-토마토등)</h3> */}</div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="mt-3">{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 py-4 px-5 bg-white flex justify-between items-center border-t border-neutral-300">
        <div className="flex items-center">
          <button onClick={toggleFav}>
            <HeartIcon className="w-7 h-7 stroke-neutral-400" />
          </button>
          <svg height="50" width="20">
            <line
              x1="10"
              y1="0"
              x2="10"
              y2="50"
              className="stroke-neutral-300"
            />
          </svg>
          <span className="font-semibold text-xl">
            {formatToWon(product.price)}원
          </span>
        </div>
        {isOwner ? (
          <div className="flex gap-2">
            <button className="bg-main-button px-5 py-2.5 rounded-md text-white font-semibold ">
              수정
            </button>

            <DeleteButton productId={id} userId={product.userId} />
          </div>
        ) : (
          <form action={createChatRoom}>
            <button className="bg-main-button px-5 py-2.5 rounded-md text-white font-semibold">
              채팅하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
