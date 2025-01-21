import { obj, effect } from "./reactivity.js";
const { log } = console;

effect(() => {
  log("effect run");
  document.body.innerText = obj.ok ? obj.text : "not";
})

setTimeout(() => {
  log("toggle ok to false");
  obj.ok = false;
  setTimeout(() => {
    obj.text = "hello vue";
  }, 1000 * 2); 
}, 1000 * 2);
