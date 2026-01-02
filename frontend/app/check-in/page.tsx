"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { checkIn, getVehicleByNumber } from "@/services/api";
import styles from "./page.module.scss";

export default function CheckInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillNumber = searchParams.get("vehicleNumber") || "";

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [formData, setFormData] = useState({
    vehicleNumber: prefillNumber,
    ownerName: "",
    ownerMobile: "",
    driverName: "",
    driverMobile: "",
    vehicleType: "Car",
    ratePerDay: "",
  });

  // Debounced vehicle search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.vehicleNumber.length >= 3) {
        searchVehicle();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.vehicleNumber]);

  useEffect(() => {
    if (prefillNumber) {
      // if prefilled from register, trigger search immediately
      searchVehicle();
    }
  }, [prefillNumber]);

  const searchVehicle = async () => {
    if (!formData.vehicleNumber.trim()) return;

    setSearching(true);
    try {
      const response = await getVehicleByNumber(formData.vehicleNumber);
      if (response.data) {
        setFormData((prev) => ({
          ...prev,
          ownerName: response.data.ownerName || "",
          ownerMobile: response.data.ownerMobile || "",
          driverName: response.data.driverName || "",
          driverMobile: response.data.driverMobile || "",
          vehicleType: response.data.vehicleType || "Car",
        }));
      }
    } catch (error) {
      // Vehicle not found - allow new entry
      console.log("New vehicle - allow fresh entry");
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.vehicleNumber ||
      !formData.ownerName ||
      !formData.ownerMobile ||
      !formData.ratePerDay
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await checkIn(formData);
      if (response.success) {
        // show success and offer print in new tab
        setSuccessData(response.data);
        window.open(`/print?tokenId=${response.data.tokenId}`, "_blank");
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        

        {successData ? (
          <div className={styles.successBox}>
            <h2>Checked in successfully</h2>
            <p>Token: {successData.tokenId}</p>
            <p>Vehicle: {successData.vehicleNumber}</p>
            <div className={styles.actionsInline}>
              <a
                href={`/print?tokenId=${successData.tokenId}`}
                target="_blank"
                rel="noreferrer"
                className={styles.primaryButton}
              >
                🖨️ Print Receipt
              </a>
              <Link href="/check-in" className={styles.ghostButton}>
                New Check-In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Vehicle Number *</label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g., MH12AB1234"
                required
                autoFocus
                className={searching ? styles.searching : ""}
              />
              {searching && (
                <span className={styles.searchIndicator}>🔍 Searching...</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Owner Name *</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Enter owner name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Owner Mobile *</label>
              <input
                type="tel"
                name="ownerMobile"
                value={formData.ownerMobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
                pattern="[0-9]{10}"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Driver Name</label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="Enter driver name (optional)"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Driver Mobile</label>
              <input
                type="tel"
                name="driverMobile"
                value={formData.driverMobile}
                onChange={handleChange}
                placeholder="10-digit mobile number (optional)"
                pattern="[0-9]{10}"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Parking Rate (per day) *</label>
              <input
                type="number"
                name="ratePerDay"
                value={formData.ratePerDay}
                onChange={handleChange}
                placeholder="e.g., 100"
                required
                min="0"
                step="0.01"
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Processing..." : "Check-In Vehicle"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
