"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "./components/LoginModal";
import styles from "./page.module.scss";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/dashboard");
    }
  }, [router]);


  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    router.push("/dashboard");
  };

  return (
    <div className={styles.homePage}>
      {/* Animated Background */}
      <div className={styles.animatedBg}>
        <div className={styles.road}>
          <div className={styles.roadLine}></div>
          <div className={styles.roadLine}></div>
          <div className={styles.roadLine}></div>
          <div className={styles.roadLine}></div>
        </div>

        {/* Animated Cars */}
        <div className={styles.car1}>🚗</div>
        <div className={styles.car2}>🚙</div>
        <div className={styles.car3}>🚕</div>
        <div className={styles.car4}>🚐</div>
        <div className={styles.car5}>🏎️</div>

        {/* Parking Spots Animation */}
        <div className={styles.parkingSpots}>
          <div className={styles.spot}>🅿️</div>
          <div className={styles.spot}>🅿️</div>
          <div className={styles.spot}>🅿️</div>
        </div>
      </div>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <div className={styles.logoSection}>
          <div className={styles.logoCircle}>
            <span className={styles.parkingIcon}>🅿️</span>
          </div>
          <h1 className={styles.mainTitle}>Sachin Parking Yard</h1>
          <p className={styles.tagline}>Professional Parking Management System</p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⚡</span>
            <span>Quick Check-In/Out</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <span>Real-time Dashboard</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>💰</span>
            <span>Revenue Tracking</span>
          </div>
        </div>

        <button
          className={styles.loginButton}
          onClick={() => setShowLoginModal(true)}
        >
          <span className={styles.lockIcon}>🔐</span>
          Login to Continue
        </button>

        <p className={styles.infoText}>
          Login to perform parking activities and manage your parking lot
        </p>
      </div>

      {/* Decorative Elements */}
      <div className={styles.decorCircle1}></div>
      <div className={styles.decorCircle2}></div>
      <div className={styles.decorCircle3}></div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}