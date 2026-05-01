import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { WaitlistSection } from "@/components/landing/waitlist-section";
import { ProductWorkflow } from "@/components/landing/product-workflow";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { GrowthSection } from "@/components/landing/growth-section";
import { WebServices } from "@/components/landing/web-services";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { UseCases } from "@/components/landing/use-cases";
import { TrustSection } from "@/components/landing/trust-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProcessSection } from "@/components/landing/process-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { MobileStickyCta } from "@/components/landing/mobile-sticky-cta";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <ProblemSection />
      <WaitlistSection />
      <ProductWorkflow />
      <FeatureGrid />
      <GrowthSection />
      <WebServices />
      <DashboardMockup />
      <UseCases />
      <TrustSection />
      <MetricsSection />
      <PricingSection />
      <ProcessSection />
      <FaqSection />
      <FinalCta />
      <Footer />
      <MobileStickyCta />
      <div className="md:hidden h-20" />
    </>
  );
}
