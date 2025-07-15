import { useParams } from "react-router-dom";
import { useState } from "react";

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
        status: "approved"
      },
      {
        type: "Imaging",
        title: "X-ray",
        date: "2025-07-10",
        summary: "No abnormalities in the thorax.",
        fullText: "Chest X-ray: Lungs unremarkable, heart size normal, ...",
        status: "pending"
      }
    ],
    changelog: [
      { date: "2025-07-15", action: "Upload", type: "Lab", status: "approved" },
      { date: "2025-07-10", action: "Upload", type: "Imaging", status: "pending" }
    ]
  },
  // More patients ...
];

const recordTypes = ["Lab", "Imaging", "Doctor Letters", "Medication", "Diagnoses", "Vaccinations"];

export default function PatientPortfolio() {
  const { id } = useParams();
  const [activeType, setActiveType] = useState("Lab");
  const patient = patientsData.find(p => p.id === Number(id));

  if (!patient) {
    return <div className="min-h-screen flex items-center justify-center">Patient not found.</div>;
  }

  // Nur freigegebene Records anzeigen
  const recordsByType = patient.records.filter(r => r.type === activeType && r.status === "approved");

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      <div className="w-full max-w-3xl bg-[#18181b] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">Medical Record</h1>
        {/* Personal Information */}
        <div className="mb-8">
          <div className="text-xl font-semibold text-white mb-2 text-center">{patient.name}</div>
          <div className="flex flex-col md:flex-row md:justify-center gap-4 text-gray-400 text-center mb-2">
            <div>Birthdate: <span className="font-medium text-white">{patient.birthdate}</span></div>
            <div>Address: <span className="font-medium text-white">{patient.address}</span></div>
            <div>Insurance: <span className="font-medium text-white">{patient.insurance}</span></div>
          </div>
          <div className="text-gray-400 text-center mb-2">Medical History: <span className="font-medium text-white">{patient.history}</span></div>
        </div>
        {/* Tabs for Medical Sections */}
        <div className="mb-6 overflow-x-auto w-full">
          <div className="flex gap-2 min-w-max justify-center px-2">
            {recordTypes.map(type => (
              <button
                key={type}
                className={`px-3 py-2 rounded-lg font-medium shadow transition border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 whitespace-nowrap ${activeType === type ? 'bg-gray-800 text-white' : 'bg-[#18181b] text-gray-400 hover:bg-gray-900'}`}
                onClick={() => setActiveType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        {/* Records by Type */}
        <div className="mb-8">
          {recordsByType.length === 0 ? (
            <div className="text-gray-400 text-center">No approved entries for {activeType} available.</div>
          ) : (
            recordsByType.map((record, idx) => (
              <div key={idx} className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">{record.title}</span>
                  <span className="text-green-400">Approved</span>
                </div>
                <div className="text-gray-200 mb-2">{record.summary}</div>
                <details className="text-sm text-gray-400">
                  <summary className="cursor-pointer">Show full text</summary>
                  <div className="mt-2 whitespace-pre-line">{record.fullText}</div>
                </details>
              </div>
            )))}
        </div>
      </div>
      {/* Changelog separat */}
      <div className="w-full max-w-3xl bg-[#18181b] rounded-2xl shadow-2xl p-8 border border-gray-800 mt-8">
        <h2 className="text-lg font-bold text-white mb-2">Changelog</h2>
        <ul className="divide-y divide-gray-700">
          {patient.changelog.length === 0 && (
            <li className="py-4 text-gray-400 text-center">No changes available.</li>
          )}
          {patient.changelog.map((entry, idx) => (
            <li key={idx} className="py-2 flex justify-between items-center text-sm">
              <span className="text-white">{entry.date}</span>
              <span className="text-gray-200">{entry.action} ({entry.type})</span>
              <span className={entry.status === "approved" ? "text-green-400" : "text-yellow-400"}>{entry.status === "approved" ? "Approved" : "Pending"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
