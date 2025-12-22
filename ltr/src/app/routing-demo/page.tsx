export default function DemoHome() {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Routing Demo</h1>
      <p>This demo shows public, protected, and dynamic routes using the App Router.</p>
      <ul>
        <li>/routing-demo — this page (public)</li>
        <li>/routing-demo/login — public login page</li>
        <li>/routing-demo/dashboard — protected page</li>
        <li>/routing-demo/users/[id] — dynamic user pages</li>
      </ul>
    </main>
  );
}
