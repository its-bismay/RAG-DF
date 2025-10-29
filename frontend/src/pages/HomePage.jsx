import { useState, useEffect } from "react";
import { Sparkles, FileText, Brain, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const[isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingIcons = [
    { Icon: FileText, delay: 0, duration: 3 },
    { Icon: Brain, delay: 0.5, duration: 3.5 },
    { Icon: Zap, delay: 1, duration: 4 },
    { Icon: Sparkles, delay: 1.5, duration: 3.2 },
  ];

  const navigate = useNavigate();
  const handleLearnmore = () => {
    navigate("/about");
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center">
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

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm mb-8 animate-fade-in">
          <Sparkles className="text-emerald-400" size={16} />
          <span className="text-sm text-blue-200 font-medium">
            Powered by Advanced AI Technology
          </span>
        </div>

        {/* Main heading with gradient text */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Transform Your Documents
          </span>
          <br />
          <span className="text-white mt-2 block">
            Into Interactive Knowledge
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-lg sm:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Upload PDFs and ask questions powered by cutting-edge RAG technology.
          Get instant, accurate answers from your documents with AI-driven
          semantic search.
        </p>

        {/* CTA Button */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <button
          onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full font-semibold text-white text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)] transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <Zap
                size={20}
                className={`transition-transform duration-300 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button
            onClick={handleLearnmore}
            className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full font-semibold text-white text-lg hover:bg-slate-800/70 hover:border-blue-500/50 transition-all duration-300"
          >
            Learn More
          </button>
        </div>

        {/* Feature highlights */}
        <div
          className="flex flex-wrap justify-center gap-8 mt-20 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          {[
            {
              icon: FileText,
              title: "Smart Upload",
              desc: "Intelligent PDF processing",
            },
            {
              icon: Brain,
              title: "AI-Powered",
              desc: "Advanced semantic search",
            },
            {
              icon: Zap,
              title: "Instant Answers",
              desc: "Lightning-fast responses",
            },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-4 px-6 py-4 rounded-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-blue-500/20 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all duration-300">
                <Icon className="text-white" size={20} />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-base">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>

<AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
