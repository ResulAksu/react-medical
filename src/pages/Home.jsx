import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  CloudArrowUpIcon,
  ShieldCheckIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      icon: CloudArrowUpIcon,
      title: "Secure Document Upload",
      description: "Upload medical documents securely with automatic analysis and processing."
    },
    {
      icon: CpuChipIcon,
      title: "AI-Powered Analysis",
      description: "Advanced AI automatically analyzes and summarizes medical documents for quick review."
    },
    {
      icon: UserGroupIcon,
      title: "Patient Portfolios",
      description: "Comprehensive patient profiles with organized medical records and history."
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Smart Chat Assistant",
      description: "Ask questions about patient portfolios with our intelligent chat assistant."
    },
    {
      icon: DocumentTextIcon,
      title: "Doctor Dashboard",
      description: "Centralized dashboard for healthcare providers to manage patients and approvals."
    },
    {
      icon: ShieldCheckIcon,
      title: "Approval Workflow",
      description: "Secure approval process for medical documents with feedback capabilities."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              MedicalAI Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Revolutionizing healthcare with AI-powered document analysis, secure patient portfolios, 
              and intelligent medical assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dm" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 shadow-lg"
              >
                Upload Documents
              </Link>
              <Link 
                to="/dashboard" 
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 border border-gray-600"
              >
                Doctor Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with secure healthcare workflows
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300">
                <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Simple, secure, and efficient medical document management</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload</h3>
              <p className="text-gray-400">Securely upload medical documents to our platform</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analyze</h3>
              <p className="text-gray-400">AI automatically analyzes and extracts key information</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Review</h3>
              <p className="text-gray-400">Doctors review and approve for patient portfolios</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join healthcare providers worldwide who trust our platform for secure medical document management.
          </p>
          <Link 
            to="/dm" 
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 shadow-lg"
          >
            Start Uploading Documents
          </Link>
        </div>
      </div>
    </div>
  );
}
