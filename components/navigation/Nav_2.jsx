'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBarV2() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="w-full py-5 px-6 md:px-12 border-b border-gray-200 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          NavBar Two
        </Link>

        {/* Desktop Navigation */}
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

          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-black transition"
            >
              Resources ▼
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                <Link href="/resources/blog" className="block px-4 py-2 hover:bg-gray-100">Blog</Link>
                <Link href="/resources/guides" className="block px-4 py-2 hover:bg-gray-100">Guides</Link>
                <Link href="/resources/tools" className="block px-4 py-2 hover:bg-gray-100">Tools</Link>
              </div>
            )}
          </div>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/start"
            className="bg-black text-white px-5 py-2 rounded-md text-sm font-semibold shadow hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-800 text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <div className="px-6 py-4 space-y-3 text-sm text-gray-700">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block hover:text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div className="border-t border-gray-200 pt-3">
              <span className="text-gray-500 uppercase text-xs">Resources</span>
              <div className="mt-2 space-y-2">
                <Link href="/resources/blog" className="block hover:text-black" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                <Link href="/resources/guides" className="block hover:text-black" onClick={() => setMobileMenuOpen(false)}>Guides</Link>
                <Link href="/resources/tools" className="block hover:text-black" onClick={() => setMobileMenuOpen(false)}>Tools</Link>
              </div>
            </div>

            <Link
              href="/start"
              className="block w-full mt-4 text-center bg-black text-white px-5 py-2 rounded-md text-sm font-semibold shadow hover:opacity-90 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
