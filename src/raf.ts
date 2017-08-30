const raf = requestAnimationFrame;
export default function requestAnimationLoop(fn: (deltaTime: number) => void) {
  let last = 0;
  let dt = 0.0;

  const tick = function(ts: number) {
    if (!last) last = ts;
    dt = (ts - last) / 1000;
    last = ts;
    fn(dt);
    raf(tock);
  };

  const tock = function(ts: number) {
    if (!last) last = ts;
    dt = (ts - last) / 1000;
    last = ts;
    fn(dt);
    raf(tick);
  };

  raf(tick);
}
