import 'bootstrap/dist/css/bootstrap.min.css';
import AccountTable from './AccountTable';
import { useUsersList } from "../../../hooks/useUsersList";

export default function UserPage() {
  const users = useUsersList();

  return (
    <div className="p-4">
      <h2>All users</h2>
      <div className="user-table mt-3">
        <AccountTable users={users}/>
      </div>
    </div>
  );
}