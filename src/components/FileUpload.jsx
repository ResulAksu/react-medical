import { useState } from "react";
import { CloudArrowUpIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center bg-[#18181b] shadow-md">
      <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-2" />
      <h3 className="text-lg font-semibold mb-2 text-white">Upload file</h3>
      <input type="file" onChange={handleFileChange} className="mb-4 text-white bg-gray border-gray-700 rounded px-2 py-1" />
      <button
        onClick={handleUpload}
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition"
      >
        <CheckCircleIcon className="h-5 w-5" /> Upload & Analyse
      </button>
    </div>
  );
}
