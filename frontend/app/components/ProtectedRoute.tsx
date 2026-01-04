// // components/ProtectedRoute.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "./ProtectedRoute.module.scss";

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = () => {
//       const isLoggedIn = localStorage.getItem("isLoggedIn");
//       if (isLoggedIn === "true") {
//         setIsAuthenticated(true);
//         setIsLoading(false);
      // } else {
      //   setTimeout(() => {
      //     router.push("/");
      //   }, 2000);
      // }
//     };

//     checkAuth();
//   }, [router]);

//   if (!isAuthenticated) {
//     return (
//       <div className={styles.notificationOverlay}>
//         <div className={styles.notificationCard}>
//           <div className={styles.iconCircle}>🔒</div>
//           <h2>Authentication Required</h2>
//           <p>Please login to access this page</p>
//           <div className={styles.loader}>
//             <div className={styles.loaderBar}></div>
//           </div>
//           <span className={styles.redirectText}>Redirecting to login...</span>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }