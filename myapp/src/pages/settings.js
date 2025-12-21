import React, { useState } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile settings state
  
  const [username, setUsername] = useState("johndoe");
  const [mobile, setMobile] = useState("+91 9876543210");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("");
  

  // Notification settings state
  const [notificationChannels, setNotificationChannels] = useState({
    sms: false,
    email: true,
  });
  const [notificationLanguage, setNotificationLanguage] = useState("English");

  // Privacy & Security state
  const [profileVisibility, setProfileVisibility] = useState("Everyone");
  const [contactPermissions, setContactPermissions] = useState("Everyone");

  // Language & Accessibility
  const [appLanguage, setAppLanguage] = useState("English");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  return (
    <div className="font-sans bg-gradient-to-b from-cream to-cream/90 relative min-h-screen">
      {/* Header + Navbar */}
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} id="sidebar" />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Page Header */}
      <header className="bg-brown text-cream text-center py-16 shadow-lg">
        <h1 className="text-5xl font-extrabold mb-2 tracking-wide">Settings</h1>
        <p className="text-lg max-w-2xl mx-auto text-cream/80">
          Customize your profile, notifications, privacy, and app preferences
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        {/* Profile Settings */}
        <section className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-brown mb-4">Profile Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <label className="font-semibold text-brown">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-brown">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-brown">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-brown">Change Password</label>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>
            
          </div>
        </section>

        {/* Notification Settings */}
        <section className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-brown mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-brown">Notification Channels</label>
              <div className="flex space-x-4 mt-1">
                {["sms", "email"].map((ch) => (
                  <label key={ch} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationChannels[ch]}
                      onChange={() =>
                        setNotificationChannels({
                          ...notificationChannels,
                          [ch]: !notificationChannels[ch],
                        })
                      }
                    />
                    <span className="capitalize">{ch}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="font-semibold text-brown">Notification Language</label>
              <select
                value={notificationLanguage}
                onChange={(e) => setNotificationLanguage(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option>English</option>
                <option>Hindi</option>
                
              </select>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-brown mb-4">Privacy & Security</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-brown">Who can view profile</label>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option>Everyone</option>
                <option>Only Me</option>
                
              </select>
            </div>
            <div>
              <label className="font-semibold text-brown">Who can contact me</label>
              <select
                value={contactPermissions}
                onChange={(e) => setContactPermissions(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option>Everyone</option>
                <option>Only Me</option>
                
              </select>
            </div>
          </div>
        </section>

        {/* Language & Accessibility */}
        <section className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-brown mb-4">Language & Accessibility</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-brown">App Language</label>
              <select
                value={appLanguage}
                onChange={(e) => setAppLanguage(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-brown">Regional Date/Time Formats</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY/MM/DD</option>
              </select>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}