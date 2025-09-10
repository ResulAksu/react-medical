import { useState } from "react";

const AGENT_STEPS = [
  { key: "input", label: "Input Agent", emoji: "📝" },
  { key: "orchestrator", label: "Orchestrator Agent", emoji: "🤖" },
  { key: "image", label: "Image-to-Text Agent", emoji: "🖼️" },
  { key: "architecture", label: "Architecture Agent", emoji: "🏗️" },
];

// Placeholder for future API calls
async function callInputAgent(inputText, image) {
  // TODO: Replace with API call
  await new Promise((r) => setTimeout(r, 700));
  return { status: "ok" };
}

async function callOrchestratorAgent(inputText, image) {
  // TODO: Replace with API call
  await new Promise((r) => setTimeout(r, 700));
  return { status: "ok" };
}

async function callImageToTextAgent(image) {
  // TODO: Replace with API call
  await new Promise((r) => setTimeout(r, 700));
  return { text: image ? "Detected diagram elements..." : "" };
}

async function callArchitectureAgent(inputText, image) {
  // TODO: Replace with API call
  await new Promise((r) => setTimeout(r, 700));
  let info = image ? `Image name: ${image.name}` : "No image selected";
  return {
    feedback: `Your input could be improved: Please specify more details about workload type, scalability needs, and security requirements.\n(${info})`,
    result: {
      imageUrl:
        "https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fzi0z7w07jyxx0x7we05e.png",
      documentation:
        "AWS Solution Architecture: \n- VPC with public/private subnets\n- Auto Scaling Group for EC2\n- Application Load Balancer\n- RDS (PostgreSQL) in private subnet\n- S3 for static assets\n- IAM roles for least privilege\n- CloudWatch monitoring\n- Multi-AZ deployment for high availability"
    }
  };
}

export default function SolutionArchitectAssistant() {
  const [inputText, setInputText] = useState("");
  const [image, setImage] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);

  // Main workflow
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setAiFeedback("");
  setResult(null);
  setShowFeedback(true);

  setCurrentAgent("input");
  await callInputAgent(inputText, image);

  setCurrentAgent("orchestrator");
  await callOrchestratorAgent(inputText, image);

  setCurrentAgent("image");
  await callImageToTextAgent(image);

  setCurrentAgent("architecture");
  const archResponse = await callArchitectureAgent(inputText, image);

  setAiFeedback(archResponse.feedback);
  setLoading(false);
  };

  const handleGoWithResult = async () => {
  setLoading(true);
  setResult(null);
  setCurrentAgent("architecture");
  // Directly get result from architecture agent
  const archResponse = await callArchitectureAgent(inputText, image);
  setResult(archResponse.result);
  setShowFeedback(false);
  setLoading(false);
  setCurrentAgent(null);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      <div className="w-full max-w-xl bg-[#18181b] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
          AWS Solution Architect Assistant
        </h1>
        {/* Agent Stepper */}
        <div className="flex justify-center items-center mb-8 gap-4">
          {AGENT_STEPS.map((step, idx) => (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`text-2xl ${
                  currentAgent === step.key
                    ? "animate-bounce text-blue-400"
                    : "text-gray-500"
                }`}
              >
                {step.emoji}
              </div>
              <div
                className={`text-xs mt-1 ${
                  currentAgent === step.key
                    ? "text-blue-400 font-bold"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </div>
              {idx < AGENT_STEPS.length - 1 && (
                <div className="w-8 h-1 bg-gray-700 mt-2 mb-2 rounded"></div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
          <textarea
            className="w-full bg-gray-800 text-gray-200 rounded-lg p-2"
            rows="4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your AWS solution architecture project..."
            required
          />
          <input
            type="file"
            accept="image/*"
            className="w-full bg-gray-800 text-gray-200 rounded-lg p-2"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button
            id="submit-btn"
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            disabled={loading}
          >
            Send request to AI
          </button>
        </form>
        {loading && <div className="text-gray-400 mb-4">Processing agents...</div>}
  {aiFeedback && showFeedback && !result && (
          <div className="bg-yellow-900 text-yellow-200 rounded-lg p-4 mb-4">
            <div className="mb-2 font-semibold">AI Feedback:</div>
            <div>{aiFeedback}</div>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                onClick={handleGoWithResult}
                disabled={loading}
              >
                Ignore feedback & get result
              </button>
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => {
                  setInputText(inputText + "\n[AI Feedback implemented]");
                  setShowFeedback(false);
                }}
                disabled={loading}
              >
                Implement feedback
              </button>
            </div>
          </div>
        )}
        {result && (
          <div className="bg-gray-900 rounded-lg p-4 mt-4 border border-gray-700">
            <div className="mb-2 font-semibold text-white">
              Solution Architecture Result:
            </div>
            <img
              src={result.imageUrl}
              alt="AWS Architecture"
              className="w-full rounded mb-4"
            />
            <div className="text-gray-200 whitespace-pre-line">
              {result.documentation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}