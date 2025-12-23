interface Props {
  params: { id: string };
}

export default function UserProfile({ params }: Props) {
  const { id } = params;
  const user = { id, name: `User ${id}` };

  return (
    <main style={{ marginTop: 24 }}>
      <h2>User Profile</h2>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </main>
  );
}
