import { MessageCircle } from 'lucide-react';

import ActiveChat from './ActiveChat';
import ChatSidebar from './ChatSidebar.tsx';
import { toast } from '@/components/ui/toast';
import { logout } from '@/store/slices/auth';
import {
  addChat,
  addMessage,
  removeChat,
  selectChat,
} from '@/store/slices/chats';
import { selectChats, selectSelectedChatId } from '@/store/selectors/chats';
import { selectCredentials } from '@/store/selectors/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSendChatMessageMutation } from '@/store/api';
import { useReceiveNotifications } from '@/hooks/useReceiveNotifications';

function Chat() {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);
  const activeChatId = useAppSelector(selectSelectedChatId);
  const credentials = useAppSelector(selectCredentials);
  const [sendChatMessageRequest] = useSendChatMessageMutation();

  useReceiveNotifications(credentials);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const createChat = (phoneNumber: string) => {
    const newChat = {
      id: `${phoneNumber}-${Date.now()}`,
      phoneNumber,
      messages: [],
    };

    dispatch(addChat(newChat));
    dispatch(selectChat(newChat.id));
  };

  const sendMessage = async (text: string) => {
    if (!activeChatId || !activeChat || !credentials) return;

    try {
      dispatch(
        addMessage({
          chatId: activeChatId,
          message: {
            id: `${activeChatId}-${Date.now()}`,
            text,
            direction: 'outgoing',
          },
        }),
      );

      const phoneNumber = Number(activeChat.phoneNumber.replace(/\D/g, ''));
      await sendChatMessageRequest({
        ...credentials,
        phoneNumber,
        message: text,
      }).unwrap();
    } catch {
      toast.add({
        type: 'error',
        title: 'Request failed',
        description: 'The request could not be completed.',
      });
    }
  };

  return (
    <main className="flex min-h-screen">
      <section className="flex min-h-screen w-full overflow-hidden">
        <ChatSidebar
          activeChatId={activeChatId}
          chats={chats}
          onCreateChat={createChat}
          onLogout={() => dispatch(logout())}
          onRemoveChat={(chatId) => dispatch(removeChat(chatId))}
          onSelectChat={(chatId) => dispatch(selectChat(chatId))}
        />

        <section className="hidden min-w-0 flex-1 flex-col bg-muted/20 sm:flex">
          {activeChat ? (
            <ActiveChat
              messages={activeChat.messages}
              phoneNumber={activeChat.phoneNumber}
              onSend={sendMessage}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <MessageCircle className="mb-4 size-12 text-muted-foreground/60" />
              <h2 className="text-lg font-semibold">Select a chat</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a conversation or create a new one.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Chat;
