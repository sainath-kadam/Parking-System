import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.badge}>Premium Parking Solution</span>
            <h2 className={styles.heroTitle}>
              Smart Parking
              <span className={styles.highlight}> Redefined</span>
            </h2>
            <p className={styles.heroSubtitle}>
              Experience the future of parking management with instant check-in/check-out,
              real-time availability tracking, and seamless digital receipts. Fast, secure, and intelligent.
            </p>

            <div className={styles.heroActions}>
              <Link href="/check-in" className={styles.primaryCta}>
                <span>Start Check-In</span>
                <span className={styles.ctaArrow}>→</span>
              </Link>
              <Link href="/dashboard" className={styles.secondaryCta}>
                View Dashboard
              </Link>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>10,000+</div>
                <div className={styles.statLabel}>Vehicles Daily</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>99.9%</div>
                <div className={styles.statLabel}>Uptime</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>&lt;30s</div>
                <div className={styles.statLabel}>Avg Check-in</div>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.imageCard}>
              <Image
                src="/parking-hero.jpg"
                alt="Modern parking facility"
                width={600}
                height={400}
                className={styles.heroImage}
                priority
              />
              <div className={styles.floatingCard}>
                <div className={styles.cardIcon}>✓</div>
                <div>
                  <div className={styles.cardTitle}>Live Tracking</div>
                  <div className={styles.cardDesc}>245/300 spots available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <Link href="/check-in" className={styles.actionCard}>
          <div className={styles.actionIcon}>🚀</div>
          <h3 className={styles.actionTitle}>Check in</h3>
          <p className={styles.actionDesc}>Fast exit process</p>
        </Link>
        <Link href="/register" className={styles.actionCard}>
          <div className={styles.actionIcon}>🚗</div>
          <h3 className={styles.actionTitle}>Register</h3>
          <p className={styles.actionDesc}>Quick vehicle entry</p>
        </Link>
        <Link href="/check-out" className={styles.actionCard}>
          <div className={styles.actionIcon}>🚀</div>
          <h3 className={styles.actionTitle}>Check-Out</h3>
          <p className={styles.actionDesc}>Fast exit process</p>
        </Link>


      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Why Choose Sachin Parking</h3>
          <p className={styles.sectionSubtitle}>
            Advanced features designed for modern convenience
          </p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h4 className={styles.featureTitle}>Lightning Fast Entry</h4>
            <p className={styles.featureDesc}>
              QR code scanning and automated gate systems get you parked in under 30 seconds.
            </p>
            <div className={styles.featureImage}>
              <Image
                src="/parking-hero.jpg"
                alt="Fast entry system"
                width={300}
                height={200}
                className={styles.smallImage}
              />
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h4 className={styles.featureTitle}>Real-Time Analytics</h4>
            <p className={styles.featureDesc}>
              Monitor occupancy, track patterns, and make data-driven decisions with live dashboards.
            </p>
            <div className={styles.featureImage}>
              <Image
                src="/parking-hero.jpg"
                alt="Analytics dashboard"
                width={300}
                height={200}
                className={styles.smallImage}
              />
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🖨️</div>
            <h4 className={styles.featureTitle}>Digital Receipts</h4>
            <p className={styles.featureDesc}>
              Instant printable receipts and automated email confirmations for easy record keeping.
            </p>
            <div className={styles.featureImage}>
              <Image
                src="/parking-hero.jpg"
                alt="Digital receipts"
                width={300}
                height={200}
                className={styles.smallImage}
              />
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h4 className={styles.featureTitle}>Secure & Protected</h4>
            <p className={styles.featureDesc}>
              24/7 CCTV surveillance, encrypted transactions, and secure payment processing.
            </p>
            <div className={styles.featureImage}>
              <Image
                src="/parking-hero.jpg"
                alt="Security system"
                width={300}
                height={200}
                className={styles.smallImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h3 className={styles.ctaTitle}>Ready to Experience Smart Parking?</h3>
          <p className={styles.ctaSubtitle}>
            Join thousands of satisfied customers using Sachin Parking System daily
          </p>
          <Link href="/register" className={styles.ctaButton}>
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}