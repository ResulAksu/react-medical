import { useState, useEffect } from "react";
import { Dialog, DialogTitle } from "@headlessui/react";
import {
  loadPatients,
  savePatients,
  loadUploads,
  saveUploads,
} from "../data/storageService";


const LS_UPLOADS_KEY = "medical_uploads";
const LS_PATIENTS_KEY = "medical_patients";


export default function Uploads() {
  const [uploads, setUploads] = useState(loadUploads);
  const [patients, setPatients] = useState(loadPatients);
  const [openId, setOpenId] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    saveUploads(uploads);
  }, [uploads]);

  useEffect(() => {
    savePatients(patients);
  }, [patients]);
  const selected = uploads.find((u) => u.id === openId);

  // Persistiere Uploads und Patienten bei Änderung
  useEffect(() => {
    localStorage.setItem(LS_UPLOADS_KEY, JSON.stringify(uploads));
  }, [uploads]);
  useEffect(() => {
    localStorage.setItem(LS_PATIENTS_KEY, JSON.stringify(patients));
  }, [patients]);

  // Approve upload and add to patient record
  const handleApprove = (upload) => {
    const updatedUploads = uploads.map((u) =>
      u.id === upload.id ? { ...u, status: "approved" } : u
    );

    const updatedPatients = patients.map((p) => {
      if (p.id === upload.patientId) {
        return {
          ...p,
          records: [
            ...(p.records || []),
            {
              type: upload.type,
              title: upload.title.replace(/\.[^.]+$/, ""),
              date: upload.date,
              summary: upload.summary,
              fullText: upload.fullText,
              status: "approved",
            },
          ],
          changelog: [
            ...(p.changelog || []),
            {
              date: upload.date,
              action: "Upload",
              type: upload.type,
              status: "approved",
            },
          ],
        };
      }
      return p;
    });

    setUploads(updatedUploads);
    setPatients(updatedPatients);
    setOpenId(null);
  };

  const handleNotApprove = (upload) => {
    const updatedUploads = uploads.map((u) =>
      u.id === upload.id ? { ...u, status: "not approved" } : u
    );
    setUploads(updatedUploads);
    setFeedback("");
    setOpenId(null);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      <div className="w-full max-w-3xl bg-[#18181b] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
          Uploads & Changes
        </h1>
        <div className="grid gap-6">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow cursor-pointer hover:bg-gray-800 transition"
              onClick={() => setOpenId(upload.id)}
            >
              <div className="font-semibold text-white">{upload.title}</div>
              <div className="text-gray-400 text-sm">
                Patient: {upload.patientName} ({upload.birthdate})
              </div>
              <div className="text-gray-400 text-sm">Type: {upload.type}</div>
              <div className="text-gray-400 text-sm">
                Status:{" "}
                <span
                  className={
                    upload.status === "approved"
                      ? "text-green-400"
                      : upload.status === "not approved"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }
                >
                  {upload.status === "approved"
                    ? "Approved"
                    : upload.status === "not approved"
                    ? "Not Approved"
                    : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={!!selected} onClose={() => setOpenId(null)}>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-60"
            aria-hidden="true"
          />
          <div className="bg-[#18181b] rounded-2xl shadow-xl p-8 max-w-md mx-auto relative z-10 border border-gray-700">
            <DialogTitle className="text-xl font-bold mb-4 text-white">
              {selected?.title}
            </DialogTitle>
            <div className="mb-2 text-gray-200">
              Patient: {selected?.patientName} ({selected?.birthdate})
            </div>
            <div className="mb-2 text-gray-200">Type: {selected?.type}</div>
            <div className="mb-2 text-gray-200">Date: {selected?.date}</div>
            <div className="mb-4 text-gray-200">
              Summary: {selected?.summary}
            </div>
            <details className="text-sm text-gray-400 mb-4">
              <summary className="cursor-pointer">Show full text</summary>
              <div className="mt-2 whitespace-pre-line">
                {selected?.fullText}
              </div>
            </details>
            {selected?.status === "pending" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-400 font-semibold mb-2">
                    Feedback (if not approved):
                  </label>
                  <textarea
                    className="w-full bg-gray-800 text-gray-200 rounded-lg p-2"
                    rows="3"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback for the agent..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                    onClick={() => handleApprove(selected)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
                    onClick={() => handleNotApprove(selected)}
                  >
                    Not Approve
                  </button>
                </div>
              </>
            )}
            <button
              className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              onClick={() => setOpenId(null)}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
