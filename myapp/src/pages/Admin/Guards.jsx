// src/pages/Admin/Guards.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import API from "../../services/api";

const MySwal = withReactContent(Swal);

export default function GuardsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guards, setGuards] = useState([]);

  // ✅ Fetch guards from backend
  const fetchGuards = async () => {
    try {
      const res = await API.get("/guard"); // your GET endpoint
      setGuards(res.data);
    } catch (err) {
      console.error("AXIOS ERROR:", err.response || err.message);
      Swal.fire("Error", "Failed to fetch guards", "error");
    }
  };

  // ✅ Add new guard
  const handleAddGuard = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Add New Guard",
      html: `
        <input id="firstName" class="swal2-input" placeholder="First Name">
        <input id="lastName" class="swal2-input" placeholder="Last Name">
        <input id="phone" class="swal2-input" placeholder="Phone">
        <input id="email" class="swal2-input" placeholder="Email">
        <input id="guardId" class="swal2-input" placeholder="Guard ID">
        <select id="status" class="swal2-select">
          <option value="free">Free</option>
          <option value="busy">Busy</option>
        </select>
      `,
      preConfirm: () => {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const guardId = document.getElementById("guardId").value.trim();
        const status = document.getElementById("status").value;

        if (!firstName || !lastName || !phone || !email || !guardId) {
          Swal.showValidationMessage("All fields are required");
          return;
        }

        return { firstName, lastName, phone, email, guardId, status };
      },
      showCancelButton: true,
    });

    if (formValues) {
      try {
        await API.post("/guard", formValues); // POST endpoint
        Swal.fire("Success", "Guard added", "success");
        fetchGuards();
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to add guard", "error");
      }
    }
  };

  // ✅ Edit guard info
  const handleEditGuard = async (guard) => {
    const { value: formValues } = await MySwal.fire({
      title: "Edit Guard",
      html: `
        <input id="firstName" class="swal2-input" placeholder="First Name" value="${guard.firstName}">
        <input id="lastName" class="swal2-input" placeholder="Last Name" value="${guard.lastName}">
        <input id="phone" class="swal2-input" placeholder="Phone" value="${guard.phone}">
        <input id="email" class="swal2-input" placeholder="Email" value="${guard.email}">
        <select id="status" class="swal2-select">
          <option value="free" ${guard.status === "free" ? "selected" : ""}>Free</option>
          <option value="busy" ${guard.status === "busy" ? "selected" : ""}>Busy</option>
        </select>
      `,
      preConfirm: () => {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const status = document.getElementById("status").value;

        if (!firstName || !lastName || !phone || !email) {
          Swal.showValidationMessage("All fields are required");
          return;
        }

        return { firstName, lastName, phone, email, status };
      },
      showCancelButton: true,
    });

    if (formValues) {
      try {
        await API.put(`/guard/${guard._id}`, formValues); // PUT endpoint
        Swal.fire("Success", "Guard updated", "success");
        fetchGuards();
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to update guard", "error");
      }
    }
  };

  // ✅ Delete guard
  const handleDeleteGuard = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove the guard permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/guard/${id}`); // DELETE endpoint
      Swal.fire("Removed", "Guard removed successfully", "success");
      fetchGuards();
    } catch (err) {
      Swal.fire("Error", "Failed to remove guard", "error");
    }
  };

  useEffect(() => {
    fetchGuards();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 font-sans text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} adminName="Admin" />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)}></div>}

      <main className="relative z-20 px-6 md:px-12 lg:px-20 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Guards</h1>
          <button
            onClick={handleAddGuard}
            className="bg-[#7B4B2A] text-cream px-4 py-2 rounded-full shadow-lg hover:scale-105 transition transform"
          >
            Add +
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-brown/20">
              <tr>
                <th className="p-2">Guard ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    No guards found
                  </td>
                </tr>
              ) : (
                guards.map((guard) => (
                  <tr key={guard._id} className="border-b hover:bg-cream/50">
                    <td className="p-2">{guard.guardId}</td>
                    <td className="p-2">{guard.firstName} {guard.lastName}</td>
                    <td className="p-2">{guard.phone}</td>
                    <td className="p-2">{guard.email}</td>
                    <td className="p-2">{guard.status}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleEditGuard(guard)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGuard(guard._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
