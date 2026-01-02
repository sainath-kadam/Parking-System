"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "../layout.module.scss";

export default function HeaderClient() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <svg
          className={styles.logo}
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <rect width="24" height="24" rx="6" fill="#0ea5e9" />
          <path d="M6 14l4-7 4 7h-8z" fill="#fff" />
        </svg>
        <div>
          <h1 className={styles.title}>Sachin Parking</h1>
          <div className={styles.subtitle}>Smart parking made simple</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <button
          className={styles.hamburger}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span
            className={open ? styles.hamburgerLineOpen : styles.hamburgerLine}
          />
          <span
            className={open ? styles.hamburgerLineOpen : styles.hamburgerLine}
          />
          <span
            className={open ? styles.hamburgerLineOpen : styles.hamburgerLine}
          />
        </button>

        <ul
          className={open ? `${styles.navList} ${styles.open}` : styles.navList}
        >
          <li>
            <Link
              href="/check-in"
              className={styles.navLink}
              onClick={() => setOpen(false)}
            >
              Check-In
            </Link>
          </li>
          <li>
            <Link
              href="/check-out"
              className={styles.navLink}
              onClick={() => setOpen(false)}
            >
              Check-Out
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className={styles.navLink}
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/print"
              className={styles.navLink}
              onClick={() => setOpen(false)}
            >
              Print
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
