import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import {
  HeartIcon,
  MapPinIcon,
  ReceiptPercentIcon,
  RectangleGroupIcon,
  ShoppingBagIcon,
  VideoCameraIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Information from "@/components/information";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

async function getRating(userId: number) {
  const sales = await db.sale.findMany({
    where: {
      userId,
    },
    select: {
      assessment: true,
    },
  });

  //assessment 평균 구하기
  const totalAssessment = sales.reduce((sum, sale) => sum + sale.assessment, 0);
  const averageAssessment = sales.length ? totalAssessment / sales.length : 0;

  //게시글 개수
  const postCount = sales.length;

  // 평가 점수 계산
  let ratingScore = 1; // 기본 점수는 1

  if (averageAssessment >= 3 && averageAssessment < 4 && postCount >= 10) {
    ratingScore = 2;
  } else if (
    averageAssessment >= 4 &&
    averageAssessment < 4.5 &&
    postCount >= 20
  ) {
    ratingScore = 3;
  } else if (
    averageAssessment >= 4.5 &&
    averageAssessment < 4.8 &&
    postCount >= 50
  ) {
    ratingScore = 4;
  } else if (averageAssessment >= 4.8 && postCount >= 100) {
    ratingScore = 5;
  }
  return ratingScore;
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  const ratingScore = await getRating(user.id);
  return (
    <div className="px-3 flex flex-col gap-4">
      <div className="py-5 px-3 rounded-lg bg-white flex flex-col gap-5">
        <div className="flex gap-3 items-center">
          <Image
            src={user.avatar!}
            alt="{message.user.username}"
            width={70}
            height={70}
            className="size-10 rounded-full"
          />
          <div>{user?.username}</div>
          <div className="p-2 text-xs text-main-button bg-main-color rounded-md">
            {user?.address}
          </div>
        </div>
        <Link
          href={`/profiles/${user.id}`}
          className="bg-main-button p-1.5 rounded-md text-white text-center"
        >
          <span>프로필 수정</span>
        </Link>
        <div className="flex flex-col gap-2 ">
          <div className="flex gap-1 items-center">
            <span className="text-md">푸쉐린 가이드</span>
            <Information />
          </div>
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`${
                  index < ratingScore ? "text-yellow-400" : "text-neutral-200"
                }`}
              >
                {index < ratingScore ? (
                  <StarSolidIcon className="size-7" />
                ) : (
                  <StarIcon className="size-7" />
                )}
              </span>
            ))}
          </div>
          {/* <div className="bg-bottom-border-color p-1.5 rounded-md"></div> */}
        </div>
      </div>
      <div className="py-7 px-10 rounded-lg bg-white flex gap-8 justify-center text-center">
        <Link
          href={`/profiles/loved`}
          className="flex flex-col gap-2 items-center justify-center text-black"
        >
          <HeartIcon className="h-6" />
          <h1 className="text-xs">관심목록</h1>
        </Link>
        <div className="w-px h-10 bg-gray-300 items-center"></div>
        <Link
          href={`/profiles/sold`}
          className="flex flex-col gap-2 items-center justify-center text-black"
        >
          <ReceiptPercentIcon className="h-6" />
          <h1 className="text-xs">판매내역</h1>
        </Link>
        <div className="w-px h-10 bg-gray-300 items-center"></div>
        <Link
          href={`/profiles/bought`}
          className="flex flex-col gap-2 items-center justify-center text-black"
        >
          <ShoppingBagIcon className="h-6" />
          <h1 className="text-xs">구매내역</h1>
        </Link>
        {/* <div className="flex flex-col gap-2 items-center justify-center">
          <GiftIcon className="h-6" />
          <h1 className="text-xs">이벤트</h1>
        </div> */}
      </div>
      <div className="p-5 rounded-lg bg-white flex flex-col gap-2">
        {/* <h1 className="text-xs">나의 활동</h1> */}
        <Link
          href={`/profiles/life`}
          className="flex gap-3 items-center text-black"
        >
          <RectangleGroupIcon className="h-6" />
          <span>내 동네생활 글</span>
        </Link>
      </div>
      <div className="p-5 rounded-lg bg-white flex flex-col gap-2">
        <Link
          href={`/profiles/live`}
          className="flex gap-3 items-center text-black"
        >
          <VideoCameraIcon className="h-6" />
          <span>내 쇼핑(라이브스트리밍)</span>
        </Link>
      </div>
      <div className="p-5 rounded-lg bg-white flex flex-col gap-2">
        <Link href={`/map`} className="flex gap-3 items-center text-black">
          <MapPinIcon className="h-6" />
          <span>위치 변경</span>
        </Link>
      </div>
      <form action={logOut}>
        <button className="p-2 rounded-md bg-white text-main-button w-full">
          Log out
        </button>
      </form>
    </div>
  );
}
