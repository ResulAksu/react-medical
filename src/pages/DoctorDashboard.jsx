import { useState } from "react";
import { useNavigate } from "react-router-dom";

const patientsData = [
  { id: 1, name: "Max Mustermann", birthdate: "1990-01-01" },
  { id: 2, name: "Erika Musterfrau", birthdate: "1985-05-12" },
  { id: 3, name: "Hans Müller", birthdate: "1978-09-23" },
  // ...weitere Patienten
];

export default function DoctorDashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filteredPatients = patientsData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.birthdate.includes(search)
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-[#18181b] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Patient Overview</h1>
        <input
          type="text"
          placeholder="Search by name or birthdate..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 bg-black text-white placeholder-gray-500 border-gray-700"
        />
        <ul className="divide-y divide-gray-700">
          {filteredPatients.map((patient) => (
            <li
              key={patient.id}
              className="py-4 flex justify-between items-center cursor-pointer hover:bg-gray-900 rounded-lg px-2 transition"
              onClick={() => navigate(`/patient/${patient.id}`)}
            >
              <span className="font-medium text-white">{patient.name}</span>
              <span className="text-gray-400">{patient.birthdate}</span>
            </li>
          ))}
          {filteredPatients.length === 0 && (
            <li className="py-4 text-gray-400 text-center">Keine Patienten gefunden.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
