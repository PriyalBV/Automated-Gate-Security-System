import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";  // ✅ ADD THIS
import HeaderNavbar from "../../components/HeaderNavbar";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";

export default function ManualEntryForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    idProof: "",
    idProofNumber: "",
    reasonOfVisit: "",
    otherReason: ""
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const reasonOptions = [
    { value: "", label: "Select a Reason" },
    { value: "Delivery", label: "Delivery" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Official Work", label: "Official Work" },
    { value: "Parent / Guardian", label: "Parent / Guardian" },
    { value: "Alumni", label: "Alumni" },
    { value: "Other", label: "Other" }
  ];

  // Validation functions
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const validateAadhaar = (value) => /^[0-9]{12}$/.test(value);

  const validatePAN = (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);

  const validateDL = (value) =>
    /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/.test(value.replace(/\s+/g, ""));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitAttempted(true);

  // Basic validations
  if (!formData.name.trim())
    return Swal.fire("Missing Field", "Name is required.", "error");

  if (!validatePhone(formData.phoneNo))
    return Swal.fire("Invalid Phone", "Enter a valid 10-digit phone number.", "error");

  if (!formData.idProof)
    return Swal.fire("Missing Field", "Please select an ID Proof.", "error");

  if (!formData.idProofNumber.trim())
    return Swal.fire("Missing Field", "Please enter the ID Number.", "error");

  if (formData.idProof === "Aadhaar" && !validateAadhaar(formData.idProofNumber))
    return Swal.fire("Invalid Aadhaar", "Aadhaar must contain exactly 12 digits.", "error");

  if (formData.idProof === "PAN" && !validatePAN(formData.idProofNumber))
    return Swal.fire("Invalid PAN", "PAN format must be ABCDE1234F.", "error");

  if (formData.idProof === "DL" && !validateDL(formData.idProofNumber))
    return Swal.fire(
      "Invalid Driving License",
      "DL must follow Indian format like MH1420110012345.",
      "error"
    );

  if (!formData.reasonOfVisit)
    return Swal.fire("Missing Field", "Please select a reason for visit.", "error");

  if (
    (formData.reasonOfVisit === "Other" || formData.reasonOfVisit === "Alumni") &&
    !formData.otherReason.trim()
  )
    return Swal.fire("Missing Field", "Please specify the reason.", "error");

  // Prepare Final Payload
  const payload = {
    name: formData.name,
    phoneNo: formData.phoneNo,
    idProof: formData.idProof,
    idProofNumber: formData.idProofNumber,
    reasonOfVisit: formData.reasonOfVisit,
    otherReason:
      formData.reasonOfVisit === "Other" || formData.reasonOfVisit === "Alumni"
        ? formData.otherReason
        : "",
  };

  try {
    // Send data to backend
    const response = await axios.post(
      "http://localhost:5000/api/manual-entry",
      payload
    );

    Swal.fire("Success!", "Entry has been recorded.", "success");

    // Reset form
    setFormData({
      name: "",
      phoneNo: "",
      idProof: "",
      idProofNumber: "",
      reasonOfVisit: "",
      otherReason: "",
    });

    setSubmitAttempted(false);
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to save entry. Check console.", "error");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3] flex flex-col">
      
      {/* HEADER */}
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        
        {/* SIDEBAR */}
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* MAIN CONTENT */}
        <main className="flex-1 flex items-start justify-center p-8">

          <form
            onSubmit={handleSubmit}
            className="
              w-full 
              bg-white/90 
              backdrop-blur-md 
              p-10 
              rounded-2xl 
              shadow-xl 
              space-y-8
              max-w-[95%] 
              md:max-w-[85%] 
              lg:max-w-[1400px]
            "
          >
            <h2 className="text-4xl font-extrabold text-center text-[#8B5E3C] mb-4">
              Manual Entry Form
            </h2>

            {/* Name */}
            <div>
              <label className="block mb-1 text-[#4B2E1E] font-semibold">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl border border-brown/40 text-lg"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 text-[#4B2E1E] font-semibold">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="10-digit number"
                className="w-full px-5 py-4 rounded-xl border border-brown/40 text-lg"
              />
            </div>

            {/* ID Proof */}
            <div>
              <label className="block mb-1 text-[#4B2E1E] font-semibold">
                ID Proof Type *
              </label>
              <select
                name="idProof"
                value={formData.idProof}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl border border-brown/40 bg-white text-lg"
              >
                <option value="">Select ID Proof</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="DL">Driving License</option>
              </select>
            </div>

            {/* ID Number */}
            <div>
              <label className="block mb-1 text-[#4B2E1E] font-semibold">
                {formData.idProof || "ID Proof"} Number *
              </label>
              <input
                type="text"
                name="idProofNumber"
                value={formData.idProofNumber}
                onChange={handleChange}
                placeholder={
                  formData.idProof === "Aadhaar"
                    ? "Enter 12-digit Aadhaar"
                    : formData.idProof === "PAN"
                    ? "ABCDE1234F"
                    : formData.idProof === "DL"
                    ? "Format: MH1420110012345"
                    : "Enter ID Number"
                }
                className="w-full px-5 py-4 rounded-xl border border-brown/40 text-lg"
              />
            </div>

            {/* Reason of Visit */}
            <div>
              <label className="block mb-2 font-semibold text-[#4B2E1E]">
                Reason of Visit *
              </label>

              <select
                name="reasonOfVisit"
                value={formData.reasonOfVisit}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl border border-brown/40 bg-white text-lg"
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

            {/* Specify other reason */}
            {(formData.reasonOfVisit === "Other" ||
              formData.reasonOfVisit === "Alumni") && (
              <div>
                <label className="block mb-2 font-semibold text-[#4B2E1E]">
                  Please Specify *
                </label>

                <input
                  type="text"
                  name="otherReason"
                  value={formData.otherReason}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl border border-brown/40 text-lg"
                />

                {submitAttempted && !formData.otherReason.trim() && (
                  <p className="text-red-600 text-sm mt-1">This field is required</p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-[#8B5E3C] text-white font-bold text-xl rounded-full hover:bg-[#4B2E1E] transition"
            >
              Save Entry
            </button>
          </form>

        </main>
      </div>

      <Footer />
    </div>
  );
}
