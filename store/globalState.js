import { createContext, useReducer, useEffect } from "react";
import { reducers } from "./reducers";
import { getData } from "../utils/fetchData";

export const DataContext = createContext();

const initialState = {
  notify: {},
  auth: {},
  cart: [],
  modal: [],
  orders: [],
  users: [],
  categories: [],
};

export const DataProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducers, initialState);
  const { cart, auth } = state;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      getData("auth/accessToken").then((res) => {
        if (res.error) {
          return localStorage.removeItem("firstLogin");
        }
        dispatch({
          type: "AUTH",
          payload: {
            token: res.access_token,
            user: res.user,
          },
        });
      });
    }

    // getData("categories").then((res) => {
    //   if (res.error) {
    //     return dispatch({ type: "NOTIFY", payload: { error: res.error } })
    //   }
    //   dispatch({
    //     type: "ADD_CATEGORIES",
    //     payload: res.categories
    //   })
    // })
  }, []);

  useEffect(() => {
    const __next__cart01__ti_shop = JSON.parse(
      localStorage.getItem("__next__cart01__ti_shop")
    );
    if (__next__cart01__ti_shop) {
      dispatch({ type: "ADD_CART", payload: __next__cart01__ti_shop });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("__next__cart01__ti_shop", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth.token) {
      getData("order", auth.token).then((res) => {
        if (res.error) {
          return dispatch({ type: "NOTIFY", payload: { error: res.error } });
        }
        dispatch({ type: "ADD_ORDERS", payload: res.orders });
      });

      if (auth.user.role === "admin") {
        getData("user", auth.token).then((res) => {
          if (res.error) {
            return dispatch({ type: "NOTIFY", payload: { error: res.error } });
          }
          dispatch({ type: "ADD_USERS", payload: res.users });
        });
      } else {
        dispatch({ type: "ADD_ORDERS", payload: [] });
        dispatch({ type: "ADD_USERS", payload: [] });
      }
    }
  }, [auth.token]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
