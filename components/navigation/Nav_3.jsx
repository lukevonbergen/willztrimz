'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdvancedNavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRefs = useRef({});

  useEffect(() => {
    function handleClickOutside(event) {
      for (const key in dropdownRefs.current) {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          setDropdownOpen(null);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/product', label: 'Product' },
    { href: '/services', label: 'Our services' },
    { href: '/integrations', label: 'Integrations' },
  ];

  const dropdowns = {
    customers: {
      label: 'Customers',
      content: (
        <div className="w-80 p-6">
          <h3 className="text-md font-semibold mb-4 text-black">How our customers are simplifying operations</h3>
          <div className="space-y-3 text-sm">
            {['GAIL\'s', 'Honest Burgers', 'LEON', 'YO!', 'More customer stories'].map((name, idx) => (
              <Link key={idx} href={`#`} className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 text-gray-700">
                {name} <span className="text-lg">→</span>
              </Link>
            ))}
          </div>
        </div>
      )
    },
    resources: {
      label: 'Resources',
      content: (
        <div className="py-4 px-4 w-40 space-y-2">
          <Link href="/resources/blog" className="block text-sm hover:text-black">Blog</Link>
          <Link href="/resources/guides" className="block text-sm hover:text-black">Guides</Link>
          <Link href="/resources/tools" className="block text-sm hover:text-black">Tools</Link>
        </div>
      )
    }
  };

  return (
    <header className="w-full py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          <span className="text-indigo-600">▰▰</span> Brand
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`hover:text-black transition ${
                pathname === href ? 'text-black font-semibold' : ''
              }`}
            >
              {label}
            </Link>
          ))}

          {Object.entries(dropdowns).map(([key, { label, content }]) => (
            <div key={key} className="relative" ref={(el) => (dropdownRefs.current[key] = el)}>
              <button
                onClick={() => setDropdownOpen(dropdownOpen === key ? null : key)}
                className="hover:text-black transition"
              >
                {label} ▼
              </button>
              {dropdownOpen === key && (
                <div className="absolute right-0 mt-2 rounded-xl bg-white border shadow-xl z-50">
                  {content}
                </div>
              )}
            </div>
          ))}

          <Link
            href="/about"
            className={`hover:text-black transition ${
              pathname === '/about' ? 'text-black font-semibold' : ''
            }`}
          >
            About us
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <input type="text" placeholder="Search" className="text-sm border px-3 py-1.5 rounded-md" />
          </div>
          <Link
            href="/demo"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm font-semibold shadow"
          >
            Book a demo
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-2xl text-gray-800">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm px-6 py-4 space-y-4">
          {[...navLinks, { href: '/about', label: 'About us' }].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-sm font-medium text-gray-700 hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {Object.entries(dropdowns).map(([key, { label, content }]) => (
            <div key={key}>
              <span className="text-xs uppercase text-gray-500">{label}</span>
              <div className="mt-2">{content}</div>
            </div>
          ))}

          <Link
            href="/demo"
            className="block text-center mt-4 bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-semibold shadow hover:bg-indigo-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book a demo
          </Link>
        </div>
      )}
    </header>
  );
}
