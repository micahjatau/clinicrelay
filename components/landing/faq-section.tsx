import { faqItems } from "@/lib/content/clinicrelay-landing";

export function FaqSection() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[--cr-text]">Common questions.</h2>
        </div>
        <div className="max-w-3xl divide-y divide-[--cr-border]">
          {faqItems.map((item, i) => (
            <details key={i} className="group py-1">
              <summary className="w-full list-none cursor-pointer flex items-center justify-between py-4 text-left gap-4">
                <span className="text-base font-semibold text-[--cr-text] tracking-tight">{item.question}</span>
                <span className="text-[--cr-muted] group-open:text-[--cr-teal]">+</span>
              </summary>
              <p className="text-base text-[--cr-muted] leading-relaxed pb-5">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
