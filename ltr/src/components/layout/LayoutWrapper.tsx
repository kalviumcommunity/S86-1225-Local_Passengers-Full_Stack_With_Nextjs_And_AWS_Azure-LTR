"use client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Toasts from "@/components/ui/Toasts";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-white p-6 overflow-auto">{children}</main>
      </div>
      <Toasts />
    </div>
  );
}
