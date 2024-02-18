import { type PropsWithChildren, createContext } from "react";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  return <AppContext.Provider value={AppContext}>{children}</AppContext.Provider>;
};
