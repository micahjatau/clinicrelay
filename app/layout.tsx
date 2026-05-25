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
  metadataBase: new URL("https://www.clinicrelay.co"),
  alternates: {
    canonical: "https://www.clinicrelay.co",
  },
  title: "ClinicRelay | Front-Desk Orchestration for Modern Clinics",
  description:
    "ClinicRelay helps clinics coordinate bookings, reduce missed appointments, recover cancelled slots, and reduce front-desk chaos.",
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
    title: "ClinicRelay | Front-Desk Orchestration for Modern Clinics",
    description:
      "ClinicRelay helps clinics coordinate bookings, reduce missed appointments, recover cancelled slots, and reduce front-desk chaos.",
    url: "https://www.clinicrelay.co",
    siteName: "ClinicRelay",
    type: "website",
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
    title: "ClinicRelay | Front-Desk Orchestration for Modern Clinics",
    description:
      "ClinicRelay helps clinics coordinate bookings, reduce missed appointments, recover cancelled slots, and reduce front-desk chaos.",
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
