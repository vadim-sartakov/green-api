import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type CreateChatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (phoneNumber: string) => void;
};

function CreateChatDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateChatDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');

  function createChat(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedPhoneNumber = phoneNumber.trim();
    if (!normalizedPhoneNumber) return;

    onCreate(normalizedPhoneNumber);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenChangeComplete={() => setPhoneNumber('')}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create chat</DialogTitle>
          <DialogDescription>
            Add a phone number to start a new conversation.
          </DialogDescription>
        </DialogHeader>
        <form id="create-chat-form" onSubmit={createChat}>
          <Field>
            <FieldLabel htmlFor="phoneNumber">Phone number</FieldLabel>
            <Input
              autoFocus
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+1 555 123 4567"
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </Field>
        </form>
        <DialogFooter>
          <Button form="create-chat-form" type="submit">
            Create chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChatDialog;