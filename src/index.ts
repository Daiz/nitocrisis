import "./index.scss";

import assetLoader from "./assets";
import raf from "./raf";

import store from "./store";
import App from "./App";

const d = document;
const w = window;

/* TODO
- Visual indicator for difficulty on top (multiple colors as it increases)
- Better Nitocris sprite
- Various eyes for Nitocris
- X velocity indicator during peek (slight angling?)
- Difficulty increase
  * Speed increase
  * X velocity increase
  * Spawn delay shortens
- Patterns
- Menus
- Pause (autopause on blur or dt over >1sec when ingame)
- Mute button
- move assets to App module instead of store?
- Webpack hot reloading for Nitos
- Improved Asset Loading (partial loading)
- Texture atlas generator for production
- Sound sprite generator for production
  * FLAC encoding, Opus encoding, MP3 encoding
  * Code generation
*/

(async function main() {
  try {
    const assets = await assetLoader();
    store.images = assets.images;
    store.sounds = assets.sounds;
    const app = new App();
    raf(app.update.bind(app));
    w.addEventListener("resize", app.resize.bind(app));
  } catch (e) {
    console.error(e);
  }
})();
