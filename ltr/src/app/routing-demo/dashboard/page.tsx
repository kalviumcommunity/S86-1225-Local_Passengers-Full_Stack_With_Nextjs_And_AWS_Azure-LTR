import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Server-side check: ensure token cookie exists (middleware also enforces JWT)
  const token = cookies().get("token")?.value;
  if (!token) {
    redirect("/routing-demo/login");
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 40,
      }}
    >
      <h1>Dashboard (Protected)</h1>
      <p>Only authenticated users should reach this page.</p>
    </main>
  );
}
