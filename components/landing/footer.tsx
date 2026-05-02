import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-[--cr-border] py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/logo-mark.svg" alt="ClinicRelay" width={18} height={18} />
              <p className="font-semibold text-[15px] text-[--cr-text] tracking-tight">ClinicRelay</p>
            </div>
            <p className="text-xs text-[--cr-muted] mb-4">Front-desk orchestration for appointment-based clinics.</p>
            <p className="text-xs text-[--cr-muted] max-w-[28ch] leading-relaxed">
              Waitlist recovery, patient reminders, booking coordination, and front-desk visibility — in one platform.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[--cr-text] mb-4">Product</p>
            {[
              { label: "Waitlist Recovery", href: "/#waitlist" },
              { label: "Pricing", href: "/pricing" },
              { label: "Workflow Audit", href: "/workflow-audit" },
              { label: "Book a Demo", href: "/demo" },
              { label: "Family Medicine Use Case", href: "/use-cases/family-medicine" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="block text-sm text-[--cr-muted] hover:text-[--cr-text] mb-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] rounded">
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[--cr-text] mb-4">Services</p>
            {[
              { label: "Recovery Audit", href: "/workflow-audit" },
              { label: "Front-Desk Recovery Pilot", href: "/pricing" },
              { label: "Cancelled-slot Demo", href: "/demo" },
              { label: "Dental Use Case", href: "/use-cases/dental" },
              { label: "Family Medicine Use Case", href: "/use-cases/family-medicine" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="block text-sm text-[--cr-muted] hover:text-[--cr-text] mb-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] rounded">
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[--cr-text] mb-4">Company</p>
            {[
              { label: "Demo", href: "/demo" },
              { label: "Workflow Audit", href: "/workflow-audit" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Pricing", href: "/pricing" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="block text-sm text-[--cr-muted] hover:text-[--cr-text] mb-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] rounded">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="border-t border-[--cr-border] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[--cr-muted]">© {year} ClinicRelay. All rights reserved.</p>
          <div className="flex gap-6">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Demo", href: "/demo" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="text-xs text-[--cr-muted] hover:text-[--cr-text] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] rounded">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
