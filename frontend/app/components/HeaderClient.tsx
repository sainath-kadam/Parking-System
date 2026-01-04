// components/HeaderClient.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "../layout.module.scss";

export default function HeaderClient() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check login status
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };
    checkAuth();
    // Listen for storage changes (in case user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (!isLoggedIn && href !== "/") {
      e.preventDefault();
      setShowLoginWarning(true);
      setOpen(false);
    } else {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
    setOpen(false);
    document.cookie = "isLoggedIn=; path=/; max-age=0";
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Left: Brand */}
          <Link
            href="/"
            className={styles.brand}
            onClick={() => setOpen(false)}
          >
            <div className={styles.logoIcon}>
              <Image
                src="/sachin-parking-logo.png"
                alt="Sachin Parking Yard Logo"
                width={52}
                height={52}
                className={styles.logoImage}
                priority
              />
            </div>
            <div className={styles.brandInfo}>
              <h1 className={styles.brandName}>Sachin Parking Yard</h1>
              <span className={styles.brandTagline}>
                Professional Parking Management
              </span>
            </div>
          </Link>

          {/* Center: Navigation */}
          <nav className={styles.nav}>
            <ul className={`${styles.navList} ${open ? styles.open : ""}`}>
              <li>
                <Link
                  href="/dashboard"
                  onClick={(e) => handleLinkClick(e, "/dashboard")}
                  className={`${pathname === "/dashboard" ? styles.activeNav : ""} ${!isLoggedIn ? styles.disabledLink : ""}`}
                >
                  <span className={styles.navIcon}>📊</span>
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href="/check-in"
                  onClick={(e) => handleLinkClick(e, "/check-in")}
                  className={`${pathname === "/check-in" ? styles.activeNav : ""} ${!isLoggedIn ? styles.disabledLink : ""}`}
                >
                  <span className={styles.navIcon}>✓</span>
                  Check-In
                </Link>
              </li>

              <li>
                <Link
                  href="/check-out"
                  onClick={(e) => handleLinkClick(e, "/check-out")}
                  className={`${pathname === "/check-out" ? styles.activeNav : ""} ${!isLoggedIn ? styles.disabledLink : ""}`}
                >
                  <span className={styles.navIcon}>✕</span>
                  Check-Out
                </Link>
              </li>

              <li>
                <Link
                  href="/parking-list"
                  onClick={(e) => handleLinkClick(e, "/parking-list")}
                  className={`${pathname === "/parking-list" ? styles.activeNav : ""} ${!isLoggedIn ? styles.disabledLink : ""}`}
                >
                  <span className={styles.navIcon}>📋</span>
                  Records
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right: Owner Info + Logout/Login + Hamburger */}
          <div className={styles.rightSection}>
            {isLoggedIn ? (
              <>
                <div className={styles.ownerInfo}>
                  <div className={styles.ownerAvatar}>
                    <span>SP</span>
                  </div>
                  <div className={styles.ownerDetails}>
                    <span className={styles.ownerName}>Sachin Parking</span>
                    <span className={styles.ownerRole}>Administrator</span>
                  </div>
                </div>

                <button
                  className={styles.logoutBtn}
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <span className={styles.logoutIcon}>🚪</span>
                  Logout
                </button>
              </>
            ) : (
              <></>
            )}

            {/* Hamburger for Mobile */}
            <button
              className={styles.hamburger}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span className={open ? styles.lineOpen : styles.line}></span>
              <span className={open ? styles.lineOpen : styles.line}></span>
              <span className={open ? styles.lineOpen : styles.line}></span>
            </button>
          </div>
        </div>
      </header>

      {/**/}
      {showLoginWarning && (
        <div
          className={styles.logoutModal}
          onClick={() => setShowLoginWarning(false)}
        >
          <div
            className={styles.logoutCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.logoutIcon}>🔒</div>
            <h3>Login Required</h3>
            <p>Please login to access this section.</p>

            <div className={styles.logoutActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowLoginWarning(false)}
              >
                Ok
              </button>

            </div>
          </div>
        </div>
      )}


      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className={styles.logoutModal} onClick={() => setShowLogoutConfirm(false)}>
          <div className={styles.logoutCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.logoutIcon}>🚪</div>
            <h3>Logout Confirmation</h3>
            <p>Are you sure you want to logout?</p>
            <div className={styles.logoutActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}