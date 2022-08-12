import React, { useReducer } from "react";
import AuthContext from "./context/AuthContext";
import * as ACTIONS from "../store/actions/actions";
import * as AuthReducer from "../store/reducers/authReducer";
import App from "../App";

const ContextState = () => {
  const [stateAuthReducer, dispatchAuthReducer] = useReducer(
    AuthReducer.AuthReducer,
    AuthReducer.initialState
  );

  const handleLogin = (data) => {
    dispatchAuthReducer(ACTIONS.login(data));
  };

  const handleLogout = () => {
    dispatchAuthReducer(ACTIONS.logout());
  };

  return (
    <AuthContext.Provider
      value={{
        authState: stateAuthReducer.isAuth,
        tokenState: stateAuthReducer.token,
        handleUserLogin: (username) => handleLogin(username),
        handleUserLogout: () => handleLogout(),
      }}
    >
      <App />
    </AuthContext.Provider>
  );
};

export default ContextState;
