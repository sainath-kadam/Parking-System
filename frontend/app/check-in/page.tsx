"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { checkIn, getVehicleByNumber } from "@/services/api";
import styles from "./page.module.scss";

export default function CheckInPage() {
  const searchParams = useSearchParams();
  const prefillNumber = searchParams.get("vehicleNumber") || "";

  const [step, setStep] = useState<"search" | "form">(prefillNumber ? "form" : "search");
  const [vehicleNumber, setVehicleNumber] = useState(prefillNumber);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isExistingVehicle, setIsExistingVehicle] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleNumber: prefillNumber,
    ownerName: "",
    ownerMobile: "",
    driverName: "",
    driverMobile: "",
    vehicleType: "Car",
    ratePerDay: "",
  });

  const handleSearchVehicle = async () => {
    if (!vehicleNumber.trim()) {
      alert("Please enter vehicle number");
      return;
    }

    setSearching(true);
    try {
      const response = await getVehicleByNumber(vehicleNumber);
      if (response.data) {
        // Vehicle found - auto-fill form
        setFormData({
          vehicleNumber: vehicleNumber,
          ownerName: response.data.ownerName || "",
          ownerMobile: response.data.ownerMobile || "",
          driverName: response.data.driverName || "",
          driverMobile: response.data.driverMobile || "",
          vehicleType: response.data.vehicleType || "Car",
          ratePerDay: response.data.ratePerDay || "",
        });
        setIsExistingVehicle(true);
      } else {
        // New vehicle - empty form
        setFormData({
          vehicleNumber: vehicleNumber,
          ownerName: "",
          ownerMobile: "",
          driverName: "",
          driverMobile: "",
          vehicleType: "Car",
          ratePerDay: "",
        });
        setIsExistingVehicle(false);
      }
      setStep("form");
    } catch (error) {
      // Vehicle not found - show empty form for new entry
      setFormData({
        vehicleNumber: vehicleNumber,
        ownerName: "",
        ownerMobile: "",
        driverName: "",
        driverMobile: "",
        vehicleType: "Car",
        ratePerDay: "",
      });
      setIsExistingVehicle(false);
      setStep("form");
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
        setReceiptData(response.data);
        setShowReceipt(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewCheckIn = () => {
    setShowReceipt(false);
    setReceiptData(null);
    setVehicleNumber("");
    setStep("search");
    setIsExistingVehicle(false);
    setFormData({
      vehicleNumber: "",
      ownerName: "",
      ownerMobile: "",
      driverName: "",
      driverMobile: "",
      vehicleType: "Car",
      ratePerDay: "",
    });
  };

  const handleBackToSearch = () => {
    setStep("search");
    setVehicleNumber(formData.vehicleNumber);
  };

  return (
    <div className={styles.page}>
      {/* Step 1: Vehicle Number Search */}
      {step === "search" && (
        <div className={`${styles.card} ${styles.searchCard}`}>
          <div className={styles.header}>
            <h1>🚗 Vehicle Check-In</h1>
            <p>Enter vehicle number to begin</p>
          </div>

          <div className={styles.searchBox}>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="Enter Vehicle Number (e.g., MH12AB1234)"
              className={styles.vehicleInput}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchVehicle();
                }
              }}
            />
            <button
              onClick={handleSearchVehicle}
              disabled={searching || !vehicleNumber.trim()}
              className={styles.searchBtn}
            >
              {searching ? "Searching..." : "✓ OK"}
            </button>
          </div>

          <p className={styles.helpText}>
            💡 We'll check if this vehicle is already registered
          </p>
        </div>
      )}

      {/* Step 2: Check-In Form */}
      {step === "form" && (
        <div className={`${styles.card} ${showReceipt ? styles.hideOnPrint : ''}`}>
          <div className={styles.header}>
            <h1>🚗 Vehicle Check-In</h1>
            <p>
              {isExistingVehicle ? (
                <span className={styles.existingBadge}>✓ Existing Vehicle - Details Auto-filled</span>
              ) : (
                <span className={styles.newBadge}>★ New Vehicle Registration</span>
              )}
            </p>
          </div>

          <button 
            onClick={handleBackToSearch}
            className={styles.backBtn}
          >
            ← Change Vehicle Number
          </button>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Row 1: Vehicle Number & Type */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Vehicle Number *</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="e.g., MH12AB1234"
                  required
                  disabled
                  className={styles.disabledInput}
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
            </div>

            {/* Row 2: Owner & Driver Name */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Owner Name *</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner name"
                  required
                  autoFocus
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
            </div>

            {/* Row 3: Mobile Numbers */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Owner Mobile *</label>
                <input
                  type="tel"
                  name="ownerMobile"
                  value={formData.ownerMobile}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  required
                  pattern="[0-9]{10}"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Driver Mobile</label>
                <input
                  type="tel"
                  name="driverMobile"
                  value={formData.driverMobile}
                  onChange={handleChange}
                  placeholder="10-digit number (optional)"
                  pattern="[0-9]{10}"
                />
              </div>
            </div>

            {/* Row 4: Rate & Check-in Time */}
            <div className={styles.formRow}>
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

              <div className={styles.formGroup}>
                <label>Check-In Time</label>
                <input
                  type="text"
                  value={new Date().toLocaleString('en-IN', { 
                    dateStyle: 'short', 
                    timeStyle: 'short' 
                  })}
                  disabled
                  className={styles.disabledInput}
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Processing..." : "✓ Complete Check-In"}
            </button>
          </form>
        </div>
      )}

      {/* Receipt Modal/Popup */}
      {showReceipt && receiptData && (
        <div className={styles.modalOverlay} onClick={() => setShowReceipt(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={`${styles.receipt} print-area`}>
              {/* Receipt Header */}
              <div className={styles.receiptHeader}>
                <div className={styles.logo}>
                  <div className={styles.logoCircle}>🅿️</div>
                  <div className={styles.logoText}>
                    <h2>Sachin Parking Yard</h2>
                    <p>Sachin Dholka, Hyderabad Road</p>
                    <p>Bombay Rd, Dist</p>
                    <p className={styles.nameted}>Named</p>
                  </div>
                </div>
                <div className={styles.receiptTitle}>Check In Receipt</div>
              </div>

              {/* Receipt Body */}
              <div className={styles.receiptBody}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Token No:</span>
                  <span className={`${styles.value} ${styles.tokenNumber}`}>
                    {receiptData.tokenId}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Owner Name:</span>
                  <span className={styles.value}>{receiptData.ownerName}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Driver Name:</span>
                  <span className={styles.value}>{receiptData.driverName || '-'}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Vehicle Number:</span>
                  <span className={`${styles.value} ${styles.vehicleNumber}`}>
                    {receiptData.vehicleNumber}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Owner Mobile:</span>
                  <span className={styles.value}>{receiptData.ownerMobile}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Driver Mobile:</span>
                  <span className={styles.value}>{receiptData.driverMobile || '-'}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Vehicle Type:</span>
                  <span className={styles.value}>{receiptData.vehicleType}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Parking Rate:</span>
                  <span className={styles.value}>₹{receiptData.ratePerDay}/day</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Check In Date:</span>
                  <span className={styles.value}>
                    {new Date().toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Check In Time:</span>
                  <span className={styles.value}>
                    {new Date().toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className={styles.receiptFooter}>
                <p>Contact Info: +91-9284062314, 7972761348</p>
                <p>9011100537</p>
                <p className={styles.signLabel}>Sign:_______________</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`${styles.modalActions} ${styles.hideOnPrint}`}>
              <button onClick={handlePrint} className={styles.primaryButton}>
                🖨️ Print Receipt
              </button>
              <button onClick={handleNewCheckIn} className={styles.ghostButton}>
                ➕ New Check-In
              </button>
              <button 
                onClick={() => setShowReceipt(false)} 
                className={styles.secondaryButton}
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}