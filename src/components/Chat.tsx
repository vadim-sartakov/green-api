import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

import ActiveChat from './ActiveChat';
import ChatSidebar from './ChatSidebar.tsx';
import CreateChatDialog from '@/components/CreateChatDialog';
import { toast } from '@/components/ui/toast';
import { logout } from '@/store/slices/auth';
import { addChat, addMessage, selectChat } from '@/store/slices/chats';
import { selectChats, selectSelectedChatId } from '@/store/selectors/chats';
import { selectCredentials } from '@/store/selectors/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCheckAccountMutation, useSendMessageMutation } from '@/store/api';
import { useReceiveNotifications } from '@/hooks/useReceiveNotifications';

function Chat() {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);
  const activeChatId = useAppSelector(selectSelectedChatId);
  const credentials = useAppSelector(selectCredentials);
  const [checkAccountRequest] = useCheckAccountMutation();
  const [sendMessageRequest] = useSendMessageMutation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
    setIsCreateDialogOpen(false);
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
      const account = await checkAccountRequest({
        ...credentials,
        phoneNumber,
      }).unwrap();

      if (!account.exist) {
        toast.add({
          type: 'error',
          title: 'Account not found',
          description: 'This phone number is not a WhatsApp account.',
        });
        return;
      }

      await sendMessageRequest({
        ...credentials,
        chatId: account.chatId,
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
          onCreateChat={() => setIsCreateDialogOpen(true)}
          onLogout={() => dispatch(logout())}
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

      <CreateChatDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={createChat}
      />
    </main>
  );
}

export default Chat;
