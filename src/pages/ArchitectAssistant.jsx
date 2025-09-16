import { useState, useEffect } from "react";

// --- Agent stepper icons ---
const AGENT_STEPS = [
  { key: "input", label: "Input Agent", emoji: "📝" },
  { key: "orchestrator", label: "Orchestrator Agent", emoji: "🤖" },
  { key: "image", label: "Image-to-Text Agent", emoji: "🖼️" },
  { key: "architecture", label: "Architecture Agent", emoji: "🏗️" },
];

// --- Conversation questions tailored to 3‑tier hardening (no migrations) ---
// Q5 intentionally elicits a "No" for WAF to show adaptation with compensating controls
const CHAT_QUESTIONS = [
{
question: "Your RDS looks single-AZ. The requirement is high availability. Should we enable Multi-AZ to meet that?",
yes: "We’ll enable Multi-AZ on the primary for automatic failover and connection retries in the app to ride through events.",
no: "Okay — we’ll note the HA requirement is unmet for now, and keep retries/backoff strong while planning Multi-AZ later.",
},
{
question: "The requirement mentions fast global delivery. Should we add CloudFront in front of ALB to cache static assets/images?",
yes: "We’ll place CloudFront before ALB, cache immutable assets (TTL 5–10 min), enable compression, and keep origin failover ready.",
no: "Understood — we’ll keep ALB only and optimize headers/compression; edge caching can be added later with zero risk.",
},
{
question: "Performance requirement under peak load: should we introduce ElastiCache Redis to reduce DB pressure, knowing it adds extra cost compared to query tuning alone?",
yes: "We’ll add a read-through cache (TTL 60–180s) with request coalescing, accepting the added cost for reduced DB load.",
no: "Okay, we’ll skip Redis for now and focus on DB optimizations and app tier scaling to handle peaks.",
},
{
question: "For disaster recovery readiness, should we set up cross-region snapshot replication and run a restore drill?",
yes: "We’ll replicate automated RDS snapshots cross-region and run a documented restore drill (target RTO ≤ 15 min, RPO ≤ 5 min).",
no: "Noted — we’ll at least verify PITR windows and export runbooks; cross-region can be scheduled later.",
},
{
question: "Security requirement calls for edge protection. Should we enable AWS WAF in front of ALB, knowing it adds ongoing cost for managed rules?",
yes: "We’ll deploy WAF with managed rules (SQLi/XSS/bot), attach to CloudFront/ALB, and add basic rate limiting.",
no: "Okay — since CloudFront is already in place, we’ll lean on its built-in protections: Shield Standard, rate limiting, and basic bot filtering, plus tighter security groups and app-level validation.",
},
];
// --- Placeholder async calls (simulate agents) ---
async function callInputAgent(inputText, image) {
  await new Promise((r) => setTimeout(r, 600));
  return { status: "ok" };
}
async function callOrchestratorAgent(inputText, image) {
  await new Promise((r) => setTimeout(r, 600));
  return { status: "ok" };
}
async function callImageToTextAgent(image) {
  await new Promise((r) => setTimeout(r, 600));
  return { text: image ? "Detected diagram elements..." : "" };
}

export default function SolutionArchitectAssistant() {
  // Default input: initial prompt that matches the demo narrative (no migrations)
  const [inputText, setInputText] = useState(
    "Please review against these goals: \n-zero‑downtime improvements (no migrations)\n-higher availability\n-better peak performance\n-security\n-DR readiness"
  );
  const [image, setImage] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [showChatQuestion, setShowChatQuestion] = useState(false);
  const [chatWaiting, setChatWaiting] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [answers, setAnswers] = useState({}); // track yes/no by step index

  // --- Main workflow ---
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

    // Architecture agent produces initial guidance before interactive Q&A
    setCurrentAgent("architecture");
    const feedback =
      "Observations from the diagram: RDS appears single‑AZ; no explicit CDN/WAF layers; app tier scales but no data cache is shown; backups are present but cross‑region posture is unclear. I’ll ask a few quick questions to finalize a zero‑downtime improvement plan.";

    setAiFeedback(feedback);
    setLoading(false);
  };

  const handleGoWithResult = async () => {
    // Skip Q&A and show a default architecture result
    setLoading(true);
    const doc = baseDocumentation({ answers: null });
    setResult({
      imageUrl:
        process.env.PUBLIC_URL + "/aws.png",
      documentation: doc,
    });
    setShowFeedback(false);
    setLoading(false);
    setCurrentAgent(null);
  };

  // Start interactive implementation chat
  const handleImplementFeedbackChat = async () => {
    setShowChatQuestion(true);
    setShowFeedback(false);
    setChatWaiting(true);
    setChatStep(0);
    setChatMessages([{ sender: "ai", text: CHAT_QUESTIONS[0].question }]);
    setChatWaiting(false);
    setAnswers({});
  };

  // Build the final documentation string based on answers
  function baseDocumentation({ answers }) {
    // Determine WAF choice from Q5 (index 4)
    const wafYes = answers ? answers[4] === "yes" : true; // default to yes if skipped

const bullets = [
  "Zero-downtime improvement plan:",
  "\n1) Availability",
  "- Enable RDS Multi-AZ for automatic failover; keep connection retries/backoff in app.",
  "\n2) Performance",
  "- Add CloudFront before ALB to serve static assets with immutable names, TTL 5–10 min, compression.",
  "- Okay, we’ll skip Redis for now and rely on DB optimizations and app tier scaling.",
  "\n3) Disaster Recovery",
  "- Configure cross-region snapshot replication; document and test a restore drill (RTO ≤ 15 min, RPO ≤ 5 min).",
  "\n4) Security",
  "- Since CloudFront is in place, we’ll lean on its built-in protections: Shield Standard, rate limiting, and basic bot filtering, plus tighter security groups and app-level validation.",
  "\n5) Rollout & Safety",
  "- Sequence: CloudFront → (skip Redis) → RDS Multi-AZ → backups → restore drill.",
  "- Use feature flags (USE_CACHE, READ_SPLIT); keep ASG min capacity; synthetic canaries and CloudWatch alarms (p95 < 300ms, DB CPU < 60%).",
  "- Rollback: disable cache/tuning flags, revert ALB routing, restore from snapshots if needed.",
];


    return bullets.join("\n");
  }

