// src/pages/PreVisit.js

import React, { useState, useRef, useEffect } from "react";
import HeaderNavbar from "../components/HeaderNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Phone validation function
function validatePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15 && /^\d+$/.test(digits);
}

// ⭐ NEW: Validate Indian ID formats
function validateID(idType, idNumber) {
  idNumber = idNumber.trim();

  const patterns = {
    PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // ABCDE1234F
    AADHAAR: /^[0-9]{12}$/, // 12 digits
    DL: /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/ // MH142011234567
  };

  return patterns[idType]?.test(idNumber) || false;
}

export default function PreVisit() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const registerRef = useRef(null);
  const moreRef = useRef(null);

  // ⭐ UPDATED: Added idProofType, vehicleNumber, dateOfVisit, numberOfPeople
  const [formData, setFormData] = useState({
    visitorName: "",
    studentName: "",
    studentId: "",
    idProofType: "",
    visitorIdProof: "",
    vehicleNumber: "",
    dateOfVisit: "",
    numberOfPeople: "",
    reasonOfVisit: "",
    otherReason: "",
    phoneNumber: "",
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (registerRef.current && !registerRef.current.contains(event.target)) setRegisterOpen(false);
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const reasonOptions = [
    { value: "", label: "Select a reason" },
    { value: "Academic Inquiry", label: "Academic Inquiry" },
    { value: "Meet Child", label: "Meet Child" },
    { value: "Delivery / Parcel", label: "Delivery / Parcel" },
    { value: "Meeting Faculty", label: "Meeting Faculty" },
    { value: "Alumini", label: "Alumini" },
    { value: "Other", label: "Other" },
  ];

  const phoneValid = validatePhone(formData.phoneNumber);

  // ⭐ UPDATED FORM VALIDATION
  const formValid =
  formData.visitorName.trim() !== "" &&
  formData.idProofType.trim() !== "" &&
  formData.visitorIdProof.trim() !== "" &&
  validateID(formData.idProofType, formData.visitorIdProof) &&
  formData.dateOfVisit.trim() !== "" &&
  formData.reasonOfVisit.trim() !== "" &&   // dropdown must have any value
  phoneValid &&
  Number(formData.numberOfPeople) > 0 &&
  (
    formData.reasonOfVisit === "Other"   // only if "Other" selected
      ? (formData.otherReason && formData.otherReason.trim() !== "")
      : true
  );

  const handleSubmit = (e) => {
  e.preventDefault();
  setSubmitAttempted(true);

  const errors = [];

  if (!formData.visitorName.trim()) errors.push("Visitor Name is required");
  if (!formData.idProofType.trim()) errors.push("ID Proof Type is required");
  if (!formData.visitorIdProof.trim()) errors.push("ID Proof Number is required");
  if (formData.idProofType && !validateID(formData.idProofType, formData.visitorIdProof))
    errors.push(`Invalid ${formData.idProofType} format`);
  if (!formData.dateOfVisit.trim()) errors.push("Date of Visit is required");
  if (!formData.reasonOfVisit.trim()) errors.push("Reason of Visit is required");
  if (formData.reasonOfVisit === "Other" && !formData.otherReason.trim())
    errors.push("Please specify the reason for visit");
  if (!phoneValid) errors.push("Invalid Phone Number (6-15 digits)");
  if (!formData.numberOfPeople || Number(formData.numberOfPeople) <= 0)
    errors.push("Number of People must be greater than 0");

  if (errors.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Form Incomplete",
      html: errors.map((err) => `<p>${err}</p>`).join(""),
      confirmButtonColor: "#8B5E3C",
    });
    return;
  }

  // If no errors, submit form
  console.log("Pre-Visit Form Data:", formData);

  Swal.fire({
    icon: "success",
    title: "Form Submitted!",
    text: "🎉 Your pre-visit request has been submitted successfully.",
    confirmButtonColor: "#8B5E3C",
  });

  // Reset form
  setFormData({
    visitorName: "",
    studentName: "",
    studentId: "",
    idProofType: "",
    visitorIdProof: "",
    vehicleNumber: "",
    dateOfVisit: "",
    numberOfPeople: "",
    reasonOfVisit: "",
    otherReason: "",
    phoneNumber: "",
  });

  setSubmitAttempted(false);
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

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 text-brown">
        <h2 className="text-4xl md:text-5xl mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#C79A63] via-[#8B5E3C] to-[#4B2E1E] font-extrabold tracking-wide leading-relaxed pb-2">
          Pre-Visit Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-brown/20 p-12 md:p-14 rounded-3xl shadow-2xl space-y-8 max-w-3xl mx-auto hover:shadow-3xl transition-all duration-500"
        >
          {/* Visitor Name */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Visitor Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
            />
            {submitAttempted && !formData.visitorName.trim() && (
              <p className="text-red-600 text-sm mt-1">This field is required</p>
            )}
          </div>

          {/* ID Proof Type */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              ID Proof Type <span className="text-red-600">*</span>
            </label>
            <select
              name="idProofType"
              value={formData.idProofType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300 bg-white"
            >
              <option value="">Select ID Proof</option>
              <option value="PAN">PAN Card</option>
              <option value="AADHAAR">Aadhaar Card</option>
              <option value="DL">Driving License</option>
            </select>
            {submitAttempted && !formData.idProofType.trim() && (
              <p className="text-red-600 text-sm mt-1">Please select ID proof type</p>
            )}
          </div>

          {/* Visitor ID Proof */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              ID Proof Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="visitorIdProof"
              value={formData.visitorIdProof}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
            />
            {submitAttempted &&
              formData.idProofType &&
              !validateID(formData.idProofType, formData.visitorIdProof) && (
                <p className="text-red-600 text-sm mt-1">
                  Invalid {formData.idProofType} format. Please enter a valid ID.
                </p>
              )}
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
            />
          </div>

          {/* ⭐ NEW: Date of Visit */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Date of Visit <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="dateOfVisit"
              value={formData.dateOfVisit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300 bg-white"
            />
            {submitAttempted && !formData.dateOfVisit.trim() && (
              <p className="text-red-600 text-sm mt-1">Please select a date</p>
            )}
          </div>

          {/* Reason of Visit */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Reason of Visit <span className="text-red-600">*</span>
            </label>
            <select
              name="reasonOfVisit"
              value={formData.reasonOfVisit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300 bg-white"
            >
              {reasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {submitAttempted && !formData.reasonOfVisit && (
              <p className="text-red-600 text-sm mt-1">Please select a reason</p>
            )}
          </div>

          {/* Other / Alumini Reason */}
          {(formData.reasonOfVisit === "Other" || formData.reasonOfVisit === "Alumini") && (
            <div>
              <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
                Please Specify <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="otherReason"
                value={formData.otherReason}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
              />
              {submitAttempted && !formData.otherReason.trim() && (
                <p className="text-red-600 text-sm mt-1">Please specify the reason</p>
              )}
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
            />
            {submitAttempted && !phoneValid && (
              <p className="text-red-600 text-sm mt-1">Please enter a valid phone number (6-15 digits)</p>
            )}
          </div>

          {/* Number of People */}
          <div>
            <label className="block mb-2 font-semibold text-sm uppercase tracking-wider text-brown/80">
              Number of People <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              min="1"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-brown/50 focus:outline-none focus:ring-2 focus:ring-brown/70 shadow-sm hover:shadow-md transition duration-300"
            />
            {submitAttempted && !formData.numberOfPeople.trim() && (
              <p className="text-red-600 text-sm mt-1">Please enter number of people</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full py-3
              bg-[#8B5E3C]
              text-white
              font-bold
              rounded-full
              shadow-md
              hover:bg-[#4B2E1E]
              hover:scale-105
              transition-all duration-300
              tracking-wider
            "
          >
            Submit Form
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
//FeedBack