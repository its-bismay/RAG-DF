import { useState, useEffect } from "react";
import {
  Database,
  Lock,
  Cpu,
  Layers,
  Zap,
  FileText,
  Search,
  Shield,
  Server,
  Brain,
  Code,
  Cloud,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const techStack = [
    {
      name: "FastAPI",
      category: "Backend Framework",
      description:
        "Lightning-fast Python web framework delivering RESTful APIs with automatic interactive documentation",
      icon: Server,
      color: "from-blue-500 via-cyan-500 to-blue-600",
      glow: "shadow-[0_0_40px_rgba(59,130,246,0.4)]",
    },
    {
      name: "JWT & Bcrypt",
      category: "Security Layer",
      description:
        "Military-grade authentication with JSON Web Tokens and bcrypt password hashing for ironclad security",
      icon: Lock,
      color: "from-emerald-500 via-teal-500 to-emerald-600",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.4)]",
    },
    {
      name: "MongoDB",
      category: "Data Persistence",
      description:
        "Flexible NoSQL database managing user data with robust email validation and scalable architecture",
      icon: Database,
      color: "from-green-500 via-emerald-500 to-teal-600",
      glow: "shadow-[0_0_40px_rgba(34,197,94,0.4)]",
    },
    {
      name: "Docling",
      category: "Document Intelligence",
      description:
        "Advanced PDF extraction engine transforming complex documents into structured, queryable text",
      icon: FileText,
      color: "from-purple-500 via-fuchsia-500 to-pink-600",
      glow: "shadow-[0_0_40px_rgba(168,85,247,0.4)]",
    },
    {
      name: "LangChain",
      category: "Text Processing",
      description:
        "RecursiveCharacterTextSplitter intelligently segments documents for optimal retrieval performance",
      icon: Layers,
      color: "from-orange-500 via-amber-500 to-yellow-600",
      glow: "shadow-[0_0_40px_rgba(249,115,22,0.4)]",
    },
    {
      name: "Jina AI v3",
      category: "Embeddings Engine",
      description:
        "State-of-the-art 1024-dimensional vectors capturing deep semantic meaning for precise matching",
      icon: Brain,
      color: "from-blue-500 via-indigo-500 to-purple-600",
      glow: "shadow-[0_0_40px_rgba(99,102,241,0.4)]",
    },
    {
      name: "Qdrant Cloud",
      category: "Vector Database",
      description:
        "High-performance vector storage enabling millisecond semantic search across millions of embeddings",
      icon: Cloud,
      color: "from-cyan-500 via-sky-500 to-blue-600",
      glow: "shadow-[0_0_40px_rgba(6,182,212,0.4)]",
    },
    {
      name: "Gemini 2.5 Flash",
      category: "AI Generation",
      description:
        "Google's cutting-edge language model delivering contextual, human-like responses at blazing speed",
      icon: Cpu,
      color: "from-pink-500 via-rose-500 to-red-600",
      glow: "shadow-[0_0_40px_rgba(236,72,153,0.4)]",
    },
  ];

  const pipelineSteps = [
    { icon: FileText, label: "Upload", sublabel: "PDF Docs" },
    { icon: Layers, label: "Chunk", sublabel: "Split Text" },
    { icon: Brain, label: "Embed", sublabel: "1024D Vectors" },
    { icon: Database, label: "Store", sublabel: "Qdrant DB" },
    { icon: Search, label: "Search", sublabel: "Semantic" },
    { icon: Zap, label: "Generate", sublabel: "AI Answer" },
  ];

  const floatingIcons = [
    { Icon: FileText, delay: 0, duration: 3 },
    { Icon: Brain, delay: 0.5, duration: 3.5 },
    { Icon: Zap, delay: 1, duration: 4 },
    { Icon: Sparkles, delay: 1.5, duration: 3.2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"
          style={{
            top: "10%",
            left: "20%",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"
          style={{
            bottom: "10%",
            right: "20%",
            animationDelay: "1s",
            transform: `translateY(${-scrollY * 0.2}px)`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"
          style={{
            top: "50%",
            left: "50%",
            animationDelay: "2s",
            transform: `translate(-50%, -50%) translateY(${scrollY * 0.15}px)`,
          }}
        />
      </div>

      <div className="fixed inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      {floatingIcons.map(({ Icon, delay, duration }, idx) => (
        <div
          key={idx}
          className="absolute text-blue-400/20"
          style={{
            top: `${20 + idx * 20}%`,
            left: `${10 + idx * 20}%`,
            animation: `float ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        >
          <Icon size={48} />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 backdrop-blur-xl mb-8">
            <Sparkles className="text-emerald-400" size={18} />
            <span className="text-sm font-semibold text-blue-200 tracking-wide">
              TECHNOLOGY BREAKDOWN
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Built Different
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto font-light">
            Enterprise-grade RAG architecture powered by 8 cutting-edge
            technologies
          </p>
        </div>

        {/* Tech Grid - Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-500 overflow-hidden cursor-pointer"
              onMouseEnter={() => setActiveCategory(idx)}
            >
              {/* Gradient glow on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
              />

              {/* Top gradient bar */}
              <div className={`h-1.5 bg-gradient-to-r ${tech.color}`} />

              <div className="relative z-10 p-6">
                {/* Icon and Category */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${tech.color} ${tech.glow} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tech.icon className="text-white" size={24} />
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {tech.category}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
                  {tech.name}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed text-sm min-h-[80px]">
                  {tech.description}
                </p>

                {/* Hover indicator */}
                <div className="flex items-center gap-2 mt-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-semibold">Learn more</span>
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Flow */}
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                The RAG Pipeline
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              {pipelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <div className="group/step flex flex-col items-center">
                    {/* Step circle */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl blur-lg opacity-50 group-hover/step:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center group-hover/step:scale-110 transition-transform duration-300 shadow-2xl">
                        <step.icon className="text-white" size={32} />
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="mt-4 text-center">
                      <p className="text-white font-bold text-base mb-1">
                        {step.label}
                      </p>
                      <p className="text-slate-500 text-xs font-medium">
                        {step.sublabel}
                      </p>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {idx < pipelineSteps.length - 1 && (
                    <div className="hidden sm:block">
                      <ChevronRight className="text-emerald-400/50" size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "1024", label: "Dimensions", sublabel: "Vector Space" },
            {
              value: "<100ms",
              label: "Response Time",
              sublabel: "Search Speed",
            },
            { value: "100%", label: "Secure", sublabel: "JWT + Bcrypt" },
            { value: "∞", label: "Scalable", sublabel: "Cloud Native" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-white font-semibold text-sm mb-1">
                {stat.label}
              </div>
              <div className="text-slate-500 text-xs">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
