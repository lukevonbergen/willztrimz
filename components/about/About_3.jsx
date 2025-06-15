export default function AboutUsAdvanced() {
  return (
    <section className="bg-gray-50 py-28 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Not Just Another Web Agency
          </h2>
          <p className="text-lg text-gray-600">
            We’re a small, agile crew that moves fast, listens closely, and gives a damn about what we build. We partner with founders and operators to create websites that make sense — and make money.
          </p>
        </div>

        {/* Identity Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Who We Are</h3>
            <p className="text-gray-700 mb-4">
              Designers, developers, and digital strategists who’ve worked in startups, SaaS, and creative studios. We’ve seen the bloated agency process — and we’ve built something sharper.
            </p>
            <p className="text-gray-600">
              No inflated quotes. No endless feedback loops. Just fast builds, clear pricing, and performance-first design.
            </p>
          </div>
          <img
            src="https://source.unsplash.com/featured/?startup,team,remote"
            alt="Our team"
            className="rounded-xl shadow-md w-full h-auto object-cover"
          />
        </div>

        {/* Core Values */}
        <div>
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-12">
            What We Believe In
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-xl font-semibold mb-2">Speed Over Perfection</h4>
              <p className="text-gray-600">We’d rather ship fast and iterate than delay waiting on “perfect.” Time kills momentum.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">Built for Conversion</h4>
              <p className="text-gray-600">A website is a tool, not a piece of art. Everything we do is geared toward outcomes.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">No Bullshit</h4>
              <p className="text-gray-600">We’re upfront about what we can (and can’t) do — and we deliver what we promise.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
