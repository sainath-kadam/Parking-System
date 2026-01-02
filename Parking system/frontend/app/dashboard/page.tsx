'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStats, getActiveParkings } from '@/services/api';
import styles from './page.module.scss';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayEntries: 0,
    currentlyParked: 0,
    todayEarnings: 0,
    monthEarnings: 0
  });
  const [activeParkings, setActiveParkings] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, activeRes] = await Promise.all([
        getStats(),
        getActiveParkings()
      ]);
      
      if (statsRes.success) {
        setStats(statsRes.data);
      }
      
      if (activeRes.success) {
        setActiveParkings(activeRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.backBtn}>← Back</Link>
          <h1>Dashboard</h1>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📥</div>
            <div className={styles.statContent}>
              <h3>Today's Entries</h3>
              <p className={styles.statValue}>{stats.todayEntries}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🚗</div>
            <div className={styles.statContent}>
              <h3>Currently Parked</h3>
              <p className={styles.statValue}>{stats.currentlyParked}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <h3>Today's Earnings</h3>
              <p className={styles.statValue}>{formatCurrency(stats.todayEarnings)}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <h3>Monthly Earnings</h3>
              <p className={styles.statValue}>{formatCurrency(stats.monthEarnings)}</p>
            </div>
          </div>
        </div>

        <div className={styles.activeSection}>
          <h2>Currently Parked Vehicles</h2>
          {activeParkings.length === 0 ? (
            <div className={styles.empty}>No vehicles currently parked</div>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div>Token</div>
                <div>Vehicle</div>
                <div>Check-In</div>
                <div>Rate/Day</div>
              </div>
              {activeParkings.map((parking) => (
                <div key={parking._id} className={styles.tableRow}>
                  <div className={styles.token}>{parking.tokenId}</div>
                  <div className={styles.vehicle}>{parking.vehicleNumber}</div>
                  <div>
                    <div>{formatDate(parking.checkInDate)}</div>
                    <div className={styles.time}>{formatTime(parking.checkInTime)}</div>
                  </div>
                  <div>₹{parking.ratePerDay}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

