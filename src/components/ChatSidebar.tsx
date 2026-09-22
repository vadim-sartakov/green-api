import { useState } from 'react';
import { LogOut, MessageCircle, Plus, Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getInitials } from '@/lib/utils';
import CreateChatDialog from './CreateChatDialog';

export type ChatSummary = {
  id: string;
  phoneNumber: string;
};

type ChatSidebarProps = {
  chats: ChatSummary[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onRemoveChat: (chatId: string) => void;
  onCreateChat: (phoneNumber: string) => void;
  onLogout: () => void;
};

function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onRemoveChat,
  onCreateChat,
  onLogout,
}: ChatSidebarProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus />
        </Button>
      </header>

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
              <div
                className={`flex w-full items-center gap-2 rounded-lg p-2 transition-colors ${
                  chat.id === activeChatId
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                }`}
                key={chat.id}
              >
                <button
                  className="flex min-w-0 flex-1 items-center gap-3 p-1 text-left"
                  type="button"
                  onClick={() => onSelectChat(chat.id)}
                >
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(chat.phoneNumber)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 truncate text-sm font-medium">
                    {chat.phoneNumber}
                  </span>
                </button>
                <Button
                  aria-label={`Remove chat with ${chat.phoneNumber}`}
                  size="icon-sm"
                  variant="destructive"
                  type="button"
                  onClick={() => onRemoveChat(chat.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3">
        <Button
          className="w-full justify-start"
          variant="ghost"
          type="button"
          onClick={onLogout}
        >
          <LogOut />
          Log out
        </Button>
      </div>

      <CreateChatDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={(phoneNumber) => {
          onCreateChat(phoneNumber);
          setIsCreateDialogOpen(false);
        }}
      />
    </aside>
  );
}

export default ChatSidebar;
