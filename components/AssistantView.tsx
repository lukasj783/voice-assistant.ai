
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { AppSettings, ChatMessage } from '../types';
import { GEMINI_MODEL } from '../constants';
import { decode, encode, decodeAudioData, createBlob } from '../services/audioUtils';
import Visualizer from './Visualizer';

interface AssistantViewProps {
  settings: AppSettings;
}

const AssistantView: React.FC<AssistantViewProps> = ({ settings }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<string>('Ready');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userTranscript, setUserTranscript] = useState('');
  const [aiTranscript, setAiTranscript] = useState('');
  
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, aiTranscript]);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setStatus('Connecting...');
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = inputCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const sessionPromise = ai.live.connect({
        model: GEMINI_MODEL,
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setStatus('Listening...');
            
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcripts
            if (message.serverContent?.outputTranscription) {
              setAiTranscript(prev => prev + message.serverContent?.outputTranscription?.text);
            } else if (message.serverContent?.inputTranscription) {
              setUserTranscript(prev => prev + message.serverContent?.inputTranscription?.text);
            }

            if (message.serverContent?.turnComplete) {
              setMessages(prev => [
                ...prev,
                { id: Date.now().toString(), role: 'user', text: userTranscript, timestamp: Date.now() },
                { id: (Date.now() + 1).toString(), role: 'assistant', text: aiTranscript, timestamp: Date.now() }
              ]);
              setUserTranscript('');
              setAiTranscript('');
            }

            // Handle Audio
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const { output } = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, output.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), output, 24000, 1);
              const sourceNode = output.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(output.destination);
              
              sourceNode.addEventListener('ended', () => {
                sourcesRef.current.delete(sourceNode);
              });

              sourceNode.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(sourceNode);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Session Error:', e);
            stopSession();
          },
          onclose: () => {
            console.log('Session Closed');
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: settings.voice.voiceName } }
          },
          systemInstruction: `You are Nova, a world-class assistant. Your tone is ${settings.voice.tone}. Always be helpful, concise, and friendly.`,
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start session:', err);
      setStatus('Failed to connect');
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      // sessionRef.current.close(); // Implicit closure by context cleanup
    }
    setIsActive(false);
    setIsConnecting(false);
    setStatus('Ready');
    analyserRef.current = null;
    audioContextRef.current = null;
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px] transition-all duration-1000 ${isActive ? 'scale-125 opacity-30' : 'scale-75 opacity-0'}`} />
      </div>

      {/* Main Interaction Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
        <div className="relative">
          <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${isActive ? 'border-sky-400 glow scale-110' : 'border-slate-700 opacity-60'}`}>
            <div className={`w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center ${isActive ? 'animate-pulse-slow' : ''}`}>
               {isActive ? (
                 <svg className="w-16 h-16 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
                   <path d="M3 10a7 7 0 0014 0h-1m-1 0a7 7 0 01-14 0H3m2 0a5 5 0 0010 0h1m-1 0a5 5 0 01-10 0H5" />
                 </svg>
               ) : (
                 <svg className="w-16 h-16 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                 </svg>
               )}
            </div>
          </div>
          {isActive && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="flex items-center gap-2 text-sky-400 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Listening...
              </span>
            </div>
          )}
        </div>

        <div className="w-full max-w-xl text-center space-y-4">
          <Visualizer analyser={analyserRef.current} isActive={isActive} />
          <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">{status}</p>
        </div>
      </div>

      {/* Transcript Log */}
      <div className="h-48 bg-slate-900/60 backdrop-blur-md border-t border-slate-800 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-sky-500/20 text-sky-100 border border-sky-500/30' : 'bg-slate-800 text-slate-200'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {(userTranscript || aiTranscript) && (
             <div className="space-y-2 animate-pulse">
               {userTranscript && (
                 <div className="flex justify-end">
                   <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm bg-sky-500/10 text-sky-200 italic border border-sky-500/20">
                     {userTranscript}...
                   </div>
                 </div>
               )}
               {aiTranscript && (
                 <div className="flex justify-start">
                   <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm bg-slate-800/50 text-slate-400 italic">
                     {aiTranscript}...
                   </div>
                 </div>
               )}
             </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-slate-900 flex justify-center items-center gap-6">
        <button className="p-3 text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        </button>
        
        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'}`}
        >
          {isConnecting ? 'Starting...' : (isActive ? 'STOP ASSISTANT' : 'START ASSISTANT')}
        </button>

        <button className="p-3 text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default AssistantView;
