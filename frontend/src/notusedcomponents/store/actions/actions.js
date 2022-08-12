export const login = (data) => {
  return {
    type: actionTypes.LOGIN,
    token: data.token,
  };
};

export const logout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};
