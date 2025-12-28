import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";
import API from "../../services/api";

const MySwal = withReactContent(Swal);

export default function BlacklistPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blacklist, setBlacklist] = useState([]);

  // Fetch blacklist entries
  const fetchBlacklist = async () => {
    try {
      const res = await API.get("/blacklist");
      setBlacklist(res.data);
    } catch (err) {
      console.error("AXIOS ERROR:", err.response || err.message);
      Swal.fire("Error", "Failed to fetch blacklist", "error");
    }
  };

  // Delete from blacklist
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove the vehicle from blacklist",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/blacklist/${id}`);
      Swal.fire("Removed", "Vehicle removed from blacklist", "success");
      fetchBlacklist();
    } catch (err) {
      Swal.fire("Error", "Failed to remove", "error");
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  // Add to blacklist
  const handleAddBlacklist = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Add Blacklist Entry",
      html: `
        <input id="vehicleNo" class="swal2-input" placeholder="Vehicle Number">
        <select id="idProofType" class="swal2-select">
          <option value="Aadhaar">Aadhaar</option>
          <option value="PAN">PAN</option>
          <option value="DL">Driving License</option>
        </select>
        <input id="idProofValue" class="swal2-input" placeholder="ID Proof Number">
        <input id="reason" class="swal2-input" placeholder="Reason">
      `,
      preConfirm: () => {
        const vehicleNo = document.getElementById("vehicleNo").value;
        const idProofType = document.getElementById("idProofType").value;
        const idProofValue = document.getElementById("idProofValue").value;
        const reason = document.getElementById("reason").value;

        if (!vehicleNo || !idProofValue || !reason) {
          Swal.showValidationMessage("All fields are required");
          return;
        }

        return { vehicleNo, idProof: { type: idProofType, value: idProofValue }, reason };
      },
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
    });

    if (formValues) {
      try {
        await API.post("/blacklist", formValues);
        Swal.fire("Success", "Blacklist entry added", "success");
        fetchBlacklist();
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to add", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/90 font-sans text-brown">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} adminName="Admin" />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)}></div>}

      <main className="relative z-20 px-6 md:px-12 lg:px-20 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Blacklist</h1>
          <button
            onClick={handleAddBlacklist}
            className="bg-[#7B4B2A] text-cream px-4 py-2 rounded-full shadow-lg hover:scale-105 transition transform"
          >
            Add +
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-brown/20">
              <tr>
                <th className="p-2">Vehicle No</th>
                <th className="p-2">ID Proof</th>
                <th className="p-2">Reason</th>
                <th className="p-2">Date Added</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No blacklist entries
                  </td>
                </tr>
              ) : (
                blacklist.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-cream/50">
                    <td className="p-2">{item.vehicleNo}</td>
                    <td className="p-2">{item.idProof.type}: {item.idProof.value}</td>
                    <td className="p-2">{item.reason}</td>
                    <td className="p-2">{new Date(item.dateAdded).toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(item._id)}
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
