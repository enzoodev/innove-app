import { MMKV } from 'react-native-mmkv';

const mmkv = new MMKV();

export class StorageRepository {
  private static baseKey = '@INNOVE_STORAGE_KEY_';

  private static makeKey(key: string): string {
    return `${this.baseKey}${key}`;
  }

  public static get<T>(key: string): T | null {
    const storageKey = this.makeKey(key);
    const value = mmkv.getString(storageKey);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  public static set(key: string, value: unknown): void {
    const storageKey = this.makeKey(key);
    mmkv.set(storageKey, JSON.stringify(value));
  }

  public static delete(key: string): void {
    const storageKey = this.makeKey(key);
    mmkv.delete(storageKey);
  }
}