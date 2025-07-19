import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Printer, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

function Footer() {
  const navigate = useNavigate();

  const handleFeedbackClick = (e) => {
    e.preventDefault();
    navigate('/');
    // Wait for navigation to complete, then scroll to feedback
    setTimeout(() => {
      const element = document.getElementById('feedback');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <footer className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4 text-center md:text-left lg:max-w-sm">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <h3 className="text-2xl font-bold">AR Prints</h3>
            </div>
            <p className="text-red-100 text-sm leading-relaxed mb-4">
              Creating beautiful memories, one print at a time. Handcrafted photocards, instax prints, and photo strips made with love.
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-1 text-red-100">
              <span className="text-sm">Made with</span>
              <Heart className="h-4 w-4 fill-current" />
              <span className="text-sm">since 2024</span>
            </div>
          </div>

          {/* Links Section - Grouped */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Quick Links */}
            <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">
              <Sparkles className="h-5 w-5 inline-block mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Pricing", path: "/pricing" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-red-100 hover:text-white transition-colors duration-200 text-sm hover:underline block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleFeedbackClick}
                  className="text-red-100 hover:text-white transition-colors duration-200 text-sm hover:underline block py-1 w-full text-center md:text-left"
                >
                  Feedbacks
                </button>
              </li>
            </ul>
          </div>

          {/* Products */}
            <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">
              <Printer className="h-5 w-5 inline-block mr-2" />
              Our Products
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Photo Cards", path: "/products" },
                { name: "Instax Prints", path: "/products" },
                { name: "Photo Strips", path: "/products" },
                { name: "Custom Designs", path: "/products" },
                { name: "Gift Sets", path: "/products" },
                { name: "Bulk Orders", path: "/products" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-red-100 hover:text-white transition-colors duration-200 text-sm hover:underline block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
            <div className="space-y-3 text-center md:text-left">
              <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2">
              
              {/* Email */}
                <li className="flex items-center justify-center md:justify-start space-x-2 py-1">
                <div className="bg-white/20 p-2 rounded-full">
                  <Mail className="h-4 w-4" />
                </div>
                <a 
                  href="mailto:arprintsservices@gmail.com" 
                  className="text-sm font-medium hover:underline text-white"
                >
                  arprintsservices@gmail.com
                </a>
              </li>

              {/* Phone */}
                <li className="flex items-center justify-center md:justify-start space-x-2 py-1">
                <div className="bg-white/20 p-2 rounded-full">
                  <Phone className="h-4 w-4" />
                </div>
                <a 
                  href="tel:+639606592742" 
                  className="text-sm font-medium hover:underline text-white"
                >
                  +63 960 659 2742
                </a>
              </li>

              {/* Location */}
                <li className="flex items-center justify-center md:justify-start space-x-2 py-1">
                <div className="bg-white/20 p-2 rounded-full">
                  <MapPin className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-white">
                  Daet, Philippines
                </p>
              </li>
              
            </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup
        <div className="mt-12 pt-8 border-t border-red-400/30">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <h4 className="text-xl font-semibold">Stay Updated! ✨</h4>
              <p className="text-red-100 text-sm max-w-md mx-auto">
                Get the latest updates on new products, special offers, and printing tips delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                />
                <button className="px-6 py-2 bg-white text-red-600 rounded-full font-medium hover:bg-red-50 transition-colors duration-200 text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>*/}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-red-400/30 bg-red-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            
            {/* Copyright */}
            <div className="text-center lg:text-left order-2 lg:order-1 mt-6 md:mt-10">
              <p className="text-red-100 text-sm">
                © 2024 AR Prints. All rights reserved. | Made with love for your memories 💕
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center space-x-4 order-1 lg:order-2">
              <span className="text-red-100 text-sm">Follow us:</span>
              <div className="flex space-x-3">
                <a
                  href="https://www.instagram.com/a.r.prints_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors duration-200 group"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61576666357859"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors duration-200 group"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                </a>
                <a
                  href="https://www.tiktok.com/@a.r.prints"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors duration-200 group"
                  aria-label="TikTok"
                >
                  <svg className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Legal Links
            <div className="flex space-x-4 text-sm order-3 lg:order-3">
              <Link to="/privacy" className="text-red-100 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-red-100 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
            </div> */}
            
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 