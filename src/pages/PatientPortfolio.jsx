import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadPatients } from "../data/storageService";
import ChatBot from "react-chatbotify";
import { 
  UserIcon, 
  CalendarIcon, 
  MapPinIcon, 
  IdentificationIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  EyeIcon
} from "@heroicons/react/24/outline";


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
  
  // Handle both string and numeric IDs
  const patient = patients.find((p) => {
    // First try exact string match, then try numeric match
    return p.id === id || p.id === Number(id);
  });
  
  const recordTypes = [
    "lab",
    "imaging",
    "doctor letters",
    "medication",
    "diagnoses",
    "vaccinations",
  ];
  const [activeType, setActiveType] = useState("Lab");

  // Chatbot configuration
  const flow = {
    start: {
      message: `Hello! I'm here to help you with questions about ${patient?.name || "this patient"}'s portfolio. What would you like to know?`,
      path: "ask_question"
    },
    ask_question: {
      message: (params) => {
        // Send user input to the API endpoint
        return callAPI(params.userInput);
      },
      path: "ask_question"
    }
  };

  const callAPI = async (userInput) => {
    try {
      const response = await fetch('https://wq334rhdyj.execute-api.us-east-1.amazonaws.com/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userInput
        })
      });
      
      const data = await response.json();
      console.log('API response:', data);
      return data.response || "I'm sorry, I couldn't process your question. Please try again.";
    } catch (error) {
      console.error('Error calling API:', error);
      return "I'm sorry, there was an error processing your question. Please try again.";
    }
  };

  const settings = {
    general: {
      primaryColor: "#3b82f6",
      secondaryColor: "#1f2937",
      fontFamily: "Arial, sans-serif",
    },
    chatWindow: {
      showMessagePrompt: true,
      messagePromptText: "Ask me about this patient's portfolio...",
      autoJumpToBottom: true,
    },
    header: {
      title: "Portfolio Assistant",
      showAvatar: true,
    },
    tooltip: {
      mode: "CLOSE",
      text: "Ask questions about the patient portfolio"
    },
    chatButton: {
      icon: "💬",
    },
    footer: {
      text: "Medical Portfolio Assistant"
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Patient Not Found</h2>
          <p className="text-gray-400">The requested patient portfolio could not be located.</p>
        </div>
      </div>
    );
  }

  // Calculate patient stats
  const totalRecords = patient.records?.length || 0;
  const approvedRecords = patient.records?.filter(r => r.status === "approved").length || 0;
  const pendingRecords = patient.records?.filter(r => r.status === "pending").length || 0;

  // Get initials for avatar
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || "?";
  };

  // Get record type icon
  const getRecordIcon = (type) => {
    switch (type) {
      case "lab": return "🧪";
      case "imaging": return "📷";
      case "doctor letters": return "📄";
      case "medication": return "💊";
      case "diagnoses": return "🔍";
      case "vaccinations": return "💉";
      default: return "📋";
    }
  };

  // Nur freigegebene Records anzeigen
  const recordsByType =
    patient.records?.filter(
      (r) => r.type === activeType && r.status === "approved"
    ) || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Patient Portfolio</h1>
          <p className="text-gray-400">Comprehensive medical record overview</p>
        </div>

        {/* Patient Information Card */}
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Patient Avatar and Basic Info */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {getInitials(patient.name)}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{patient.name}</h2>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Born: {patient.birthdate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Stats */}
            <div className="flex gap-6 lg:ml-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{totalRecords}</div>
                <div className="text-sm text-gray-400">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{approvedRecords}</div>
                <div className="text-sm text-gray-400">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{pendingRecords}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            </div>
          </div>

          {/* Detailed Patient Information */}
          <div className="grid md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Address</p>
                <p className="text-white">{patient.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IdentificationIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Insurance</p>
                <p className="text-white">{patient.insurance}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Medical History</p>
                <p className="text-white">{patient.history}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Record Type Navigation */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Medical Records</h3>
          <div className="flex flex-wrap gap-3">
            {recordTypes.map((type) => {
              const recordCount = patient.records?.filter(r => r.type === type && r.status === "approved").length || 0;
              return (
                <button
                  key={type}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeType === type 
                      ? "bg-blue-600 text-white shadow-lg scale-105" 
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveType(type)}
                >
                  <span className="text-lg">{getRecordIcon(type)}</span>
                  <span>{type}</span>
                  {recordCount > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeType === type ? "bg-blue-800" : "bg-gray-700"
                    }`}>
                      {recordCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Records Display */}
        <div className="mb-8">
          {recordsByType.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No {activeType} Records</h3>
              <p className="text-gray-500">No approved records found for this category.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {recordsByType.map((record, idx) => (
                <div key={idx} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{record.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {record.date}
                          </span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Approved
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Summary</h5>
                    <p className="text-white">{record.summary}</p>
                  </div>
                  
                  <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-blue-400 hover:text-blue-300 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                      <span className="font-medium">View Full Report</span>
                    </summary>
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg border-l-4 border-blue-500">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Full Text</h5>
                      <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                        {record.fullText}
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Chatbot positioned at bottom right */}
      <ChatBot 
        flow={flow} 
        settings={settings}
      />
    </div>
  );
}
