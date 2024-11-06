import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return posts;
}

export const metadata = {
  title: "동네생활",
};

export default async function Life() {
  const posts = await getPosts();

  return (
    <div className="px-5 flex flex-col gap-2">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="px-4 py-3 text-black flex  flex-col gap-2  bg-white rounded-lg shadow-md"
        >
          <h2 className="text-black text-lg font-semibold">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href="/posts/add"
        className=" flex items-center justify-center rounded-full fixed bottom-24 right-8"
      >
        <button className="px-4 py-2 bg-main-button text-white rounded-lg">
          글쓰기
        </button>
      </Link>
    </div>
  );
}
