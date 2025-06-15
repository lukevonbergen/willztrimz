export default function ServicesSection() {
  const services = [
    {
      title: 'Landing Pages',
      description: 'High-converting pages built fast — perfect for promotions or lead capture.',
    },
    {
      title: 'Portfolio Sites',
      description: 'Elegant, responsive sites for creatives, freelancers, or personal branding.',
    },
    {
      title: 'Business Websites',
      description: 'Clean, trustworthy web presence that builds authority and converts customers.',
    },
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">What We Build</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          We focus on speed, clarity, and simplicity. Here’s what we deliver best.
        </p>

        <div className="grid md:grid-cols-3 gap-10 text-left">
          {services.map(({ title, description }, i) => (
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
