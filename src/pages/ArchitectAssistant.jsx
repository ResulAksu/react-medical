import { useState, useEffect } from "react";

const AGENT_STEPS = [
  { key: "input", label: "Input Agent", emoji: "📝" },
  { key: "orchestrator", label: "Orchestrator Agent", emoji: "🤖" },
  { key: "image", label: "Image-to-Text Agent", emoji: "🖼️" },
  { key: "architecture", label: "Architecture Agent", emoji: "🏗️" },
];

const CHAT_QUESTIONS = [
  {
    question: "Do you want users to access the virtual assistant via a web browser with fast global delivery of the UI?",
    yes: "We’ll use Amazon CloudFront to deliver the web interface and Amazon S3 to host the static content.",
    no: null,
  },
  {
    question: "Should the system authenticate users and manage access control using Amazon Cognito?",
    yes: "Cognito will verify user identity and permissions before allowing access.",
    no: null,
  },
  {
    question: "Do you want the client to send queries directly to Bedrock without any orchestration logic?",
    yes: null,
    no: "We’ll use an AWS Lambda function to orchestrate the AI workflow and route the query to a Bedrock Supervisor Agent.",
    noLabel: "NO",
  },
  {
    question: "Should the Bedrock Supervisor Agent handle all queries without delegating to specialized agents?",
    yes: null,
    no: "We’ll introduce Domain-Specific Agents that the Supervisor Agent can delegate to for specialized processing.",
    noLabel: "NO",
  },
  {
    question: "Do you want to include both internal and external data sources to answer user queries?",
    yes: "We’ll use Amazon Bedrock Knowledge Bases and OpenSearch for internal data, and a Lambda Web Search function with Tavily API for external data.",
    no: null,
    yesLabel: "YES",
  },
  {
    question: "Do you need more feedback or is this enough?",
    yes: "Okay, please specify what additional feedback you need.",
    no: "Great! Proceeding with the architecture.",
    yesLabel: "Needs more feedback",
    noLabel: "This is enough",
  },
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
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChatQuestion, setShowChatQuestion] = useState(false);
  const [chatWaiting, setChatWaiting] = useState(false);
  const [chatStep, setChatStep] = useState(0);

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
          `AWS Multi-Agent Employee Virtual Assistant Architecture:\n\n- CloudFront delivers the web UI.\n- S3 hosts static content.\n- Cognito manages authentication.\n- Lambda orchestrates AI workflow.\n- Bedrock Supervisor & Domain Agents process queries.\n- Knowledge Base & OpenSearch for internal data.\n- Lambda Web Search for external data.\n- DynamoDB stores conversation history.`
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
          `AWS Multi-Agent Employee Virtual Assistant Architecture:\n\n- CloudFront delivers the web UI.\n- S3 hosts static content.\n- Cognito manages authentication.\n- Lambda orchestrates AI workflow.\n- Bedrock Supervisor & Domain Agents process queries.\n- Knowledge Base & OpenSearch for internal data.\n- Lambda Web Search for external data.\n- DynamoDB stores conversation history.`
      }
    };
    setResult(archResponse.result);
    setShowFeedback(false);
    setLoading(false);
    setCurrentAgent(null);
  };

  // Show feedback as chat message
  useEffect(() => {
    if (aiFeedback && showFeedback && !result) {
      setChatMessages([
        { sender: "ai", text: aiFeedback }
      ]);
    }
  }, [aiFeedback, showFeedback, result]);

  // Handle "Implement feedback" as chat
  const handleImplementFeedbackChat = async () => {
    setShowChatQuestion(true);
    setShowFeedback(false);
    setChatWaiting(true);
    setChatStep(0);
    setTimeout(() => {
      setChatMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: CHAT_QUESTIONS[0].question
        }
      ]);
      setChatWaiting(false);
    }, 1000);
  };

  // Handle chat answer
  const handleChatAnswer = (answer) => {
    const currentQ = CHAT_QUESTIONS[chatStep];
    setChatMessages((msgs) => [
      ...msgs,
      { sender: "user", text: answer === "yes" ? (currentQ.yesLabel || "Yes") : (currentQ.noLabel || "No") }
    ]);
    setChatWaiting(true);

    setTimeout(() => {
      let nextStep = chatStep + 1;
      // Show feedback if any
      if (answer === "yes" && currentQ.yes) {
        setChatMessages((msgs) => [
          ...msgs,
          { sender: "ai", text: currentQ.yes }
        ]);
      }
      if (answer === "no" && currentQ.no) {
        setChatMessages((msgs) => [
          ...msgs,
          { sender: "ai", text: currentQ.no }
        ]);
      }
      // Ask next question if any
      if (nextStep < CHAT_QUESTIONS.length) {
        setTimeout(() => {
          setChatMessages((msgs) => [
            ...msgs,
            { sender: "ai", text: CHAT_QUESTIONS[nextStep].question }
          ]);
          setChatStep(nextStep);
          setChatWaiting(false);
        }, 1000);
      } else {
        // If last answer is "This is enough", close chat and show architecture result
        if (answer === "no" && currentQ.noLabel === "This is enough") {
          setTimeout(() => {
            setShowChatQuestion(false);
            setResult({
              imageUrl: process.env.PUBLIC_URL + "/d2d771c9-ce1e-45bc-965a-c01021af5e2e-aws-multi-agent-employee-virtual-assistant-architecture-diagram-2928x1797.5c46b69a1d0e34439346d3893899258324c4fc55.png",
              documentation:
                `The user accesses TeamLink AI, an Amazon Bedrock-powered virtual assistant, through their web browser to submit queries and receive instant cross-departmental information...\n\n`
            });
            setChatWaiting(false);
          }, 1000);
        } else {
          setChatWaiting(false);
        }
      }
    }, 1000);
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
        {/* Chatbox UI */}
        {(aiFeedback && showFeedback && !result) || (showChatQuestion && !result) ? (
          <div className="bg-gray-900 rounded-lg p-4 mb-4 flex flex-col gap-2" style={{ minHeight: 120 }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.sender === "ai"
                      ? "bg-blue-900 text-blue-100"
                      : "bg-green-700 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chatWaiting && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-blue-900 text-blue-100 animate-pulse">
                  ...
                </div>
              </div>
            )}
            {/* Show buttons only if waiting for answer */}
            {showChatQuestion && !chatWaiting && chatStep < CHAT_QUESTIONS.length && (
              <div className="flex gap-2 mt-2 justify-start">
                <button
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                  onClick={() => handleChatAnswer("yes")}
                  disabled={chatWaiting}
                >
                  {CHAT_QUESTIONS[chatStep].yesLabel || "Yes"}
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                  onClick={() => handleChatAnswer("no")}
                  disabled={chatWaiting}
                >
                  {CHAT_QUESTIONS[chatStep].noLabel || "No"}
                </button>
              </div>
            )}
          </div>
        ) : null}
        {/* Feedback buttons */}
        {aiFeedback && showFeedback && !result && (
          <div className="flex gap-2 mb-4">
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
              onClick={handleGoWithResult}
              disabled={loading}
            >
              Ignore feedback & get result
            </button>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              onClick={handleImplementFeedbackChat}
              disabled={loading}
            >
              Implement feedback
            </button>
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
            <div className="text-gray-200 whitespace-pre-line mb-6">
              {result.documentation}
            </div>
            {/* Jira & Confluence Buttons */}
            <div className="flex gap-4 justify-center mt-6">
              <a
                href="https://can-solutions.atlassian.net/browse/SCRUM-1?atlOrigin=eyJpIjoiYTg0ZWMwOTMyMGM0NDY4NGIyZGRkOWM4NjU4OTRkZWYiLCJwIjoiaiJ9"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0052CC] text-white px-6 py-3 rounded-lg hover:bg-[#0747A6] transition text-lg font-semibold"
              >
                Jira
              </a>
              <a
                href="https://can-solutions.atlassian.net/wiki/spaces/~608085e2cbff1b00700dc8db/pages/360449/AWS+Multi-Agent+Employee+Virtual+Assistant+Architecture+Preview"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#172B4D] text-white px-6 py-3 rounded-lg hover:bg-[#253858] transition text-lg font-semibold"
              >
                Confluence
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}