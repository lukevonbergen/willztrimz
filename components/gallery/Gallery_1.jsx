'use client';

import { useState } from 'react';

const images = [
  { src: 'https://picsum.photos/seed/gallery1/800/600', alt: 'Placeholder image 1' },
  { src: 'https://picsum.photos/seed/gallery2/800/600', alt: 'Placeholder image 2' },
  { src: 'https://picsum.photos/seed/gallery3/800/600', alt: 'Placeholder image 3' },
  { src: 'https://picsum.photos/seed/gallery4/800/600', alt: 'Placeholder image 4' },
  { src: 'https://picsum.photos/seed/gallery5/800/600', alt: 'Placeholder image 5' },
  { src: 'https://picsum.photos/seed/gallery6/800/600', alt: 'Placeholder image 6' },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          The Gallery
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          Pictures (click to enlarge)
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map(({ src, alt }, i) => (
            <div
              key={i}
              className="cursor-pointer group relative overflow-hidden rounded-lg border hover:shadow-md transition"
              onClick={() => setSelectedImage({ src, alt })}
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full px-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full rounded-lg shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
