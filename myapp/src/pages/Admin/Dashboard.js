import React, { useState, useEffect } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

export default function AdminDashboard() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [adminName, setAdminName] = useState("");


useEffect(() => {
const token = localStorage.getItem("adminToken");
if (token) {
try {
const decoded = jwtDecode(token);
setAdminName(decoded.name || "Admin");
} catch {}
}
}, []);
  const stats = [
    { title: "Daily Entries", value: "1,248", delta: "+4.2%" },
    { title: "Pending Requests", value: "18", delta: "-1" },
    { title: "Active Guards", value: "12", delta: "+0" },
    { title: "Vehicles Today", value: "76", delta: "+8%" },
  ];

  const quickActions = [
    { name: "Approve Requests", icon: "✅" },
    { name: "Add to Whitelist", icon: "➕" },
    { name: "Create Gatepass", icon: "⏳" },
    { name: "Generate Report", icon: "📄" },
  ];

  const recentLogs = [
    { id: 1, person: "S. Sharma", type: "Student Exit", time: "10:24 AM" },
    { id: 2, person: "Delivery - DHL", type: "Vehicle Entry", time: "10:10 AM" },
    { id: 3, person: "A. Gupta", type: "Visitor Check-in", time: "09:58 AM" },
    { id: 4, person: "G. Singh", type: "Guard Login", time: "09:42 AM" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 font-sans text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} adminName={adminName} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* overlay when sidebar open */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)}></div>}

      <main className="relative z-20 px-6 md:px-12 lg:px-20 py-10">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">Welcome to Admin Dashboard</h1>
              <p className="mt-2 text-sm text-brown/70">Overview of campus security operations & quick actions.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm text-brown/60">Today</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>

              <button className="px-4 py-2 bg-[#7B4B2A] text-cream rounded-full shadow-lg hover:scale-105 transition transform">New Alert</button>
            </div>
          </div>
        </motion.header>

        {/* Stats + Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-brown/60">{s.title}</div>
                    <div className="text-2xl font-bold mt-2">{s.value}</div>
                  </div>
                  <div className="text-sm text-brown/60">{s.delta}</div>
                </div>

                {/* floating decorative circle */}
                <div className="absolute -right-8 -top-8 w-36 h-36 bg-cream/30 rounded-full blur-2xl pointer-events-none"></div>
              </motion.div>
            ))}

            <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow-xl col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Campus Activity (Last 24h)</h3>
                <div className="text-sm text-brown/60">Live</div>
              </div>

              {/* Simple sparkline */}
              <svg viewBox="0 0 200 50" className="w-full h-16" preserveAspectRatio="none">
                <polyline fill="none" stroke="#7B4B2A" strokeWidth="3" points="0,30 20,28 40,18 60,22 80,12 100,20 120,10 140,14 160,8 180,12 200,6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="mt-4 text-sm text-brown/60">Smooth live overview of entries, exits and vehicle passes.</div>
            </motion.div>
          </div>

          <aside className="space-y-6">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl p-4 shadow-xl">
              <h4 className="font-semibold mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((q, idx) => (
                  <button key={idx} className="flex items-center gap-2 p-3 bg-cream/60 rounded-xl hover:scale-105 transition transform">
                    <span>{q.icon}</span>
                    <span className="text-sm font-medium">{q.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl p-4 shadow-xl">
              <h4 className="font-semibold mb-3">Notifications</h4>
              <div className="space-y-2 text-sm text-brown/70">
                <div className="p-2 bg-cream/30 rounded">New exit request from S. Sharma</div>
                <div className="p-2 bg-cream/30 rounded">Vehicle whitelist updated</div>
                <div className="p-2 bg-cream/30 rounded">Guard G. Singh marked absent</div>
              </div>
            </motion.div>
          </aside>
        </section>

        {/* Recent Logs + Activity Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <div className="text-sm text-brown/60">Showing latest 10</div>
            </div>

            <div className="divide-y divide-brown/10">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{log.person}</div>
                    <div className="text-sm text-brown/60">{log.type}</div>
                  </div>
                  <div className="text-sm text-brown/60">{log.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold mb-4">System Health</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-brown/60 mb-1">Connection</div>
                <div className="w-full bg-cream/30 rounded-full h-3">
                  <div className="bg-[#7B4B2A] h-3 rounded-full w-3/4 transition-all" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-brown/60 mb-1">Iris Scanner Uptime</div>
                <div className="w-full bg-cream/30 rounded-full h-3">
                  <div className="bg-[#7B4B2A] h-3 rounded-full w-11/12 transition-all" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-brown/60 mb-1">ANPR Accuracy</div>
                <div className="w-full bg-cream/30 rounded-full h-3">
                  <div className="bg-[#7B4B2A] h-3 rounded-full w-4/5 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Action Button */}
        <motion.button whileHover={{ scale: 1.05 }} className="fixed right-10 bottom-10 bg-[#7B4B2A] text-cream rounded-full px-5 py-3 shadow-2xl z-50 hover:rotate-3 transition transform">
          ✚ Create Alert
        </motion.button>
      </main>

      <Footer />
    </div>
  );
}
