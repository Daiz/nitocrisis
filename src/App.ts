import Nito, { Cris } from "./Nito";

const w = window;
const d = document;
const { random, max } = Math;
import store from "./store";

import { inbound } from "./math";

enum GameState {
  Loading,
  Error,
  MainMenu,
  InGame,
  Paused,
  GameOver
}

export default class App {
  nitos: Nito[] = [];
  timer: number = 1000 + random() * 3000;
  highScoreTimer: number = -1;
  state: GameState = GameState.InGame;
  score: number = 0;
  misses: number = 0;
  record: number = 0;
  timeScale: number = 1.0;
  els: {
    score: Element;
    misses: Element;
    record: Element;
  };

  constructor() {
    const record = localStorage.getItem("nitocris-record");
    if (record) this.record = parseInt(record, 10);
    this.els = {
      score: d.querySelector("#score")!,
      misses: d.querySelector("#misses")!,
      record: d.querySelector("#record")!
    };
    if (this.record > 0) {
      this.els.record.textContent = `best: ${this.record}`;
    }
    // temporary difficulty modifier
    setInterval(() => (this.timeScale += 0.01), 1000);
    const hit = (e: MouseEvent | TouchEvent) => {
      const prevent = (e.target as Element).tagName !== "A";
      for (let nito of this.nitos) {
        if (nito.state !== Cris.Jumping) continue;
        let x = 0;
        let y = 0;
        if (e instanceof MouseEvent) {
          x = e.clientX;
          y = e.clientY;
          if (prevent) e.preventDefault();
        } else if (e instanceof TouchEvent) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
        }
        if (inbound(x, y, nito)) {
          nito.state = Cris.Smacked;
          nito.smackDirection = nito.vx > 0 ? 1 : -1;
          nito.vx *= 1.25;
          nito.vy *= 0.5;
          nito.el.style.pointerEvents = "none";
          nito.el.style.zIndex = "1";
          nito.el.className = "";
          store.sounds!.hit.play();
          store.add("score");
          break;
        }
      }
    };
    d.addEventListener("mousedown", hit);
    d.addEventListener("touchstart", hit);

    // add score & miss listeners
    store.subscribe("score", score => {
      this.els.score.textContent = score.toString();
      this.score = score;
      if (this.score > this.record) {
        localStorage.setItem("nitocris-record", this.score.toString());
        if (this.highScoreTimer === -1 && this.record > 0) {
          store.sounds!.record.play();
          this.els.record.textContent = "new record!";
          this.els.record.className = "blink";
          this.highScoreTimer = 5000;
        }
      }
    });

    store.subscribe("misses", misses => {
      let text = "";
      if (misses < 4) {
        for (let i = 0; i < misses; ++i) {
          text += "\u2715";
        }
        this.els.misses.textContent = text;
        this.misses = misses;
      } else {
        if (this.score > this.record) {
          this.record = this.score;
          this.els.record.textContent = `best: ${this.record}`;
        }
        store.set("score", 0);
        store.set("misses", 0);
        this.highScoreTimer = -1;
        this.timeScale = 1.0;
      }
    });
  }

  update(dt: number) {
    dt *= this.timeScale;
    this.timer -= 1000 * dt;
    if (this.timer <= 0) {
      // insert from front for collision checking in front-to-back z-order
      this.nitos.unshift(new Nito());
      this.timer = 1000 + random() * 3000;
    }

    if (this.highScoreTimer > 0) {
      this.highScoreTimer = max(0, this.highScoreTimer - 1000 * dt);
      if (this.highScoreTimer === 0) {
        this.els.record.className = "";
        this.els.record.textContent = "";
      }
    }

    this.nitos.forEach(nito => {
      if (nito.state !== Cris.Removed) {
        nito.update(dt);
      } else {
        this.nitos.splice(this.nitos.indexOf(nito), 1);
      }
    });
    this.nitos.forEach(nito => nito.render());
  }

  resize() {
    const width = w.innerWidth;
    const height = w.innerHeight;
    store.set("width", width);
    store.set("height", height);
    this.nitos.forEach(nito => nito.resize(width, height));
  }
}
