const bucket = new WeakMap();

const data = {
  foo: 1,
  bar: 2
};
const effectStack = [];
let activeEffect;

export const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    trigger(target, key);
    return true;
  },
});

function track(target, key) {
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
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if(!depsMap) {
    return;
  }
  const deps = depsMap.get(key);
  const depsToRun = new Set();
  deps && deps.forEach((fn) => {
    if(fn !== activeEffect) {
      depsToRun.add(fn);
    }
  });
  depsToRun.forEach((fn) => {
    if(fn.options.scheduler) {
      fn.options.scheduler(fn);
    } else {
      fn();
    }
  });
}

export function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  }
  effectFn.deps = [];
  effectFn.options = options;
  if(!options.lazy) {
    effectFn();
  }
  return effectFn;
}

function cleanup(effectFn) {
  for(let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

export const jobQueue = new Set();
const p = Promise.resolve();
let isFlushing = false;
export function flushJob() {
  if(isFlushing) {
    return;
  }
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach((job) => job());
  }).finally(() => {
    isFlushing = false;
  });
}

export function computed(getter) {
  let value;
  let dirty = true;
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if(!dirty) {
        dirty = true;
        trigger(obj, 'value');
      }
    }
  });
  const obj = {
    get value() {
      if(dirty) {
        value = effectFn();
        dirty = false;
      }
      track(obj, 'value');
      return value;
    }
  }
  return obj;
}

export function watch(source, cb) {
  let getter;
  
  if(typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  effect(
    () => getter(),
    {
      scheduler() {
        cb();
      }
    }
  );
}

function traverse(value, seen = new Set()) {
  if(typeof value !== 'object' || value === null || seen.has(value)) {
    return;
  }
  seen.add(value);
  for(const key in value) {
    traverse(value[key], seen);
  }
  return value;
}