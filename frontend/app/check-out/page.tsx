'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { checkOut, getActiveEntry } from '@/services/api';
import styles from './page.module.scss';

export default function CheckOutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [entryData, setEntryData] = useState<any>(null);
  const [formData, setFormData] = useState({
    vehicleNumber: searchParams.get('vehicleNumber') || '',
    tokenId: '',
    checkOutDate: new Date().toISOString().split('T')[0],
    checkOutTime: new Date().toTimeString().slice(0, 5),
    ratePerDay: ''
  });
  const [calculated, setCalculated] = useState({
    totalDays: 0,
    totalAmount: 0
  });

  const fetchActiveEntry = async (vehicleNumber?: string, tokenId?: string) => {
    const vNumber = vehicleNumber || formData.vehicleNumber;
    const tId = tokenId || formData.tokenId;

    if (!vNumber && !tId) return;

    setFetching(true);
    try {
      const response = await getActiveEntry(vNumber || undefined, tId || undefined);
      if (response.success) {
        setEntryData(response.data);
        setFormData(prev => ({
          ...prev,
          ratePerDay: response.data.ratePerDay?.toString() || ''
        }));
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch active entry:', error);
      }
      setEntryData(null);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (formData.vehicleNumber || formData.tokenId) {
      fetchActiveEntry();
    }
  }, []);

  const handleVehicleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, vehicleNumber: value, tokenId: '' }));
    setEntryData(null);
    setCalculated({ totalDays: 0, totalAmount: 0 });
  };

  const calculateAmount = () => {
    if (!entryData || !formData.checkOutDate) return;

    const checkIn = new Date(entryData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);

    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalDays = Math.max(1, diffDays);

    const rate = parseFloat(formData.ratePerDay) || entryData.ratePerDay || 0;
    const totalAmount = totalDays * rate;

    setCalculated({ totalDays, totalAmount });
  };

  useEffect(() => {
    if (entryData && formData.checkOutDate) {
      calculateAmount();
    }
  }, [formData.checkOutDate, formData.ratePerDay, entryData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.vehicleNumber.trim().length >= 3) {
        fetchActiveEntry(formData.vehicleNumber);
      } else {
        setEntryData(null);
        setCalculated({ totalDays: 0, totalAmount: 0 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.vehicleNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicleNumber && !formData.tokenId) {
      alert('Please enter vehicle number or token ID');
      return;
    }

    setLoading(true);
    try {
      const response = await checkOut({
        ...formData,
        ratePerDay: formData.ratePerDay || undefined
      });

      if (response.success) {
        router.push(`/print?tokenId=${response.data.tokenId}&checkout=true`);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

    

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Vehicle Number or Token ID *</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleVehicleInput}
              placeholder="Enter vehicle number or token ID"
              autoFocus
            />
            {fetching && <span className={styles.searchIndicator}>🔍 Searching...</span>}
            {entryData && (
              <div className={styles.entryInfo}>
                <p>✓ Found active entry</p>
                <small>Check-In: {new Date(entryData.checkInDate).toLocaleDateString()} {entryData.checkInTime}</small>
                <small>Rate: ₹{entryData.ratePerDay}/day</small>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Check-Out Date *</label>
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Check-Out Time *</label>
            <input
              type="time"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Rate Per Day (Override)</label>
            <input
              type="number"
              name="ratePerDay"
              value={formData.ratePerDay}
              onChange={handleChange}
              placeholder="Leave empty to use original rate"
              min="0"
              step="0.01"
            />
            <small>Leave empty to use original parking rate</small>
          </div>

          {calculated.totalDays > 0 && (
            <div className={styles.calculation}>
              <div className={styles.calcRow}>
                <span>Total Days:</span>
                <strong>{calculated.totalDays} {calculated.totalDays === 1 ? 'day' : 'days'}</strong>
              </div>
              <div className={styles.calcRow}>
                <span>Total Amount:</span>
                <strong className={styles.amount}>₹{calculated.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading || fetching}>
            {loading ? 'Processing...' : 'Check-Out Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
}

