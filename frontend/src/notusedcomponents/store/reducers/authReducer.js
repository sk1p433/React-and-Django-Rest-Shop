import { createContext } from 'react';
import * as actionTypes from "../actions/actionTypes";


export const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem("LoginToken"),
};

export const AuthStore = createContext()

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        token: action.token,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: "",
      };
    default:
      return state;
  }
};
