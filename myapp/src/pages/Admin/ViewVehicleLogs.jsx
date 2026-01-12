// src/pages/Admin/ViewVehicleLogs.jsx

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar1";
import Footer from "../../components/Footer";

export default function ViewVehicleLogs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [insideCount, setInsideCount] = useState(0);
  const [outsideCount, setOutsideCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(false);
  // const backendUrl = "http://localhost:5000/api";

const backendUrl = "http://localhost:4000/vehiclelogs";

  // -------------------------------
  // Fetch vehicle logs
  // -------------------------------
  const fetchVehicleLogs = async () => {
  try {
    setLoading(true);

    const res = await fetch(
       `${backendUrl}?page=${page}&limit=${limit}&status=${statusFilter}`,{ method: "GET" }
      
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const result = await res.json();
    
    console.log(result.data);
    setLogs(result.data || []);
    setInsideCount(result.total_entry || 0);
    setOutsideCount(result.total_exit || 0);
    // alert("outside ");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Unable to load vehicle logs", "error");
  } finally {
    setLoading(false);
  }
};


  // -------------------------------
  // Load on page / filter change
  // -------------------------------
  useEffect(() => {
    fetchVehicleLogs();
  }, [page, statusFilter]);

  // // -------------------------------
  // Search filter
  // -------------------------------
  const filteredLogs = logs.filter((log) =>
    (log.vehicleNo || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7eddc] to-[#efe0c6]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="px-8 py-24 text-[#5C3A21]">
        <div className="max-w-7xl mx-auto bg-[#fffaf4] rounded-[2.5rem] shadow-[0_25px_70px_rgba(123,75,42,0.25)] p-10">

          <h2 className="text-4xl font-extrabold text-center mb-2">
            Vehicle Logs
          </h2>
          <p className="text-center opacity-70 mb-10">
            Live vehicle entry & exit records
          </p>

          {/* COUNTS */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-green-100 rounded-2xl p-6 text-center shadow">
              <p className="text-lg font-semibold text-green-800">
                Vehicles Inside
              </p>
              <p className="text-4xl font-extrabold text-green-700">
                {insideCount}
              </p>
            </div>

            <div className="bg-red-100 rounded-2xl p-6 text-center shadow">
              <p className="text-lg font-semibold text-red-800">
                Vehicles Exited
              </p>
              <p className="text-4xl font-extrabold text-red-700">
                {outsideCount}
              </p>
            </div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex flex-wrap gap-4 justify-between mb-6">
            <input
              type="text"
              placeholder="Search by Vehicle Number"
              className="p-3 rounded-xl border w-full md:w-1/2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="p-3 rounded-xl border"
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
            >
              <option value="all">All</option>
              <option value="ENTRY">Inside</option>
              <option value="EXIT">Exited</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#7B4B2A] text-white">
                  <th className="p-4 text-left">Vehicle No</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Source</th>
                  <th className="p-4 text-left">Movement</th>
                  <th className="p-4 text-left">Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log, i) => (
                  <tr
                    key={i}
                    className={`border-b ${
                      log.movementType === "ENTRY"
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <td className="p-4 font-semibold">
                      {log.vehicleNo || "—"}
                    </td>
                    <td className="p-4 capitalize">
                      {log.category || "manual"}
                    </td>
                    <td className="p-4">{log.source.type}</td>
                    <td className="p-4 font-bold">
                      {log.movementType === "ENTRY"
                        ? "🟢 ENTRY"
                        : "🔴 EXIT"}
                    </td>
                    <td className="p-4">
                      {log.scanTime
                        ? new Date(log.scanTime).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <p className="text-center mt-6 font-semibold">
              Loading vehicle logs…
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
