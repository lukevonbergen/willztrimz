export default function HowToFindUs() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            How to Find Us
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Our studio is located in the heart of London, just a short walk from Liverpool Street Station.
          </p>
          <p className="text-md text-gray-600">
            123 Startup Lane<br />
            Shoreditch, London EC2A 4DP<br />
            <br />
            <strong>Opening Hours:</strong><br />
            Mon–Fri: 9:00am – 6:00pm<br />
            Sat–Sun: Closed
          </p>
        </div>

        {/* Google Map Embed */}
        <div className="md:w-1/2 w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-md">
          <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed/v1/place?q=16+the+rosary+high+wycombe&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
