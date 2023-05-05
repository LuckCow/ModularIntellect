import { createContext } from 'react';
import ChainExecutionStore from './ChainExecutionStore';

interface StoreContextValue {
  chainExecutionStore: ChainExecutionStore;
}

const StoreContext = createContext<StoreContextValue>({} as StoreContextValue);

export { StoreContext };
