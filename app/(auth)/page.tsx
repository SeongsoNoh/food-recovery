import Link from "next/link";
import logoImg from "../../image/logo/logo.png";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 ">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <Image src={logoImg} alt="Logo"></Image>
        <h2 className="text-2xl">푸드리코베리에 오신 걸 환영합니다!</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
