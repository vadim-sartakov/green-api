// @vitest-environment jsdom

import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';

import App from '../App';
import { api } from '../store/api';
import authReducer from '../store/slices/auth';
import chatsReducer from '../store/slices/chats';

const credentials = {
  idInstance: '123456',
  apiTokenInstance: 'token',
};

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      chats: chatsReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

const createJsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

describe('app integration', () => {
  const fetchMock = vi.fn();
  let resolveReceive: ((response: Response) => void) | undefined;
  let requests: Request[];

  beforeEach(() => {
    requests = [];
    resolveReceive = undefined;
    fetchMock.mockReset();
    fetchMock.mockImplementation((request: Request) => {
      requests.push(request);

      if (request.url.includes('/receiveNotification/')) {
        return new Promise<Response>((resolve) => {
          resolveReceive = resolve;
        });
      }

      if (request.url.includes('/checkAccount/')) {
        return Promise.resolve(
          createJsonResponse({
            exist: true,
            chatId: 'chat-id',
            fromCache: false,
          }),
        );
      }

      if (request.url.includes('/sendMessage/')) {
        return Promise.resolve(createJsonResponse({ idMessage: 'sent-id' }));
      }

      if (request.url.includes('/deleteNotification/')) {
        return Promise.resolve(
          createJsonResponse({ result: true, reason: '' }),
        );
      }

      throw new Error(`Unexpected request: ${request.url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('logs in, creates a chat, sends a message, and displays an incoming message', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await user.type(
      screen.getByLabelText('idInstance'),
      credentials.idInstance,
    );
    await user.type(
      screen.getByLabelText('apiTokenInstance'),
      credentials.apiTokenInstance,
    );
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    await user.click(screen.getByRole('button', { name: 'Создать чат' }));
    const phoneInput = await screen.findByLabelText('Номер телефона');
    await user.type(phoneInput, '79991234567');
    await user.click(screen.getByRole('button', { name: 'Создать чат' }));

    const messageInput = await screen.findByPlaceholderText(
      'Введите сообщение...',
    );
    await user.type(messageInput, 'Hello from the app');
    await user.click(
      screen.getByRole('button', { name: 'Отправить сообщение' }),
    );

    await waitFor(() => {
      expect(
        requests.filter((request) => request.url.includes('/checkAccount/')),
      ).toHaveLength(1);
      expect(
        requests.filter((request) => request.url.includes('/sendMessage/')),
      ).toHaveLength(1);
    });

    const checkAccountRequest = requests.find((request) =>
      request.url.includes('/checkAccount/'),
    );
    const sendMessageRequest = requests.find((request) =>
      request.url.includes('/sendMessage/'),
    );

    expect(checkAccountRequest?.url).toBe(
      'https://api.green-api.com/waInstance123456/checkAccount/token',
    );
    expect(checkAccountRequest?.method).toBe('POST');
    expect(await checkAccountRequest?.clone().json()).toEqual({
      phoneNumber: 79991234567,
    });

    expect(sendMessageRequest?.url).toBe(
      'https://api.green-api.com/waInstance123456/sendMessage/token',
    );
    expect(sendMessageRequest?.method).toBe('POST');
    expect(await sendMessageRequest?.clone().json()).toEqual({
      chatId: 'chat-id',
      message: 'Hello from the app',
    });

    resolveReceive?.(
      createJsonResponse({
        receiptId: 43,
        body: {
          typeWebhook: 'incomingMessageReceived',
          timestamp: 456,
          idMessage: 'incoming-id',
          senderData: {
            chatId: 'chat-id',
            senderPhoneNumber: 79991234567,
          },
          messageData: {
            typeMessage: 'textMessage',
            textMessageData: { textMessage: 'Reply from backend' },
          },
        },
      }),
    );

    expect(await screen.findByText('Reply from backend')).toBeTruthy();

    const deleteRequest = requests.find((request) =>
      request.url.includes('/deleteNotification/'),
    );
    expect(deleteRequest?.url).toBe(
      'https://api.green-api.com/waInstance123456/deleteNotification/token/43',
    );
    expect(deleteRequest?.method).toBe('DELETE');
  });
});
