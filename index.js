import { obj, effect } from "./reactivity.js";
const { log } = console;

let temp1, temp2;

effect(() => {
  log("outer effect invoked.");
  effect(() => {
    log("inner effect invoked.");
    temp2 = obj.bar;
  });
  temp1 = obj.foo;
});

setTimeout(() => {
  obj.foo = false;
}, 1000 * 2);