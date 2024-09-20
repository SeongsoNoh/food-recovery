import Input from "@/components/input";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function AddComment() {
  return (
    <div className="fixed bottom-0 w-full mx-auto border-neutral-200 border-t py-3 bg-white">
      <form className="flex justify-between gap-3 px-3 w-full items-center">
        <input
          name="comment"
          type="text"
          placeholder="댓글을 입력해주세요."
          className="bg-transparent rounded-md w-full h-11 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-main-button border-none placeholder:text-neutral-400 px-2"
        ></input>

        <PaperAirplaneIcon className="w-7 h-7 stroke-main-button" />
      </form>
    </div>
  );
}
