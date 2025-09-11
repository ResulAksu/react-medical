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

export default function SolutionArchitectAssistant() {
  const [inputText, setInputText] = useState("I want an architecture for having a virtual assistant on AWS which provides authentication to webapp UI with Cognito and a Bedrock Knowledge base.");
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
    // Beispiel-Antwort für den Use Case
    const archResponse = {
      feedback: "Your input could be improved: Please specify more details about user roles, data privacy, and integration needs.",
      result: {
        imageUrl: process.env.PUBLIC_URL + "/d2d771c9-ce1e-45bc-965a-c01021af5e2e-aws-multi-agent-employee-virtual-assistant-architecture-diagram-2928x1797.5c46b69a1d0e34439346d3893899258324c4fc55.png", // Beispielbild aus public
        documentation:
          `The user accesses TeamLink AI, an Amazon Bedrock-powered virtual assistant, through their web browser to submit queries and receive instant cross-departmental information.\n\n" +
          "When the user accesses the application, Amazon CloudFront delivers the web interface content, helping ensure a smooth experience regardless of the user's location.\n\n" +
          "Behind the scenes, Amazon S3 serves the static website content, while Amazon Cognito verifies the user's identity and permissions to access the system.\n\n" +
          "After the user submits their query, the client application triggers an AWS Lambda function that acts as the orchestrator for the AI processing workflow.\n\n" +
          "The Lambda function forwards the user's request to the Amazon Bedrock Supervisor Agent, which acts as the primary coordinator for processing the query.\n\n" +
          "The Supervisor Agent within Amazon Bedrock analyzes the query and directs it to the appropriate Domain-Specific Agent for specialized processing.\n\n" +
          "To locate relevant information, the Domain Agent queries Amazon Bedrock Knowledge Bases, the system's central information repository.\n\n" +
          "The system then uses Amazon OpenSearch Serverless to search through indexed documents for query-related matches.\n\n" +
          "During this process, Amazon S3 provides access to domain-specific datasets that have been previously indexed in the OpenSearch system.\n\n" +
          "If the query requires external information, the system activates a Lambda Web Search function to expand the search beyond internal resources.\n\n" +
          "Lambda web search queries the internet for additional data if needed, using Tavily API.\n\n" +
          "Throughout the interaction, Amazon DynamoDB maintains a record of the entire conversation between the user and system.`
      }
    };

    setAiFeedback(archResponse.feedback);
    setResult(null);
    setLoading(false);
  };

  const handleGoWithResult = async () => {
  setLoading(true);
  setResult(null);
  setCurrentAgent("architecture");
    // Beispiel-Antwort für den Use Case
    const archResponse = {
      result: {
        imageUrl: process.env.PUBLIC_URL + "/d2d771c9-ce1e-45bc-965a-c01021af5e2e-aws-multi-agent-employee-virtual-assistant-architecture-diagram-2928x1797.5c46b69a1d0e34439346d3893899258324c4fc55.png",
        documentation:
          `The user accesses TeamLink AI, an Amazon Bedrock-powered virtual assistant, through their web browser to submit queries and receive instant cross-departmental information.\n\n" +
          "When the user accesses the application, Amazon CloudFront delivers the web interface content, helping ensure a smooth experience regardless of the user's location.\n\n" +
          "Behind the scenes, Amazon S3 serves the static website content, while Amazon Cognito verifies the user's identity and permissions to access the system.\n\n" +
          "After the user submits their query, the client application triggers an AWS Lambda function that acts as the orchestrator for the AI processing workflow.\n\n" +
          "The Lambda function forwards the user's request to the Amazon Bedrock Supervisor Agent, which acts as the primary coordinator for processing the query.\n\n" +
          "The Supervisor Agent within Amazon Bedrock analyzes the query and directs it to the appropriate Domain-Specific Agent for specialized processing.\n\n" +
          "To locate relevant information, the Domain Agent queries Amazon Bedrock Knowledge Bases, the system's central information repository.\n\n" +
          "The system then uses Amazon OpenSearch Serverless to search through indexed documents for query-related matches.\n\n" +
          "During this process, Amazon S3 provides access to domain-specific datasets that have been previously indexed in the OpenSearch system.\n\n" +
          "If the query requires external information, the system activates a Lambda Web Search function to expand the search beyond internal resources.\n\n" +
          "Lambda web search queries the internet for additional data if needed, using Tavily API.\n\n" +
          "Throughout the interaction, Amazon DynamoDB maintains a record of the entire conversation between the user and system.`
      }
    };
    setResult(archResponse.result);
    setShowFeedback(false);
    setLoading(false);
    setCurrentAgent(null);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
  <div className="w-full max-w-4xl bg-[#18181b] rounded-2xl shadow-2xl p-12 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
          Architect Assistant
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
              {idx < AGENT_STEPS.length  && (
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
            <div className="flex gap-2 mb-4">
              <a
                href={result.imageUrl}
                download="architecture.png"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Download Image
              </a>
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                onClick={() => {
                  const mermaid = `graph TD\n  VPC --> Subnet_Public\n  VPC --> Subnet_Private\n  Subnet_Public --> ALB\n  ALB --> EC2\n  EC2 --> RDS\n  S3 --> VPC\n`;
                  const blob = new Blob([mermaid], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'architecture.mmd';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export as Mermaid
              </button>
              <button
                className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition"
                onClick={() => {
                  const drawio = `<?xml version="1.0" encoding="UTF-8"?><mxfile><diagram id="1" name="AWS Architecture"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="VPC" style="rounded=1;fillColor=#dae8fc;" vertex="1" parent="1"><geometry x="40" y="40" width="120" height="60" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>`;
                  const blob = new Blob([drawio], { type: 'text/xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'architecture.drawio.xml';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export as Draw.io XML
              </button>
            </div>
            <div className="text-gray-200 whitespace-pre-line">
              {result.documentation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}