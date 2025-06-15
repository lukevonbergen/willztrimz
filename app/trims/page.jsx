import Features from "@/components/features/Features_1"
import Pricing from "@/components/pricing/Pricing_1"
import Gallery from "@/components/gallery/Gallery_1"

export const metadata = {
  title: 'Components - All',
  description: 'SEO SEO SEO SEO SEO',
};

export default function HomePage() {
  return (
      <main>
        <Features />
        <Gallery />
        <Pricing />
      </main>
  );
}
