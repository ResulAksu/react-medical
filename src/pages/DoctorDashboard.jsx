import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadPatients, loadUploads } from "../data/storageService";
import { 
  UserGroupIcon, 
  DocumentCheckIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon,
  FunnelIcon,
  EyeIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

export default function DoctorDashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [patients, setPatients] = useState([]);
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate();

  // Load data from localStorage
  useEffect(() => {
    const loadedPatients = loadPatients();
    const loadedUploads = loadUploads();
    setPatients(loadedPatients);
    setUploads(loadedUploads);
  }, []);

  // Calculate dynamic patient data
  const patientsWithStats = patients.map(patient => {
    // Count pending uploads for this patient
    const pendingDocs = uploads.filter(upload => 
      upload.patientId === patient.id && upload.status === "pending"
    ).length;
    
    // Count total records (approved uploads + existing records)
    const approvedUploads = uploads.filter(upload => 
      upload.patientId === patient.id && upload.status === "approved"
    ).length;
    const totalRecords = (patient.records?.length || 0) + approvedUploads;

    return {
      ...patient,
      name: patient.name || "Unknown Patient",
      birthdate: patient.birthdate || "Unknown",
      lastVisit: "2025-07-15", // You could add this to patient data
      status: pendingDocs > 0 ? "pending" : "active",
      pendingDocs,
      totalRecords,
      condition: patient.history || "No condition specified"
    };
  });
  
  const filteredPatients = patientsWithStats.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.birthdate.includes(search) ||
                         p.condition.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "pending" && p.pendingDocs > 0) ||
                         (filter === "active" && p.status === "active");
    
    return matchesSearch && matchesFilter;
  });

  // Dashboard stats
  const totalPatients = patientsWithStats.length;
  const pendingReviews = patientsWithStats.reduce((sum, p) => sum + p.pendingDocs, 0);
  const activePatients = patientsWithStats.filter(p => p.status === "active").length;
  const recentActivity = uploads.filter(upload => {
    const uploadDate = new Date(upload.date);
    const today = new Date();
    const daysDiff = (today - uploadDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7; // Activity in last 7 days
  }).length;

  const stats = [
    {
      name: "Total Patients",
      value: totalPatients,
      icon: UserGroupIcon,
      color: "blue"
    },
    {
      name: "Pending Reviews",
      value: pendingReviews,
      icon: ClockIcon,
      color: "yellow"
    },
    {
      name: "Active Patients",
      value: activePatients,
      icon: DocumentCheckIcon,
      color: "green"
    },
    {
      name: "Recent Activity",
      value: recentActivity,
      icon: ChatBubbleLeftRightIcon,
      color: "purple"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-400/10";
      case "pending": return "text-yellow-400 bg-yellow-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Doctor Dashboard</h1>
          <p className="text-gray-400">Manage your patients and review medical documents</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search patients by name, birthdate, or condition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="all">All Patients</option>
                <option value="active">Active Only</option>
                <option value="pending">Pending Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/patient/${patient.id}`)}
            >
              {/* Patient Header */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {getInitials(patient.name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {patient.name}
                  </h3>
                  <p className="text-gray-400 text-sm">Born: {patient.birthdate}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </div>
              </div>

              {/* Patient Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                  <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-400">Last Visit:</span>
                  <span className="text-white ml-2">{patient.lastVisit}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Condition:</span>
                  <span className="text-white ml-2">{patient.condition}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{patient.totalRecords}</p>
                  <p className="text-xs text-gray-400">Total Records</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${patient.pendingDocs > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {patient.pendingDocs}
                  </p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
                <div className="flex items-center justify-center">
                  <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    <EyeIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No patients found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
