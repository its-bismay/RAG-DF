import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Send, 
  Loader2, 
  CheckCircle2, 
  X,
  Bot,
  User,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [collectionName, setCollectionName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadSuccess(true);
        setPdfUrl(URL.createObjectURL(file));
        setCollectionName(file.name.split('.')[0]);
        setMessages([{
          type: 'system',
          content: `PDF "${file.name}" uploaded successfully! You can now ask questions about it.`
        }]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessages([{
        type: 'error',
        content: 'Failed to upload PDF. Please try again.'
      }]);
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !collectionName) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setSending(true);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          collection_name: collectionName
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: data.answer,
          context: data.context_used 
        }]);
      }
    } catch (error) {
      console.error('Query error:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Failed to get response. Please try again.' 
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text) => {
    if (!text) return null;
    
    // Split by lines
    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      // Handle bullet points (*)
      if (line.trim().startsWith('* ')) {
        const content = line.substring(line.indexOf('* ') + 2);
        return (
          <div key={idx} className="flex gap-2 mb-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>{formatInlineMarkdown(content)}</span>
          </div>
        );
      }
      
      // Handle numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s/);
      if (numberedMatch) {
        const content = line.substring(numberedMatch[0].length);
        return (
          <div key={idx} className="flex gap-2 mb-2">
            <span className="text-blue-400 font-semibold">{numberedMatch[1]}.</span>
            <span>{formatInlineMarkdown(content)}</span>
          </div>
        );
      }
      
      // Regular text
      return line.trim() ? (
        <p key={idx} className="mb-2">
          {formatInlineMarkdown(line)}
        </p>
      ) : (
        <br key={idx} />
      );
    });
  };

  const formatInlineMarkdown = (text) => {
    const parts = [];
    let lastIndex = 0;
    
    // Match **bold** and *italic*
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const matched = match[0];
      if (matched.startsWith('**') && matched.endsWith('**')) {
        // Bold text
        parts.push(
          <strong key={match.index} className="font-bold text-white">
            {matched.slice(2, -2)}
          </strong>
        );
      } else if (matched.startsWith('*') && matched.endsWith('*')) {
        // Italic text
        parts.push(
          <em key={match.index} className="italic">
            {matched.slice(1, -1)}
          </em>
        );
      }
      
      lastIndex = regex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  const handleReset = () => {
    setFile(null);
    setUploadSuccess(false);
    setPdfUrl(null);
    setCollectionName('');
    setMessages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse top-0 left-0" />
        <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse bottom-0 right-0" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
          <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  RAG Dashboard
                </h1>
                {collectionName && (
                  <p className="text-xs text-slate-400">Document: {collectionName}</p>
                )}
              </div>
            </div>
            {uploadSuccess && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
              >
                Upload New PDF
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {!uploadSuccess ? (
          // Upload Section
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-xl w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Upload Your PDF
                </h2>
                <p className="text-slate-400">
                  Upload a PDF document to start asking questions
                </p>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                <div className="relative p-12 rounded-3xl bg-slate-900/60 backdrop-blur-xl border-2 border-dashed border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                      <Upload className="text-white" size={36} />
                    </div>

                    {file ? (
                      <div className="text-center">
                        <p className="text-white font-semibold mb-1 flex items-center gap-2 justify-center">
                          <FileText size={20} className="text-emerald-400" />
                          {file.name}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-white font-semibold mb-1">
                          Click to upload PDF
                        </p>
                        <p className="text-slate-400 text-sm">
                          or drag and drop your file here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {file && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        Upload & Process
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Split View: PDF + Chat
          <div className="flex-1 flex overflow-hidden">
            {/* Left: PDF Viewer */}
            <div className="w-1/2 border-r border-slate-800/50 bg-slate-900/30 flex flex-col">
              <div className="p-4 border-b border-slate-800/50 bg-slate-900/50">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <FileText size={18} className="text-blue-400" />
                  Document Preview
                </h3>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {pdfUrl && (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full rounded-xl border border-slate-800/50"
                    title="PDF Preview"
                  />
                )}
              </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="w-1/2 flex flex-col bg-slate-900/20">
              <div className="p-4 border-b border-slate-800/50 bg-slate-900/50">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Bot size={18} className="text-emerald-400" />
                  AI Assistant
                </h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type !== 'user' && (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.type === 'error' ? 'bg-red-500/20' : 'bg-gradient-to-br from-blue-500 to-emerald-500'
                      }`}>
                        <Bot size={16} className="text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${msg.type === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-2xl p-4 ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white' 
                          : msg.type === 'error'
                          ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                          : 'bg-slate-800/50 border border-slate-700/50 text-slate-200'
                      }`}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap formatted-content">
                          {formatMessage(msg.content)}
                        </div>
                      </div>
                    </div>

                    {msg.type === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 order-2">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {sending && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about your document..."
                    disabled={sending}
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all duration-300 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !inputMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* CSS Animations */}
      <style>{`
        .formatted-content strong {
          font-weight: 600;
        }
        
        .formatted-content em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}