const bucket = new Set();

const data = {
  text: "hello world",
};
let activeEffect;

export const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect) {
      bucket.add(activeEffect);
    }
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    bucket.forEach((fn) => fn());
    return true;
  },
});

export function effect(fn) {
  activeEffect = fn;
  fn();
}
