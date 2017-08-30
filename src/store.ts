import { Assets, ImageAssets, SoundAssets, ImageKey, SoundKey } from "./assets";

class Data {
  score: number = 0;
  misses: number = 0;
  record: number = 0;
  width: number = window.innerWidth;
  height: number = window.innerHeight;
}
type Key = keyof Data;

interface Callback {
  key: Key;
  callback: (value: any) => void;
}

class Store {
  images: ImageAssets | null;
  sounds: SoundAssets | null;

  private listeners: Callback[] = [];
  private data = new Data();

  constructor(assets?: Assets) {
    if (assets) {
      this.images = assets.images;
      this.sounds = assets.sounds;
    }
  }

  load(assets: Assets) {
    this.images = assets.images;
    this.sounds = assets.sounds;
  }

  image(key: ImageKey): HTMLImageElement | void {
    if (this.images && this.images[key]) return this.images[key];
  }

  sound(key: SoundKey): Howl | void {
    if (this.sounds && this.sounds[key]) return this.sounds[key];
  }

  subscribe<T extends Key>(key: T, callback: (value: Data[T]) => void) {
    this.listeners.push({ key, callback });
  }

  emit<T extends Key>(key: T, value: Data[T]) {
    this.listeners.forEach(l => {
      if (l.key === key) l.callback(value);
    });
  }

  set<T extends Key>(key: T, value: Data[T]) {
    this.data[key] = value;
    this.emit(key, value);
  }

  get<T extends Key>(key: T): Data[T] {
    return this.data[key];
  }

  add(key: Key, amount: number = 1): number | void {
    const old = this.data[key];
    if (typeof old === "number") {
      const value = old + amount;
      this.data[key] = value;
      this.emit(key, value);
      return value;
    }
  }
}

export default new Store();
