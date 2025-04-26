
import React from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-48 bg-quantis-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-48 bg-quantis-blue/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block py-1.5 px-3 rounded-full bg-quantis-purple/10 text-quantis-purple font-medium text-sm mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
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
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-8 text-lg italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="h-12 w-12 rounded-full mr-4 object-cover border-2 border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className={`h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-quantis-purple' : 'bg-gray-300'}`}
                ></div>
              ))}
            </div>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
