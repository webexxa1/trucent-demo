import React, { useEffect, useMemo, useState } from "react";
import {
  Droplets,
  ArrowRight,
  ShieldCheck,
  Gauge,
  LineChart as LineChartIcon,
  BarChart4,
  Sparkles,
  Calculator,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const BRAND = {
  blue: "#0090C0",
  green: "#8DC63E",
};

// Inline SVG fallback for ACME logo to avoid external loading issues
const AcmeMark = ({ className = "h-8" }) => (
  <svg viewBox="0 0 360 120" className={className} aria-label="ACME Corp logo" role="img">
    <defs>
      <linearGradient id="acmeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF4D4D" />
        <stop offset="100%" stopColor="#C61E1E" />
      </linearGradient>
    </defs>
    {/* Red triangle */}
    <polygon points="40,100 100,100 70,48" fill="url(#acmeGrad)" />
    {/* ACME wordmark */}
    <g fill="#111" fontFamily="Inter, ui-sans-serif, system-ui" fontWeight="800">
      <text x="120" y="85" fontSize="56">ACME</text>
      <text x="122" y="108" fontSize="18" letterSpacing="2">CORP.</text>
    </g>
  </svg>
);

const withAlpha = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function KpiCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-xl border"
          style={{
            backgroundColor: withAlpha(BRAND.blue, 0.1),
            borderColor: withAlpha(BRAND.blue, 0.2),
          }}
        >
          {Icon ? (
            <Icon className="w-5 h-5" style={{ color: BRAND.blue }} />
          ) : (
            <AcmeMark className="h-5" />
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="text-2xl font-semibold leading-tight">{value}</p>
          {sub && (
            <p className="text-xs mt-1" style={{ color: BRAND.green }}>
              {sub}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const lineData = [
  { month: "Jan", throughput: 120, recovery: 78, cost: 42 },
  { month: "Feb", throughput: 138, recovery: 82, cost: 40 },
  { month: "Mar", throughput: 150, recovery: 88, cost: 39 },
  { month: "Apr", throughput: 170, recovery: 95, cost: 37 },
  { month: "May", throughput: 185, recovery: 101, cost: 35 },
  { month: "Jun", throughput: 210, recovery: 110, cost: 33 },
];

const barData = [
  { name: "Line A", uptime: 98.2, savings: 24 },
  { name: "Line B", uptime: 96.9, savings: 17 },
  { name: "Line C", uptime: 97.5, savings: 20 },
];

// ROI Calculator helpers (pure functions)
function sumValues(obj) {
  return Object.values(obj || {}).reduce((a, b) => a + (Number(b) || 0), 0);
}

function computeNPV(monthlySavings, capex, rate = 0.12, months = 36) {
  let npv = -Number(capex || 0);
  const r = Number(rate);
  for (let t = 1; t <= months; t++) {
    npv += Number(monthlySavings) / Math.pow(1 + r / 12, t);
  }
  return npv;
}

function computeRoiTotals({ baselineMonthly, afterMonthly, capex, rate = 0.12 }) {
  const monthlySavings = Math.max(0, Number(baselineMonthly) - Number(afterMonthly));
  const paybackMonths = monthlySavings > 0 ? Number(capex) / monthlySavings : Infinity;
  const annualSavings = monthlySavings * 12;
  const npv3 = computeNPV(monthlySavings, capex, rate, 36);
  return { monthlySavings, annualSavings, paybackMonths, npv3 };
}

// Simple AI Chatbot helpers
function generateBotReply(input) {
  const q = (input || "").trim().toLowerCase();
  if (!q) return "I didn't catch that. Could you type your question again?";
  const has = (s) => q.includes(s);
  if (has("hello") || has("hi") || has("hey") || has("good morning") || has("good afternoon") || has("good evening")) {
    return "Hi there! I can answer questions about uptime, recovery, ROI, and implementation timelines.";
  }
  if (has("roi") || has("payback") || has("savings")) {
    return "Based on current figures ($42,300/month savings), payback is ~6–8 months depending on install scope. Want a quick estimate with your numbers?";
  }
  if (has("uptime") || has("availability")) {
    return "Average system uptime across lines is 97.8% this quarter, trending +0.6%.";
  }
  if (has("recovery") || has("throughput") || has("performance")) {
    return "Recovery continues to improve; last month throughput reached 210 units with recovery at 110.";
  }
  if (has("pricing") || has("cost") || has("quote") || has("estimate")) {
    return "Pricing is tailored by flow rate and contaminant profile. I can collect a few details and route you to a specialist for a quote.";
  }
  if (has("contact") || has("call") || has("demo") || has("meeting")) {
    return "I can set up a call or on-site review. Share your name, plant location, and a good time to connect.";
  }
  if (has("data") || has("source") || (q.includes("where") && q.includes("numbers")) || (q.includes("how") && q.includes("calculated"))) {
    return "Figures shown here come from demo data and representative customer outcomes; we'll use your historian data for a precise model.";
  }
  return "Got it. I'll note that and can route you to a human if needed. Ask about ROI, uptime, recovery, pricing, or scheduling a call.";
}

export default function TrucentPartnerPrototypeDemo() {
  const [dark, setDark] = useState(false);

  // Single source of truth for chat messages
  const [messages, setMessages] = useState([
    { role: "bot", from: "bot", text: "Welcome! I'm the Trucent assistant. Ask me about ROI, uptime, recovery, or schedule a call." },
  ]);

  // Inline chat input
  const [input, setInput] = useState("");

  // Floating widget chat input/state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  // ROI modal + form state
  const [roiOpen, setRoiOpen] = useState(false);
  const [capex, setCapex] = useState(250000);
  const [rate, setRate] = useState(0.12);
  const [baselineCosts, setBaselineCosts] = useState({
    disposal: 20000,
    energy: 8000,
    chemicals: 5000,
    labor: 7000,
    other: 2000,
  });
  const [afterCosts, setAfterCosts] = useState({
    disposal: 4000,
    energy: 5000,
    chemicals: 3000,
    labor: 6000,
    maintenance: 3000,
    other: 1000,
  });

  const baselineMonthly = useMemo(() => sumValues(baselineCosts), [baselineCosts]);
  const afterMonthly = useMemo(() => sumValues(afterCosts), [afterCosts]);
  const roi = useMemo(
    () => computeRoiTotals({ baselineMonthly, afterMonthly, capex, rate }),
    [baselineMonthly, afterMonthly, capex, rate]
  );

  const chartStroke = useMemo(() => BRAND.blue, []);
  const positive = useMemo(() => BRAND.green, []);

  // Inline chat sender
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const reply = generateBotReply(text);
    setMessages((m) => [...m, { role: "user", from: "user", text }, { role: "bot", from: "bot", text: reply }]);
    setInput("");
  };

  // Floating widget sender
  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const reply = generateBotReply(text);
    setMessages((m) => [...m, { role: "user", from: "user", text }, { role: "bot", from: "bot", text: reply }]);
    setChatInput("");
  };

  const team = [
    {
      name: "Thomas Czartoski",
      title: "Founder & CEO",
      img: "https://www.trucent.com/wp-content/uploads/2022/12/Tom-Czartoski-Lrg-e1678809141889.jpg",
      link: "https://www.trucent.com/thomas-czartoski/",
    },
    {
      name: "Lauren Kennard",
      title: "Corporate Controller",
      img: "https://www.trucent.com/wp-content/uploads/2022/12/Lauren-Kennard-Small-e1678808939501.jpg",
      link: "https://www.trucent.com/company/lauren-kennard/",
    },
    {
      name: "James Timbrook",
      title: "Director of Special Projects",
      img: "https://www.trucent.com/wp-content/uploads/2020/12/jj-portrait-1-e1706899583733.jpg",
      link: "https://www.trucent.com/company/james-timbrook/",
    },
  ];

  const Avatar = ({ person, size = 64 }) => (
    <a
      href={person.link || "#"}
      className="group block focus:outline-none"
      title={`${person.name} – ${person.title || "Team"}`}
      data-testid={`link-team-${person.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div
        className="relative rounded-full border shadow-sm overflow-hidden"
        style={{ width: size, height: size, borderColor: withAlpha(BRAND.blue, 0.25) }}
      >
        {person.img ? (
          <img
            src={person.img}
            alt={person.name}
            className="w-full h-full object-cover"
            loading="lazy"
            data-testid={`img-avatar-${person.name.toLowerCase().replace(/\s+/g, '-')}`}
          />
        ) : (
          <div
            className="w-full h-full grid place-items-center text-sm font-medium"
            style={{ background: withAlpha(BRAND.blue, 0.1), color: BRAND.blue }}
          >
            {person.name
              .split(" ")
              .map((s) => s[0])
              .join("")
              .slice(0, 3)}
          </div>
        )}
      </div>
      <div className="mt-2 text-center">
        <p className="text-xs font-medium leading-tight group-hover:underline" data-testid={`text-name-${person.name.toLowerCase().replace(/\s+/g, '-')}`}>
          {person.name}
        </p>
        {person.title && (
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400" data-testid={`text-title-${person.name.toLowerCase().replace(/\s+/g, '-')}`}>{person.title}</p>
        )}
      </div>
    </a>
  );

  return (
    <div className={"min-h-[85vh] w-full " + (dark ? "dark" : "")} data-testid="dashboard-container">
      <div className="bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Logos */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AcmeMark className="h-8" />
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>Powered by</span>
              <a href="https://www.trucent.com" target="_blank" rel="noopener noreferrer" data-testid="link-trucent">
                <img src="https://www.trucent.com/wp-content/uploads/2020/12/fluid-separation-logo-trucent-480x216.png" alt="Fluid Separation" className="h-6 object-contain" data-testid="img-trucent-logo" />
              </a>
            </div>
          </div>

          {/* Floating AI Chatbot */}
          <div className="fixed bottom-6 right-6 z-50">
            {/* Panel */}
            {chatOpen && (
              <div className="w-[320px] sm:w-[360px] rounded-2xl shadow-xl border bg-white/95 dark:bg-zinc-900/95 border-zinc-200/70 dark:border-zinc-800 backdrop-blur overflow-hidden mb-3" data-testid="chat-widget-panel">
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: withAlpha(BRAND.blue, 0.08) }}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: BRAND.blue }} />
                    <span className="text-sm font-semibold">Trucent Assistant</span>
                  </div>
                  <button
                    className="text-xs px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => setChatOpen(false)}
                    data-testid="button-close-chat"
                  >
                    Close
                  </button>
                </div>
                <div className="max-h-[45vh] overflow-y-auto p-3 space-y-2" data-testid="chat-messages">
                  {messages.map((m, i) => (
                    <div key={i} className={m.role === "bot" ? "text-sm" : "text-sm text-right"} data-testid={`message-${i}`}>
                      <div
                        className={
                          (m.role === "bot"
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            : "bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.06)]") +
                          " inline-block px-3 py-2 rounded-2xl max-w-[85%]"
                        }
                        style={m.role === "user" ? { border: `1px solid ${withAlpha(BRAND.blue, 0.25)}` } : {}}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {/* Quick prompts */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {["What's the payback period?", "Show uptime", "How do you price projects?"].map((p) => (
                      <button
                        key={p}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => {
                          setChatInput(p);
                          setTimeout(() => sendMessage(), 0);
                        }}
                        data-testid={`button-quick-prompt-${p.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 text-sm px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none"
                      placeholder="Ask about ROI, uptime, pricing…"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      data-testid="input-chat-widget"
                    />
                    <button
                      className="px-3 py-2 rounded-xl text-sm text-white"
                      style={{ backgroundColor: BRAND.blue }}
                      onClick={sendMessage}
                      data-testid="button-send-widget"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Toggle */}
            <button
              className="rounded-full shadow-lg px-4 py-3 text-sm font-medium border border-zinc-200 dark:border-zinc-700"
              style={{ backgroundColor: BRAND.blue, color: "white" }}
              onClick={() => setChatOpen((o) => !o)}
              data-testid="button-toggle-chat"
            >
              {chatOpen ? "Hide Assistant" : "AI Chat"}
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2" data-testid="text-title">
                <Sparkles className="w-6 h-6" style={{ color: BRAND.blue }} />
                Trucent Partner Prototype — Live Demo
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1" data-testid="text-subtitle">
                Brand colors active. No local Tailwind config required.
              </p>
            </div>
            <button
              className="rounded-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
              data-testid="button-theme-toggle"
            >
              {dark ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>

          {/* Main layout: content + right sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            {/* Left: KPIs + Charts + CTA + Inline Chat */}
            <div>
              {/* KPI row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-testid="kpi-cards">
                <KpiCard icon={Droplets} label="Water Recovered" value="110,200 gal" sub="+8.4% MoM" />
                <KpiCard icon={Gauge} label="System Uptime" value="97.8%" sub="+0.6% vs last quarter" />
                <KpiCard icon={DollarSign} label="Monthly Savings" value="$42,300" sub="Target met" />
                <KpiCard icon={ShieldCheck} label="Compliance" value="100%" sub="All checks passed" />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800 p-4 shadow-sm" data-testid="chart-performance">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold flex items-center gap-2">
                      <LineChartIcon className="w-5 h-5" style={{ color: BRAND.blue }} />
                      Throughput vs Recovery
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: withAlpha(BRAND.blue, 0.3), color: BRAND.blue }}>
                      Last 6 months
                    </span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartStroke} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={chartStroke} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="throughput" stroke={chartStroke} fillOpacity={1} fill="url(#fillBlue)" />
                        <Line type="monotone" dataKey="recovery" stroke={positive} strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800 p-4 shadow-sm" data-testid="chart-uptime">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold flex items-center gap-2">
                      <BarChart4 className="w-5 h-5" style={{ color: BRAND.blue }} />
                      Uptime & Savings by Line
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: withAlpha(BRAND.green, 0.3), color: BRAND.green }}>
                      Snapshot
                    </span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="uptime" fill={withAlpha(BRAND.blue, 0.9)} />
                        <Bar dataKey="savings" fill={withAlpha(BRAND.green, 0.9)} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-6 bg-gradient-to-r from-white via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Ready to estimate ROI?</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Use your historical flows to project savings and payback period.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRoiOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border text-sm shadow-sm"
                      style={{
                        color: "white",
                        backgroundColor: BRAND.blue,
                        borderColor: withAlpha(BRAND.blue, 0.25),
                      }}
                      data-testid="button-open-roi"
                    >
                      <Calculator className="w-4 h-4" />
                      Open ROI Calculator
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ROI Modal */}
              {roiOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4" data-testid="roi-modal">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setRoiOpen(false)} />
                  <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
                    <div className="px-5 py-3 flex items-center justify-between" style={{ background: withAlpha(BRAND.blue, 0.08) }}>
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4" style={{ color: BRAND.blue }} />
                        <h3 className="text-sm font-semibold">ROI Calculator</h3>
                      </div>
                      <button className="text-xs px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700" onClick={() => setRoiOpen(false)} data-testid="button-close-roi">Close</button>
                    </div>

                    <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Inputs */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className="text-sm">CapEx ($)
                            <input type="number" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700" value={capex}
                              onChange={(e)=> setCapex(Number(e.target.value))} data-testid="input-capex"/>
                          </label>
                          <label className="text-sm">Discount Rate (annual)
                            <input type="number" step="0.01" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700" value={rate}
                              onChange={(e)=> setRate(Number(e.target.value))} data-testid="input-rate"/>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Baseline Monthly Costs</h4>
                            {Object.entries(baselineCosts).map(([k,v])=> (
                              <label key={k} className="text-sm block mb-2 capitalize">{k}
                                <input type="number" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700" value={v}
                                  onChange={(e)=> setBaselineCosts((prev)=> ({...prev, [k]: Number(e.target.value)}))} data-testid={`input-baseline-${k}`}/>
                              </label>
                            ))}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">After Monthly Costs</h4>
                            {Object.entries(afterCosts).map(([k,v])=> (
                              <label key={k} className="text-sm block mb-2 capitalize">{k}
                                <input type="number" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700" value={v}
                                  onChange={(e)=> setAfterCosts((prev)=> ({...prev, [k]: Number(e.target.value)}))} data-testid={`input-after-${k}`}/>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="lg:col-span-1">
                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white/70 dark:bg-zinc-900/70" data-testid="roi-summary">
                          <h4 className="text-sm font-semibold mb-3">Summary</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between"><span>Baseline Monthly</span><span data-testid="text-baseline-monthly">${baselineMonthly.toLocaleString()}</span></li>
                            <li className="flex justify-between"><span>After Monthly</span><span data-testid="text-after-monthly">${afterMonthly.toLocaleString()}</span></li>
                            <li className="flex justify-between"><span>Monthly Savings</span><span style={{color: BRAND.green}} data-testid="text-monthly-savings">${roi.monthlySavings.toLocaleString()}</span></li>
                            <li className="flex justify-between"><span>Annual Savings</span><span data-testid="text-annual-savings">${roi.annualSavings.toLocaleString()}</span></li>
                            <li className="flex justify-between"><span>Payback</span><span data-testid="text-payback">{Number.isFinite(roi.paybackMonths) ? `${roi.paybackMonths.toFixed(1)} months` : '—'}</span></li>
                            <li className="flex justify-between"><span>3-Year NPV</span><span className={roi.npv3>=0?"":"text-red-600"} data-testid="text-npv">${roi.npv3.toLocaleString(undefined,{maximumFractionDigits:0})}</span></li>
                          </ul>
                          <button
                            className="mt-4 w-full rounded-lg px-3 py-2 text-sm text-white"
                            style={{ backgroundColor: BRAND.blue }}
                            onClick={() => setRoiOpen(false)}
                            data-testid="button-done-roi"
                          >Done</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline AI Chatbot */}
              <div className="mt-8">
                <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-4 bg-white/70 dark:bg-zinc-900/70 shadow-sm" data-testid="inline-chat">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: BRAND.blue }} />
                    AI Chatbot
                  </h3>
                  <div className="h-64 overflow-y-auto mb-3 border rounded-lg p-2 bg-white dark:bg-zinc-800" data-testid="inline-chat-messages">
                    {messages.map((m, i) => (
                      <div key={i} className={`my-1 text-sm ${m.role === "user" ? "text-right" : "text-left"}`} data-testid={`inline-message-${i}`}>
                        <span
                          className={`inline-block px-2 py-1 rounded-lg ${m.role === "user" ? "text-white" : "bg-zinc-200 dark:bg-zinc-700"}`}
                          style={m.role === "user" ? { backgroundColor: BRAND.blue, color: "white" } : {}}
                        >
                          {m.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-lg border px-2 py-1 text-sm dark:bg-zinc-800 dark:border-zinc-700"
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      data-testid="input-inline-chat"
                    />
                    <button
                      onClick={handleSend}
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{ backgroundColor: BRAND.green, color: "white" }}
                      data-testid="button-send-inline"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Team sidebar */}
            <aside className="lg:block">
              <div className="sticky top-6">
                <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-4 shadow-sm" data-testid="team-section">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: BRAND.green }} />
                    Trucent Team
                  </h3>
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                    {team.map((p, idx) => (
                      <Avatar key={idx} person={p} size={72} />
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-3">
                    Headshots pulled from the public Company page.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
