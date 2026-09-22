import { createSlice } from '@reduxjs/toolkit';

export type AuthCredentials = {
  idInstance: string;
  apiTokenInstance: string;
};

export type AuthState = {
  credentials: AuthCredentials | null;
};

const initialState: AuthState = {
  credentials: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: { payload: AuthCredentials }) => {
      state.credentials = action.payload;
    },
    logout: (state) => {
      state.credentials = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
