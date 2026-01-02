import styles from "./layout.module.scss";
import HeaderClient from "./components/HeaderClient";
import FooterClient from "./components/FooterClient";

export const metadata = {
  title: "Sachin Parking System",
  description: "Professional Parking Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <HeaderClient />
        <main className={styles.main}>{children}</main>
        <FooterClient />
      </body>
    </html>
  );
}