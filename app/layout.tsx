import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DemoModalProvider } from "@/context/demo-modal-context";
import { DemoModalLazy } from "@/components/landing/demo-modal-lazy";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://clinicrelay.vercel.app"
  ),
  title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
  description: "ClinicRelay helps clinics recover cancelled slots, route patient requests, prepare intake and insurance tasks, and give staff one place to see what needs attention.",
  other: {
    contactEmail: "hello@clinicrelay.co",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
  openGraph: {
    title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
    description: "ClinicRelay helps clinics recover cancelled slots, route patient requests, prepare intake and insurance tasks, and give staff one place to see what needs attention.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ClinicRelay front-desk orchestration workflow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClinicRelay — Front-Desk Orchestration for Growing Clinics",
    description: "Cancelled-slot recovery, pre-visit readiness, and front-desk coordination for appointment-based clinics.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <PostHogProvider>
          <DemoModalProvider>
            {children}
            <DemoModalLazy />
          </DemoModalProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
