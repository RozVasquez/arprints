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
        <div className="flex justify-center gap-4 mb-8">
          <a href="https://www.facebook.com/profile.php?id=61576666357859" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl text-blue-600 hover:text-blue-700 transition duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"></path></svg>
          </a>
          <a href="https://www.instagram.com/a.r.prints_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl text-pink-600 hover:text-pink-700 transition duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@a.r.prints" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl text-gray-800 hover:text-gray-900 transition duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
          </a>
        </div>
        <p className="text-pink-200 text-sm">&copy; 2024 AR Prints. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer; 