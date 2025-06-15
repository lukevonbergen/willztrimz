import HeroBasic from "@/components/hero/Hero_1";
import HeroIntermediate from "@/components/hero/Hero_2";
import Features from "@/components/features/Features_1"
import PricingBasic from "@/components/pricing/Pricing_1"
import PricingIntermediate from "@/components/pricing/Pricing_2"
import PricingAdvanced from "@/components/pricing/Pricing_3"
import FooterBasic from "@/components/footer/Footer_1"
import FooterIntermediate from "@/components/footer/Footer_2"
import FooterAdvanced from "@/components/footer/Footer_3"
import NavbarBasic from "@/components/navigation/Nav_1"
import NavbarIntermediate from "@/components/navigation/Nav_2"
import Gallery from "@/components/gallery/Gallery_1"
import TestimonialsBasic from "@/components/testimonials/Testimonials_1"
import TestimonialsIntermediate from "@/components/testimonials/Testimonials_2"
import CTABasic from "@/components/cta/CTA_1"
import CTAIntermediate from "@/components/cta/CTA_2"
import FAQ from "@/components/faq/FAQ_1"
import StatsBasic from "@/components/stats/Stats_1"
import StatsIntermediate from "@/components/stats/Stats_2"
import ServicesBasic from "@/components/services/Service_1"
import ServicesIntermediate from "@/components/services/Service_2"
import Banner from "@/components/banner/Banner_1"
import FindUsBasic from "@/components/findus/FindUs_1"
import AboutBasic from "@/components/about/About_1"
import AboutIntermediate from "@/components/about/About_2"
import AboutAdvanced from "@/components/about/About_3"
import ServiceListBasic from "@/components/servicelist/List_1"
import ServiceListIntermediate from "@/components/servicelist/List_2"
import ServiceListAdvanced from "@/components/servicelist/List_3"

export default function HomePage() {
  return (
      <main>
        <Banner />
        <NavbarBasic />
        <NavbarIntermediate />
        <HeroBasic
          headline="Launch Your Site Like a Pro"
          subheadline="Websites That Look £2,000 — Delivered for £249"
          description="Professionally designed, mobile-ready sites built and deployed in 48 hours. Zero fluff, all results."
          ctaText="Claim Your Spot"
          ctaLink="#contact"
          logos={[
            "/logo-placeholder-1.svg",
            "/logo-placeholder-2.svg",
          ]}
        />
        <HeroIntermediate />
        <AboutBasic />
        <AboutIntermediate />
        <AboutAdvanced />
        <StatsBasic />
        <StatsIntermediate />
        <Features />
        <Gallery />
        <ServiceListBasic />
        <ServiceListIntermediate />
        <ServiceListAdvanced />
        <ServicesBasic />
        <ServicesIntermediate />
        <TestimonialsBasic />
        <TestimonialsIntermediate />
        <PricingBasic />
        <PricingIntermediate />
        <PricingAdvanced />
        <CTABasic />
        <CTAIntermediate />
        <FindUsBasic />
        <FAQ />
        <FooterBasic />
        <FooterIntermediate />
        <FooterAdvanced />
      </main>
  );
}
