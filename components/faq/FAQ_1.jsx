'use client';

import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How long does it take to launch my website?',
      answer: 'We aim to get your site live within 48 hours of finalising content and requirements.',
    },
    {
      question: 'Can I update the website myself?',
      answer: 'Yes — we build sites to be simple and easy to maintain with no technical knowledge.',
    },
    {
      question: 'What if I need something custom?',
      answer: 'We’re happy to accommodate custom requests or integrate specific tools you need.',
    },
  ];

  return (
    <section className="bg-gray-50 py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Frequently Asked Questions</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12">Still got questions? Here are the most common ones we hear.</p>

        <div className="space-y-6 text-left">
          {faqs.map(({ question, answer }, i) => (
            <div key={i} className="border rounded-lg bg-white">
              <button
                className="w-full text-left px-6 py-4 font-medium text-gray-800 flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {question}
                <span>{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-gray-600">{answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
