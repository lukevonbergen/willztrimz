export default function AboutUs() {
  return (
    <section className="bg-gray-50 py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
          Built to Deliver, Not Just Design
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
          We’re a lean team of designers, developers, and problem-solvers who care about one thing: 
          making websites that actually do something. Fast to launch, easy to manage, and always focused 
          on helping your business grow — no bloat, no bullshit.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
            <p className="text-gray-600 max-w-sm">
              To help small businesses and startups launch high-performance websites that are built to convert,
              not just look pretty.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Edge</h3>
            <p className="text-gray-600 max-w-sm">
              We move fast, keep things simple, and always deliver what we promise — typically within 48 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
