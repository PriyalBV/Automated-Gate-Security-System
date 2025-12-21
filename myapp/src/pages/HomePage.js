import React, { useState, useEffect } from "react";
import gateImg from "../assets/gate.png";
import { useNavigate } from "react-router-dom";

import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import SecureEntryVideo from "../assets/Secure_Entry_Demo.mp4";
import NotifyVideo from "../assets/Notify.mp4"; 
import VehicleVideo from "../assets/veh.mp4";

export default function HomePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      const sidebar = document.getElementById("sidebar");
      if (sidebarOpen && sidebar && !sidebar.contains(event.target)) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="font-sans bg-cream relative min-h-screen text-brown">
      {/* Header + Navbar */}
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} id="sidebar" />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Section */}
      <main className="flex flex-col md:flex-row w-full">
        {/* Left Panel: Full Image */}
        <div className="md:w-1/2 w-full h-[600px] md:h-auto relative flex items-center justify-center">
          <img
            src={gateImg}
            alt="Gate"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 "></div>
        </div>

        {/* Right Panel: Welcome */}
        {/* Right Panel: Welcome */}
<div className="md:w-1/2 w-full flex items-center justify-center p-6 md:p-12 h-[600px] md:h-[600px]">
  <div className="bg-cream rounded-3xl shadow-2xl text-center space-y-5 w-full h-full flex flex-col items-center justify-center p-6 md:p-10">
    <h1 className="text-4xl md:text-5xl font-extrabold">
      Welcome to AGSS-BV
    </h1>
    <p className="text-lg md:text-xl">
      Automated Gate Security System for Banasthali Vidyapith
    </p>
    <button
      className="px-8 py-3 bg-brown text-cream rounded-full font-semibold hover:scale-105 hover:shadow-xl transition-all duration-500 mt-4"
      onClick={() => navigate("/secure-entry")}
    >
      Get Started
    </button>
  </div>
</div>

      </main>

      {/* Features / Info Cards */}
      <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-6 md:gap-8 px-6 md:px-20">
        {[
          {
            title: "Secure Entry",
            desc: "Biometric and ID-based student and visitor verification.",
            icon: "🔒",
            link: "/secure-entry",
            video: SecureEntryVideo
          },
          {
            title: "Smart Notifications",
            desc: "Parents get instant alerts when students exit or enter campus.",
            icon: "📲",
            link: "/notify",
            video: NotifyVideo
          },
          {
            title: "Vehicle Management",
            desc: "Automated gate control and whitelist management for vehicles.",
            icon: "🚗",
            link: "/vehicle",
            video: VehicleVideo
          }
        ].map((feature, idx) => (
          <div
            key={idx}
            onClick={() => feature.link && navigate(feature.link)}
            className="cursor-pointer bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 text-center"
          >
            <div className="text-4xl md:text-5xl mb-3">{feature.icon}</div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">{feature.title}</h2>
            <p className="text-sm md:text-base">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
