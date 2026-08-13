'use client';

type Listener = () => void;

let schoolLogo: string | null = null;
let listeners: Listener[] = [];

function getSchoolLogo(): string | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('schoolLogo');
    if (stored) return stored;
  }
  return schoolLogo;
}

function setSchoolLogo(logo: string | null): void {
  schoolLogo = logo;
  if (typeof window !== 'undefined') {
    if (logo) {
      localStorage.setItem('schoolLogo', logo);
    } else {
      localStorage.removeItem('schoolLogo');
    }
  }
  listeners.forEach(fn => fn());
}

function subscribe(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export { getSchoolLogo, setSchoolLogo, subscribe };