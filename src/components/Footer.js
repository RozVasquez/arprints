import React from 'react';

function Footer() {
  return (
    <footer id="footer" className="bg-pink-600 text-white py-12">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold mb-4">AR Prints</h3>
        <div className="space-y-4 md:space-y-0 md:flex md:justify-center md:gap-8 mb-6 text-pink-100">
          <p className="flex items-center justify-center gap-2"><span>📍</span> Daet, Camarines Norte</p>
          <a href="mailto:arprintsservices@gmail.com" className="flex items-center justify-center gap-2 hover:text-white transition duration-300"><span>📧</span> arprintsservices@gmail.com</a>
          <p className="flex items-center justify-center gap-2"><span>📱</span> +639606592742</p>
        </div>
        <div className="flex justify-center mb-8">
          <a href="https://www.facebook.com/profile.php?id=61576666357859" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl text-blue-600 hover:text-blue-700 transition duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"></path></svg>
          </a>
        </div>
        <p className="text-pink-200 text-sm">&copy; 2024 AR Prints. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer; 