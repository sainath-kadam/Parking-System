'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

type Filter = 'today' | 'week' | 'month';
type Tab = 'IN' | 'OUT';

export default function DashboardPage() {
  const [filter, setFilter] = useState<Filter>('today');
  const [tab, setTab] = useState<Tab>('IN');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<any>(null);
  const [revenueChart, setRevenueChart] = useState<any[]>([]);
  const [peakChart, setPeakChart] = useState<any[]>([]);
  const [parkings, setParkings] = useState<any>({ IN: [], OUT: [] });

  useEffect(() => {
    fetchDashboard();
  }, [filter]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?filter=${filter}`);
      const data = await res.json();

      setStats(data.stats);
      setRevenueChart(data.revenueChart);
      setPeakChart(data.peakChart);
      setParkings(data.parkings);
    } catch (err) {
      console.error('Dashboard error', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading dashboard…</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Filters */}
        <div className={styles.filters}>
          {['today', 'week', 'month'].map(f => (
            <button
              key={f}
              className={filter === f ? styles.active : ''}
              onClick={() => setFilter(f as Filter)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <Card title="Currently Parked" value={stats?.currentlyParked} />
          <Card title="Checked Out Today" value={stats?.checkedOutToday} />
          <Card title="Today Revenue" value={`₹${stats?.todayRevenue}`} />
          <Card title="Avg Duration" value={`${stats?.avgDuration} hrs`} />
          <Card title="Peak Hours" value={stats?.peakHour} />
        </div>

        {/* Charts */}
        <div className={styles.charts}>
          <div className={styles.chartCard}>
            <h3>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueChart}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3>Peak Parking Hours</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={peakChart}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#06b6d4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button onClick={() => setTab('IN')} className={tab === 'IN' ? styles.active : ''}>IN</button>
          <button onClick={() => setTab('OUT')} className={tab === 'OUT' ? styles.active : ''}>OUT</button>
        </div>

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Token</div>
            <div>Vehicle</div>
            <div>Date</div>
            <div>Amount</div>
          </div>

          {parkings[tab].map((p: any) => (
            <div key={p._id} className={styles.tableRow}>
              <div>{p.tokenId}</div>
              <div>{p.vehicleNumber}</div>
              <div>{p.date}</div>
              <div>₹{p.amount}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className={styles.statCard}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}
