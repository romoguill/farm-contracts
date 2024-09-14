import { Contract } from '@/db/schema';
import { createContext } from 'react';

type ContextType = {
  contracts: Contract;
};

const contractsContext = createContext(null);

export function ContractsProvider() {
  return <div></div>;
}
