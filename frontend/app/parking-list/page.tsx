// parking-list.tsx
"use client";
import { useState, useEffect } from "react";
import { getAllVehiclesList } from "@/services/api";
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
  const [pagination, setPagination] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter states - aligned with backend API
  const [filters, setFilters] = useState({
    filter: "today" as "all" | "today" | "week" | "month" | "custom",
    status: "all" as "all" | "active" | "completed",
    from: "",
    to: "",
    vehicleNumber: "",
    driverMobile: "",
    ownerMobile: "",
  });

  // Separate state for text inputs (not submitted yet)
  const [inputValues, setInputValues] = useState({
    vehicleNumber: "",
    driverMobile: "",
    ownerMobile: ""
  });

  // Fetch vehicles when any filter changes
  useEffect(() => {
    fetchVehicles();
  }, [
    filters.filter, 
    filters.status, 
    filters.from, 
    filters.to, 
    filters.vehicleNumber, 
    filters.driverMobile, 
    filters.ownerMobile, 
    filters.page
  ]);

  // Initial load
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params: any = {
        filter: filters.filter,
        page: filters.page
      };

      // Add status filter if not 'all'
      if (filters.status !== 'all') {
        params.status = filters.status;
      }

      // Only send dates for custom filter
      if (filters.filter === 'custom' && filters.from && filters.to) {
        params.from = filters.from;
        params.to = filters.to;
      }

      // Add search filters if they exist
      if (filters.vehicleNumber) params.vehicleNumber = filters.vehicleNumber;
      if (filters.driverMobile) params.driverMobile = filters.driverMobile;
      if (filters.ownerMobile) params.ownerMobile = filters.ownerMobile;

      console.log('Fetching with params:', params); // Debug log

      const response = await getAllVehiclesList(params);
      
      if (response.success) {
        setVehicles(response.data || []);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle date filter change (auto-fetch)
  const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as typeof filters.filter;
    setFilters(prev => ({
      ...prev,
      filter: value,
      from: "",
      to: "",
      page: 1
    }));
  };

  // Handle custom date inputs
  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle text input changes (don't fetch yet)
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  // Apply text filters (manual trigger)
  const handleApplyFilters = () => {
    setFilters(prev => ({
      ...prev,
      vehicleNumber: inputValues.vehicleNumber.trim(),
      driverMobile: inputValues.driverMobile.trim(),
      ownerMobile: inputValues.ownerMobile.trim(),
      page: 1
    }));
    // fetchVehicles will be called automatically by useEffect
  };

  // Clear all filters
  const handleClearFilters = () => {
    setInputValues({
      vehicleNumber: "",
      driverMobile: "",
      ownerMobile: ""
    });
    setFilters({
      filter: "today",
      status: "all",
      from: "",
      to: "",
      vehicleNumber: "",
      driverMobile: "",
      ownerMobile: "",
      page: 1
    });
  };

  // Check if any text filter is applied
  const hasActiveTextFilters = filters.vehicleNumber || filters.driverMobile || filters.ownerMobile;

  // Check if text inputs have unsaved changes
  const hasUnsavedChanges = 
    inputValues.vehicleNumber !== filters.vehicleNumber ||
    inputValues.driverMobile !== filters.driverMobile ||
    inputValues.ownerMobile !== filters.ownerMobile;

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

  const activeVehicles = vehicles.filter((v) => v.status === "active");
  const completedVehicles = vehicles.filter((v) => v.status === "completed");
  const totalRevenue = completedVehicles.reduce((sum, v) => sum + (v.totalAmount || 0), 0);

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
          {/* Date Filters - Auto Apply */}
          <div className={styles.dateFilterRow}>
            <div className={styles.filterGroup}>
              <label>📅 Date Filter (Auto-Apply)</label>
              <select
                value={filters.filter}
                onChange={handleDateFilterChange}
                className={styles.filterSelect}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>📊 Status Filter (Auto-Apply)</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any, page: 1 }))}
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="active">🟢 Active</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            {filters.filter === "custom" && (
              <>
                <div className={styles.filterGroup}>
                  <label>From Date</label>
                  <input
                    type="date"
                    name="from"
                    value={filters.from}
                    onChange={handleCustomDateChange}
                    className={styles.filterInput}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <label>To Date</label>
                  <input
                    type="date"
                    name="to"
                    value={filters.to}
                    onChange={handleCustomDateChange}
                    className={styles.filterInput}
                  />
                </div>
              </>
            )}
          </div>

          {/* Search Filters - Manual Apply */}
          <div className={styles.searchFilterSection}>
            <label className={styles.sectionLabel}>
              🔍 Search Filters (Click Apply to Search)
            </label>
            
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label>🚙 Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={inputValues.vehicleNumber}
                  onChange={handleTextInputChange}
                  placeholder="KA-05-MN-1234"
                  className={styles.filterInput}
                />
              </div>

              <div className={styles.filterGroup}>
                <label>🧑‍✈️ Driver Mobile</label>
                <input
                  type="text"
                  name="driverMobile"
                  value={inputValues.driverMobile}
                  onChange={handleTextInputChange}
                  placeholder="10 digit mobile"
                  className={styles.filterInput}
                />
              </div>

              <div className={styles.filterGroup}>
                <label>👤 Owner Mobile</label>
                <input
                  type="text"
                  name="ownerMobile"
                  value={inputValues.ownerMobile}
                  onChange={handleTextInputChange}
                  placeholder="10 digit mobile"
                  className={styles.filterInput}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.filterActions}>
              <button
                onClick={handleApplyFilters}
                disabled={!hasUnsavedChanges && !hasActiveTextFilters}
                className={`${styles.applyBtn} ${(!hasUnsavedChanges && !hasActiveTextFilters) ? styles.disabled : ''}`}
              >
                ✓ Apply Filters
                {hasUnsavedChanges && (
                  <span className={styles.unsavedBadge}>Unsaved</span>
                )}
              </button>
              
              {(hasActiveTextFilters || hasUnsavedChanges) && (
                <button
                  onClick={handleClearFilters}
                  className={styles.clearBtn}
                >
                  ✖ Clear All Filters
                </button>
              )}
            </div>

            {/* Active Filter Tags */}
            {hasActiveTextFilters && (
              <div className={styles.activeFilters}>
                <span className={styles.activeLabel}>Active Filters:</span>
                {filters.vehicleNumber && (
                  <span className={styles.filterTag}>
                    Vehicle: {filters.vehicleNumber}
                  </span>
                )}
                {filters.driverMobile && (
                  <span className={styles.filterTag}>
                    Driver: {filters.driverMobile}
                  </span>
                )}
                {filters.ownerMobile && (
                  <span className={styles.filterTag}>
                    Owner: {filters.ownerMobile}
                  </span>
                )}
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
              <span className={styles.statValue}>{vehicles.length}</span>
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
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={11} className={styles.emptyState}>
                      <div className={styles.emptyIcon}>🔍</div>
                      <p>No vehicles found</p>
                      <small>Try adjusting your filters</small>
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
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