import { createContext, useContext } from 'react';

interface NavigateContextType {
  onTabChange: (tab: string) => void;
}

const NavigateContext = createContext<NavigateContextType>({ onTabChange: () => {} });

export function useNavigate() {
  return useContext(NavigateContext);
}

export { NavigateContext };
