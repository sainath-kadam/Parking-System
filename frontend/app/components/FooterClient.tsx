"use client";
import Link from "next/link";
import styles from "../layout.module.scss";

export default function FooterClient() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Column 1: Brand & Description */}
        <div className={styles.footerBrandSection}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogoIcon}>🅿️</div>
            <div>
              <div className={styles.footerBrandName}>Sachin Parking Mart</div>
              <div className={styles.footerBrandTagline}>
                Professional Parking Management System
              </div>
            </div>
          </div>
          <p className={styles.footerDescription}>
            Experience hassle-free parking with our modern digital system.
            Quick check-ins, automated billing, and 24/7 service for your convenience.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <span>f</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <span>𝕏</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <span>📷</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <span>in</span>
            </a>
          </div>
        </div>
        {/* Column 3: Services */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Our Services</h3>
          <p>Car Parking</p>
          <p>Bike Parking</p>
          <p>Truck Parking</p>
          <p>Valet Service</p>
          <p>Monthly Passes</p>
        </div>
        {/* Column 4: Contact Info */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Contact Us</h3>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📍</span>
            <div>
              <p>Sachin Dholka, Hyderabad Road</p>
              <p>Bondhar, Tq.Dist, Nanded</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <div>
              <a href="tel:+919284063314">+91 9284063314</a>
              <a href="tel:+917972761348">+91 7972761348</a>
              <a href="tel:+919011100537">+91 9011100537</a>
            </div>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>✉️</span>
            <div>
              <a href="mailto:info@sachinparking.com">info@sachinparking.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <p className={styles.copyright}>
           © 2026 Sachin Parking Yard. Powered by Saiman Pvt. Ltd. All rights reserved.
          </p>
          <div className={styles.footerBottomLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <span className={styles.separator}>•</span>
            <Link href="/terms">Terms of Service</Link>
            <span className={styles.separator}>•</span>
            <Link href="/support">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}