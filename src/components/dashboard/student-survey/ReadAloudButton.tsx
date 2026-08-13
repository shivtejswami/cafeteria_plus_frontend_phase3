'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface ReadAloudButtonProps {
  content: string;
  iconOnly?: boolean;
}

export default function ReadAloudButton({ content, iconOnly = false }: ReadAloudButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
    }

    const handleVoicesChanged = () => {};
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      }
    };
  }, []);

  const handleClick = useCallback(() => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  }, [content, isSpeaking]);

  useEffect(() => {
    return () => {
      if (synthRef.current && isSpeaking) {
        synthRef.current.cancel();
      }
    };
  }, [isSpeaking]);

  if (!isSupported) return null;

  if (iconOnly) {
    return (
      <button
        onClick={handleClick}
        aria-label={isSpeaking ? 'Stop reading aloud' : 'Read this to me'}
        aria-pressed={isSpeaking}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris cursor-pointer ${isSpeaking ? 'bg-iris-100 text-iris' : 'bg-transparent text-iris hover:bg-iris-50'}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isSpeaking ? 'animate-pulse' : ''}>
          <path d="M9.5 10C9.95963 10 10.4148 9.90947 10.8394 9.73358C11.264 9.55769 11.6499 9.29988 11.9749 8.97487C12.2999 8.64987 12.5577 8.26403 12.7336 7.83939C12.9095 7.41475 13 6.95963 13 6.5C13 6.04037 12.9095 5.58525 12.7336 5.16061C12.5577 4.73597 12.2999 4.35013 11.9749 4.02513C11.6499 3.70012 11.264 3.44231 10.8394 3.26642C10.4148 3.09053 9.95963 3 9.5 3C8.57174 3 7.6815 3.36875 7.02513 4.02513C6.36875 4.6815 6 5.57174 6 6.5C6 7.42826 6.36875 8.3185 7.02513 8.97487C7.6815 9.63125 8.57174 10 9.5 10Z" fill="#6D28D9" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 4C16.5 4 17.625 6.25 16.5 9M20 2C20 2 22.25 6.05 20 11" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 20.4V21H17V20.4C17 18.16 17 17.04 16.564 16.184C16.1805 15.4314 15.5686 14.8195 14.816 14.436C13.96 14 12.84 14 10.6 14H8.4C6.16 14 5.04 14 4.184 14.436C3.43139 14.8195 2.81949 15.4314 2.436 16.184C2 17.04 2 18.16 2 20.4Z" fill="#6D28D9" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isSpeaking ? 'Stop reading aloud' : 'Read this to me'}
      aria-pressed={isSpeaking}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-[17px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 whitespace-nowrap cursor-pointer min-h-[48px] ${isSpeaking ? 'bg-iris-50' : 'bg-white'} ${isSpeaking ? 'text-iris' : 'text-sage'} ${isSpeaking ? 'border-2 border-iris' : 'border-2 border-sage-200'} ${isSpeaking ? 'shadow-[0_2px_16px_rgba(109,40,217,0.22)]' : 'shadow-[0_1px_4px_rgba(0,0,0,0.04)]'} ${isSpeaking ? '[transform:scale(1.04)]' : '[transform:scale(1)]'}`}
    >
      <span className="w-6 h-6 flex items-center justify-center" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 10C9.95963 10 10.4148 9.90947 10.8394 9.73358C11.264 9.55769 11.6499 9.29988 11.9749 8.97487C12.2999 8.64987 12.5577 8.26403 12.7336 7.83939C12.9095 7.41475 13 6.95963 13 6.5C13 6.04037 12.9095 5.58525 12.7336 5.16061C12.5577 4.73597 12.2999 4.35013 11.9749 4.02513C11.6499 3.70012 11.264 3.44231 10.8394 3.26642C10.4148 3.09053 9.95963 3 9.5 3C8.57174 3 7.6815 3.36875 7.02513 4.02513C6.36875 4.6815 6 5.57174 6 6.5C6 7.42826 6.36875 8.3185 7.02513 8.97487C7.6815 9.63125 8.57174 10 9.5 10Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 4C16.5 4 17.625 6.25 16.5 9M20 2C20 2 22.25 6.05 20 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 20.4V21H17V20.4C17 18.16 17 17.04 16.564 16.184C16.1805 15.4314 15.5686 14.8195 14.816 14.436C13.96 14 12.84 14 10.6 14H8.4C6.16 14 5.04 14 4.184 14.436C3.43139 14.8195 2.81949 15.4314 2.436 16.184C2 17.04 2 18.16 2 20.4Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <span>{isSpeaking ? 'Stop' : 'Read this to me'}</span>
      {isSpeaking && (
        <span className="flex items-center gap-[3px] ml-0.5" aria-hidden="true">
          <span
            className="w-[3px] h-3 rounded-full inline-block animate-pulse bg-iris [animation-duration:0.6s]"
          />
          <span
            className="w-[3px] h-2 rounded-full inline-block animate-pulse bg-iris [animation-delay:0.15s] [animation-duration:0.6s]"
          />
          <span
            className="w-[3px] h-4 rounded-full inline-block animate-pulse bg-iris [animation-delay:0.3s] [animation-duration:0.6s]"
          />
        </span>
      )}
    </button>
  );
}