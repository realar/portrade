import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  backgroundColor: string;
  circleColor: string;
  link: string;
}

export default function PromoBanner({
  title,
  subtitle,
  buttonText,
  image,
  backgroundColor,
  circleColor,
  link
}: PromoBannerProps) {
  return (
    <div className={`w-full rounded-2xl overflow-hidden ${backgroundColor} text-white relative shadow-lg`}>
      <div className="flex flex-col md:flex-row items-center justify-between pl-8 md:pl-16 relative z-10">
        
        {/* Left Content */}
        <div className="flex-1 max-w-lg mb-8 md:mb-0 z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{title}</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">{subtitle}</p>
          
          <Link 
            href={link} 
            className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
          >
            {buttonText}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {/* Right Image with Circle Background */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 flex items-center justify-center">
             {/* Circle Background */}
             <div className={`absolute inset-0 rounded-full ${circleColor} opacity-50 scale-250 md:scale-300`} />
             
             {/* Product Image */}
             <img 
               src={image} 
               alt={title} 
               className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
             />
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
    </div>
  );
}
