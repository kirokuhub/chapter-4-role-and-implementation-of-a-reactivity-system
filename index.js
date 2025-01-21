import { obj, effect } from "./reactivity.js";
const { log } = console;

effect(() => {
  obj.foo++;
  log(`obj.foo: ${obj.foo}`);
});