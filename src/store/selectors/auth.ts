import type { RootState } from '../index';

export const selectLoggedIn = (state: RootState) =>
	state.auth.credentials !== null;