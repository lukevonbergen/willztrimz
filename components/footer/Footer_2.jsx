export default function FooterIntermediate() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm text-gray-600">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">Willz Trimz</h3>
          <p className="text-gray-600">
            The best trim you'll ever get.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#gallery" className="hover:text-gray-900 transition">Gallery</a></li>
            <li><a href="#pricing" className="hover:text-gray-900 transition">Pricing</a></li>
            <li><a href="#contact" className="hover:text-gray-900 transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Resources</h4>
          <ul className="space-y-2">
            <li><a href="/blog" className="hover:text-gray-900 transition">Blog</a></li>
            <li><a href="/guides" className="hover:text-gray-900 transition">Guides</a></li>
            <li><a href="/terms" className="hover:text-gray-900 transition">Terms</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Follow me</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:opacity-80 transition">🌐</a>
            <a href="#" className="hover:opacity-80 transition">🐦</a>
            <a href="#" className="hover:opacity-80 transition">📷</a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-12">
        &copy; {new Date().getFullYear()} Willz Trimz. All rights reserved.
      </div>
    </footer>
  );
}
