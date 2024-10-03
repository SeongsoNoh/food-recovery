import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "food-recovery",
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production", // 개발 환경에서는 false로 설정
      sameSite: "lax", // 아이피 접속에서도 세션이 유지되도록 설정
    },
  });
}
