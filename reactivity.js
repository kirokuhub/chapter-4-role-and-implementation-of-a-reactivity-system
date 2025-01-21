const bucket = new WeakMap();

const data = {
  ok: true,
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
    activeEffect.deps.push(deps);
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;

    const depsMap = bucket.get(target);
    if(!depsMap) {
      return;
    }
    const deps = depsMap.get(key);
    const depsToRun = new Set(deps);
    depsToRun.forEach((fn) => fn());
    return true;
  },
});

export function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
  }
  effectFn.deps = [];
  effectFn();
}

function cleanup(effectFn) {
  for(let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}