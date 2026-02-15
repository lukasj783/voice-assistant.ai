
export enum Page {
  HOME = 'home',
  HISTORY = 'history',
  SETTINGS = 'settings',
  TOOLS = 'tools',
  ADMIN = 'admin'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface VoiceSettings {
  voiceName: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
  speed: number;
  pitch: number;
  language: string;
  tone: 'empathetic' | 'formal' | 'friendly';
}

export interface AppSettings {
  voice: VoiceSettings;
  memoryEnabled: boolean;
  darkMode: boolean;
  notifications: boolean;
}

export interface ConversationHistory {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
  isPinned: boolean;
}
