import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type CreateChatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (phoneNumber: string) => void;
};

type CreateChatFormValues = {
  phoneNumber: string;
};

function CreateChatDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateChatDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChatFormValues>();

  function createChat({ phoneNumber }: CreateChatFormValues) {
    onCreate(phoneNumber.trim());
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={() => reset()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create chat</DialogTitle>
          <DialogDescription>
            Add a phone number to start a new conversation.
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-chat-form"
          onSubmit={handleSubmit(createChat)}
        >
          <Field data-invalid={!!errors.phoneNumber}>
            <FieldLabel htmlFor="phoneNumber">Phone number</FieldLabel>
            <Input
              autoFocus
              id="phoneNumber"
              placeholder="+1 555 123 4567"
              type="tel"
              aria-invalid={!!errors.phoneNumber}
              {...register('phoneNumber', {
                validate: (value) =>
                  value.trim().length > 0 || 'Phone number is required',
              })}
            />
            <FieldError errors={[errors.phoneNumber]} />
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