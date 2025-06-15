'use client';

import { useState } from 'react';

const serviceData = {
  Haircuts: [
    { name: 'Men’s Cut', price: '£25', duration: '30 mins', desc: 'Tailored to your style and finished with product.' },
    { name: 'Women’s Cut & Blow Dry', price: '£40', duration: '60 mins', desc: 'Full cut and style with blow-dry finish.' },
    { name: 'Children (under 12)', price: '£15', duration: '20 mins', desc: 'Gentle, quick cuts for kids.' },
  ],
  Nails: [
    { name: 'Classic Manicure', price: '£25', duration: '30 mins', desc: 'Trim, file, buff and polish.' },
    { name: 'Gel Polish', price: '£30', duration: '40 mins', desc: 'Long-lasting finish with colour of choice.' },
    { name: 'Nail Art Add-on', price: 'from £5', duration: 'Varies', desc: 'Custom designs to elevate your look.' },
  ],
  'Styling & Colour': [
    { name: 'Full Colour', price: '£60', duration: '90 mins', desc: 'Professional full-head permanent colour.' },
    { name: 'Highlights', price: '£75', duration: '2 hrs', desc: 'Subtle to bold — customised for your tone.' },
    { name: 'Blow Dry', price: '£20', duration: '30 mins', desc: 'Volume and polish for any occasion.' },
  ],
};

export default function ServicePriceListAdvanced() {
  const categories = Object.keys(serviceData);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Services & Pricing</h2>
        <p className="text-lg text-gray-600 mb-10">Explore our full range of treatments by category.</p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                activeCategory === category ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services */}
        <div className="space-y-8 text-left">
          {serviceData[activeCategory].map(({ name, price, duration, desc }) => (
            <div
              key={name}
              className="flex flex-col md:flex-row md:items-start md:justify-between border-b pb-6"
            >
              <div className="md:w-2/3">
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{name}</h4>
                <p className="text-sm text-gray-600 mb-1">{desc}</p>
                <p className="text-sm text-gray-500">{duration}</p>
              </div>
              <div className="text-right md:text-left mt-4 md:mt-0">
                <p className="text-lg font-bold text-gray-800 mb-2">{price}</p>
                <a
                  href="/book"
                  className="inline-block px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:opacity-90 transition"
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
