export default function Pricing() {
  return (
    <section className="bg-gray-50 py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          One flat rate. No hidden fees. No bullshit.
        </p>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10">
          <h3 className="text-2xl font-semibold mb-4">Launch Package</h3>
          <p className="text-5xl font-bold text-green-600 mb-4">£249</p>
          <p className="text-gray-600 mb-8">Everything you need to get online fast and make a real impression.</p>

          <ul className="text-left text-gray-700 space-y-3 mb-8">
            <li>✅ Fully responsive, mobile-first site</li>
            <li>✅ Tailored to your business or brand</li>
            <li>✅ Live and deployed within 48 hours</li>
            <li>✅ SEO & performance optimised</li>
            <li>✅ Clean, reusable code (yours to keep)</li>
            <li>✅ Support for small changes post-launch</li>
          </ul>

          <a
            href="#contact"
            className="inline-block bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-md font-medium transition"
          >
            Let’s Build Your Site
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Want something more custom? <a href="#contact" className="underline">Drop us a message</a>.
        </p>
      </div>
    </section>
  );
}
