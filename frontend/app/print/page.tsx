"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getParkingByToken } from "@/services/api";
import styles from "./page.module.scss";

export default function PrintPage() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get("tokenId");
  const [loading, setLoading] = useState(true);
  const [parkingData, setParkingData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);

  useEffect(() => {
    if (tokenId) {
      fetchParkingData();
    }
  }, [tokenId]);

  const fetchParkingData = async () => {
    try {
      // Note: You'll need to create this API endpoint
      // For now, we'll use a mock structure
      const response = await getParkingByToken(tokenId!);
      if (response.success) {
        setParkingData(response.data);
        setVehicleData(response.data.vehicle);
      }
    } catch (error) {
      console.error("Failed to fetch parking data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading bill...</div>
      </div>
    );
  }

  if (!parkingData) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>Parking data not found</div>
        <Link href="/" className={styles.backBtn}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.bill}>
        <div className={styles.billHeader}>
          <div className={styles.logo}>🚗</div>
          <h1>Sachin Parking System</h1>
          <p>Professional Parking Management</p>
        </div>

        <div className={styles.billContent}>
          <div className={styles.billRow}>
            <span>Token Number:</span>
            <strong>{parkingData.tokenId}</strong>
          </div>

          <div className={styles.billRow}>
            <span>Vehicle Number:</span>
            <strong>{parkingData.vehicleNumber}</strong>
          </div>

          {vehicleData && (
            <>
              <div className={styles.billRow}>
                <span>Owner Name:</span>
                <strong>{vehicleData.ownerName}</strong>
              </div>
              {vehicleData.ownerMobile && (
                <div className={styles.billRow}>
                  <span>Owner Mobile:</span>
                  <strong>{vehicleData.ownerMobile}</strong>
                </div>
              )}
            </>
          )}

          <div className={styles.divider}></div>

          <div className={styles.billRow}>
            <span>Check-In Date:</span>
            <strong>{formatDate(parkingData.checkInDate)}</strong>
          </div>

          <div className={styles.billRow}>
            <span>Check-In Time:</span>
            <strong>{formatTime(parkingData.checkInTime)}</strong>
          </div>

          {parkingData.checkOutDate && (
            <>
              <div className={styles.billRow}>
                <span>Check-Out Date:</span>
                <strong>{formatDate(parkingData.checkOutDate)}</strong>
              </div>
              <div className={styles.billRow}>
                <span>Check-Out Time:</span>
                <strong>{formatTime(parkingData.checkOutTime)}</strong>
              </div>
            </>
          )}

          <div className={styles.divider}></div>

          <div className={styles.billRow}>
            <span>Total Days:</span>
            <strong>
              {parkingData.totalDays || 0}{" "}
              {parkingData.totalDays === 1 ? "day" : "days"}
            </strong>
          </div>

          <div className={styles.billRow}>
            <span>Rate Per Day:</span>
            <strong>₹{parkingData.ratePerDay?.toFixed(2) || "0.00"}</strong>
          </div>

          {parkingData.totalAmount > 0 && (
            <div className={styles.billRowTotal}>
              <span>Total Amount:</span>
              <strong>₹{parkingData.totalAmount?.toFixed(2) || "0.00"}</strong>
            </div>
          )}
        </div>

        <div className={styles.billFooter}>
          <p>Thank You – Drive Safe</p>
          <p className={styles.footerNote}>Sachin Parking System</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handlePrint} className={styles.printBtn}>
          🖨️ Print Bill
        </button>
        <Link href="/" className={styles.homeBtn}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
