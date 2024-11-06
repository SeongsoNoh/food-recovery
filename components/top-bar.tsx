import UserData from "@/lib/userData";
import TopBarContainer from "./topBar-container";

export default async function TopBar() {
  const user = await UserData();
  console.log("유저!!!", user);
  return <TopBarContainer user={user} />;
}
