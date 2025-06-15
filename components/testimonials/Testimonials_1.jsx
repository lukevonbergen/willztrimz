export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">What People Are Saying</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          Real feedback from happy clients who’ve launched their sites with us.
        </p>

        <div className="grid md:grid-cols-3 gap-10 text-left">
          {[
            {
              quote: "Incredible speed. My site was live in 2 days and looks amazing on mobile.",
              name: "Sarah J.",
              title: "Local Bakery Owner",
            },
            {
              quote: "The design is clean, simple, and actually works for my business.",
              name: "Darren L.",
              title: "Personal Trainer",
            },
            {
              quote: "Way better than anything I built on Wix. Highly recommend.",
              name: "Aisha M.",
              title: "Freelance Copywriter",
            },
          ].map(({ quote, name, title }, i) => (
            <div key={i} className="p-6 bg-white rounded-lg border shadow-sm">
              <p className="text-gray-700 italic mb-4">“{quote}”</p>
              <div className="text-sm font-medium text-gray-900">{name}</div>
              <div className="text-xs text-gray-500">{title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
