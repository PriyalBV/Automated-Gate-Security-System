import React, { useState, useEffect } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import API from "../../services/api";
import Swal from "sweetalert2";

export default function WhitelistPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [whitelist, setWhitelist] = useState([]);

  // Fetch whitelist from backend
  const fetchWhitelist = async () => {
    try {
      const res = await API.get("/whitelist");
      setWhitelist(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch whitelist data", "error");
    }
  };

  useEffect(() => {
    fetchWhitelist();
  }, []);

  const handleDelete = async (id) => {
  const confirm = await Swal.fire({
    title: "Remove from whitelist?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
  });

  if (!confirm.isConfirmed) return;

  try {
    await API.delete(`/whitelist/${id}`);
    Swal.fire("Removed", "Vehicle removed from whitelist", "success");
    fetchWhitelist();
  } catch (err) {
    Swal.fire("Error", "Failed to remove", "error");
  }
};

  // Add new whitelist entry using SweetAlert2
  const handleAddVehicle = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Vehicle to Whitelist",
      html:
        `<input id="ownerName" class="swal2-input" placeholder="Owner Name">` +
        `<input id="vehicleNo" class="swal2-input" placeholder="Vehicle Number">` +
        `<select id="type" class="swal2-input">
          <option value="faculty">Faculty</option>
          <option value="staff">Staff</option>
          <option value="worker">Worker</option>
          <option value="shop owner">Shop Owner</option>
          <option value="staff family">Staff Family</option>
        </select>`,
      focusConfirm: false,
      preConfirm: () => {
        const ownerName = document.getElementById("ownerName").value.trim();
        const vehicleNo = document.getElementById("vehicleNo").value.trim().toUpperCase();
        const type = document.getElementById("type").value;

        if (!ownerName || !vehicleNo) {
          Swal.showValidationMessage("Please enter all required fields");
        }
        return { vehicleOwnerName: ownerName, vehicleNo, type };
      },
      showCancelButton: true,
    });

    if (formValues) {
      try {
        await API.post("/whitelist", formValues);
        Swal.fire("Success", "Vehicle added to whitelist ✅", "success");
        fetchWhitelist(); // refresh table
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to add vehicle",
          "error"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 font-sans text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} adminName="Admin" />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)}></div>
      )}

      <main className="relative z-20 px-6 md:px-12 lg:px-20 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Whitelist</h1>
          <button
            onClick={handleAddVehicle}
            className="bg-[#7B4B2A] text-cream px-4 py-2 rounded hover:scale-105 transition transform"
          >
            + Add Vehicle
          </button>
        </div>

        {/* Table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-brown/20">
              <tr className="bg-brown/20">
                <th className="p-2">Owner</th>
                <th className="p-2">Vehicle No</th>
                <th className="p-2">Type</th>
                <th className="p-2">Added On</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {whitelist.map((item) => (
                <tr key={item._id} className="border-b hover:bg-cream/50">
                  <td className="p-2">{item.vehicleOwnerName}</td>
                  <td className="p-2">{item.vehicleNo}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                  <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                    Remove </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
