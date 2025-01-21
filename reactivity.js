const bucket = new WeakMap();

const data = {
  text: "hello world",
};
let activeEffect;

export const obj = new Proxy(data, {
  get(target, key) {
    if(!activeEffect) {
      return;
    }

    let depsMap = bucket.get(target);
    if(!depsMap) {
      bucket.set(target, (depsMap = new Map()));
    }

    let deps = depsMap.get(key);
    if(!deps) {
      depsMap.set(key, (deps = new Set()));
    }

    deps.add(activeEffect);
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;

    const depsMap = bucket.get(target);
    if(!depsMap) {
      return;
    }
    const deps = depsMap.get(key);
    deps && deps.forEach((fn) => fn());
    return true;
  },
});

export function effect(fn) {
  activeEffect = fn;
  fn();
}
