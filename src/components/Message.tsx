import type { ChatMessage } from '@/store/slices/chats';
import { cn } from '@/lib/utils';

type MessageProps = {
  message: ChatMessage;
};

function Message({ message }: MessageProps) {
  return (
    <div
      className={cn(
        'max-w-[75%] rounded-xl px-4 py-2 text-sm whitespace-pre',
        message.direction === 'outgoing'
          ? 'self-end bg-primary text-primary-foreground'
          : 'bg-background',
      )}
    >
      {message.text}
    </div>
  );
}

export default Message;