const handleChatAnswer = (answer) => {
  const currentQ = CHAT_QUESTIONS[chatStep];
  setAnswers((prev) => ({ ...prev, [chatStep]: answer }));

  // push user response into chat
  setChatMessages((msgs) => [
    ...msgs,
    { sender: "user", text: answer === "yes" ? "Yes" : "No" },
  ]);

  setChatWaiting(true);

  setTimeout(() => {
    const msgs = [];
    if (answer === "yes" && currentQ.yes)
      msgs.push({ sender: "ai", text: currentQ.yes });
    if (answer === "no" && currentQ.no)
      msgs.push({ sender: "ai", text: currentQ.no });

    setChatMessages((prev) => [...prev, ...msgs]);

    const nextStep = chatStep + 1;

    if (nextStep < CHAT_QUESTIONS.length) {
      // ask next question
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { sender: "ai", text: CHAT_QUESTIONS[nextStep].question },
        ]);
        setChatStep(nextStep);
        setChatWaiting(false);
      }, 600);
    } else {
      // end of questions → show architecture result tailored to answers
      const doc = baseDocumentation({
        answers: { ...answers, [chatStep]: answer },
      });

      // short pause, then show analyzing message
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Analyzing your answers and preparing the final plan...",
          },
        ]);
        setChatWaiting(true);

        // after 2s, show the final improvement plan
        setTimeout(() => {
          setShowChatQuestion(false);
          setResult({
            imageUrl:
              process.env.PUBLIC_URL +
              "/aws.png",
            documentation: doc,
          });
          setChatWaiting(false);
        }, 2000); // 2-second pause
      }, 700); // initial pause before analyzing message
    }
  }, 600);
};


  // Show initial "feedback" as a chat bubble
  useEffect(() => {
    if (aiFeedback && showFeedback && !result) {
      setChatMessages([{ sender: "ai", text: aiFeedback }]);
    }
  }, [aiFeedback, showFeedback, result]);

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
                  currentAgent === step.key ? "animate-bounce text-blue-400" : "text-gray-500"
                }`}
              >
                {step.emoji}
              </div>
              <div
                className={`text-xs mt-1 ${
                  currentAgent === step.key ? "text-blue-400 font-bold" : "text-gray-400"
                }`}
              >
                {step.label}
              </div>
              {idx < AGENT_STEPS.length && (
                <div className="w-8 h-1 bg-gray-700 mt-2 mb-2 rounded"></div>
              )}
            </div>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
          <textarea
            className="w-full bg-gray-800 text-gray-200 rounded-lg p-2"
            rows="6"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your initial instruction for the co‑architect..."
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
              <div key={idx} className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.sender === "ai" ? "bg-blue-900 text-blue-100" : "bg-green-700 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chatWaiting && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-blue-900 text-blue-100 animate-pulse">...</div>
              </div>
            )}

            {/* Answer buttons */}
            {showChatQuestion && !chatWaiting && chatStep < CHAT_QUESTIONS.length && (
              <div className="flex gap-2 mt-2 justify-start">
                <button
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                  onClick={() => handleChatAnswer("yes")}
                  disabled={chatWaiting}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                  onClick={() => handleChatAnswer("no")}
                  disabled={chatWaiting}
                >
                  No
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* Feedback actions */}
        {aiFeedback && showFeedback && !result && (
          <div className="flex gap-2 mb-4">
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
              onClick={handleGoWithResult}
              disabled={loading}
            >
              Skip Q&A & show plan
            </button>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              onClick={handleImplementFeedbackChat}
              disabled={loading}
            >
              Answer quick questions
            </button>
          </div>
        )}

        {/* Final Architecture Result */}
        {result && (
          <div className="bg-gray-900 rounded-lg p-4 mt-4 border border-gray-700">
            <div className="mb-2 font-semibold text-white">Improvement Plan</div>
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
                  const mermaid = `graph TD\n  Route53-->CloudFront\n  CloudFront-->ALB\n  ALB-->ASG[EC2 Auto Scaling]\n  ASG-->RDS\n  ASG-->Redis[ElastiCache Redis]\n`;
                  const blob = new Blob([mermaid], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "architecture.mmd";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export as Mermaid
              </button>
              <button
                className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition"
                onClick={() => {
                  const drawio =
                    `<?xml version="1.0" encoding="UTF-8"?><mxfile><diagram id="1" name="AWS Architecture"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="VPC" style="rounded=1;fillColor=#dae8fc;" vertex="1" parent="1"><geometry x="40" y="40" width="120" height="60" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>`;
                  const blob = new Blob([drawio], { type: "text/xml" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "architecture.drawio.xml";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export as Draw.io XML
              </button>
            </div>
            <div className="text-gray-200 whitespace-pre-line mb-6">{result.documentation}</div>

            {/* Links area (optional) */}
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
