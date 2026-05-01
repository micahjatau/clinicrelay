import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
  description: "ClinicRelay helps clinics recover cancelled appointment slots, coordinate patient communication, manage waitlists, and reduce front-desk chaos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
