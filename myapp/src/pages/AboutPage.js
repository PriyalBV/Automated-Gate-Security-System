// src/pages/AboutPage.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const registerRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setRegisterOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-cream to-cream/90 flex flex-col">
      {/*copy start*/}
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
{/*copy end*/}
      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 text-brown">
        <h2 className="text-4xl md:text-5xl mb-8 text-center text-brown/90 underline decoration-cream/60">
          About Us
        </h2>

        <div className="flex flex-col md:flex-row items-start bg-cream/60 rounded-2xl shadow-xl p-8 md:p-12 space-x-0 md:space-x-8 space-y-6 md:space-y-0 text-brown/90 leading-relaxed text-lg">
          {/* Left Image */}
          <img
            src={Logo}
            alt="Rakshapeeth"
            className="w-full md:w-1/3 rounded-2xl shadow-lg"
          />

          {/* Text */}
          <div className="md:flex-1 text-justify">
            <p className="first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-2 first-letter:leading-tight first-letter:-mt-2">
              Rakshapeeth is an advanced automated gate security system designed specifically for universities and educational institutions. Our goal is to redefine campus safety by combining cutting-edge technology with intelligent automation — ensuring a secure, efficient, and transparent access management experience for students, staff, and visitors.
            </p>

            <p>
              For students, Rakshapeeth offers a dual-layer verification system that combines iris recognition with student ID scanning. This ensures that every individual entering the campus is verified beyond doubt, creating a reliable and tamper-proof layer of protection for the institution.
            </p>

            <p>
              When it comes to visitors, Rakshapeeth provides a truly smart experience. Its number plate recognition system automatically scans and validates incoming vehicles, while unregistered guests can still be logged manually for security tracking. Visitors can also submit pre-visit requests, making entry more convenient and organized. If a blacklisted user or vehicle is detected, Rakshapeeth immediately triggers an alert to security personnel, ensuring that potential threats are addressed instantly and effectively.
            </p>

            <p>
              Safety goes beyond the gate. With Rakshapeeth’s real-time parent notification system, parents receive instant alerts whenever their child enters or exits the campus. This promotes peace of mind, transparency, and trust between families and institutions.
            </p>

            <p>
              At its core, Rakshapeeth is more than a security system — it’s a vision for safer campuses through innovation. By merging advanced verification, intelligent monitoring, and real-time communication, Rakshapeeth empowers universities to create a secure and connected environment where safety is effortless, reliable, and future-ready.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-brown to-brown/90 text-cream mt-16 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-cream/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cream/10 rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-wide">RAKSHAPEETH</h2>
            <p className="text-cream/80">Automated Gate Security System for Banasthali Vidyapith.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-yellow-300 transition-all duration-300">Home</Link></li>
              <li><Link to="/about" className="hover:text-yellow-300 transition-all duration-300">About</Link></li>
              <li><a href="#" className="hover:text-yellow-300 transition-all duration-300">Register</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition-all duration-300">Contact Us</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Connect</h3>
            <p>Email: info@rakshapeeth.com</p>
            <p>Phone: +91 12345 67890</p>
            <div className="flex space-x-4 mt-3">
              <a href="#" className="p-2 bg-cream/20 rounded-full hover:bg-cream/50 text-brown shadow-lg transition-all duration-300 hover:scale-110">🐦</a>
              <a href="#" className="p-2 bg-cream/20 rounded-full hover:bg-cream/50 text-brown shadow-lg transition-all duration-300 hover:scale-110">🔗</a>
              <a href="#" className="p-2 bg-cream/20 rounded-full hover:bg-cream/50 text-brown shadow-lg transition-all duration-300 hover:scale-110">📘</a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/40 mt-6 py-4 text-center text-cream/70 relative z-10">
          © {new Date().getFullYear()} RAKSHAPEETH. All rights reserved.
        </div>
      </footer>
    </div>
  );
}