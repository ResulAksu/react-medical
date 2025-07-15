import { useState } from "react";
import { Dialog } from "@headlessui/react";

// Dummy patients for demo (should be imported/shared in real app)
const patientsData = [
  {
    id: 1,
    name: "Max Mustermann",
    birthdate: "1990-01-01",
  },
  {
    id: 2,
    name: "Anna Example",
    birthdate: "1985-05-12",
  },
];

const recordTypes = ["Lab", "Imaging", "Doctor Letters", "Medication", "Diagnoses", "Vaccinations"];

const initialUploads = [
  {
    id: 1,
    title: "Blood Test.pdf",
    patientId: 1,
    patientName: "Max Mustermann",
    birthdate: "1990-01-01",
    type: "Lab",
    summary: "Leukocytes elevated, hemoglobin normal.",
    fullText: "Leukocytes: 12,000/µl, Hemoglobin: 14 g/dl, ...",
    status: "pending",
    date: "2025-07-15"
  },
  {
    id: 2,
    title: "X-ray.jpg",
    patientId: 2,
    patientName: "Anna Example",
    birthdate: "1985-05-12",
    type: "Imaging",
    summary: "No abnormalities in the thorax.",
    fullText: "Chest X-ray: Lungs unremarkable, heart size normal, ...",
    status: "pending",
    date: "2025-07-10"
  }
];

export default function Uploads() {
  const [uploads, setUploads] = useState(initialUploads);
  const [openId, setOpenId] = useState(null);
  const selected = uploads.find(u => u.id === openId);

  // Approve upload and add to patient record
  const handleApprove = (upload) => {
    setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: "approved" } : u));
    // In real app: update patient record in global state/db
    // Demo: show alert
    alert(`Upload for ${upload.patientName} approved and added to medical record.`);
    setOpenId(null);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      <div className="w-full max-w-3xl bg-[#18181b] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">Uploads & Changes</h1>
        <div className="grid gap-6">
          {uploads.map(upload => (
            <div key={upload.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow cursor-pointer hover:bg-gray-800 transition" onClick={() => setOpenId(upload.id)}>
              <div className="font-semibold text-white">{upload.title}</div>
              <div className="text-gray-400 text-sm">Patient: {upload.patientName} ({upload.birthdate})</div>
              <div className="text-gray-400 text-sm">Type: {upload.type}</div>
              <div className="text-gray-400 text-sm">Status: <span className={upload.status === "approved" ? "text-green-400" : "text-yellow-400"}>{upload.status === "approved" ? "Approved" : "Pending"}</span></div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={!!selected} onClose={() => setOpenId(null)} className="fixed z-50 inset-0 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60" />
        <div className="bg-[#18181b] rounded-2xl shadow-xl p-8 max-w-md mx-auto relative z-10 border border-gray-700">
          <Dialog.Title className="text-xl font-bold mb-4 text-white">{selected?.title}</Dialog.Title>
          <div className="mb-2 text-gray-200">Patient: {selected?.patientName} ({selected?.birthdate})</div>
          <div className="mb-2 text-gray-200">Type: {selected?.type}</div>
          <div className="mb-2 text-gray-200">Date: {selected?.date}</div>
          <div className="mb-4 text-gray-200">Summary: {selected?.summary}</div>
          <details className="text-sm text-gray-400 mb-4">
            <summary className="cursor-pointer">Show full text</summary>
            <div className="mt-2 whitespace-pre-line">{selected?.fullText}</div>
          </details>
          {selected?.status === "pending" && (
            <button className="bg-green-700 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-800 transition" onClick={() => handleApprove(selected)}>Approve</button>
          )}
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition" onClick={() => setOpenId(null)}>Close</button>
        </div>
      </Dialog>
    </div>
  );
}
