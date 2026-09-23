import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { ChatMessage } from '@/store/slices/chats';
import { getInitials } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import MessageComposer from './MessageComposer';
import Message from './Message';

type ActiveChatProps = {
  phoneNumber: string;
  messages: ChatMessage[];
  onBack: () => void;
  onSend: (text: string) => void;
};

function ActiveChat({ phoneNumber, messages, onBack, onSend }: ActiveChatProps) {
  return (
    <>
      <header className="flex items-center gap-3 border-b bg-background px-6 py-4">
        <Button
          aria-label="Вернуться к чатам"
          className="sm:hidden"
          size="icon"
          type="button"
          variant="ghost"
          onClick={onBack}
        >
          <ArrowLeft />
        </Button>
        <Avatar>
          <AvatarFallback>{getInitials(phoneNumber)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{phoneNumber}</h2>
          <p className="text-xs text-muted-foreground">Чат Green Api</p>
        </div>
      </header>

      <ScrollArea className="flex-1 px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Отправьте сообщение, чтобы начать.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        )}
      </ScrollArea>

      <MessageComposer onSend={onSend} />
    </>
  );
}

export default ActiveChat;
