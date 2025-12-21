import notifyVideoFile from "../assets/Notify.mp4";
import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
export default function NotifyPage() {
  const navigate = useNavigate();
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
    <div className="min-h-screen font-sans bg-gradient-to-b from-cream to-cream/90">

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
     

      {/* ======== Main Content (unchanged) ======== */}
      <main className="p-6 md:p-12 max-w-7xl mx-auto bg-gradient-to-br from-cream/95 to-cream/90 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Decorative background shapes */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-brown/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brown/10 rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
          {/* Video */}
          <div className="w-full md:w-1/2 flex justify-center">
            <video
              src={notifyVideoFile}
              controls
              className="w-full max-w-[350px] md:max-w-full aspect-[9/16] rounded-3xl shadow-2xl border-4 border-cream hover:scale-105 transform transition-all duration-500"
            />
          </div>

          {/* Description */}
          <div className="w-full md:w-1/2 text-brown space-y-6 text-justify">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wider text-center md:text-left relative">
              Smart Notification
              <span className="block h-1 w-24 bg-gradient-to-r from-brown to-brown/70 rounded-full mt-2 mx-auto md:mx-0 animate-pulse-slow"></span>
            </h2>

            <p className="text-lg md:text-xl leading-relaxed text-brown/90 first-letter:text-6xl first-letter:font-bold first-letter:text-brown/80 first-letter:mr-2">
              AGSS-BV’s <span className="font-semibold">Smart Notification</span> system by Rakshapeeth ensures that parents and administrators are always connected to the campus in <span className="italic text-brown/80">real time</span>. The moment a student enters or exits the campus, the system automatically generates a precise notification, including the exact time and date of the entry or exit, which is instantly delivered to the parents’ registered device.
            </p>

            <p className="text-lg md:text-xl leading-relaxed text-brown/90">
              This intelligent alert system is powered by seamless integration with the secure <span className="font-semibold">biometric and ID verification</span> process at the gate. By providing instant updates, it enhances student safety, fosters transparency, and gives parents peace of mind, knowing they are continuously informed about their ward’s whereabouts.
            </p>

            <p className="text-lg md:text-xl leading-relaxed text-brown/90">
              Beyond safety, this real-time communication empowers campus administrators to monitor student movements efficiently, respond promptly to any irregularities, and maintain a secure, well-managed campus environment. With AGSS-BV’s Smart Notification system, families and staff stay connected, informed, and reassured at all times.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 px-8 py-3 bg-brown text-cream rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl hover:bg-gradient-to-r from-brown/90 to-brown/70 transition-all duration-300 font-semibold"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
