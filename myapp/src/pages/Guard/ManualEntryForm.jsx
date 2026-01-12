import React, { useState } from "react";
import Swal from "sweetalert2";
// import axios from "axios";
import HeaderNavbar from "../../components/HeaderNavbar";
import Sidebar2 from "../../components/Sidebar2";
import Footer from "../../components/Footer";

// SCAN_URL = "http://localhost:4000/manual_entry";

export default function ManualEntryForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    idProof: "",
    idProofNumber: "",
    entryType: "FOOT",
    vehicleNo: "",
    reasonOfVisit: "",
    otherReason: ""
  });

  const reasonOptions = [
    "Delivery",
    "Maintenance",
    "Official Work",
    "Parent / Guardian",
    "Alumni",
    "OTHER"
  ];

  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validateAadhaar = (v) => /^[0-9]{12}$/.test(v);
  const validatePAN = (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
  const validateDL = (v) =>
    /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/.test(v.replace(/\s+/g, ""));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim())
      return Swal.fire("Error", "Name is required", "error");

    if (!validatePhone(formData.phoneNo))
      return Swal.fire("Error", "Invalid phone number", "error");

    if (!formData.idProof)
      return Swal.fire("Error", "Select ID proof", "error");

    if (!formData.idProofNumber)
      return Swal.fire("Error", "Enter ID number", "error");

    if (
      formData.idProof === "Aadhaar" &&
      !validateAadhaar(formData.idProofNumber)
    )
      return Swal.fire("Error", "Invalid Aadhaar", "error");

    if (formData.idProof === "PAN" && !validatePAN(formData.idProofNumber))
      return Swal.fire("Error", "Invalid PAN", "error");

    if (formData.idProof === "DL" && !validateDL(formData.idProofNumber))
      return Swal.fire("Error", "Invalid DL", "error");

    if (formData.entryType === "VEHICLE" && !formData.vehicleNo.trim())
      return Swal.fire("Error", "Vehicle number required", "error");

    if (!formData.reasonOfVisit)
      return Swal.fire("Error", "Select reason of visit", "error");

    if (
      formData.reasonOfVisit === "OTHER" &&
      !formData.otherReason.trim()
    )
      return Swal.fire("Error", "Specify other reason", "error");

    const payload = {
      ...formData,
      vehicleNo:
        formData.entryType === "VEHICLE"
          ? formData.vehicleNo.toUpperCase()
          : undefined,
      guardId: localStorage.getItem("guardId") // IMPORTANT
    };
    console.log("this is form entry type: ", formData.entryType);

    // handle submit is the method which gets called when the html form is submitted  
    // in handel submit then i am calling the method manual entry inmy main.py 
    // where i am passing entry type VEHICLE or FOOT so that that method can either 
    // make entry in vehicle logs or pedestrial logs collection
    // i am passing all the formData elements that have been passed in the method 

    try {
      const Data = new FormData();
      Data.append("entryType", formData.entryType);
      Data.append("vehicleNo", formData.entryType==="VEHICLE" ? formData.vehicleNo : "y" );
      Data.append("vehicleType", formData.entryType==="VEHICLE" ? formData.vehicleType : "N/A" );
      Data.append("driverName", formData.name);
      Data.append("phoneNumber", formData.phoneNo);
      Data.append("proofType", formData.idProof);
      Data.append("proofId", formData.idProofNumber);
      Data.append("reason", formData.reasonOfVisit === "OTHER" ? formData.otherReason : formData.reasonOfVisit);

      const res = await fetch("http://localhost:4000/manual_entry", {
        method: "POST",
        body: Data,
      });
      Swal.fire("Success", "Entry recorded", "success");

      setFormData({
        name: "",
        phoneNo: "",
        idProof: "",
        idProofNumber: "",
        entryType: "FOOT",
        vehicleNo: "",
        reasonOfVisit: "",
        otherReason: ""
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save entry", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f1] to-[#f3eae3]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-10 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-6"
          >
            <h2 className="text-3xl font-bold text-center text-[#8B5E3C]">
              Manual Entry
            </h2>

            {/* Entry Type */}
            <select
              name="entryType"
              value={formData.entryType}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select Entry Type</option>
              <option value="FOOT">Pedestrian Entry</option>
              <option value="VEHICLE">Vehicle Entry</option>
            </select>

            {formData.entryType === "VEHICLE" && (
              <input
                name="vehicleNo"
                placeholder="Vehicle Number"
                value={formData.vehicleNo}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />
            )}

            {formData.entryType === "VEHICLE" && (
              <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select Vehicle Type</option>
              <option value="two">Two Wheeler</option>
              <option value="four">Four Wheeler</option>
            </select>
            )}

            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              name="phoneNo"
              placeholder="Phone Number"
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <select
              name="idProof"
              value={formData.idProof}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select ID Proof</option>
              <option value="Aadhaar">Aadhaar</option>
              <option value="PAN">PAN</option>
              <option value="DL">Driving License</option>
            </select>

            <input
              name="idProofNumber"
              placeholder="ID Proof Number"
              value={formData.idProofNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <select
              name="reasonOfVisit"
              value={formData.reasonOfVisit}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select Reason</option>
              {reasonOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {formData.reasonOfVisit === "OTHER" && (
              <input
                name="otherReason"
                placeholder="Specify reason"
                value={formData.otherReason}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />
            )}

            <button
              type="submit"
              className="w-full bg-[#8B5E3C] text-white py-3 rounded-full font-bold"
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
