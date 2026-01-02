"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { createVehicle } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vehicleNumber: "",
    ownerName: "",
    ownerMobile: "",
    driverName: "",
    driverMobile: "",
    vehicleType: "Car",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleNumber || !form.ownerName || !form.ownerMobile) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      const resp = await createVehicle(form);
      if (resp.success) {
        alert("Vehicle registered successfully. Proceed to check-in.");
        router.push(
          `/check-in?vehicleNumber=${encodeURIComponent(form.vehicleNumber)}`
        );
      } else {
        alert(resp.error || "Failed to register vehicle");
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <h1>Register Vehicle</h1>
          <p className={styles.lead}>
            Add a vehicle to speed up future check-ins.
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Vehicle Number *</label>
            <input
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="e.g., MH12AB1234"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Owner Name *</label>
            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Owner name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Owner Mobile *</label>
            <input
              name="ownerMobile"
              value={form.ownerMobile}
              onChange={handleChange}
              placeholder="10-digit mobile"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Driver Name</label>
            <input
              name="driverName"
              value={form.driverName}
              onChange={handleChange}
              placeholder="Driver name (optional)"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Driver Mobile</label>
            <input
              name="driverMobile"
              value={form.driverMobile}
              onChange={handleChange}
              placeholder="Driver mobile (optional)"
              pattern="[0-9]{10}"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Vehicle Type *</label>
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
            >
              <option>Bike</option>
              <option>Car</option>
              <option>SUV</option>
              <option>Truck</option>
              <option>Other</option>
            </select>
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Vehicle"}
          </button>
        </form>
      </section>
    </main>
  );
}
