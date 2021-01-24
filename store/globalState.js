import { createContext, useReducer, useEffect } from "react";
import { reducers } from "./reducers";
import { getData } from '../utils/fetchData';

export const DataContext = createContext();

const initialState = {
  notify: {},
  auth: {},
  cart: [],
  modal: {}
};

export const DataProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducers, initialState);
  const { cart } = state

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin")
    if (firstLogin) {
      getData('auth/accessToken').then((res) => {
        if (res.error) {
          return localStorage.removeItem("firstLogin")
        }
        dispatch({
          type: "AUTH",
          payload: {
            token: res.access_token,
            user: res.user
          }
        })
      })
    }
  }, []);

  useEffect(() => {
    const __next__cart01__ti_shop = JSON.parse(localStorage.getItem("__next__cart01__ti_shop"))
    if (__next__cart01__ti_shop) {
      dispatch({ type: "ADD_CART", payload: __next__cart01__ti_shop })
    }
  },[])

  useEffect(() => {
    localStorage.setItem("__next__cart01__ti_shop", JSON.stringify(cart))
  },[cart])

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
