import { MessageCircle, Plus } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';

export type ChatSummary = {
  id: string;
  phoneNumber: string;
};

type ChatSidebarProps = {
  chats: ChatSummary[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onCreateChat: () => void;
};

function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
}: ChatSidebarProps) {
  return (
    <aside className="flex w-full max-w-sm shrink-0 flex-col border-r bg-card">
      <header className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Green Api
          </p>
          <h1 className="text-xl font-semibold tracking-tight">Chats</h1>
        </div>
        <Button
          aria-label="Create chat"
          size="icon"
          type="button"
          onClick={onCreateChat}
        >
          <Plus />
        </Button>
      </header>
      <Separator />

      <ScrollArea className="flex-1">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <MessageCircle className="mb-3 size-8 text-muted-foreground" />
            <p className="font-medium">No chats yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a chat to start messaging.
            </p>
          </div>
        ) : (
          <div className="p-2">
            {chats.map((chat) => (
              <button
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                  chat.id === activeChatId
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                }`}
                key={chat.id}
                type="button"
                onClick={() => onSelectChat(chat.id)}
              >
                <Avatar>
                  <AvatarFallback>{getInitials(chat.phoneNumber)}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 truncate text-sm font-medium">
                  {chat.phoneNumber}
                </span>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}

export default ChatSidebar;