import Link from "next/link";
import Image from "next/image";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
  state: number;
}
export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
  state,
}: ListProductProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex gap-5 p-4 border-b border-neutral-200 rounded-2xl shadow-lg bg-white"
    >
      <div className="relative size-28 rounded-md overflow-hidden outline outline-1 outline-neutral-200">
        <Image
          fill
          src={`${photo}/avatar`}
          className="obejct-cover "
          alt={title}
        />
      </div>
      <div className="flex flex-col gap-1 *:text-neutral-600">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <div className="flex gap-1 items-center">
          {state === 2 ? (
            <div className="px-2 py-1 text-white text-xs border-main-button bg-main-button rounded-md ">
              예약중
            </div>
          ) : state === 3 ? (
            <div className="px-2 py-1 text-white text-xs border-slate-700 bg-slate-700 rounded-md ">
              거래완료
            </div>
          ) : null}
          <span className="text-lg font-semibold">{formatToWon(price)}원</span>
        </div>
        {/* <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
          <span>
            <HandThumbUpIcon className="size-4" />0
          </span>
          <span>
            <ChatBubbleBottomCenterIcon className="size-4" />0
          </span>
        </div> */}
      </div>
    </Link>
  );
}
