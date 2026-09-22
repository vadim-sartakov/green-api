import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthCredentials } from './slices/auth';

export type CheckAccountRequest = {
  phoneNumber: number;
};

export type CheckAccountResponse = {
  exist: boolean;
  chatId: string;
  fromCache: boolean;
};

export type SendMessageRequest = {
  chatId: string;
  message: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

type CheckAccountArgs = AuthCredentials & CheckAccountRequest;
type SendMessageArgs = AuthCredentials & SendMessageRequest;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  }),
  endpoints: (builder) => ({
    checkAccount: builder.mutation<CheckAccountResponse, CheckAccountArgs>({
      query: ({ idInstance, apiTokenInstance, phoneNumber }) => ({
        url: `waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
        method: 'POST',
        body: { phoneNumber },
      }),
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessageArgs>({
      query: ({ idInstance, apiTokenInstance, chatId, message }) => ({
        url: `waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        method: 'POST',
        body: { chatId, message },
      }),
    }),
  }),
});

export const { useCheckAccountMutation, useSendMessageMutation } = api;
