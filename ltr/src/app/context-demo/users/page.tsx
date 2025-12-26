// Server component: simulates fetching user data with delay
import React from "react";

type User = { id: number; name: string; station: string };

async function fetchUsers(delay = 1500, fail = false): Promise<User[]> {
  await new Promise((r) => setTimeout(r, delay));
  if (fail) throw new Error("Simulated fetch error");
  return [
    { id: 1, name: "Asha Patel", station: "Mumbai Central" },
    { id: 2, name: "Ravi Kumar", station: "Bandra" },
    { id: 3, name: "Sunita Rao", station: "Dadar" },
  ];
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const fail = searchParams?.error === "1";
  const users = await fetchUsers(1400, Boolean(fail));

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Users (simulated fetch)</h1>

        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-4 bg-white dark:bg-gray-800 rounded shadow"
            >
              <h2 className="font-semibold">{u.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Station: {u.station}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Tip: Append <code>?error=1</code> to simulate an error and see the
          error UI.
        </div>
      </div>
    </main>
  );
}
