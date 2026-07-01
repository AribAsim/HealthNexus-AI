import { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

interface Props {
  language: string;
}

export default function VoiceReporter({ language }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isHi = language === 'hi';

  const startRecording = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isHi ? 'आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता है।' : 'Your browser does not support voice input.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = isHi ? 'hi-IN' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        processWithGemini(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const processWithGemini = async (text: string) => {
    if (!text || !API_KEY) return;
    setProcessing(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are a medical NLP assistant for HealthNexus AI.
        User said: "${text}"

        Extract updates to facility metrics. We track: 
        - inventory (Paracetamol, ORS, Amoxicillin, IV Fluids, Rabies Vaccine)
        - beds (total, occupied, oxygen)
        - staff (doctorsPresent, nursesPresent)

        Return strictly JSON in this schema (or empty object if nothing clear):
        {
          "facilityMatch": "string or null",
          "updates": {
             "beds": { "occupied": number },
             "inventory": [ { "item": "string", "stock": number } ]
          }
        }
      `;

      const result = await model.generateContent(prompt);
      const resText = result.response.text().replace(/^```json/i, '').replace(/```$/, '').trim();
      const data = JSON.parse(resText);

      // We would normally look up the facility ID and apply the update.
      // For the demo, we will just show a toast notification of what *would* happen.
      if (data.facilityMatch) {
         console.log('Voice extracted:', data);
         // Simulate store update (pseudo-code as we need actual IDs to update properly)
         // updateFacility(foundId, data.updates);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {transcript && (
        <div className="bg-surface-container-high text-on-surface text-sm px-4 py-2 rounded-xl shadow-lg border border-outline-variant max-w-xs animate-fade-in flex flex-col gap-1">
          <span>"{transcript}"</span>
          {processing && <span className="text-primary text-[10px] uppercase font-bold animate-pulse">{isHi ? 'प्रसंस्करण...' : 'Processing...'}</span>}
        </div>
      )}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 border-2 ${
          isRecording 
            ? 'bg-error text-white border-error animate-pulse shadow-error/20' 
            : 'bg-primary text-white border-primary-container shadow-primary/20'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">
          {isRecording ? 'mic_off' : 'mic'}
        </span>
      </button>
    </div>
  );
}
