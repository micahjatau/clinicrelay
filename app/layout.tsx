import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { DemoModalProvider } from "@/context/demo-modal-context";
import { DemoModalLazy } from "@/components/landing/demo-modal-lazy";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
  description: "ClinicRelay helps clinics recover cancelled appointment slots, coordinate patient communication, manage waitlists, and reduce front-desk chaos.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
  openGraph: {
    title: "Fill cancelled slots faster with ClinicRelay",
    description: "Waitlist recovery, patient reminders, booking workflows, and front-desk coordination for growing clinics.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <DemoModalProvider>
          {children}
          <DemoModalLazy />
        </DemoModalProvider>
      </body>
    </html>
  );
}
