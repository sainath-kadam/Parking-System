"use client";
import styles from "../layout.module.scss";

export default function FooterClient() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <svg
            className={styles.footerLogo}
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="6" fill="#0ea5e9" />
            <path d="M6 14l4-7 4 7h-8z" fill="#fff" />
          </svg>
          <div>
            <div className={styles.footerBrandName}>Sachin Parking System</div>
            <div className={styles.footerTagline}>Smart. Fast. Reliable.</div>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <div className={styles.footerColumn}>
            <h5 className={styles.footerHeading}>Contact</h5>
            <a href="tel:+919876543210">+91 98765 43210</a>
            <a href="mailto:info@sachinparking.com">info@sachinparking.com</a>
          </div>

          <div className={styles.footerColumn}>
            <h5 className={styles.footerHeading}>Address</h5>
            <p className={styles.footerAddress}>
              123 Main Street<br />
              Downtown District<br />
              Nagpur, Maharashtra 440001
            </p>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2026 Sachin Parking System. All rights reserved.</p>
      </div>
    </footer>
  );
}