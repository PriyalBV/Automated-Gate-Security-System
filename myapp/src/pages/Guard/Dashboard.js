import React, { useState } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";  // ⭐ Add this

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();  // ⭐ Add this

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3] flex flex-col">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-8 md:p-12">
          {/* Welcome Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-brown-800">
              Welcome, Guard!
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor visitor entries, manage scans, and keep the campus secure — all from one dashboard.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-brown-700">05</p>
              <p className="text-gray-600 mt-2">Active Entries</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-brown-700">10</p>
              <p className="text-gray-600 mt-2">Total Logged Visits</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-brown-700">02</p>
              <p className="text-gray-600 mt-2">Alerts Sent</p>
            </div>
          </div>

          {/* Action Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform"
            onClick={() => navigate("/manual-entry")}>
              <h3 className="text-xl font-semibold text-brown-800 mb-3">
                Manual Entry
              </h3>
              <p className="text-gray-600 mb-4">
                Log visitor details manually in case of system or scan errors.
              </p>
              
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-brown-800 mb-3">
                Iris Scan
              </h3>
              <p className="text-gray-600 mb-4">
                Verify pedestrian identity using biometric iris recognition.
              </p>
              
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-brown-800 mb-3">
                Number Plate Scan
              </h3>
              <p className="text-gray-600 mb-4">
                Scan and log vehicle plates for quick entry authorization.
              </p>
              
            </div>
          </div>

          
        </main>
      </div>

      <Footer />
    </div>
  );
}