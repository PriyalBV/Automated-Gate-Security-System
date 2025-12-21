import React, { useState, useEffect, useRef } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function ContactUs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const registerRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (registerRef.current && !registerRef.current.contains(event.target))
        setRegisterOpen(false);
      if (moreRef.current && !moreRef.current.contains(event.target))
        setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    console.log("Contact Form Submitted:", formData);
    alert("✉️ Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#f9ede3] via-[#f5e3d1] to-[#e7c9a9] flex flex-col">
      {/* Navbar */}
      <HeaderNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        registerOpen={registerOpen}
        setRegisterOpen={setRegisterOpen}
        moreOpen={moreOpen}
        setMoreOpen={setMoreOpen}
        registerRef={registerRef}
        moreRef={moreRef}
      />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-16 text-brown">
        <h2 className="text-4xl md:text-5xl mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#C79A63] via-[#8B5E3C] to-[#4B2E1E] font-extrabold tracking-wide leading-relaxed pb-2">
          Contact Us
        </h2>

        <p className="text-center text-brown/70 mb-12 text-lg max-w-2xl mx-auto">
          Have questions or need assistance? We're here to help. Reach out to us through any of the channels below.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: "📍",
                title: "Visit Us",
                desc: (
                  <>
                    Banasthali Vidyapith <br />
                    P.O. Banasthali Vidyapith <br />
                    Rajasthan 304022, India
                  </>
                ),
              },
              {
                icon: "📧",
                title: "Email Us",
                desc: (
                  <>
                    General: info@rakshapeeth.com <br />
                    Support: support@rakshapeeth.com <br />
                    Security: security@rakshapeeth.com
                  </>
                ),
              },
              {
                icon: "📞",
                title: "Call Us",
                desc: (
                  <>
                    Main Office: +91 12345 67890 <br />
                    Security Desk: +91 98765 43210 <br />
                    Emergency: +91 11111 22222
                  </>
                ),
              },
              {
                icon: "🕐",
                title: "Office Hours",
                desc: (
                  <>
                    Wed - Mon: 9:00 AM - 6:00 PM <br />
                    Tuesday: Closed <br />
                    <span className="text-sm italic">Security desk operates 24/7</span>
                  </>
                ),
              },
            ].map((info, index) => (
              <div
                key={index}
                className="bg-brown/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{info.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-brown">
                      {info.title}
                    </h3>
                    <p className="text-brown/80">{info.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-brown/20 p-12 md:p-14 rounded-3xl shadow-2xl space-y-8 hover:shadow-3xl transition-all duration-500"
          >
            {[
              { name: "name", label: "Your Name", type: "text", required: true },
              { name: "email", label: "Email Address", type: "email", required: true },
              { name: "phone", label: "Phone Number", type: "tel", required: false },
              { name: "subject", label: "Subject", type: "text", required: true },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
                  {field.label}{" "}
                  {field.required && <span className="text-red-600">*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
                />
              </div>
            ))}

            {/* Message */}
            <div>
              <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-br from-[#B8860B] via-[#8B5A2B] to-[#3E2723]
               text-cream font-bold rounded-full shadow-inner
               hover:bg-gradient-to-tr hover:scale-105 hover:shadow-[0_0_15px_rgba(139,90,43,0.5)]
               transition-all duration-500 tracking-wider"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );

}


