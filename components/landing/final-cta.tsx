import { FinalCtaButtons } from "./final-cta-buttons";

export function FinalCta() {
  return (
    <section className="py-24 md:py-32 bg-[--cr-text]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
        <h2 className="text-3xl md:text-5xl tracking-tighter font-semibold text-white mb-6 max-w-[22ch] mx-auto leading-tight">
          Stop letting front-desk chaos leak revenue.
        </h2>
        <p className="text-base text-[--cr-muted] mb-10 max-w-[50ch] mx-auto leading-relaxed">
          ClinicRelay pays for itself the first week a cancelled slot gets filled automatically.
        </p>
        <FinalCtaButtons />
      </div>
    </section>
  );
}
