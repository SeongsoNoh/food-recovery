import UserData from "@/lib/userData";
import TopBarContainer from "./topBar-container";

export default async function TopBar() {
  const user = await UserData();
  return <TopBarContainer user={user} />;
}
