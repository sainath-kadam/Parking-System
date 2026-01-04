// components/LoginModal.tsx
"use client";
import { useState } from "react";
import styles from "../layout.module.scss";

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      // password
      if (password === "parking@sachinyard") {
        document.cookie = "isLoggedIn=true; path=/";
        localStorage.setItem("isLoggedIn", "true");
        onSuccess();
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
        setIsLoading(false);
      }
    }, 200);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.iconCircle}>🔐</div>
          <h2>Login Required</h2>
          <p>Enter your password to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <span className={styles.error}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || !password}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Logging in...
              </>
            ) : (
              <>
                <span>🚀</span>
                Login
              </>
            )}
          </button>
        </form>

        <div className={styles.hint}>
          <span className={styles.hintIcon}>💡</span>
          <span>Contact admin if you forgot your password</span>
        </div>
      </div>
    </div>
  );
}