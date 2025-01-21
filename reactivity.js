const bucket = new Set();

const data = {
  text: "hello world",
};

export const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect);
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    bucket.forEach((fn) => fn());
    return true;
  },
});

function effect() {
  document.body.innerText = obj.text;
}

effect();
