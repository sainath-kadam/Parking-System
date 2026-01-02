import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.kicker}>Welcome</div>
          <h1 className={styles.title}>
            Sachin Parking — Smart, Fast, Reliable
          </h1>
          <p className={styles.subtitle}>
            Modern parking management with instant check-in/check-out, live
            availability, and printable receipts. Built for speed and
            simplicity.
          </p>

          <div className={styles.actions}>
            <Link href="/register" className={styles.registerButton}>
              Register Your Vehicle
            </Link>
          </div>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🚗</div>
              <div>
                <div className={styles.featureTitle}>Fast Entry</div>
                <div className={styles.featureDesc}>Get parked in seconds.</div>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📊</div>
              <div>
                <div className={styles.featureTitle}>Live Dashboard</div>
                <div className={styles.featureDesc}>
                  Monitor occupancy in real time.
                </div>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🖨️</div>
              <div>
                <div className={styles.featureTitle}>Printable Receipts</div>
                <div className={styles.featureDesc}>Easy record keeping.</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroImageWrap} aria-hidden>
          <Image
            src="/parking-hero.jpg"
            alt="Modern parking lot overview"
            width={760}
            height={480}
            className={styles.heroImage}
            priority
          />
        </div>
      </div>
    </div>
  );
}
