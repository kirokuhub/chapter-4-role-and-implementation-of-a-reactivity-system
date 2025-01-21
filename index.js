import { obj, effect } from "./reactivity.js";
const { log } = console;

effect(() => {
  log("effect run");
  document.body.innerText = obj.text;
})

setTimeout(() => {
  obj.text = "hello vue";
}, 1000 * 2);
