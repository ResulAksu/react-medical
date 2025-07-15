import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SummaryCard({ summary, approved, onApprove }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircleIcon className={`h-6 w-6 ${approved ? 'text-green-500' : 'text-gray-400'}`} />
        <h2 className="text-xl font-semibold">Analyse-Zusammenfassung</h2>
      </div>
      <p className="text-gray-700 mb-4">{summary}</p>
      {!approved ? (
        <button
          onClick={onApprove}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          Beitrag freigeben
        </button>
      ) : (
        <span className="text-green-600 font-medium">Freigegeben</span>
      )}
    </div>
  );
}
