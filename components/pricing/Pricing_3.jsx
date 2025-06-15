'use client';

import { useState } from 'react';

export default function PricingAdvanced() {
  const [mode, setMode] = useState('one-time');

  const plans = {
    'one-time': [
      {
        name: 'Essentials',
        price: '£149',
        desc: 'One-page setup with clean visuals.',
        features: ['Responsive layout', 'Basic SEO', 'Fast launch'],
      },
      {
        name: 'Full Site',
        price: '£249',
        desc: 'Best for small businesses or portfolios.',
        features: ['Multi-page site', 'Mobile-first design', 'SEO & speed'],
      },
    ],
    monthly: [
      {
        name: 'Ongoing Care',
        price: '£29/mo',
        desc: 'Site hosting + maintenance.',
        features: ['Hosting included', 'Monthly edits', 'Speed monitoring'],
      },
      {
        name: 'Growth Plan',
        price: '£59/mo',
        desc: 'For actively scaling businesses.',
        features: ['Priority edits', 'SEO reports', 'Feature requests'],
      },
    ],
  };

  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Flexible Pricing</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Choose one-time build or ongoing monthly support.
        </p>

        <div className="flex justify-center mb-8">
          <button
            className={`px-4 py-2 rounded-l border ${
              mode === 'one-time'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setMode('one-time')}
          >
            One-Time
          </button>
          <button
            className={`px-4 py-2 rounded-r border ${
              mode === 'monthly'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setMode('monthly')}
          >
            Monthly
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          {plans[mode].map(({ name, price, desc, features }, i) => (
            <div key={i} className="p-8 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">{name}</h3>
              <p className="text-4xl font-bold text-green-600 mb-4">{price}</p>
              <p className="text-gray-600 mb-6">{desc}</p>

              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                {features.map((f, j) => (
                  <li key={j}>✅ {f}</li>
                ))}
              </ul>

              <a
                href="#contact"
                className="block text-center bg-black text-white px-6 py-2 rounded-md font-medium hover:opacity-90 transition"
              >
                Let’s Talk
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
