import { obj, watch } from "./reactivity.js";
const { log } = console;

watch(obj, () => {
  log(`数据变化了`);
});

setTimeout(() => {
  obj.foo++
}, 3000);