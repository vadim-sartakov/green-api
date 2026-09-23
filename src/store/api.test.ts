import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from './api';

const credentials = {
  idInstance: '123456',
  apiTokenInstance: 'token',
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

const createJsonResponse = (body: unknown) => {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

describe('sendChatMessage', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('checks the account and sends a message using the returned chat id', async () => {
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          exist: true,
          chatId: 'chat-id',
          fromCache: false,
        }),
      )
      .mockResolvedValueOnce(createJsonResponse({ idMessage: 'message-id' }));

    const store = createTestStore();
    const result = await store.dispatch(
      api.endpoints.sendChatMessage.initiate({
        ...credentials,
        phoneNumber: 15551234567,
        message: 'Hello',
      }),
    );

    expect(result).toMatchObject({ data: { idMessage: 'message-id' } });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [checkAccountRequest, sendMessageRequest] = fetchMock.mock.calls.map(
      ([request]) => request as Request,
    );

    expect(checkAccountRequest.url).toBe(
      'https://api.green-api.com/waInstance123456/checkAccount/token',
    );
    expect(checkAccountRequest.method).toBe('POST');
    expect(await checkAccountRequest.json()).toEqual({
      phoneNumber: 15551234567,
    });

    expect(sendMessageRequest.url).toBe(
      'https://api.green-api.com/waInstance123456/sendMessage/token',
    );
    expect(sendMessageRequest.method).toBe('POST');
    expect(await sendMessageRequest.json()).toEqual({
      chatId: 'chat-id',
      message: 'Hello',
    });
  });

  it('fails without sending a message when the account does not exist', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        exist: false,
        chatId: '',
        fromCache: false,
      }),
    );

    const store = createTestStore();
    const result = await store.dispatch(
      api.endpoints.sendChatMessage.initiate({
        ...credentials,
        phoneNumber: 15551234567,
        message: 'Hello',
      }),
    );

    expect(result).toMatchObject({
      error: {
        status: 'CUSTOM_ERROR',
        error: 'ACCOUNT_NOT_FOUND',
      },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('API endpoint requests', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls checkAccount with the phone number body', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({ exist: true, chatId: 'chat-id', fromCache: false }),
    );

    const store = createTestStore();
    await store.dispatch(
      api.endpoints.checkAccount.initiate({
        ...credentials,
        phoneNumber: 15551234567,
      }),
    );

    const [request] = fetchMock.mock.calls[0] as [Request];
    expect(request.url).toBe(
      'https://api.green-api.com/waInstance123456/checkAccount/token',
    );
    expect(request.method).toBe('POST');
    expect(await request.json()).toEqual({ phoneNumber: 15551234567 });
  });

  it('calls sendMessage with the chat id and message body', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({ idMessage: 'message-id' }),
    );

    const store = createTestStore();
    await store.dispatch(
      api.endpoints.sendMessage.initiate({
        ...credentials,
        chatId: 'chat-id',
        message: 'Hello',
      }),
    );

    const [request] = fetchMock.mock.calls[0] as [Request];
    expect(request.url).toBe(
      'https://api.green-api.com/waInstance123456/sendMessage/token',
    );
    expect(request.method).toBe('POST');
    expect(await request.json()).toEqual({
      chatId: 'chat-id',
      message: 'Hello',
    });
  });

  it('calls receiveNotification with the receive timeout query parameter', async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(null));

    const store = createTestStore();
    await store.dispatch(
      api.endpoints.receiveNotification.initiate({
        ...credentials,
        receiveTimeout: 60,
      }),
    );

    const [request] = fetchMock.mock.calls[0] as [Request];
    expect(request.url).toBe(
      'https://api.green-api.com/waInstance123456/receiveNotification/token?receiveTimeout=60',
    );
    expect(request.method).toBe('GET');
  });

  it('calls deleteNotification with the receipt id in the URL', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({ result: true, reason: '' }),
    );

    const store = createTestStore();
    await store.dispatch(
      api.endpoints.deleteNotification.initiate({
        ...credentials,
        receiptId: 42,
      }),
    );

    const [request] = fetchMock.mock.calls[0] as [Request];
    expect(request.url).toBe(
      'https://api.green-api.com/waInstance123456/deleteNotification/token/42',
    );
    expect(request.method).toBe('DELETE');
  });
});
