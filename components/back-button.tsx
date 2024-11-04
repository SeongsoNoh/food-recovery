"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <button onClick={handleBack} className="fixed left-3 text-black">
      <ChevronLeftIcon className="size-8" />
    </button>
  );
}
