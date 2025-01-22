import { obj, watch } from "./reactivity.js";
const { log } = console;

watch(() => obj.foo, (newVal, oldVal) => {
  log(`newValue: ${newVal}, oldValue: ${oldVal}`)
})

setTimeout(() => {
  obj.foo++
}, 3000)