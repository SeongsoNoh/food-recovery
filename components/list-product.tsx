import Link from "next/link";
import Image from "next/image";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}
export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
}: ListProductProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex gap-5 pb-5 border-b border-neutral-200"
    >
      <div className="relative size-28 rounded-md overflow-hidden outline outline-1 outline-neutral-200">
        <Image fill src={photo} className="obejct-cover " alt={title} />
      </div>
      <div className="flex flex-col gap-1 *:text-neutral-600">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
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
