import { useEffect, useRef } from 'react';

import {
  useDeleteNotificationMutation,
  useReceiveNotificationMutation,
} from '@/store/api';
import { toast } from '@/components/ui/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addChat, addMessage } from '@/store/slices/chats';
import { selectChats } from '@/store/selectors/chats';

type ReceiveCredentials = {
  idInstance?: string;
  apiTokenInstance?: string;
} | null;

const maxReceiveRetries = 5;

const normalizePhoneNumber = (phoneNumber: string | number) => {
  return String(phoneNumber).replace(/\D/g, '');
};

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
    let retryCount = 0;

    const receiveNotifications = async () => {
      while (!cancelled) {
        try {
          const notification = await receiveNotificationRequest({
            ...authCredentials,
            receiveTimeout: 60,
          }).unwrap();
          retryCount = 0;

          if (!notification) continue;

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
                normalizePhoneNumber(chat.phoneNumber) ===
                normalizedPhoneNumber,
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
        } catch {
          retryCount += 1;

          if (cancelled) return;

          if (retryCount > maxReceiveRetries) {
            toast.add({
              type: 'error',
              title: 'Получение сообщений остановлено',
              description:
                'Не удалось получить сообщения после нескольких попыток.',
            });
            return;
          }

          const retryDelay = 2 ** (retryCount - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
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
