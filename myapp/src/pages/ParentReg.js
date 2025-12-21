// src/pages/ParentRegister.js
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Logo from "../assets/logo.png";

const MySwal = withReactContent(Swal);

const countryOptions = [
  { code: "+91", name: "India" },
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+61", name: "Australia" },
];

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email);
}

function validatePhone(countryCode, phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15 && /^\d+$/.test(digits);
}

function passwordRules(password) {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const passed = Object.values(rules).filter(Boolean).length;
  return { rules, score: passed };
}

export default function ParentRegister() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const registerRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (registerRef.current && !registerRef.current.contains(event.target)) setRegisterOpen(false);
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    countryCode: "+91",
    phone: "",
  });

  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = validateEmail(formData.email);
  const phoneValid = validatePhone(formData.countryCode, formData.phone);
  const pw = passwordRules(formData.password);
  const passwordValid = pw.score === 4;

  const formValid =
    emailValid &&
    phoneValid &&
    passwordValid &&
    formData.firstName.trim().length > 0 &&
    formData.lastName.trim().length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((s) => ({ ...s, [e.target.name]: true }));
  };

  const showError = (title, text) => {
    MySwal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "#8B5E3C",
    });
  };

  const showSuccess = (title, text) => {
    MySwal.fire({
      icon: "success",
      title,
      text,
      confirmButtonColor: "#8B5E3C",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!formValid) {
      showError("Fix required fields", "Please fill all required fields correctly before submitting.");
      return;
    }

    setLoading(true);

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: `${formData.countryCode}-${formData.phone.replace(/\D/g, "")}`,
      password: formData.password,
    };

    try {
      const res = await fetch("http://localhost:5000/api/parents/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.msg || data.error || "Registration failed";
        showError("Registration failed", message);
        setLoading(false);
        return;
      }

      showSuccess("Registered", "Parent registered successfully 🎉");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        countryCode: "+91",
        phone: "",
      });
      setTouched({});
      setSubmitAttempted(false);
      setLoading(false);
    } catch (error) {
      console.error("Parent registration network error:", error);
      showError("Network Error", "Unable to reach the server. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#f9ede3] via-[#f5e3d1] to-[#e7c9a9] flex flex-col">
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 text-brown">
        <h2 className="text-4xl md:text-5xl mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#C79A63] via-[#8B5E3C] to-[#4B2E1E] font-extrabold tracking-wide leading-relaxed pb-2">
          Parent Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-brown/20 p-12 md:p-14 rounded-2xl shadow-2xl space-y-8 max-w-3xl mx-auto"
          noValidate
        >
          {/* Input Fields same as before */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              First Name<span className="text-red-600">*</span>
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70"
            />
            {(touched.firstName || submitAttempted) && formData.firstName.trim().length === 0 && (
              <p className="text-red-600 text-sm mt-1">First name is required.</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Last Name<span className="text-red-600">*</span>
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70"
            />
            {(touched.lastName || submitAttempted) && formData.lastName.trim().length === 0 && (
              <p className="text-red-600 text-sm mt-1">Last name is required.</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Email Address<span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70"
            />
            {(touched.email || submitAttempted) && !emailValid && (
              <p className="text-red-600 text-sm mt-1">Please enter a valid email address.</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Password<span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70"
            />
            <div className="mt-2 text-sm text-brown/70">
              Password must include uppercase, number, and special character.
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Phone Number<span className="text-red-600">*</span>
            </label>
            <div className="flex gap-3">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="px-3 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70"
              >
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter phone number"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70"
              />
            </div>
            {(touched.phone || submitAttempted) && !phoneValid && (
              <p className="text-red-600 text-sm mt-1">Enter a valid phone number.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${
              loading
                ? "bg-brown/40 cursor-not-allowed"
                : "bg-gradient-to-br from-[#B8860B] via-[#8B5A2B] to-[#3E2723] hover:scale-105"
            } text-cream font-bold rounded-full shadow-inner transition-all duration-500 tracking-wider`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
