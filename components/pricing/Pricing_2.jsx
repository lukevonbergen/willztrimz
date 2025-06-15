export default function PricingIntermediate() {
  const plans = [
    {
      name: "Starter",
      price: "£149",
      description: "For one-pagers and simple launches.",
      features: [
        "Responsive landing page",
        "48h delivery",
        "Basic SEO setup",
        "One round of changes",
      ],
      highlight: false,
    },
    {
      name: "Launch Package",
      price: "£249",
      description: "Most popular — full site with polish.",
      features: [
        "Up to 5 pages (Home, About, etc.)",
        "Mobile-first design",
        "Performance & SEO",
        "Post-launch tweaks",
      ],
      highlight: true,
    },
    {
      name: "Custom Build",
      price: "£499+",
      description: "Bespoke builds, integrations, or larger scope.",
      features: [
        "Full brand integration",
        "Custom layouts/components",
        "Optional booking or contact tools",
        "One-on-one planning session",
      ],
      highlight: false,
    },
  ];

  return (
    <section className="bg-gray-50 py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Pricing That Works For You
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          Choose the package that matches your goals.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {plans.map(({ name, price, description, features, highlight }, i) => (
            <div
              key={i}
              className={`p-8 border rounded-lg shadow-sm transition ${
                highlight
                  ? 'bg-white border-green-500 ring-2 ring-green-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{name}</h3>
              <p className="text-4xl font-bold text-green-600 mb-4">{price}</p>
              <p className="text-gray-600 mb-6">{description}</p>

              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                {features.map((f, j) => (
                  <li key={j}>✅ {f}</li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center rounded-md px-6 py-2 font-medium transition ${
                  highlight
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Select
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
