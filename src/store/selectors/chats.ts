import type { RootState } from '../index';

export const selectChats = (state: RootState) => state.chats.chats;
export const selectSelectedChatId = (state: RootState) =>
  state.chats.selectedChatId;
