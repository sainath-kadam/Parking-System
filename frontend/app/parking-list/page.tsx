// parking-list.tsx
"use client";
import { useState, useEffect } from "react";
import { getAllVehicles } from "@/services/api";
import styles from "./parking-list.module.scss";

interface Vehicle {
  id: string;
  tokenId: string;
  vehicleNumber: string;
  ownerName: string;
  ownerMobile: string;
  driverName?: string;
  vehicleType: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate?: string;
  checkOutTime?: string;
  ratePerDay: number;
  totalAmount?: number;
  status: "active" | "completed";
}

export default function VehicleListPage() {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    vehicleNumber: "",
    ownerName: "",
    driverName: "",
    dateFilter: "today" as "today" | "week" | "month" | "custom",
    customStartDate: "",
    customEndDate: "",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, vehicles]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await getAllVehicles();
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Filter by vehicle number
    if (filters.vehicleNumber.trim()) {
      filtered = filtered.filter((v) =>
        v.vehicleNumber.toLowerCase().includes(filters.vehicleNumber.toLowerCase())
      );
    }

    // Filter by owner name
    if (filters.ownerName.trim()) {
      filtered = filtered.filter((v) =>
        v.ownerName.toLowerCase().includes(filters.ownerName.toLowerCase())
      );
    }

    // Filter by driver name
    if (filters.driverName.trim()) {
      filtered = filtered.filter((v) =>
        v.driverName?.toLowerCase().includes(filters.driverName.toLowerCase())
      );
    }

    // Filter by date
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filters.dateFilter === "today") {
      filtered = filtered.filter((v) => {
        const checkInDate = new Date(v.checkInDate);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate.getTime() === now.getTime();
      });
    } else if (filters.dateFilter === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((v) => {
        const checkInDate = new Date(v.checkInDate);
        return checkInDate >= weekAgo;
      });
    } else if (filters.dateFilter === "month") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter((v) => {
        const checkInDate = new Date(v.checkInDate);
        return checkInDate >= monthAgo;
      });
    } else if (filters.dateFilter === "custom") {
      if (filters.customStartDate && filters.customEndDate) {
        const startDate = new Date(filters.customStartDate);
        const endDate = new Date(filters.customEndDate);
        endDate.setHours(23, 59, 59, 999);

        filtered = filtered.filter((v) => {
          const checkInDate = new Date(v.checkInDate);
          return checkInDate >= startDate && checkInDate <= endDate;
        });
      }
    }

    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      vehicleNumber: "",
      ownerName: "",
      driverName: "",
      dateFilter: "today",
      customStartDate: "",
      customEndDate: "",
    });
  };

  const handleDownloadCheckIn = (vehicle: Vehicle) => {
    window.open(`/print?tokenId=${vehicle.tokenId}&checkout=false`, "_blank");
    setOpenMenuId(null);
  };

  const handleDownloadCheckOut = (vehicle: Vehicle) => {
    if (vehicle.status === "completed") {
      window.open(`/print?tokenId=${vehicle.tokenId}&checkout=true`, "_blank");
    } else {
      alert("Vehicle not checked out yet");
    }
    setOpenMenuId(null);
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const calculateDuration = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return "Ongoing";
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  };

  const activeVehicles = filteredVehicles.filter((v) => v.status === "active");
  const completedVehicles = filteredVehicles.filter((v) => v.status === "completed");
  const totalRevenue = completedVehicles.reduce((sum, v) => sum + (v.totalAmount || 0), 0);

  const isAnyFilterApplied =
    filters.vehicleNumber.trim() !== "" ||
    filters.ownerName.trim() !== "" ||
    filters.driverName.trim() !== "" ||
    filters.dateFilter !== "today" ||
    filters.customStartDate !== "" ||
    filters.customEndDate !== "";

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>🚗 Vehicle Records</h1>
            <p>View and manage all parking entries</p>
          </div>
          <button onClick={fetchVehicles} className={styles.refreshBtn}>
            🔄 Refresh Data
          </button>
        </div>

        {/* Enhanced Filters */}
        <div className={styles.filterSection}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>📅 Date Filter</label>
              <select
                name="dateFilter"
                value={filters.dateFilter}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {filters.dateFilter === "custom" && (
              <>
                <div className={styles.filterGroup}>
                  <label>From Date</label>
                  <input
                    type="date"
                    name="customStartDate"
                    value={filters.customStartDate}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <label>To Date</label>
                  <input
                    type="date"
                    name="customEndDate"
                    value={filters.customEndDate}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                </div>
              </>
            )}
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>🚙 Vehicle Number</label>
              <input
                type="text"
                name="vehicleNumber"
                value={filters.vehicleNumber}
                onChange={handleFilterChange}
                placeholder="KA-05-MN-1234"
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>👤 Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={filters.ownerName}
                onChange={handleFilterChange}
                placeholder="Search by owner"
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>🧑‍✈️ Driver Name</label>
              <input
                type="text"
                name="driverName"
                value={filters.driverName}
                onChange={handleFilterChange}
                placeholder="Search by driver"
                className={styles.filterInput}
              />
            </div>

            {isAnyFilterApplied && (
              <div className={styles.filterGroup}>
                <button onClick={clearFilters} className={styles.clearBtn}>
                  ✖ Clear Filters
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Enhanced Stats */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.blue}`}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Records</span>
              <span className={styles.statValue}>{filteredVehicles.length}</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.green}`}>
            <div className={styles.statIcon}>🟢</div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Currently Parked</span>
              <span className={styles.statValue}>{activeVehicles.length}</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.purple}`}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Completed</span>
              <span className={styles.statValue}>{completedVehicles.length}</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.orange}`}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Revenue</span>
              <span className={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading vehicles...</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Vehicle</th>
                  <th>Owner</th>
                  <th>Driver</th>
                  <th>Type</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={11} className={styles.emptyState}>
                      <div className={styles.emptyIcon}>🔍</div>
                      <p>No vehicles found</p>
                      <small>Try adjusting your filters</small>
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className={styles.tableRow}>
                      <td>
                        <span className={styles.token}>{vehicle.tokenId}</span>
                      </td>
                      <td>
                        <span className={styles.vehicleNumber}>
                          {vehicle.vehicleNumber}
                        </span>
                      </td>
                      <td>
                        <div className={styles.personInfo}>
                          <span className={styles.name}>{vehicle.ownerName}</span>
                          <span className={styles.mobile}>{vehicle.ownerMobile}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.driverName}>
                          {vehicle.driverName || "-"}
                        </span>
                      </td>
                      <td>
                        <span className={styles.vehicleType}>{vehicle.vehicleType}</span>
                      </td>
                      <td>
                        <div className={styles.dateTime}>
                          <span>{new Date(vehicle.checkInDate).toLocaleDateString('en-IN')}</span>
                          <small>{vehicle.checkInTime}</small>
                        </div>
                      </td>
                      <td>
                        {vehicle.checkOutDate ? (
                          <div className={styles.dateTime}>
                            <span>{new Date(vehicle.checkOutDate).toLocaleDateString('en-IN')}</span>
                            <small>{vehicle.checkOutTime}</small>
                          </div>
                        ) : (
                          <span className={styles.pending}>-</span>
                        )}
                      </td>
                      <td>
                        <span className={styles.duration}>
                          {calculateDuration(vehicle.checkInDate, vehicle.checkOutDate)}
                        </span>
                      </td>
                      <td>
                        <span className={styles.amount}>
                          {vehicle.totalAmount ? `₹${vehicle.totalAmount}` : "-"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${vehicle.status === "active"
                            ? styles.statusActive
                            : styles.statusCompleted
                            }`}
                        >
                          {vehicle.status === "active" ? "🟢 Active" : "✅ Completed"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionWrapper}>
                          <button
                            onClick={() => toggleMenu(vehicle.id)}
                            className={styles.actionBtn}
                          >
                            ⋮
                          </button>
                          {openMenuId === vehicle.id && (
                            <div className={styles.actionMenu}>
                              <button
                                onClick={() => handleDownloadCheckIn(vehicle)}
                                className={styles.menuItem}
                              >
                                📥 Check-In Receipt
                              </button>
                              <button
                                onClick={() => handleDownloadCheckOut(vehicle)}
                                className={styles.menuItem}
                                disabled={vehicle.status !== "completed"}
                              >
                                📥 Check-Out Receipt
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Overlay */}
      {openMenuId && (
        <div
          className={styles.overlay}
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
}