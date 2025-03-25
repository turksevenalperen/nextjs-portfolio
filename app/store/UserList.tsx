import useUserStore from "./userStore";

export default function UserList() {
  const users = useUserStore((state) => state.users);
  const fetchUsers = useUserStore((state) => state.fethUsers);

  return (
    <div>
      <button onClick={fetchUsers}>Get Users</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
