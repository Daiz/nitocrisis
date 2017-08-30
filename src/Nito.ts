const w = window;
const d = document;

import store from "./store";
import { lerp } from "./math";

const { random, pow, round } = Math;
const GRAVITY = 982;
const SPIN_SPEED = 360;
const CANCEL = () => false;

export enum Cris {
  Hiding,
  Peeking,
  Crouching,
  Jumping,
  Smacked,
  Deleted,
  Removed
}

type NitoProps = Partial<Nito>;

export default class Nito {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  opacity: number;
  state: Cris;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  timer: number;
  el: HTMLImageElement;
  targetY: number;
  smackDirection: number;
  timeScale: number;
  dt: number = 0;

  constructor(props: NitoProps = {}) {
    const img = store.images!.nito;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    this.vx = props.vx || 0;
    this.vy = props.vy || 0;
    this.width = props.width || iw;
    this.height = props.height || ih;
    this.angle = props.angle || 0;
    this.opacity = props.opacity = 1.0;
    this.state = props.state || Cris.Hiding;
    this.minX = props.minX || 0;
    this.maxX = props.maxX || w.innerWidth - this.width;
    this.minY = props.minY || this.height * -0.2;
    this.maxY = props.maxY || w.innerHeight;
    this.x = props.x || random() * (this.maxX - this.width);
    this.y = props.y || this.maxY + 10;
    this.timer = props.timer || 500 + random() * 500;
    this.targetY = props.targetY || this.maxY - this.height * 0.5;
    this.smackDirection = props.smackDirection || 0;
    this.timeScale = props.timeScale || 0;
    if (props.el == null) {
      this.el = new Image();
      this.el.draggable = false;
      this.el.ondragstart = CANCEL;
    } else {
      this.el = props.el;
    }
    this.el.src = img.src;
    this.el.style.opacity = "0.5";
    this.el.style.zIndex = "0";
    d.body.appendChild(this.el);
  }

  update(dt: number) {
    this.dt = dt * this.timeScale;
    if (this.timer > 0) {
      this.timer -= 1000 * dt;
    }

    if (this.vx) this.x += this.vx * dt;
    if (this.vy) this.y += this.vy * dt;

    switch (this.state) {
      case Cris.Hiding:
        if (this.timer <= 0) {
          this.state = Cris.Peeking;
          this.timer = 750 + random() * 750;
        }
        break;
      case Cris.Peeking:
        if (this.y > this.targetY) {
          this.y = lerp(this.y, this.targetY, 1 - pow(0.001, dt));
        }

        if (this.timer <= 0) {
          this.state = Cris.Crouching;
          this.targetY = this.maxY + 10;
          this.timer = 750 + random() * 750;
        }
        break;
      case Cris.Crouching:
        if (this.y < this.targetY) {
          this.y = lerp(this.y, this.targetY, 1 - pow(0.001, dt));
        }

        if (this.timer <= 0) {
          this.el.className = "active";
          this.state = Cris.Jumping;
          this.vx = -100 + random() * 200;
          this.vy = -1000 - random() * 750;
          this.el.style.opacity = "1.0";
          this.el.style.zIndex = "2";
        }
        break;
      case Cris.Jumping:
        this.vy += GRAVITY * dt;

        if (this.x < this.minX) {
          this.x = this.minX;
          if (this.vx < 0) this.vx *= -1;
        }

        if (this.x > this.maxX) {
          this.x = this.maxX;
          if (this.vx > 0) this.vx *= -1;
        }

        if (this.y < this.minY) this.y = this.minY;

        if (this.vy > 0 && this.y > this.maxY) {
          this.state = Cris.Deleted;
          store.add("misses");
          store.sounds!.miss.play();
        }
        break;
      case Cris.Smacked:
        this.vy += GRAVITY * dt;
        this.opacity -= 1 * dt;
        this.angle += SPIN_SPEED * this.smackDirection * dt;
        if (this.opacity < 0) {
          this.state = Cris.Deleted;
        }
        break;
      case Cris.Deleted:
        this.state = Cris.Removed;
        d.body.removeChild(this.el);
        break;
    }
  }

  resize(width: number, height: number) {
    const oldY = this.maxY;
    this.maxX = width - this.width;
    this.maxY = height;
    if (this.x > this.maxX) this.x = this.maxX;
    if (this.state < Cris.Jumping || height < oldY) {
      const diffY = height - oldY;
      this.y += diffY;
      this.targetY += diffY;
    }
  }

  render() {
    let transform = `translate3d(${this.x | 0}px,${this.y | 0}px,0)`;
    if (this.state === Cris.Smacked) {
      this.el.style.opacity = this.opacity.toString();
      transform += ` rotateZ(${round(this.angle)}deg)`;
    }
    this.el.style.transform = transform;
  }
}
