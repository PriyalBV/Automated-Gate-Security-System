import React, { useState } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const CONTACT_INFO = [
  {
    emoji: "📍",
    title: "Visit Us",
    short: "Banasthali Vidyapith, Rajasthan",
    full: "Banasthali Vidyapith\nP.O. Banasthali Vidyapith\nRajasthan – 304022, India",
  },
  {
    emoji: "📧",
    title: "Email Us",
    short: "support@rakshapeeth.com",
    full: "General: info@rakshapeeth.com\nSupport: support@rakshapeeth.com\nSecurity: security@rakshapeeth.com",
  },
  {
    emoji: "📞",
    title: "Call Us",
    short: "+91 98765 43210",
    full: "Main Office: +91 12345 67890\nSecurity Desk: +91 98765 43210\nEmergency: +91 11111 22222",
  },
  {
    emoji: "🕐",
    title: "Office Hours",
    short: "9 AM – 6 PM",
    full: "Wed – Mon: 9:00 AM – 6:00 PM\nTuesday: Closed\n(Security Desk works 24/7)",
  },
];

export default function ContactUs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [activeInfo, setActiveInfo] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✨ Thanks for reaching out! We’ll contact you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9ede3] via-[#f5e3d1] to-[#e7c9a9] flex flex-col">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#C79A63] via-[#8B5E3C] to-[#4B2E1E]"
        >
          Let’s Talk 💬
        </motion.h2>

        <p className="text-center text-brown/70 max-w-2xl mx-auto mb-10 text-lg">
          Questions, feedback, or help? Switch tabs or tap cards to explore ✨
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-14">
          {[
            { key: "info", label: "📞 Contact Info" },
            { key: "form", label: "✉️ Contact Form" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-8 py-3 mx-2 rounded-full font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#8B5E3C] to-[#4B2E1E] text-white shadow-xl scale-105"
                  : "bg-white/70 hover:bg-white shadow-md"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* CONTACT INFO TAB */}
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {CONTACT_INFO.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveInfo(item)}
                  className="cursor-pointer bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <h3 className="text-xl font-bold text-brown mb-2">
                    {item.title}
                  </h3>
                  <p className="text-brown/70">{item.short}</p>
                  <p className="mt-4 text-sm text-brown/50 italic">
                    Tap to expand ↗️
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CONTACT FORM TAB */}
          {activeTab === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl p-12 rounded-3xl shadow-2xl space-y-6"
            >
              {[
                { name: "name", placeholder: "👤 Your Name", required: true },
                { name: "email", placeholder: "📧 Email Address", required: true },
                { name: "phone", placeholder: "📞 Phone Number", required: false },
                { name: "subject", placeholder: "📝 Subject", required: true },
              ].map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-5 py-4 rounded-xl border border-brown/40 focus:outline-none focus:ring-2 focus:ring-brown shadow-sm"
                />
              ))}

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="💬 Your Message"
                required
                className="w-full px-5 py-4 rounded-xl border border-brown/40 focus:outline-none focus:ring-2 focus:ring-brown shadow-sm"
              />

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#B8860B] via-[#8B5A2B] to-[#3E2723] text-white font-bold text-lg tracking-wide hover:scale-105 transition-all shadow-xl"
              >
                Send Message 🚀
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </main>

      {/* Zoom Modal */}
      <AnimatePresence>
        {activeInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="relative bg-gradient-to-br from-[#fff7ef] to-[#f1dcc6] max-w-lg w-full rounded-3xl p-10 shadow-2xl text-center"
            >
              <button
                onClick={() => setActiveInfo(null)}
                className="absolute top-4 right-4 text-brown hover:text-red-600"
              >
                <X />
              </button>

              <div className="text-6xl mb-6">{activeInfo.emoji}</div>
              <h3 className="text-3xl font-extrabold text-brown mb-4">
                {activeInfo.title}
              </h3>
              <pre className="whitespace-pre-wrap text-brown/80 text-lg leading-relaxed">
                {activeInfo.full}
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}