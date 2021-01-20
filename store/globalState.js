import { createContext, useReducer, useEffect } from "react";
import { reducers } from "./reducers";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = { notify: {}, auth: {} };
  const [state, dispatch] = useReducer(reducers, initialState);

  useEffect(() => {}, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
