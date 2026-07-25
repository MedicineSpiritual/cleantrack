// Dashboard page scaffold — shows last check-ins per entrance

import React, { useEffect, useState } from 'react';

type Checkin = {
  id: string;
  entrance_id: string;
  timestamp: string;
  user_id?: string;
};

export default function DashboardPage() {
  const [items, setItems] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard/last_checkins');
        const json = await res.json();
        if (json.ok) setItems(json.data || []);
      } catch (err) {
        console.error('fetch dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Manager Dashboard (Skeleton)</h1>
      {loading ? <p>Loading...</p> : null}
      <table>
        <thead>
          <tr><th>Entrance</th><th>Last Check-in</th><th>User</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}><td>{i.entrance_id}</td><td>{i.timestamp}</td><td>{i.user_id}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
