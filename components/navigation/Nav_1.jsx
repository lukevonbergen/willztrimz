export default function Navbar() {
  return (
    <header className="w-full py-6 px-6 md:px-12 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight text-gray-900">
          NavBar One
        </a>

        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <a href="#features" className="hover:text-black transition">Link 1</a>
          <a href="#pricing" className="hover:text-black transition">Link 2</a>
          <a href="#examples" className="hover:text-black transition">Link 3</a>
          <a href="#contact" className="hover:text-black transition">Link 4</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:opacity-90 transition"
          >
            Nav Button
          </a>
        </div>

        <div className="md:hidden">
          {/* Mobile menu toggle placeholder (can be a hamburger icon if needed) */}
          <button className="text-gray-800">☰</button>
        </div>
      </div>
    </header>
  );
}
