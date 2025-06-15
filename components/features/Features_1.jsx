export default function Features() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Everything You Need — Nothing You Don’t
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          We’ve stripped out the fluff and focused on what actually matters: speed, polish, and conversions.
        </p>

        <div className="grid md:grid-cols-3 gap-10 text-left">
          {[
            {
              title: "⚡ Lightning-Fast Delivery",
              description: "Get your website live in 48 hours — no waiting, no BS. We don’t waste your time.",
            },
            {
              title: "📱 Mobile-First Design",
              description: "Looks beautiful on every screen size. Optimised for real users, not just mockups.",
            },
            {
              title: "🎯 Built to Convert",
              description: "Each layout is designed to build trust and drive action — not just look pretty.",
            },
            {
              title: "🛠 Easy to Maintain",
              description: "Your site is simple, clean, and easy to tweak — no confusing CMS or bloatware.",
            },
            {
              title: "🔐 SEO & Speed Optimised",
              description: "We bake in performance best practices. Pages load instantly and rank faster.",
            },
            {
              title: "🧑‍💻 Code You Own",
              description: "No lock-in. You get clean, maintainable code that’s yours to scale or repurpose.",
            },
          ].map(({ title, description }, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-lg border hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
