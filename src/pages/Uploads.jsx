import { useState, useEffect } from "react";
import { Dialog, DialogTitle } from "@headlessui/react";
import {
  loadPatients,
  savePatients,
  loadUploads,
  saveUploads,
} from "../data/storageService";
import FileUpload from "../components/FileUpload";
import {
  DocumentArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";


const LS_UPLOADS_KEY = "medical_uploads";
const LS_PATIENTS_KEY = "medical_patients";


export default function Uploads() {
  const [uploads, setUploads] = useState(loadUploads);
  const [patients, setPatients] = useState(loadPatients);
  const [openId, setOpenId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    saveUploads(uploads);
  }, [uploads]);

  useEffect(() => {
    savePatients(patients);
  }, [patients]);

  // Fetch uploads from API on component mount (only once)
  useEffect(() => {
    // Only fetch if we don't have any uploads yet, or user explicitly requests refresh
    const hasExistingUploads = uploads.length > 0;
    if (!hasExistingUploads) {
      fetchUploadsFromAPI();
    }
  }, []); // Empty dependency array means this only runs once on mount

  // Fetch uploads from the patient endpoint
  const fetchUploadsFromAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://wq334rhdyj.execute-api.us-east-1.amazonaws.com/patient');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch uploads: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response for uploads:', data);

      // Check if data is an array (as shown in the API response)
      const documents = Array.isArray(data) ? data : [data];
      
      if (documents.length === 0) {
        console.log('No documents found in response');
        return;
      }

      // Process each document in the array
      const newUploads = [];
      
      for (const doc of documents) {
        // Check if analysisResult exists and is valid
        if (!doc.analysisResult) {
          console.log('No analysisResult found in document:', doc);
          continue;
        }

        let analysisData;
        
        // Handle both string and object formats
        if (typeof doc.analysisResult === 'string') {
          try {
            analysisData = JSON.parse(doc.analysisResult);
          } catch (parseError) {
            console.error('Error parsing analysisResult string:', parseError);
            continue;
          }
        } else if (typeof doc.analysisResult === 'object') {
          analysisData = doc.analysisResult;
        } else {
          console.error('analysisResult is neither string nor object:', typeof doc.analysisResult);
          continue;
        }

        // Validate that we have the required data
        if (!analysisData || typeof analysisData !== 'object') {
          console.error('Invalid analysisData:', analysisData);
          continue;
        }

        // Create upload entry from API data
        const apiUpload = {
          id: doc.responseId,
          title: analysisData.title || "Document",
          patientName: analysisData.patient || "Unknown Patient",
          birthdate: "Unknown", // Not provided in the API response
          patientId: doc.patientId || "PATIENT1", // Use the patientId from API
          type: analysisData.type.toLowerCase() || "lab",
          date: analysisData.date || new Date().toISOString().split('T')[0],
          summary: analysisData.summary || "Analysis pending...",
          fullText: analysisData.originalText || "Full analysis text will appear here...",
          status: "pending"
        };
        newUploads.push(apiUpload);
      }

      // Update uploads state with new documents
      setUploads(prev => {
        const updated = [...prev];
        
        newUploads.forEach(newUpload => {
          const existingIndex = updated.findIndex(upload => upload.id === newUpload.id);
          if (existingIndex >= 0) {
            // Preserve the existing status if document was already processed
            const existingUpload = updated[existingIndex];
            if (existingUpload.status === "approved" || existingUpload.status === "not approved") {
              // Keep the existing processed document, don't overwrite with API data
              console.log(`Preserving existing status "${existingUpload.status}" for document ${newUpload.id}`);
              return;
            } else {
              // Update with new data but keep existing status if it's not pending
              updated[existingIndex] = {
                ...newUpload,
                status: existingUpload.status
              };
            }
          } else {
            // Add new upload (will be pending by default)
            updated.push(newUpload);
          }
        });
        
        return updated;
      });

      console.log(`Fetched ${newUploads.length} documents successfully:`, newUploads);

    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    saveUploads(uploads);
  }, [uploads]);

  useEffect(() => {
    savePatients(patients);
  }, [patients]);
  
  const selected = uploads.find((u) => u.id === openId);

  // Filter uploads based on status
  const filteredUploads = uploads.filter(upload => {
    if (filter === "all") return true;
    return upload.status === filter;
  });

  // Calculate stats
  const totalUploads = uploads.length;
  const pendingUploads = uploads.filter(u => u.status === "pending").length;
  // Use session counts for approved/rejected instead of filtering uploads
  // since approved/rejected documents are removed from the uploads queue

  const stats = [
    {
      name: "Queue Total",
      value: totalUploads,
      icon: DocumentArrowUpIcon,
      color: "blue"
    },
    {
      name: "Pending Review",
      value: pendingUploads,
      icon: ClockIcon,
      color: "yellow"
    },
    {
      name: "Approved Today",
      value: approvedCount,
      icon: CheckCircleIcon,
      color: "green"
    },
    {
      name: "Rejected Today",
      value: rejectedCount,
      icon: XCircleIcon,
      color: "red"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return CheckCircleIcon;
      case "not approved": return XCircleIcon;
      case "pending": return ClockIcon;
      default: return DocumentTextIcon;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "not approved": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "pending": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case "Lab": return "🧪";
      case "Imaging": return "📷";
      case "Doctor Letters": return "📄";
      case "Medication": return "💊";
      case "Diagnoses": return "🔍";
      case "Vaccinations": return "💉";
      default: return "📋";
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:application/pdf;base64, prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file upload and analysis
  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Convert file to base64
      const base64Data = await fileToBase64(file);

      // Send to analysis endpoint
      const response = await fetch('https://wq334rhdyj.execute-api.us-east-1.amazonaws.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfData: base64Data
        })
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const analysisResult = await response.json();

      // File uploaded and analyzed successfully
      console.log('File analyzed successfully:', analysisResult);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Approve upload and add to patient record
  const handleApprove = (upload) => {
    // Remove the approved upload from the queue
    const updatedUploads = uploads.filter((u) => u.id !== upload.id);

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
              date: new Date().toISOString().split('T')[0],
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
    setApprovedCount(prev => prev + 1);  // Increment approved count
    setOpenId(null);
  };

  const handleNotApprove = (upload) => {
    // Remove the rejected upload from the queue
    const updatedUploads = uploads.filter((u) => u.id !== upload.id);
    setUploads(updatedUploads);
    setRejectedCount(prev => prev + 1);  // Increment rejected count
    setFeedback("");
    setOpenId(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Document Management</h1>
          <p className="text-gray-400">Upload, analyze, and manage medical documents</p>
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

        {/* Upload Section */}
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <DocumentArrowUpIcon className="h-6 w-6 text-blue-400" />
              Upload New Document
            </h2>
            <p className="text-gray-400">Upload medical documents for AI analysis and review</p>
          </div>
          
          <FileUpload onUpload={handleFileUpload} />
          
          {/* Upload Status */}
          {isUploading && (
            <div className="mt-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                <span className="text-blue-200">Uploading and analyzing document...</span>
              </div>
            </div>
          )}
          
          {uploadError && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <span className="text-red-200">Error: {uploadError}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold">Document Queue</h3>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="all">All Documents</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="not approved">Rejected</option>
              </select>
            </div>
            
            <button
              onClick={fetchUploadsFromAPI}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <DocumentArrowUpIcon className="h-4 w-4" />
                  <span>Refresh Documents</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredUploads.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No Documents Found</h3>
            <p className="text-gray-500">
              {filter === "all" 
                ? "Upload your first document to get started" 
                : `No documents with status: ${filter}`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredUploads.map((upload) => {
              const StatusIcon = getStatusIcon(upload.status);
              return (
                <div
                  key={upload.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-all duration-300 cursor-pointer group"
                  onClick={() => setOpenId(upload.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {getDocumentTypeIcon(upload.type)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {upload.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            {upload.patientName}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {upload.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(upload.status)}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-sm font-medium capitalize">
                        {upload.status === "not approved" ? "Rejected" : upload.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium">Type:</span> {upload.type}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="text-sm text-gray-400">
                      Click to review document details
                    </div>
                    <EyeIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Dialog */}
      <Dialog open={!!selected} onClose={() => setOpenId(null)}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-60" aria-hidden="true" />
          <div className="bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-gray-700">
            {/* Dialog Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {getDocumentTypeIcon(selected?.type)}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl font-bold text-white">
                    {selected?.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {selected && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selected.status)}`}>
                        <span className="h-3 w-3 flex items-center justify-center">
                          {selected.status === "approved" && <CheckCircleIcon className="h-3 w-3" />}
                          {selected.status === "not approved" && <XCircleIcon className="h-3 w-3" />}
                          {selected.status === "pending" && <ClockIcon className="h-3 w-3" />}
                        </span>
                        <span className="capitalize">
                          {selected.status === "not approved" ? "Rejected" : selected.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Patient:</span>
                    <span className="text-white">{selected?.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Type:</span>
                    <span className="text-white">{selected?.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Date:</span>
                    <span className="text-white">{selected?.date}</span>
                  </div>
                </div>
              </div>

              {selected?.summary && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Summary</h4>
                  <p className="text-white bg-gray-800 p-4 rounded-lg">{selected.summary}</p>
                </div>
              )}

              {selected?.fullText && (
                <details className="mb-6 group">
                  <summary className="flex items-center gap-2 cursor-pointer text-blue-400 hover:text-blue-300 transition-colors mb-3">
                    <EyeIcon className="h-4 w-4" />
                    <span className="font-medium">View Full Document</span>
                  </summary>
                  <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                      {selected.fullText}
                    </div>
                  </div>
                </details>
              )}

              {/* Actions for pending documents */}
              {selected?.status === "pending" && (
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 font-semibold mb-2">
                      <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
                      Feedback (if rejecting):
                    </label>
                    <textarea
                      className="w-full bg-gray-800 text-gray-200 rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
                      rows="3"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide feedback for the document submitter..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      onClick={() => handleApprove(selected)}
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      onClick={() => handleNotApprove(selected)}
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="p-6 border-t border-gray-800">
              <button
                className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setOpenId(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
