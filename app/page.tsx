import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { ManifestoSection } from "@/components/landing/manifesto-section";
import { WaitlistSection } from "@/components/landing/waitlist-section";
import { PreVisitReadiness } from "@/components/landing/pre-visit-readiness";
import { ProductWorkflow } from "@/components/landing/product-workflow";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { UseCases } from "@/components/landing/use-cases";
import { TrustSection } from "@/components/landing/trust-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { MobileStickyCta } from "@/components/landing/mobile-sticky-cta";
import { OrganizationJsonLd } from "@/components/landing/organization-jsonld";

export default function Home() {
  return (
    <>
      <Nav />
      <OrganizationJsonLd />
      <Hero />
      <ProblemSection />
      <ManifestoSection />
      <WaitlistSection />
      <PreVisitReadiness />
      <ProductWorkflow />
      <FeatureGrid />
      <UseCases />
      <TrustSection />
      <MetricsSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
      <Footer />
      <MobileStickyCta />
      <div className="md:hidden h-20" />
    </>
  );
}
