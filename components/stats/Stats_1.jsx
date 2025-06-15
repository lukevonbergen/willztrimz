export default function StatsSection() {
  const stats = [
    { label: 'Websites Launched', value: '150+' },
    { label: 'Avg. Delivery Time', value: '48h' },
    { label: 'Client Satisfaction', value: '99%' },
  ];

  return (
    <section className="bg-black text-white py-20 px-6 md:px-12 border-t border-gray-900">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight">Results That Matter</h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {stats.map(({ label, value }, i) => (
            <div key={i}>
              <div className="text-4xl font-extrabold">{value}</div>
              <div className="text-sm text-gray-400 mt-2">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
