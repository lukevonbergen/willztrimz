export default function ServicesSectionIntermediate() {
  const services = [
    {
      icon: '📄',
      title: 'Landing Pages',
      description: 'High-converting pages built fast — perfect for promotions, products, or lead capture.',
    },
    {
      icon: '🎨',
      title: 'Portfolio Sites',
      description: 'Responsive, elegant sites that showcase your work and personal brand with clarity.',
    },
    {
      icon: '🏢',
      title: 'Business Websites',
      description: 'Credible, conversion-optimised websites for small businesses and local services.',
    },
    {
      icon: '🛠️',
      title: 'Custom Builds',
      description: 'Need something specific? We tailor solutions to your niche and tools.',
    },
  ];

  return (
    <section className="bg-gray-50 py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Smart, Simple Site Packages</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          We build what works — fast, clean, and designed to make you look good.
        </p>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          {services.map(({ icon, title, description }, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-lg border hover:shadow transition"
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
              <p className="text-gray-600 mb-4">{description}</p>
              <a
                href="#contact"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}