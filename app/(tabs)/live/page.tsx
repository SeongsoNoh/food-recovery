import LiveList from "@/components/live-list";
import Link from "next/link";

export default async function Live() {
  return (
    <div className="p-2">
      <Link
        href="/streams/add"
        className=" flex items-center justify-center border-main-button bg-main-button text-white rounded-md w-full p-3"
      >
        <span>라이브 시작하기</span>
      </Link>
      <LiveList />
    </div>
  );
}
