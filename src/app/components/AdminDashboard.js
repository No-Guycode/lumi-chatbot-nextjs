import { useState } from'react';
import { useRouter } from 'next/router';

const AdminDashboard = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPassword === process.env.ADMIN_PASSWORD) {
      setIsAdmin(true);
    }
  };

  if (!isAdmin) {
    return (
      <form onSubmit={handleLogin}>
        <input
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          placeholder="Admin Password"
        />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <section>
        <h2>Rate Limiting</h2>
        <input type="number" value={10} onChange={(e) => console.log(e.target.value)} />
      </section>
      <section>
        <h2>Max Tokens</h2>
        <input type="number" value={100} onChange={(e) => console.log(e.target.value)} />
      </section>
      <section>
        <h2>Chat Log Review</h2>
        <ul>
          <li>Chat Log 1</li>
          <li>Chat Log 2</li>
        </ul>
      </section>
      <section>
        <h2>Usage Statistics</h2>
        <p>Number of Users: 100</p>
        <p>Number of Requests: 1000</p>
      </section>
    </div>
  );
};

export default AdminDashboard;
