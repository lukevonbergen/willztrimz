export default function CallToActionIntermediate() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{
          backgroundImage: "url('https://picsum.photos/1600/800?grayscale&blur=2')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90 z-10"></div>

      {/* Content */}
      <div className="relative z-20 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
          {/* Left Side - Text */}
          <div className="text-center md:text-left md:w-2/3">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Ready to Launch Something Great?
            </h2>
            <p className="text-lg text-gray-300">
              Build a stunning, fast, conversion-driven website — without the fluff. Get exactly what your business needs to grow online.
            </p>
          </div>

          {/* Right Side - CTA */}
          <div className="md:w-1/3 text-center md:text-right">
            <a
              href="/start"
              className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
