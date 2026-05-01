import { heroData } from "@/lib/content/clinicrelay-landing";
import { HeroBento } from "./hero-bento";
import { HeroCtaButtons } from "./hero-cta-buttons";

export function Hero() {
  return (
    <section className="min-h-[100dvh] flex items-center bg-[--cr-bg] pt-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[--cr-teal] mb-4">
              {heroData.eyebrow}
            </p>
            <h1 className="text-5xl md:text-6xl tracking-tighter font-semibold text-[--cr-text] leading-none mb-6">
              {heroData.h1}
            </h1>
            <p className="text-base leading-relaxed text-[--cr-muted] max-w-[55ch] mb-8">
              {heroData.subheadline}
            </p>
            <HeroCtaButtons />
            <p className="text-xs text-[--cr-muted] mt-4 mb-6">{heroData.trustLine}</p>
            <div className="flex flex-wrap gap-2">
              {heroData.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[--cr-teal-light] text-[--cr-teal]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <HeroBento cards={heroData.bentoCards} />
        </div>
      </div>
    </section>
  );
}
