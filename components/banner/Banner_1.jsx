'use client';

import { useState } from 'react';

export default function BannerStrip() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-yellow-400 text-black text-sm py-2 px-6 flex justify-between items-center font-medium">
      <div className="max-w-7xl mx-auto flex-1 flex justify-center md:justify-between items-center flex-wrap gap-2">
        <span>
          🚀 Limited Offer: Book a haircut before 18th June for 10% off.
        </span>
        <a
          href="/#"
          className="underline hover:opacity-80 transition"
        >
          Book now
        </a>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-lg font-bold hover:opacity-70 transition"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
