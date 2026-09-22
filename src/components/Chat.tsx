import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

import ActiveChat, { type ChatMessage } from './ActiveChat';
import ChatSidebar, { type ChatSummary } from './ChatSidebar.tsx';
import CreateChatDialog from '@/components/CreateChatDialog';
import { logout } from '@/store/slices/auth';
import { useAppDispatch } from '@/store/hooks';

type ChatItem = ChatSummary & {
  messages: ChatMessage[];
};

function Chat() {
  const dispatch = useAppDispatch();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  function createChat(phoneNumber: string) {
    const newChat: ChatItem = {
      id: `${phoneNumber}-${Date.now()}`,
      phoneNumber,
      messages: [],
    };

    setChats((currentChats) => [...currentChats, newChat]);
    setActiveChatId(newChat.id);
    setIsCreateDialogOpen(false);
  }

  function sendMessage(text: string) {
    if (!activeChatId) return;

    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { id: `${chat.id}-${Date.now()}`, text, direction: 'outgoing' },
              ],
            }
          : chat,
      ),
    );
  }

  return (
    <main className="flex min-h-screen bg-muted/30 p-0 sm:p-4">
      <section className="flex min-h-screen w-full overflow-hidden border bg-background sm:min-h-0 sm:h-[calc(100vh-2rem)] sm:rounded-xl">
        <ChatSidebar
          activeChatId={activeChatId}
          chats={chats}
          onCreateChat={() => setIsCreateDialogOpen(true)}
          onLogout={() => dispatch(logout())}
          onSelectChat={setActiveChatId}
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