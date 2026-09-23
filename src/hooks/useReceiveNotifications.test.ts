// @vitest-environment jsdom

import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  deleteNotification: vi.fn(),
  dispatch: vi.fn(),
  receiveNotification: vi.fn(),
}));

vi.mock('@/store/api', () => ({
  useDeleteNotificationMutation: () => [mocks.deleteNotification],
  useReceiveNotificationMutation: () => [mocks.receiveNotification],
}));

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: () => [],
}));

import { useReceiveNotifications } from './useReceiveNotifications';

describe('useReceiveNotifications', () => {
  beforeEach(() => {
    mocks.deleteNotification.mockReset();
    mocks.dispatch.mockReset();
    mocks.receiveNotification.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('receives, processes, deletes, and continues polling notifications', async () => {
    const notification = {
      receiptId: 42,
      body: {
        typeWebhook: 'incomingMessageReceived',
        timestamp: 123,
        idMessage: 'message-id',
        senderData: {
          chatId: 'chat-id',
          senderPhoneNumber: 15551234567,
        },
        messageData: {
          typeMessage: 'textMessage',
          textMessageData: { textMessage: 'Hello' },
        },
      },
    };

    mocks.receiveNotification
      .mockReturnValueOnce({ unwrap: () => Promise.resolve(notification) })
      .mockReturnValueOnce({ unwrap: () => new Promise(() => {}) });
    mocks.deleteNotification.mockReturnValue({
      unwrap: () => Promise.resolve({ result: true, reason: '' }),
    });

    const { unmount } = renderHook(() =>
      useReceiveNotifications({
        idInstance: '123456',
        apiTokenInstance: 'token',
      }),
    );

    await waitFor(() => {
      expect(mocks.dispatch).toHaveBeenCalledTimes(2);
      expect(mocks.receiveNotification).toHaveBeenCalledTimes(2);
      expect(mocks.deleteNotification).toHaveBeenCalledWith({
        idInstance: '123456',
        apiTokenInstance: 'token',
        receiptId: 42,
      });
    });

    expect(mocks.receiveNotification).toHaveBeenNthCalledWith(1, {
      idInstance: '123456',
      apiTokenInstance: 'token',
      receiveTimeout: 60,
    });
    expect(mocks.dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'chats/addChat' }),
    );
    expect(mocks.dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'chats/addMessage' }),
    );

    unmount();
  });

  it('does not receive notifications without complete credentials', () => {
    renderHook(() => useReceiveNotifications({ idInstance: '123456' }));

    expect(mocks.receiveNotification).not.toHaveBeenCalled();
  });
});
