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

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: {
    typeWebhook: string;
    timestamp: number;
    idMessage: string;
    senderData: {
      chatId: string;
      senderPhoneNumber?: number;
      senderName?: string;
    };
    messageData: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
};

export type DeleteNotificationResponse = {
  result: boolean;
  reason: string;
};

type CheckAccountArgs = AuthCredentials & CheckAccountRequest;
type SendMessageArgs = AuthCredentials & SendMessageRequest;
type SendChatMessageArgs = AuthCredentials & {
  phoneNumber: number;
  message: string;
};
type ReceiveNotificationArgs = AuthCredentials & {
  receiveTimeout: number;
};
type DeleteNotificationArgs = AuthCredentials & {
  receiptId: number;
};

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
    sendChatMessage: builder.mutation<SendMessageResponse, SendChatMessageArgs>(
      {
        queryFn: async (
          { idInstance, apiTokenInstance, phoneNumber, message },
          _api,
          _extraOptions,
          baseQuery,
        ) => {
          const accountResult = await baseQuery({
            url: `waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
            method: 'POST',
            body: { phoneNumber },
          });

          if (accountResult.error) return { error: accountResult.error };

          const account = accountResult.data as CheckAccountResponse;

          if (!account.exist) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'ACCOUNT_NOT_FOUND',
              },
            };
          }

          const sendResult = await baseQuery({
            url: `waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
            method: 'POST',
            body: { chatId: account.chatId, message },
          });

          if (sendResult.error) return { error: sendResult.error };

          return { data: sendResult.data as SendMessageResponse };
        },
      },
    ),
    receiveNotification: builder.mutation<
      ReceiveNotificationResponse | null,
      ReceiveNotificationArgs
    >({
      query: ({ idInstance, apiTokenInstance, receiveTimeout }) => ({
        url: `waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
        params: { receiveTimeout },
      }),
    }),
    deleteNotification: builder.mutation<
      DeleteNotificationResponse,
      DeleteNotificationArgs
    >({
      query: ({ idInstance, apiTokenInstance, receiptId }) => ({
        url: `waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCheckAccountMutation,
  useSendMessageMutation,
  useSendChatMessageMutation,
  useReceiveNotificationMutation,
  useDeleteNotificationMutation,
} = api;
