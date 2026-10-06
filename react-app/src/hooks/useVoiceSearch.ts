import { useCallback, useRef, useState } from "react";

// Minimal Web Speech API typings (not in TS DOM lib).
interface SpeechRecognitionResult {
  transcript: string;
}
interface SpeechRecognitionResultList {
  [index: number]: { [index: number]: SpeechRecognitionResult };
}
interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

/**
 * Voice search via Web Speech API (Hindi), mirrors voiceSearch().
 * Returns transcript through onResult. Unsupported browsers report
 * `supported === false` so the mic button can hide itself.
 */
export function useVoiceSearch(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  const w = window as unknown as WindowWithSpeech;
  const supported = typeof w.SpeechRecognition !== "undefined" || typeof w.webkitSpeechRecognition !== "undefined";

  const toggle = useCallback(() => {
    if (!supported) return;
    if (recRef.current) {
      recRef.current.stop();
      recRef.current = null;
      setListening(false);
      return;
    }
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "hi-IN";
    rec.interimResults = false;
    rec.onresult = (e: SpeechRecognitionEventLike) => {
      onResult(e.results[0][0].transcript);
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [supported, onResult, w]);

  return { supported, listening, toggle };
}
