"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { checkOut, getActiveEntry } from "@/services/api";
import styles from "./page.module.scss";

export default function CheckOutPage() {
  const searchParams = useSearchParams();
  const prefillNumber = searchParams.get("vehicleNumber") || "";

  const [step, setStep] = useState<"search" | "form">(prefillNumber ? "form" : "search");
  const [vehicleNumberOrToken, setVehicleNumberOrToken] = useState(prefillNumber);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [entryData, setEntryData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    tokenId: "",
    checkOutDate: new Date().toISOString().split("T")[0],
    checkOutTime: new Date().toTimeString().slice(0, 5),
    ratePerDay: "",
  });

  const [calculated, setCalculated] = useState({
    totalDays: 0,
    totalAmount: 0,
  });

  const handleSearchVehicle = async () => {

    // based on backend we will check that.
    if (!vehicleNumberOrToken.trim()) {
      alert("Please enter vehicle number or token ID");
      return;
    }

    setSearching(true);
    try {
      const response = await getActiveEntry(vehicleNumberOrToken, vehicleNumberOrToken);
      if (response.success && response.data) {
        setEntryData(response.data);
        
        // Calculate days and amount
        const checkIn = new Date(response.data.checkInDate);
        const checkOut = new Date();
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);
        
        const diffTime = checkOut.getTime() - checkIn.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalDays = Math.max(1, diffDays);
        const rate = response.data.ratePerDay || 0;
        const totalAmount = totalDays * rate;

        setFormData({
          vehicleNumber: response.data.vehicleNumber,
          tokenId: response.data.tokenId,
          checkOutDate: new Date().toISOString().split("T")[0],
          checkOutTime: new Date().toTimeString().slice(0, 5),
          ratePerDay: rate.toString(),
        });

        setCalculated({ totalDays, totalAmount });
        setStep("form");
      } else {
        alert("No active parking entry found for this vehicle/token");
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Vehicle not found or already checked out");
    } finally {
      setSearching(false);
    }
  };

  const recalculateAmount = (checkOutDate: string, ratePerDay: string) => {
    if (!entryData) return;

    const checkIn = new Date(entryData.checkInDate);
    const checkOut = new Date(checkOutDate);
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalDays = Math.max(1, diffDays);
    const rate = parseFloat(ratePerDay) || entryData.ratePerDay || 0;
    const totalAmount = totalDays * rate;

    setCalculated({ totalDays, totalAmount });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Recalculate on date or rate change
      if (name === "checkOutDate" || name === "ratePerDay") {
        recalculateAmount(
          name === "checkOutDate" ? value : updated.checkOutDate,
          name === "ratePerDay" ? value : updated.ratePerDay
        );
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicleNumber && !formData.tokenId) {
      alert("Please enter vehicle number or token ID");
      return;
    }

    setLoading(true);
    try {
      const response = await checkOut({
        vehicleNumber: formData.vehicleNumber,
        tokenId: formData.tokenId,
        checkOutDate: formData.checkOutDate,
        checkOutTime: formData.checkOutTime,
        ratePerDay: formData.ratePerDay || undefined,
      });

      if (response.success) {
        setReceiptData({
          ...response.data,
          ...entryData,
          totalDays: calculated.totalDays,
          totalAmount: calculated.totalAmount,
          checkOutDate: formData.checkOutDate,
          checkOutTime: formData.checkOutTime,
        });
        setShowReceipt(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewCheckOut = () => {
    setShowReceipt(false);
    setReceiptData(null);
    setEntryData(null);
    setVehicleNumberOrToken("");
    setStep("search");
    setCalculated({ totalDays: 0, totalAmount: 0 });
    setFormData({
      vehicleNumber: "",
      tokenId: "",
      checkOutDate: new Date().toISOString().split("T")[0],
      checkOutTime: new Date().toTimeString().slice(0, 5),
      ratePerDay: "",
    });
  };

  const handleBackToSearch = () => {
    setStep("search");
    setVehicleNumberOrToken(formData.vehicleNumber || formData.tokenId);
    setEntryData(null);
  };

  return (
    <div className={styles.page}>
      {/* Step 1: Vehicle/Token Search */}
      {step === "search" && (
        <div className={`${styles.card} ${styles.searchCard}`}>
          <div className={styles.header}>
            <h1>🚙 Vehicle Check-Out</h1>
            <p>Enter vehicle number or token ID</p>
          </div>

          <div className={styles.searchBox}>
            <input
              type="text"
              value={vehicleNumberOrToken}
              onChange={(e) => setVehicleNumberOrToken(e.target.value.toUpperCase())}
              placeholder="Vehicle Number or Token ID"
              className={styles.vehicleInput}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearchVehicle();
                }
              }}
            />
            <button
              onClick={handleSearchVehicle}
              disabled={searching || !vehicleNumberOrToken.trim()}
              className={styles.searchBtn}
            >
              {searching ? "Searching..." : "✓ OK"}
            </button>
          </div>

          <p className={styles.helpText}>
            💡 We'll fetch the active parking entry
          </p>
        </div>
      )}

      {/* Step 2: Check-Out Form */}
      {step === "form" && entryData && (
        <div className={`${styles.card} ${showReceipt ? styles.hideOnPrint : ""}`}>
          <div className={styles.header}>
            <h1>🚙 Vehicle Check-Out</h1>
            <p>
              <span className={styles.activeEntry}>✓ Active Parking Entry Found</span>
            </p>
          </div>

          <button onClick={handleBackToSearch} className={styles.backBtn}>
            ← Change Vehicle/Token
          </button>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Row 1: Token & Vehicle Number */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Token No</label>
                <input
                  type="text"
                  value={formData.tokenId}
                  disabled
                  className={styles.disabledInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Vehicle Number</label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  disabled
                  className={styles.disabledInput}
                />
              </div>
            </div>

            {/* Row 2: Owner & Driver Name */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Owner Name</label>
                <input
                  type="text"
                  value={entryData.ownerName}
                  disabled
                  className={styles.disabledInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Driver Name</label>
                <input
                  type="text"
                  value={entryData.driverName || "-"}
                  disabled
                  className={styles.disabledInput}
                />
              </div>
            </div>

            {/* Row 3: Mobile Numbers */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Owner Mobile</label>
                <input
                  type="text"
                  value={entryData.ownerMobile}
                  disabled
                  className={styles.disabledInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Driver Mobile</label>
                <input
                  type="text"
                  value={entryData.driverMobile || "-"}
                  disabled
                  className={styles.disabledInput}
                />
              </div>
            </div>

            {/* Row 4: Vehicle Type & Parking Rate */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Vehicle Type</label>
                <input
                  type="text"
                  value={entryData.vehicleType}
                  disabled
                  className={styles.disabledInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Parking Rate (per day)</label>
                <input
                  type="number"
                  name="ratePerDay"
                  value={formData.ratePerDay}
                  onChange={handleChange}
                  placeholder="Override rate"
                  min="0"
                  step="0.01"
                />
                <small>Leave to use original rate</small>
              </div>
            </div>

            {/* Row 5: Check-In Details */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Check-In Date</label>
                <input
                  type="text"
                  value={new Date(entryData.checkInDate).toLocaleDateString('en-IN')}
                  disabled
                  className={styles.disabledInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Check-In Time</label>
                <input
                  type="text"
                  value={entryData.checkInTime}
                  disabled
                  className={styles.disabledInput}
                />
              </div>
            </div>

            {/* Row 6: Check-Out Details */}
            <div className={styles.formRow}>
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
            </div>

            {/* Amount Calculation */}
            {calculated.totalDays > 0 && (
              <div className={styles.calculation}>
                <div className={styles.calcRow}>
                  <span>Parking Days:</span>
                  <strong>
                    {calculated.totalDays} {calculated.totalDays === 1 ? "day" : "days"}
                  </strong>
                </div>
                <div className={styles.calcRow}>
                  <span>Amount to Pay:</span>
                  <strong className={styles.amount}>
                    ₹{calculated.totalAmount.toFixed(2)}
                  </strong>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Processing..." : "✓ Complete Check-Out"}
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
                    <p>Sachin Dhaba, Hyderabad Road,</p>
                    <p>Bondhar, Tq.Dist</p>
                    <p className={styles.nameted}>Nanded</p>
                  </div>
                </div>
                <div className={styles.receiptTitle}>Check-out Receipt</div>
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
                  <span className={styles.value}>{receiptData.driverName || "-"}</span>
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
                  <span className={styles.value}>{receiptData.driverMobile || "-"}</span>
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
                    {new Date(receiptData.checkInDate).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Check In Time:</span>
                  <span className={styles.value}>{receiptData.checkInTime}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Check Out Date:</span>
                  <span className={styles.value}>
                    {new Date(receiptData.checkOutDate).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Check Out Time:</span>
                  <span className={styles.value}>{receiptData.checkOutTime}</span>
                </div>

                <div className={`${styles.infoRow} ${styles.highlight}`}>
                  <span className={styles.label}>Parking Days:</span>
                  <span className={styles.value}>{receiptData.totalDays} days</span>
                </div>

                <div className={`${styles.infoRow} ${styles.highlight}`}>
                  <span className={styles.label}>Amount Paid:</span>
                  <span className={`${styles.value} ${styles.amountPaid}`}>
                    ₹{receiptData.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className={styles.receiptFooter}>
                <p>Contact Info: +91-9284063314,7972761348</p>
                <p>9011100587</p>
                <p className={styles.signLabel}>Sign:_______________</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`${styles.modalActions} ${styles.hideOnPrint}`}>
              <button onClick={handlePrint} className={styles.primaryButton}>
                🖨️ Print Receipt
              </button>
              <button onClick={handleNewCheckOut} className={styles.ghostButton}>
                ➕ New Check-Out
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