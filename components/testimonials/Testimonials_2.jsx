export default function TestimonialsIntermediate() {
  const testimonials = [
    {
      name: "Ellie B.",
      title: "Marketing Consultant",
      quote: "The site launched in under 48 hours and my clients love it.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Jason K.",
      title: "Gym Owner",
      quote: "I was sceptical, but this outperformed my old WordPress site by far.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=17",
    },
    {
      name: "Maria T.",
      title: "Wedding Photographer",
      quote: "Super fast turnaround and the design actually fits my brand.",
      rating: 4,
      avatar: "https://i.pravatar.cc/100?img=32",
    },
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Our Clients Love the Results
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          Straight from the people we’ve worked with.
        </p>

        <div className="grid md:grid-cols-3 gap-10 text-left">
          {testimonials.map(({ name, title, quote, rating, avatar }, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-lg border shadow hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-medium text-gray-900">{name}</div>
                  <div className="text-xs text-gray-500">{title}</div>
                </div>
              </div>
              <div className="flex gap-1 text-yellow-500 text-sm mb-3">
                {"★".repeat(rating)}{"☆".repeat(5 - rating)}
              </div>
              <p className="text-gray-700 italic">“{quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
