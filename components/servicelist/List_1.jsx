export default function ServicePriceList() {
  const services = [
    {
      category: 'Haircuts',
      items: [
        { name: 'Men’s Cut', price: '£25' },
        { name: 'Women’s Cut & Blow Dry', price: '£40' },
        { name: 'Children (under 12)', price: '£15' },
      ],
    },
    {
      category: 'Styling & Colour',
      items: [
        { name: 'Full Colour', price: '£60' },
        { name: 'Highlights', price: '£75' },
        { name: 'Blow Dry', price: '£20' },
      ],
    },
    {
      category: 'Nails',
      items: [
        { name: 'Classic Manicure', price: '£25' },
        { name: 'Gel Polish', price: '£30' },
        { name: 'Nail Art Add-on', price: 'from £5' },
      ],
    },
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Our Services</h2>
        <p className="text-lg text-gray-600 mb-12">Transparent pricing, no surprises. Book what you need, when you need it.</p>
        
        <div className="space-y-12 text-left">
          {services.map(({ category, items }) => (
            <div key={category}>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">{category}</h3>
              <ul className="space-y-3">
                {items.map(({ name, price }) => (
                  <li key={name} className="flex justify-between text-gray-700">
                    <span>{name}</span>
                    <span className="font-medium">{price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
