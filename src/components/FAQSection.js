import { Mail, MapPin, Clock, Facebook, Heart } from "lucide-react";
import React, { useState } from "react";

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="space-y-4">{React.Children.map(children, (child, i) =>
      React.cloneElement(child, {
        open: openIndex === i,
        onToggle: () => setOpenIndex(openIndex === i ? null : i),
      })
    )}</div>
  );
}

function AccordionItem({ value, open, onToggle, children, className = "" }) {
  const [trigger, ...rest] = React.Children.toArray(children);
  return (
    <div className={`bg-white rounded-lg shadow-sm border-0 ${className}`.trim()}>
      {React.cloneElement(trigger, { open, onToggle })}
      {open && rest}
    </div>
  );
}

function AccordionTrigger({ children, open, onToggle, className = "" }) {
  return (
    <button
      className={`w-full flex justify-between items-center px-6 py-4 text-left text-xl font-semibold text-gray-800 hover:no-underline hover:text-pink-600 transition-colors ${className}`}
      onClick={onToggle}
      aria-expanded={open}
    >
      <span>{children}</span>
      <svg className={`ml-2 h-5 w-5 transition-transform duration-200 ${open ? 'rotate-90 text-pink-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function AccordionContent({ children, className = "" }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

export default function FAQSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to know about ordering your beautifully printed memories
          </p>
        </div>
        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg md:text-xl">How to order?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">1</div>
                    <div className="text-left md:text-left">
                      <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg text-left md:text-left">Pick Your Favorite Design</h4>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base text-left md:text-left">Browse our collection on the website, choose the design you want, and message us to request the order form.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">2</div>
                    <div className="text-left md:text-left">
                      <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg text-left md:text-left">Complete the Order Form</h4>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base text-left md:text-left">Fill in all required details (size, quantity, special instructions, etc.) and send the completed form back to us via Messenger.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">3</div>
                    <div className="text-left md:text-left">
                      <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg text-left md:text-left">Send Your Photos</h4>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base text-left md:text-left">Email your photo files to <span className="font-semibold text-pink-600">arprintsservices@gmail.com</span>. Be sure to attach high-resolution images for best print quality.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">4</div>
                    <div className="text-left md:text-left">
                      <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg text-left md:text-left">Make a 50% Down Payment</h4>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base text-left md:text-left">To secure your order, please send a 50% deposit via GCash. This payment is strictly required to avoid order cancellation and is non‑refundable.</p>
                    </div>
                  </div>
                  <div className="mt-6 p-3 bg-pink-50 border-l-4 border-pink-500 rounded-r-lg text-left md:text-left">
                    <p className="text-pink-800 font-semibold flex items-center gap-2 text-sm md:text-base text-left md:text-left">
                      <MapPin className="h-4 w-4" />
                      Note: Pickup only.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg md:text-xl">Where can I pick up my order?</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="text-left md:text-left">
                    <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg text-left md:text-left">Pickup Location:</h4>
                    <p className="text-gray-600 leading-relaxed mb-2 text-sm md:text-base text-left md:text-left">Magana Apartment, Magallanes Iraya, Daet, Camarines Norte</p>
                    <p className="text-gray-500 text-xs md:text-sm text-left md:text-left">We will message you once your order is ready for pickup.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg md:text-xl">How many days does it take for orders?</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="text-left md:text-left">
                    <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg text-left md:text-left">Processing Time:</h4>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base text-left md:text-left">Allow 1–2 days for processing—updates will be sent via Messenger or email.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg md:text-xl">Have more questions?</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Facebook className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="text-left md:text-left">
                    <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg text-left md:text-left">Get in Touch:</h4>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base text-left md:text-left">If you have further questions, visit our Facebook page for more information and support.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* Contact Banner Below FAQ */}
        <div className="max-w-6xl mx-auto px-6 mt-12">
          <div className="w-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between p-6 md:p-10 gap-6 text-center md:text-left">
            {/* Left Column: Text */}
            <div className="flex-1 flex flex-col items-center md:items-start">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <Facebook className="hidden md:inline-block h-7 w-7 md:h-9 md:w-9 text-white" />
                <span className="font-bold text-xl md:text-3xl text-white">Contact Us on Facebook</span>
              </div>
              <p className="text-pink-100 text-sm md:text-base">We're here to help make your memories beautifully printed!</p>
            </div>
            {/* Right Column: Button */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
              <a
                href="https://www.facebook.com/arprintservices/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-pink-600 font-semibold px-7 py-3 rounded-lg shadow hover:bg-pink-50 transition-colors text-base md:text-lg text-center w-full md:w-auto"
              >
                Message AR Prints
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 