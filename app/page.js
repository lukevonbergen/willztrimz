import HeroIntermediate from "@/components/hero/Hero_2";
import Features from "@/components/features/Features_1"
import FooterAdvanced from "@/components/footer/Footer_3"
import NavbarAdvanced from "@/components/navigation/Nav_3"
import Gallery from "@/components/gallery/Gallery_1"
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
        <NavbarAdvanced />
        <HeroIntermediate />
        <AboutIntermediate />
        <Features />
        <Gallery />
        <ServiceListIntermediate />
        <ServicesBasic />
        <ServicesIntermediate />
        <TestimonialsIntermediate />
        <CTAIntermediate />
        <FindUsBasic />
        <FAQ />
        <FooterAdvanced />
      </main>
  );
}
