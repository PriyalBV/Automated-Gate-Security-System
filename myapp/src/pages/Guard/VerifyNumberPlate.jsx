import { useState } from "react";
import HeaderNavbar from "../../components/HeaderNavbar2";
import Sidebar from "../../components/Sidebar2";
import Footer from "../../components/Footer";

export default function VerifyNumberPlate() {
  const [image, setImage] = useState(null);
  const [detectedPlate, setDetectedPlate] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SCAN_URL = "http://localhost:4000/scan_plate";

  const handleScan = async () => {
    if (!image) {
      alert("Please upload a vehicle image");
      return;
    }

    setLoading(true);
    setDetectedPlate("");
    setStatus("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("vehicle_type", "four");

      const res = await fetch(SCAN_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (!data.plate) {
        setStatus("NOT DETECTED");
        setMessage("Retry scan or enter manually");
        return;
      }

      setDetectedPlate(data.plate);
      {data?.category && (
        <p className="mt-2 text-sm font-semibold uppercase opacity-80">
          {data.category} vehicle
        </p>
      )}

      setStatus(data.status);
      setMessage(data.message);
      // setStatus(data.access);      // ← THIS IS THE FIX
      // setMessage(data.message);



    } catch {
      setLoading(false);
      setStatus("ERROR");
      setMessage("Server error — try again");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7eddc] via-[#f3e5cf] to-[#efe0c6] text-[#5C3A21]">
      <HeaderNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex justify-center items-center px-6 py-20">
        <div className="bg-[#fffaf4] rounded-[2.5rem] shadow-[0_25px_70px_rgba(123,75,42,0.25)] border border-[#7B4B2A]/30 w-full max-w-2xl p-12">

          <h2 className="text-3xl font-extrabold text-center">
            Vehicle Number Plate Verification
          </h2>

          <p className="text-center opacity-80 mb-10">
            Automated Gate Security System – AGSS-BV
          </p>

          <label className="block text-sm font-semibold mb-2">
            Upload Vehicle Image
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full mt-6 rounded-2xl border"
            />
          )}

          <button
            onClick={handleScan}
            className="w-full mt-8 bg-gradient-to-r from-[#7B4B2A] to-[#5C3A21] text-white py-4 rounded-2xl font-bold text-lg"
          >
            Scan Number Plate
          </button>

          {loading && <p className="text-center mt-6">Processing image…</p>}

          {detectedPlate && (
            <div className="mt-6 text-center bg-[#f3e5cf] py-4 rounded-2xl">
              <p className="text-sm opacity-70">Detected Plate</p>
              <p className="text-2xl font-extrabold tracking-widest">
                {detectedPlate}
              </p>
            </div>
          )}

          {status && (
            <div className="mt-6 text-center">
              <p
                className={`text-xl font-bold ${
                  status === "ALLOWED" ? "text-green-700" : "text-red-700"
                }`}
              >
                {status}
              </p>
              <p className="mt-2 text-sm opacity-80">{message}</p>

              {status !== "ALLOWED" && (
                <p className="mt-4 text-sm italic opacity-70">
                  Please retry scan or proceed with manual verification
                </p>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
