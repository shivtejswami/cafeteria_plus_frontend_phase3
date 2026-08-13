'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type SubMode = 'active' | 'read-only';

interface ReadOnlyModeContextValue {
  mode: SubMode;
  isReadOnly: boolean;
  toggleMode: () => void;
}

const ReadOnlyModeContext = createContext<ReadOnlyModeContextValue>({
  mode: 'active',
  isReadOnly: false,
  toggleMode: () => {},
});

export function ReadOnlyModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SubMode>('active');

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'active' ? 'read-only' : 'active'));
  }, []);

  return (
    <ReadOnlyModeContext.Provider value={{ mode, isReadOnly: mode === 'read-only', toggleMode }}>
      {children}
    </ReadOnlyModeContext.Provider>
  );
}

export function useReadOnlyMode() {
  return useContext(ReadOnlyModeContext);
}