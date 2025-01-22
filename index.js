import { obj, watch } from "./reactivity.js";
const { log } = console;

watch(() => obj.foo, (newVal, oldVal) => {
  console.log(`newValue: ${newVal}, oldValue: ${oldVal}`)
}, {
  immediate: true,
})

setTimeout(() => {
  obj.foo++
}, 3000)