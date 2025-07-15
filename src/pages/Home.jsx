import FileUpload from '../components/FileUpload';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-10">
      <div className="max-w-xl w-full bg-[#18181b] rounded-2xl shadow-2xl p-8 border border-gray-800 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to MedicalAI</h1>
        <p className="text-gray-400 mb-8">Here, doctors and patients can securely upload and share medical documents. The data is automatically analyzed and summarized.</p>
        <FileUpload onUpload={() => {}} />
      </div>
    </div>
  );
}
