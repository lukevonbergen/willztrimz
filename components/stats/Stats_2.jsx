export default function StatsSectionIntermediate() {
  const stats = [
    {
      label: 'Websites Launched',
      value: '150+',
      icon: '🚀',
    },
    {
      label: 'Avg. Delivery Time',
      value: '48h',
      icon: '⏱️',
    },
    {
      label: 'Client Satisfaction',
      value: '99%',
      icon: '💬',
    },
    {
      label: 'Code Ownership',
      value: '100%',
      icon: '🧑‍💻',
    },
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight text-gray-900">
          Built for Impact
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ label, value, icon }, i) => (
            <div
              key={i}
              className="bg-gray-50 p-6 rounded-lg border text-center hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}