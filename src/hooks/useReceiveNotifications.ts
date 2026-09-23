import { useEffect, useRef } from 'react';

import {
  useDeleteNotificationMutation,
  useReceiveNotificationMutation,
} from '@/store/api';
import { toast } from '@/components/ui/toast';
import { normalizePhoneNumber, retry } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addChat, addMessage } from '@/store/slices/chats';
import { selectChats } from '@/store/selectors/chats';

type ReceiveCredentials = {
  idInstance?: string;
  apiTokenInstance?: string;
} | null;

const maxReceiveRetries = 5;

export const useReceiveNotifications = (credentials: ReceiveCredentials) => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);
  const [deleteNotificationRequest] = useDeleteNotificationMutation();
  const [receiveNotificationRequest] = useReceiveNotificationMutation();
  const chatsRef = useRef(chats);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    if (!credentials?.idInstance || !credentials.apiTokenInstance) return;

    const authCredentials = {
      idInstance: credentials.idInstance,
      apiTokenInstance: credentials.apiTokenInstance,
    };

    let cancelled = false;

    const receiveNotification = async () => {
      const notification = await receiveNotificationRequest({
        ...authCredentials,
        receiveTimeout: 60,
      }).unwrap();

      if (!notification) return;

      const { body, receiptId } = notification;
      const phoneNumber = body.senderData.senderPhoneNumber;
      const text = body.messageData.textMessageData?.textMessage;

      if (
        body.typeWebhook === 'incomingMessageReceived' &&
        body.messageData.typeMessage === 'textMessage' &&
        phoneNumber &&
        text
      ) {
        const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
        const existingChat = chatsRef.current.find(
          (chat) =>
            normalizePhoneNumber(chat.phoneNumber) === normalizedPhoneNumber,
        );
        const chatId = existingChat?.id ?? `${phoneNumber}-${Date.now()}`;

        if (!existingChat) {
          dispatch(
            addChat({
              id: chatId,
              phoneNumber: String(phoneNumber),
              messages: [],
            }),
          );
        }

        dispatch(
          addMessage({
            chatId,
            message: {
              id: body.idMessage,
              text,
              direction: 'incoming',
            },
          }),
        );
      }

      await deleteNotificationRequest({
        ...authCredentials,
        receiptId,
      }).unwrap();
    };

    const receiveNotificationWithRetry = () =>
      retry(receiveNotification, { maxRetries: maxReceiveRetries });

    const receiveNotifications = async () => {
      while (!cancelled) {
        try {
          await receiveNotificationWithRetry();
        } catch {
          if (cancelled) return;

          toast.add({
            type: 'error',
            title: 'Получение сообщений остановлено',
            description:
              'Не удалось получить сообщения после нескольких попыток.',
          });
          return;
        }
      }
    };

    void receiveNotifications();

    return () => {
      cancelled = true;
    };
  }, [
    credentials,
    deleteNotificationRequest,
    dispatch,
    receiveNotificationRequest,
  ]);
};
