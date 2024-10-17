import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import AddComment from "@/components/add-comment";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

async function getComments(id: number) {
  try {
    const comments = await db.comment.findMany({
      where: {
        postId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    return comments;
  } catch (e) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  // const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: userId!,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }
  const comments = await getComments(id);
  if (!comments) {
    return notFound();
  }
  const { likeCount, isLiked } = await getCachedLikeStatus(id);
  return (
    <div className="">
      <div className="p-5 text-black border-b-4 border-neutral-300">
        <div className="flex items-center gap-2 mb-2">
          {post.user.avatar && (
            <Image
              width={28}
              height={28}
              className="size-7 rounded-full"
              src={post.user.avatar!}
              alt={post.user.username}
            />
          )}
          <div>
            <span className="text-sm font-semibold">{post.user.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p className="mb-5">{post.description}</p>
          {post.photo !== null ? (
            <Image
              width={300}
              height={100}
              src={post.photo}
              className="object-cover"
              alt={post.title}
            />
          ) : null}
        </div>
        <div className="mt-3 flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>{post.views}명이 봤어요</span>
          </div>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between">
          <span>댓글 {post._count.comments}</span>
          <div className="flex gap-2">
            <button>등록순</button>
            <button>최신순</button>
          </div>
        </div>
        <div className="flex flex-col">
          {comments.length === 0 ? (
            <div className="text-center items-center mt-10 text-neutral-500">
              아직 댓글이 없어요.
              <br />
              가장 먼저 댓글을 남겨보세요.
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {comment.user.avatar && (
                    <Image
                      width={28}
                      height={28}
                      className="size-7 rounded-full"
                      src={comment.user.avatar!}
                      alt={comment.user.username}
                    />
                  )}
                  <div>
                    <span className="flex gap-3 text-sm font-semibold">
                      {comment.user.username}{" "}
                      {post.user.id === comment.user.id ? (
                        <div className="px-2 py-1  bg-neutral-200 rounded-md text-neutral-400 text-xs">
                          작성자
                        </div>
                      ) : (
                        ""
                      )}
                    </span>
                    <div className="text-xs">
                      <span>
                        {formatToTimeAgo(comment.created_at.toString())}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm ">{comment.payload}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <AddComment />
      </div>
    </div>
  );
}
