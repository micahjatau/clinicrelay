import { navLinks } from "@/lib/content/clinicrelay-landing";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-[--cr-border] py-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <p className="font-semibold text-[--cr-text] tracking-tight mb-2">ClinicRelay</p>
            <p className="text-xs text-[--cr-muted] mb-4">Front-desk orchestration for appointment-based clinics.</p>
            <p className="text-xs text-[--cr-muted] max-w-[28ch] leading-relaxed">
              Waitlist recovery, patient reminders, booking coordination, and front-desk visibility — in one platform.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[--cr-text] mb-4">Product</p>
            {["Waitlist Recovery", "Recall Automation", "Confirmation Flows", "Missed Call Capture", "Dashboard"].map((item) => (
              <p key={item} className="text-sm text-[--cr-muted] mb-2.5">{item}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[--cr-text] mb-4">Services</p>
            {["Clinic Website", "Google Ads", "Local SEO", "Reputation System", "Growth Audit"].map((item) => (
              <p key={item} className="text-sm text-[--cr-muted] mb-2.5">{item}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[--cr-text] mb-4">Company</p>
            {["About", "Contact", "Privacy Policy", "Terms of Service", "Security"].map((item) => (
              <p key={item} className="text-sm text-[--cr-muted] mb-2.5">{item}</p>
            ))}
          </div>
        </div>
        <div className="border-t border-[--cr-border] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[--cr-muted]">© {year} ClinicRelay. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Security"].map((item) => (
              <span key={item} className="text-xs text-[--cr-muted] hover:text-[--cr-text] cursor-pointer transition-colors">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
