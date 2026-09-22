import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { api } from './api';
import authReducer, { type AuthCredentials } from './slices/auth';

const AUTH_STORAGE_KEY = 'green-api-auth';

const loadCredentials = (): AuthCredentials | null => {
  const storedCredentials = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedCredentials) {
    return null;
  }

  try {
    const credentials: unknown = JSON.parse(storedCredentials);

    if (
      typeof credentials === 'object' &&
      credentials !== null &&
      'idInstance' in credentials &&
      'apiTokenInstance' in credentials &&
      typeof credentials.idInstance === 'string' &&
      typeof credentials.apiTokenInstance === 'string'
    ) {
      return credentials as AuthCredentials;
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return null;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  preloadedState: {
    auth: {
      credentials: loadCredentials(),
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

store.subscribe(() => {
  const credentials = store.getState().auth.credentials;

  if (credentials) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(credentials));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
