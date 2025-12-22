import Link from "next/link";

export default function UsersList() {
  // Mock users
  const users = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
  ];

  return (
    <main style={{ marginTop: 24 }}>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <Link href={`/routing-demo/users/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
