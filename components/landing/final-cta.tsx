import { FinalCtaButtons } from "./final-cta-buttons";

export function FinalCta() {
  return (
    <section className="py-28 md:py-36 bg-[#0F172A]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
        <h2 className="text-4xl md:text-6xl tracking-tighter font-semibold text-white mb-6 max-w-[18ch] mx-auto leading-none">
          Stop letting front-desk chaos leak revenue.
        </h2>
        <p className="text-base text-white/75 mb-10 max-w-[56ch] mx-auto leading-relaxed">
          ClinicRelay pays for itself the first week a cancelled slot gets filled automatically.
        </p>
        <FinalCtaButtons />
      </div>
    </section>
  );
}
