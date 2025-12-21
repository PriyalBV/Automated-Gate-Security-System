import React, { useState } from "react";

function AddStudent() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rfid, setRfid] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name, role, rfid };

    const res = await fetch("http://localhost:5000/add-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setMessage(result.message);
  };

  return (
    <div style={{ margin: "50px" }}>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />
        <input
          type="text"
          placeholder="Enter role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        /><br /><br />
        <input
          type="text"
          placeholder="Enter RFID"
          value={rfid}
          onChange={(e) => setRfid(e.target.value)}
        /><br /><br />
        <button type="submit">Add Student</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddStudent;
