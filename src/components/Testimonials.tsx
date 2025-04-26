
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Michael S.",
      role: "Professional Trader",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "Quantis provides the best trading conditions I've experienced in my 7 years of trading. The execution speed is unmatched and their support team is always responsive.",
      rating: 5
    },
    {
      name: "Sarah L.",
      role: "Day Trader",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "I've been using Quantis for over 2 years now. The platform is intuitive and their educational resources have helped me improve my trading strategy significantly.",
      rating: 5
    },
    {
      name: "David K.",
      role: "Swing Trader",
      image: "https://randomuser.me/api/portraits/men/62.jpg",
      content: "The spreads are consistently low and the withdrawal process is hassle-free. I've recommended Quantis to several of my colleagues who are equally satisfied.",
      rating: 4
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our <span className="text-quantis-purple">Traders</span> Say
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied traders who have chosen Quantis for their trading journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
