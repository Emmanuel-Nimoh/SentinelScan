import { createContext, useContext, useState } from 'react';

export const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [currentScan, setCurrentScan] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const value = { currentScan, setCurrentScan, scanHistory, setScanHistory };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
