import AsyncStorage from '@react-native-async-storage/async-storage';

import { emitEvent } from './events.ts';

const TOKEN_KEY = 'token';

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  emitEvent<string | null>('token-changed', token);
}

export async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Cannot read token', error);
    return null;
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    emitEvent<string | null>('token-changed', null);
    return true;
  } catch (error) {
    console.error('Cannot remove token', error);
    return false;
  }
}
