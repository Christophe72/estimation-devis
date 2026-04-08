"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const NO_SIDEBAR_PATHS = ["/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !NO_SIDEBAR_PATHS.includes(pathname);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
