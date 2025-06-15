import NavBarIntermediate from "@/components/navigation/Nav_2";
import NavBarAdvanced from "@/components/navigation/Nav_3";
import Footer from "@/components/footer/Footer_1";
import Banner from "@/components/banner/Banner_1";

export default function TrimsLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <NavBarAdvanced />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
