import { useState } from 'react';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type MessageComposerProps = {
  onSend: (text: string) => void;
};

function MessageComposer({ onSend }: MessageComposerProps) {
  const [draftMessage, setDraftMessage] = useState('');

  const submitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = draftMessage.trim();
    if (!text) return;

    onSend(text);
    setDraftMessage('');
  };

  return (
    <form
      className="flex items-end gap-3 border-t bg-background p-4"
      onSubmit={submitMessage}
    >
      <Textarea
        className="min-h-10 resize-none"
        placeholder="Write a message..."
        rows={1}
        value={draftMessage}
        onChange={(event) => setDraftMessage(event.target.value)}
      />
      <Button aria-label="Send message" size="icon" type="submit">
        <Send />
      </Button>
    </form>
  );
}

export default MessageComposer;
