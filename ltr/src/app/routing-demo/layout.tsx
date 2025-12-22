import Link from "next/link";


export default function RoutingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: 12, background: "#f3f4f6" }}>
          <Link href="/routing-demo" style={{ marginRight: 12 }}>
            Home
          </Link>
          <Link href="/routing-demo/login" style={{ marginRight: 12 }}>
            Login
          </Link>
          <Link href="/routing-demo/dashboard" style={{ marginRight: 12 }}>
            Dashboard
          </Link>
          <Link href="/routing-demo/users/1">User 1</Link>
        </nav>
        <main style={{ padding: 20 }}>{children}</main>
      </body>
    </html>
  );
}
