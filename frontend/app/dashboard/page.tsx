// page.tsx
'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Car, Clock, AlertCircle, DollarSign, Activity } from 'lucide-react';
import { getDashboardStats } from '@/services/api'; 

type Filter = 'today' | 'week' | 'month';
type Tab = 'IN' | 'OUT';

export default function DashboardPage() {
  const [filter, setFilter] = useState<Filter>('today');
  const [tab, setTab] = useState<Tab>('IN');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<any>(null);
  const [revenueChart, setRevenueChart] = useState<any[]>([]);
  const [peakChart, setPeakChart] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [parkings, setParkings] = useState<any>({ IN: [], OUT: [] });

  useEffect(() => {
    fetchDashboard();
  }, [filter]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats(filter);
      
      setStats(data.stats || null);
      setRevenueChart(data.revenueChart || []);
      setPeakChart(data.peakChart || []);
      setVehicleTypes(data.vehicleTypes || []);
      setParkings(data.parkings || { IN: [], OUT: [] });
    } catch (err) {
      console.error('Dashboard error:', err);
      // Set empty/default values on error
      setStats(null);
      setRevenueChart([]);
      setPeakChart([]);
      setVehicleTypes([]);
      setParkings({ IN: [], OUT: [] });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const occupancyRateNum =
    stats?.totalCapacity
      ? (stats.currentlyParked / stats.totalCapacity) * 100
      : 0;

  const occupancyRate = occupancyRateNum.toFixed(1);

  const occupancyStatus =
    occupancyRateNum > 90
      ? "critical"
      : occupancyRateNum > 75
        ? "high"
        : "normal";

  const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b'];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Parking Dashboard</h1>
            <p>Real-time analytics & insights</p>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            {(['today', 'week', 'month'] as Filter[]).map(f => (
              <button
                key={f}
                className={filter === f ? styles.active : ''}
                onClick={() => setFilter(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Alert Banner */}
        {occupancyStatus !== 'normal' && (
          <div className={`${styles.alert} ${styles[occupancyStatus]}`}>
            <AlertCircle className={styles.alertIcon} />
            <span>
              {occupancyStatus === 'critical'
                ? 'Critical: Parking nearly full! Only few spots remaining.'
                : 'High occupancy alert: 75% capacity reached.'}
            </span>
          </div>
        )}

        {/* Key Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.gradient1}`}>
            <div className={styles.statIcon}>
              <Car />
            </div>
            <div className={styles.statContent}>
              <h4>Occupancy</h4>
              <p className={styles.statValue}>
                {stats?.currentlyParked || 0}/{stats?.totalCapacity || 0}
              </p>
              <span className={styles.statSubtitle}>{occupancyRate}% capacity</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.gradient2}`}>
            <div className={styles.statIcon}>
              <Activity />
            </div>
            <div className={styles.statContent}>
              <h4>Checked Out</h4>
              <p className={styles.statValue}>{stats?.checkedOutToday || 0}</p>
              <span className={styles.statSubtitle}>vehicles today</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.gradient3}`}>
            <div className={styles.statIcon}>
              <DollarSign />
            </div>
            <div className={styles.statContent}>
              <h4>Today Revenue</h4>
              <p className={styles.statValue}>₹{stats?.todayRevenue || 0}</p>
              <span className={styles.statSubtitle}>
                ₹{stats?.revenuePerSpace || 0}/space
              </span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.gradient4}`}>
            <div className={styles.statIcon}>
              <Clock />
            </div>
            <div className={styles.statContent}>
              <h4>Avg Duration</h4>
              <p className={styles.statValue}>{stats?.avgDuration || 0} hrs</p>
              <span className={styles.statSubtitle}>Peak: {stats?.peakHour}</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className={styles.chartsGrid}>

          {/* Revenue Chart */}
          <div className={styles.chartCard}>
            <h3>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueChart}>
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Peak Hours Chart */}
          <div className={styles.chartCard}>
            <h3>Peak Parking Hours</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={peakChart}>
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Vehicle Types */}
          {vehicleTypes.length > 0 && (
            <div className={styles.chartCard}>
              <h3>Vehicle Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={vehicleTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            onClick={() => setTab('IN')}
            className={tab === 'IN' ? styles.active : ''}
          >
            Currently Parked ({parkings.IN?.length || 0})
          </button>
          <button
            onClick={() => setTab('OUT')}
            className={tab === 'OUT' ? styles.active : ''}
          >
            Recent Checkouts ({parkings.OUT?.length || 0})
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <div className={styles.table}>
            {tab === 'IN' ? (
              <>
                <div className={styles.tableHeader}>
                  <div>Token</div>
                  <div>Vehicle Number</div>
                  <div>Check-in Time</div>
                  <div>Vehicle Type</div>
                </div>
                {parkings.IN?.length > 0 ? (
                  parkings.IN.map((p: any) => (
                    <div key={p._id} className={styles.tableRow}>
                      <div className={styles.token}>{p.tokenId}</div>
                      <div className={styles.vehicle}>{p.vehicleNumber}</div>
                      <div>{p.time || p.date}</div>
                      <div>
                        <span className={styles.badge}>{p.type || 'Car'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>No vehicles currently parked</div>
                )}
              </>
            ) : (
              <>
                <div className={styles.tableHeader}>
                  <div>Token</div>
                  <div>Vehicle Number</div>
                  <div>Checkout Time</div>
                  <div>Duration</div>
                  <div>Amount</div>
                </div>
                {parkings.OUT?.length > 0 ? (
                  parkings.OUT.map((p: any) => (
                    <div key={p._id} className={styles.tableRow}>
                      <div className={styles.token}>{p.tokenId}</div>
                      <div className={styles.vehicle}>{p.vehicleNumber}</div>
                      <div>{p.time || p.date}</div>
                      <div>{p.duration || '-'}</div>
                      <div className={styles.amount}>₹{p.amount}</div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>No recent checkouts</div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}