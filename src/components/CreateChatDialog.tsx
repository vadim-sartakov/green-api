import { IMaskMixin } from 'react-imask';
import { Controller, useForm } from 'react-hook-form';
import type { Ref } from 'react';

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

const MaskedInput = IMaskMixin<HTMLInputElement>(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as Ref<HTMLInputElement>} />
));

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
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChatFormValues>();

  const createChat = ({ phoneNumber }: CreateChatFormValues) => {
    onCreate(phoneNumber);
  };

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
        <form id="create-chat-form" onSubmit={handleSubmit(createChat)}>
          <Field data-invalid={!!errors.phoneNumber}>
            <FieldLabel htmlFor="phoneNumber">Phone number</FieldLabel>
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: 'Phone number is required',
                validate: (value) =>
                  value.replace(/\D/g, '').length === 11 ||
                  'Enter a complete phone number',
              }}
              render={({ field }) => (
                <MaskedInput
                  autoFocus
                  id="phoneNumber"
                  mask="+{7} (000) 000-00-00"
                  placeholder="+7 (___) ___-__-__"
                  aria-invalid={!!errors.phoneNumber}
                  name={field.name}
                  value={field.value}
                  onAccept={(value: string) => field.onChange(value)}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
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
