import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function PatientCard({ patient, onToggle }) {
  return (
    <div style={{
      background: "white", borderRadius: "8px", padding: "16px",
      marginBottom: "12px", borderLeft: `4px solid ${patient.active ? "#0A5C46" : "#ccc"}`,
      opacity: patient.active ? 1 : 0.6,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: "0 0 6px" }}>{patient.name}</h3>
        <button
          onClick={() => onToggle(patient)}
          style={{
            padding: "4px 10px", fontSize: "12px", borderRadius: "4px", border: "none",
            cursor: "pointer", background: patient.active ? "#fee2e2" : "#dcfce7",
            color: patient.active ? "#dc2626" : "#16a34a"
          }}
        >
          {patient.active ? "Deactivate" : "Activate"}
        </button>
      </div>
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>📞 {patient.phone}</p>
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
        Status: {patient.active ? "✅ Active" : "❌ Inactive"}
      </p>
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#0A5C46" }}>
        💊 {patient.medications}
      </p>
    </div>
  );
}

function App() {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("all");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const { data, error } = await supabase.from("patients").select("*");
    if (error) {
      console.error("Error fetching patients:", error);
    } else {
      setPatients(data);
    }
    setLoading(false);
  }

  async function handleAddPatient() {
    if (!name || !phone) return;
    const { error } = await supabase.from("patients").insert({
      name: name,
      phone: phone,
      active: true,
      medications: "Pending assessment",
    });
    if (error) {
      console.error("Error adding patient:", error);
    } else {
      setName("");
      setPhone("");
      fetchPatients();
    }
  }

  async function handleToggle(patient) {
    const { error } = await supabase
      .from("patients")
      .update({ active: !patient.active })
      .eq("id", patient.id);
    if (error) {
      console.error("Error updating patient:", error);
    } else {
      fetchPatients();
    }
  }

  const displayed = filter === "active"
    ? patients.filter((p) => p.active)
    : patients;

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "40px auto", padding: "0 20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ color: "#0A5C46" }}>Vatrix Patient System</h1>

      <div style={{ background: "white", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 12px" }}>Register New Patient</h3>
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
        />
        <input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ display: "block", width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
        />
        <button
          onClick={handleAddPatient}
          style={{ padding: "8px 16px", background: "#0A5C46", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Add Patient
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setFilter("all")} style={{ marginRight: "8px", padding: "8px 16px", background: "#0A5C46", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          All Patients
        </button>
        <button onClick={() => setFilter("active")} style={{ padding: "8px 16px", background: "#0A5C46", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Active Only
        </button>
      </div>

      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <>
          <p>{displayed.length} patients shown.</p>
          {displayed.map((patient) => (
            <PatientCard key={patient.id} patient={patient} onToggle={handleToggle} />
          ))}
        </>
      )}
    </div>
  );
}

export default App;