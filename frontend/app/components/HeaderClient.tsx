"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "../layout.module.scss";

export default function HeaderClient() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Brand (Clickable → Landing Page) */}
        <Link
          href="/"
          className={styles.brand}
          onClick={() => setOpen(false)}
        >
          <div className={styles.logoIcon}>🚗</div>
          <div>
            <h1 className={styles.brandName}>Sachin Parking</h1>
            <span className={styles.brandTagline}>
              Smart parking made simple
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <button
            className={styles.hamburger}
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className={open ? styles.lineOpen : styles.line} />
            <span className={open ? styles.lineOpen : styles.line} />
            <span className={open ? styles.lineOpen : styles.line} />
          </button>

          <ul className={`${styles.navList} ${open ? styles.open : ""}`}>
            <li>
              <Link href="/check-in" onClick={() => setOpen(false)}>
                Check-In
              </Link>
            </li>
            <li>
              <Link href="/check-out" onClick={() => setOpen(false)}>
                Check-Out
              </Link>
            </li>
            <li>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/print" onClick={() => setOpen(false)}>
                Print
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
