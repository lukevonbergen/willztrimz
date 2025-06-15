'use client';

import { useState } from 'react';

export default function FooterAdvanced() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-black text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h3 className="text-2xl font-bold mb-4">Your Company</h3>
          <p className="text-gray-400 mb-6">
            We build fast, beautiful sites that convert. No fluff, just results.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">🌐</a>
            <a href="#" className="hover:text-white">🐦</a>
            <a href="#" className="hover:text-white">📷</a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Join Our Newsletter</h4>
          <p className="text-gray-400 mb-4">
            Get updates on new templates and features.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
              alert("Thanks for subscribing!");
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="px-4 py-2 rounded-md text-black w-full"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Your Company. Built with precision.
      </div>
    </footer>
  );
}
