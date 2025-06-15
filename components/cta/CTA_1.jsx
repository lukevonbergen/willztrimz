export default function CallToAction() {
  return (
    <section className="bg-black text-white py-20 px-6 md:px-12 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Ready to Launch Something Great?
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Let’s build a fast, beautiful website that actually works for your business.
        </p>
        <a
          href="/start"
          className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition"
        >
          Get Started Today
        </a>
      </div>
    </section>
  );
}
