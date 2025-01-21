import { obj } from "./reactivity.js";

setTimeout(() => {
  obj.text = "hello vue";
}, 1000 * 2);
