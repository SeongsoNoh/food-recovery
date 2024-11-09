import TabBar from "@/components/tab-bar";
import TopBar from "@/components/top-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <TopBar />
      <div className="pb-20">{children}</div>
      <TabBar />
    </div>
  );
}
