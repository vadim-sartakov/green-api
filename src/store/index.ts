import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { api } from './api';
import authReducer from './slices/auth';
import chatsReducer from './slices/chats';

const persistedAuthReducer = persistReducer(
  {
    key: 'auth',
    storage,
    whitelist: ['credentials'],
  },
  authReducer,
);
const persistedChatsReducer = persistReducer(
  {
    key: 'chats',
    storage,
    whitelist: ['chats', 'selectedChatId'],
  },
  chatsReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    chats: persistedChatsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
