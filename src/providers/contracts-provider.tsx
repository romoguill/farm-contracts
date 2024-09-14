import { Contract } from '@/db/schema';
import { createContext, PropsWithChildren, useContext } from 'react';

type ContextType = {
  contracts: Contract[];
};

const ContractsContext = createContext<ContextType | null>(null);

export function ContractsProvider({ children }: PropsWithChildren) {
  const contracts: Contract[] = [];

  return (
    <ContractsContext.Provider value={{ contracts }}>
      {children}
    </ContractsContext.Provider>
  );
}

export function useContractsContext() {
  const context = useContext(ContractsContext);

  if (!context)
    throw new Error('This hook must be inside ContractsProvider component');

  return context;
}
