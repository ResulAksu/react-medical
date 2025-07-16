import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadPatients } from "../data/storageService";

const patientsData = [
  {
    id: 1,
    name: "Max Mustermann",
    birthdate: "1990-01-01",
    address: "Sample Street 1, 12345 Sample City",
    insurance: "AOK",
    history: "No pre-existing conditions.",
    records: [
      {
        type: "Lab",
        title: "Blood Test",
        date: "2025-07-15",
        summary: "Leukocytes elevated, hemoglobin normal.",
        fullText: "Leukocytes: 12,000/µl, Hemoglobin: 14 g/dl, ...",
        status: "approved",
      },
      {
        type: "Imaging",
        title: "X-ray",
        date: "2025-07-10",
        summary: "No abnormalities in the thorax.",
        fullText: "Chest X-ray: Lungs unremarkable, heart size normal, ...",
        status: "pending",
      },
    ],
    changelog: [
      { date: "2025-07-15", action: "Upload", type: "Lab", status: "approved" },
      {
        date: "2025-07-10",
        action: "Upload",
        type: "Imaging",
        status: "pending",
      },
    ],
  },
  // More patients ...
];

const recordTypes = [
  "Lab",
  "Imaging",
  "Doctor Letters",
  "Medication",
  "Diagnoses",
  "Vaccinations",
];

export default function PatientPortfolio() {
  const { id } = useParams();
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const loaded = loadPatients();
    setPatients(loaded);
  }, []);
  const patient = patients.find((p) => p.id === Number(id));
  const recordTypes = [
    "Lab",
    "Imaging",
    "Doctor Letters",
    "Medication",
    "Diagnoses",
    "Vaccinations",
  ];
  const [activeType, setActiveType] = useState("Lab");

  if (!patient) {
    return <div className="text-center text-white">Patient not found.</div>;
  }

  // Nur freigegebene Records anzeigen
  const recordsByType =
    patient.records?.filter(
      (r) => r.type === activeType && r.status === "approved"
    ) || [];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Patient Portfolio</h1>
      <div className="text-center mb-4">
        <div className="text-xl">{patient.name}</div>
        <div>{patient.birthdate}</div>
        <div>{patient.address}</div>
        <div>{patient.insurance}</div>
        <div className="italic">{patient.history}</div>
      </div>
      <div className="flex gap-2 justify-center mb-4">
        {recordTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded ${
              activeType === type ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => setActiveType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div>
        {recordsByType.length === 0 ? (
          <div className="text-gray-400 text-center">
            No records for {activeType}
          </div>
        ) : (
          recordsByType.map((record, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded mb-2">
              <div className="flex justify-between">
                <div>{record.title}</div>
                <div className="text-green-400">Approved</div>
              </div>
              <div>{record.summary}</div>
              <details>
                <summary className="cursor-pointer text-blue-400">
                  Show full text
                </summary>
                <div>{record.fullText}</div>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
