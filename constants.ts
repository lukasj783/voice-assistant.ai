
import { VoiceSettings, AppSettings } from './types';

export const GEMINI_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceName: 'Zephyr',
  speed: 1.0,
  pitch: 1.0,
  language: 'en-US',
  tone: 'friendly'
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  voice: DEFAULT_VOICE_SETTINGS,
  memoryEnabled: true,
  darkMode: true,
  notifications: true
};

export const VOICE_OPTIONS = [
  { value: 'Zephyr', label: 'Zephyr (Smooth & Warm)' },
  { value: 'Puck', label: 'Puck (Cheerful & High)' },
  { value: 'Charon', label: 'Charon (Deep & Calm)' },
  { value: 'Kore', label: 'Kore (Clear & Professional)' },
  { value: 'Fenrir', label: 'Fenrir (Textured & Solid)' }
];

export const TONE_OPTIONS = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'formal', label: 'Formal' }
];

export const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'ja-JP', label: 'Japanese' }
];
