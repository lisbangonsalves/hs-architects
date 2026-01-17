"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    message: "",
  });
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSent(true);
        setFormData({ email: "", phone: "", message: "" });
        setTimeout(() => {
          setShowModal(false);
          setSent(false);
        }, 2000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    if (mapInstanceRef.current) return;
    if (!mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      
      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Wait a bit for CSS to load
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create map
      const map = L.map(mapRef.current, {
        center: [19.076, 72.87],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      });

      // Add dark tile layer (CartoDB Dark Matter - no labels version)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Custom white circle marker
      const markerIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      // Add marker at office location
      L.marker([19.1162, 72.8319], { icon: markerIcon }).addTo(map);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch("/api/contact");
        if (response.ok) {
          const data = await response.json();
          setContact(data);
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  // Format phone for tel: link (remove spaces and special chars)
  const phoneLink = contact.phone?.replace(/[\s\-\(\)]/g, "") || "";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-32 sm:pt-40">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {/* Title */}
          <h1 className="uppercase tracking-[0.2em] text-2xl sm:text-3xl font-medium text-black mb-16 sm:mb-24">
            Contact
          </h1>

          {loading ? (
            <div className="animate-pulse space-y-8">
              <div className="h-6 bg-gray-100 rounded w-48"></div>
              <div className="h-6 bg-gray-100 rounded w-40"></div>
              <div className="h-6 bg-gray-100 rounded w-32"></div>
            </div>
          ) : (
            <>
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                {/* Email */}
                {contact.email && (
                  <div>
                    <p className="uppercase tracking-[0.15em] text-xs text-gray-400 mb-3">
                      Email
                    </p>
                    <a 
                      href={`mailto:${contact.email}`} 
                      className="text-lg sm:text-xl text-gray-800 hover:text-black transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}

                {/* Phone */}
                {contact.phone && (
                  <div>
                    <p className="uppercase tracking-[0.15em] text-xs text-gray-400 mb-3">
                      Phone
                    </p>
                    <a 
                      href={`tel:${phoneLink}`} 
                      className="text-lg sm:text-xl text-gray-800 hover:text-black transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}

                {/* Address */}
                {contact.address && (
                  <div className="md:col-span-2 mt-4">
                    <p className="uppercase tracking-[0.15em] text-xs text-gray-400 mb-3">
                      Studio
                    </p>
                    <p className="text-lg sm:text-xl text-gray-800 leading-relaxed">
                      {contact.address}
                    </p>
                  </div>
                )}
              </div>

              {/* Divider & Note */}
              {contact.note && (
                <>
                  <div className="border-t border-gray-200 my-16 sm:my-24"></div>
                  <p className="text-gray-500 text-sm max-w-md">
                    {contact.note}
                  </p>
                </>
              )}

              {/* Message Us Button */}
              <div className="mt-12 sm:mt-16">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-gray-800 hover:text-black transition-colors group"
                >
                  <span>Message us</span>
                  <svg 
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Message Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => !sending && setShowModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal */}
            <div 
              className="relative bg-white w-full max-w-md p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => !sending && setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={sending}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {sent ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-800 font-medium">Message sent!</p>
                  <p className="text-gray-500 text-sm mt-1">We'll get back to you soon.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    Send us a message
                  </h2>

                  <form onSubmit={handleSubmitMessage} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                        placeholder="your@email.com"
                        disabled={sending}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                        placeholder="+91 98765 43210"
                        disabled={sending}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
                        placeholder="Your message..."
                        disabled={sending}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Dark Map Section */}
        <div className="mt-20 sm:mt-32">
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
            {/* Leaflet Map */}
            <div 
              ref={mapRef}
              className="w-full h-full"
              style={{ zIndex: 0 }}
            />

            {/* View on Google Maps Button */}
            <a 
              href="https://maps.app.goo.gl/C4JHLayfJftJJWe57"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 hover:bg-white transition-colors group"
              style={{ zIndex: 1000 }}
            >
              <div className="w-3 h-3 bg-black rounded-full group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-800 font-medium">
                View on Google Maps
              </span>
              <svg 
                className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
