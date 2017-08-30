import { Howl } from "howler";

type ImageAsset = HTMLImageElement | string | null;
type SoundAsset = Howl | string | null;
type GenericAsset = ImageAsset | SoundAsset;
type AssetBank<T> = { [P in keyof T]: GenericAsset };
const X: GenericAsset = null;

class ImageBank {
  nito = X;
}

class SoundBank {
  hit = X;
  miss = X;
  record = X;
}

export type ImageKey = keyof ImageBank;
export type SoundKey = keyof SoundBank;

enum Asset {
  Image = "IMAGE",
  Sound = "SOUND"
}

enum LoadState {
  Loading,
  Loaded,
  Failed
}

interface IAsset {
  name: string;
  type: Asset;
  state: LoadState;
  asset: any;
}

interface IAssetImage extends IAsset {
  type: Asset.Image;
  asset: HTMLImageElement;
}

interface IAssetSound extends IAsset {
  type: Asset.Sound;
  asset: Howl;
}

export type ImageAssets = { [P in ImageKey]: HTMLImageElement };

export type SoundAssets = { [P in SoundKey]: Howl };

export interface Assets {
  images: ImageAssets;
  sounds: SoundAssets;
}

export default function load(): Promise<Assets> {
  return new Promise((resolve: any, reject: any) => {
    const imageBank = new ImageBank() as AssetBank<ImageBank>;
    const soundBank = new SoundBank() as AssetBank<SoundBank>;
    const imageSources = Object.keys(imageBank);
    const soundSources = Object.keys(soundBank);
    const imageCount = imageSources.length;
    const soundCount = soundSources.length;
    const assetCount = imageCount + soundCount;
    const IMAGE_OFFSET = 0;
    const SOUND_OFFSET = imageCount;
    let loaded = 0;

    imageSources.forEach((key: ImageKey) => {
      const ref = imageBank[key] as ImageAsset;
      let src = `assets/${key}.png`;
      let image: HTMLImageElement;
      if (ref instanceof HTMLImageElement) {
        image = ref;
      } else {
        if (typeof ref === "string") src = ref;
        image = new Image();
      }
      image.onload = isLoaded;
      image.onerror = reject;
      image.src = src;
      imageBank[key] = image;
    });

    soundSources.forEach((key: SoundKey) => {
      const ref = soundBank[key] as SoundAsset;
      let src = `assets/${key}.wav`;
      let sound: Howl;
      if (ref instanceof Howl) {
        sound = ref;
      } else {
        if (typeof ref === "string") src = ref;
        sound = new Howl({ src, preload: false });
      }
      sound.once("load", isLoaded);
      sound.once("loaderror", reject);
      sound.load();
      soundBank[key] = sound;
    });

    function isLoaded() {
      ++loaded;
      console.log(`loading ${Math.round(loaded / assetCount * 100)}%`);
      if (loaded === assetCount) {
        let assets: Assets = {
          images: imageBank as ImageAssets,
          sounds: soundBank as SoundAssets
        };
        resolve(assets);
      }
    }
  });
}
