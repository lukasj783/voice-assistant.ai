
import React from 'react';
import { AppSettings, VoiceSettings } from '../types';
import { VOICE_OPTIONS, TONE_OPTIONS, LANGUAGE_OPTIONS } from '../constants';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const updateVoice = (key: keyof VoiceSettings, value: any) => {
    onUpdate({
      ...settings,
      voice: { ...settings.voice, [key]: value }
    });
  };

  const updateApp = (key: keyof AppSettings, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 overflow-y-auto max-h-[85vh]">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-sky-400">Voice Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Select Voice</label>
            <select 
              value={settings.voice.voiceName}
              onChange={(e) => updateVoice('voiceName', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              {VOICE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Language</label>
            <select 
              value={settings.voice.language}
              onChange={(e) => updateVoice('language', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              {LANGUAGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Voice Tone</label>
            <select 
              value={settings.voice.tone}
              onChange={(e) => updateVoice('tone', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              {TONE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Speech Speed: {settings.voice.speed.toFixed(1)}x</label>
            <input 
              type="range" min="0.5" max="2.0" step="0.1" 
              value={settings.voice.speed}
              onChange={(e) => updateVoice('speed', parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-sky-400">Assistant Intelligence</h2>
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div>
            <h3 className="font-medium">Persistent Memory</h3>
            <p className="text-xs text-slate-400">Allows the assistant to remember your preferences and past conversations.</p>
          </div>
          <button 
            onClick={() => updateApp('memoryEnabled', !settings.memoryEnabled)}
            className={`w-12 h-6 rounded-full transition-colors ${settings.memoryEnabled ? 'bg-sky-500' : 'bg-slate-600'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.memoryEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-sky-400">Account & Phone</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-sky-500/20 rounded-full flex items-center justify-center text-sky-400 font-bold">JD</div>
            <div>
              <p className="font-medium text-slate-200">Jane Doe</p>
              <p className="text-xs text-slate-400">jane.doe@example.com</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Twilio Phone Link (Optional)</label>
            <input 
              type="tel" placeholder="+1 (555) 000-0000"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
