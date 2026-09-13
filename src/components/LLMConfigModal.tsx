import React, { useState } from 'react';
import { X, Cpu, Key, Server, Check } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProvider: string;
  onSaveProvider: (provider: string) => void;
}

export const LLMConfigModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  currentProvider,
  onSaveProvider
}) => {
  const [selected, setSelected] = useState(currentProvider);
  const [geminiKey, setGeminiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">LLM Provider Configuration</h3>
            <p className="text-xs text-slate-400">Choose host model for NIRVAHA tool selection & reasoning</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {/* OLLAMA */}
          <div
            onClick={() => setSelected('ollama')}
            className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
              selected === 'ollama'
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="font-bold text-xs">Local Ollama</h4>
                <p className="text-[10px] text-slate-500">http://localhost:11434 (llama3 / qwen2.5)</p>
              </div>
            </div>
            {selected === 'ollama' && <Check className="w-4 h-4 text-cyan-400" />}
          </div>

          {/* GEMINI */}
          <div
            onClick={() => setSelected('gemini')}
            className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 ${
              selected === 'gemini'
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="font-bold text-xs">Google Gemini API</h4>
                  <p className="text-[10px] text-slate-500">gemini-2.5-flash</p>
                </div>
              </div>
              {selected === 'gemini' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
            {selected === 'gemini' && (
              <input
                type="password"
                placeholder="Enter Gemini API Key..."
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>

          {/* GROQ */}
          <div
            onClick={() => setSelected('groq')}
            className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 ${
              selected === 'groq'
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-bold text-xs">Groq API</h4>
                  <p className="text-[10px] text-slate-500">llama-3.3-70b-versatile</p>
                </div>
              </div>
              {selected === 'groq' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
            {selected === 'groq' && (
              <input
                type="password"
                placeholder="Enter Groq API Key..."
                value={groqKey}
                onChange={e => setGroqKey(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>
        </div>

        <button
          onClick={() => {
            onSaveProvider(selected);
            onClose();
          }}
          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};
