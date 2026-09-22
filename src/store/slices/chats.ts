import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ChatMessage = {
  id: string;
  text: string;
  direction: 'incoming' | 'outgoing';
};

export type Chat = {
  id: string;
  phoneNumber: string;
  messages: ChatMessage[];
};

type ChatsState = {
  chats: Chat[];
  selectedChatId: string | null;
};

const initialState: ChatsState = {
  chats: [],
  selectedChatId: null,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.push(action.payload);
    },
    selectChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(({ id }) => id !== action.payload);

      if (state.selectedChatId === action.payload) {
        state.selectedChatId = null;
      }
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: ChatMessage }>,
    ) => {
      const chat = state.chats.find(({ id }) => id === action.payload.chatId);

      chat?.messages.push(action.payload.message);
    },
  },
});

export const { addChat, addMessage, removeChat, selectChat } =
  chatsSlice.actions;
export default chatsSlice.reducer;
