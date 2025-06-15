export default function AboutUsIntermediate() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
            We Build Fast, Functional Websites That Actually Convert
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Our team isn’t here to sell you a pretty homepage — we’re here to launch lean, modern websites that deliver results. Whether you're a startup founder or a local business owner, you get a clean, custom site built to drive action.
          </p>
          <ul className="text-gray-600 space-y-3">
            <li>✅ 48-hour average turnaround</li>
            <li>✅ Clean, scalable code</li>
            <li>✅ Mobile-first design by default</li>
            <li>✅ Zero bullshit, zero lock-in</li>
          </ul>
        </div>

        {/* Image */}
        <div className="md:w-1/2">
          <img
            src="https://source.unsplash.com/featured/?web,design,team"
            alt="About our team"
            className="rounded-xl shadow-lg w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}
