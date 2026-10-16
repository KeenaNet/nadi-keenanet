import React, { useState, useRef, useEffect } from 'react';
import { CommandLog } from '../types';
import { QUICK_COMMANDS, getSimulatedResponse } from '../data/commandData';
import { sound } from '../audio/soundSystem';
import { Terminal, Send, Trash2, Shield, CornerDownLeft, Sparkles, X } from 'lucide-react';

interface CommandInterfaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandInterfaceModal: React.FC<CommandInterfaceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'KEENANET AUTONOMOUS AGENT BUS INITIALIZED. NADI CO-PILOT LISTENING.',
      timestamp: '00:00:01',
      metadata: { subsystem: 'SYS_INIT', status: 'info' }
    },
    {
      id: 'init-2',
      type: 'nadi',
      text: 'Ready. I am NADI — your engineering partner and technical co-pilot for KeenaNet. Select a preset diagnostic directive below or submit a custom system inquiry.',
      timestamp: '00:00:02',
      metadata: { subsystem: 'NADI_CORE', latency: '12ms', status: 'success' }
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isTyping]);

  const handleSendCommand = (cmdString: string) => {
    if (!cmdString.trim() || isTyping) return;

    sound.playClick();
    const userTime = new Date().toLocaleTimeString();

    const userLog: CommandLog = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: cmdString,
      timestamp: userTime
    };

    setLogs((prev) => [...prev, userLog]);
    setInputVal('');
    setIsTyping(true);

    const simulated = getSimulatedResponse(cmdString);

    // Simulate realistic model reasoning delay
    setTimeout(() => {
      sound.playTypeTick();
      const nadiLog: CommandLog = {
        id: `nadi-${Date.now()}`,
        type: 'nadi',
        text: simulated.text,
        timestamp: new Date().toLocaleTimeString(),
        metadata: {
          subsystem: simulated.subsystem,
          latency: simulated.latency,
          status: 'success'
        }
      };

      setLogs((prev) => [...prev, nadiLog]);
      setIsTyping(false);
    }, 450);
  };

  const handleClear = () => {
    sound.playClick();
    setLogs([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 pointer-events-auto bg-[#050B14]/80">
      <div className="w-full max-w-4xl h-[85vh] max-h-[700px] bg-[#07111F] border border-[#00D9FF]/40 rounded-lg shadow-[0_0_40px_rgba(0,217,255,0.2)] flex flex-col overflow-hidden hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0B1526] border-b border-[#1C2533]">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D9FF]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF]"></span>
            </div>
            <span className="text-xs font-code font-bold text-white tracking-wider flex items-center space-x-1.5">
              <Terminal className="w-4 h-4 text-[#00D9FF]" />
              <span>NADI // COMMAND CONSOLE</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-[10px] font-code text-[#00D9FF] bg-[#07111F] px-2 py-0.5 rounded border border-[#00D9FF]/30">
              OPENCLAW FAST-MCP BRIDGE: SIMULATED
            </span>
            <button
              onClick={handleClear}
              title="Clear Terminal Output"
              className="p-1.5 text-[#A7BBCB] hover:text-white hover:bg-[#1C2533] rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#A7BBCB] hover:text-white hover:bg-[#1C2533] rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-3 py-2 bg-[#091322] border-b border-[#1C2533] flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] font-code text-[#62778A] uppercase tracking-wider shrink-0">
            Presets:
          </span>
          {QUICK_COMMANDS.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleSendCommand(cmd.command)}
              className="px-2.5 py-1 text-[11px] font-code bg-[#0F1C2E] hover:bg-[#16273F] text-[#A7BBCB] hover:text-[#00D9FF] border border-[#1C2533] hover:border-[#00D9FF]/40 rounded shrink-0 transition-colors cursor-pointer"
            >
              {cmd.label}
            </button>
          ))}
        </div>

        {/* Terminal Logs View */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-code text-xs space-y-3 bg-[#050B14]">
          {logs.map((log) => (
            <div key={log.id} className="space-y-1">
              {/* Log Meta Header */}
              <div className="flex items-center space-x-2 text-[10px] text-[#62778A]">
                <span>[{log.timestamp}]</span>
                <span
                  className={
                    log.type === 'user'
                      ? 'text-[#A7BBCB]'
                      : log.type === 'nadi'
                      ? 'text-[#00D9FF] font-semibold'
                      : 'text-amber-400'
                  }
                >
                  {log.type === 'user' ? 'ENGINEER@HOMELAB' : log.type === 'nadi' ? 'NADI@CO-PILOT' : 'DAEMON'}
                </span>
                {log.metadata?.subsystem && (
                  <span className="bg-[#0D1826] text-[#62778A] px-1 rounded">
                    {log.metadata.subsystem}
                  </span>
                )}
                {log.metadata?.latency && (
                  <span className="text-emerald-400">({log.metadata.latency})</span>
                )}
              </div>

              {/* Log Content */}
              <div
                className={`p-2.5 rounded border whitespace-pre-wrap leading-relaxed ${
                  log.type === 'user'
                    ? 'bg-[#0D1826] text-white border-[#1C2533]'
                    : log.type === 'nadi'
                    ? 'bg-[#071324] text-[#E0F2FE] border-[#00D9FF]/30'
                    : 'bg-[#141B26] text-amber-200 border-amber-900/40'
                }`}
              >
                {log.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs font-code text-[#00D9FF]">
              <span className="inline-block w-2 h-2 bg-[#00D9FF]"></span>
              <span>NADI is computing architectural analysis...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendCommand(inputVal);
          }}
          className="p-3 bg-[#0B1526] border-t border-[#1C2533] flex items-center space-x-2"
        >
          <span className="text-[#00D9FF] font-code text-sm font-bold pl-2">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type directive (e.g. 'Analyze KeenaNet Architecture' or 'Show Network Topology')..."
            className="flex-1 bg-transparent border-none outline-none text-white font-code text-xs px-2 py-1 placeholder:text-[#4A5D6E]"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="px-4 py-2 bg-[#00D9FF] hover:bg-[#38BDF8] disabled:opacity-40 disabled:cursor-not-allowed text-[#050B14] font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>Execute</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
