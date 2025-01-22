import { obj, effect, jobQueue, flushJob, computed } from "./reactivity.js";
const { log } = console;

const sum = computed(() => obj.foo + obj.bar);

effect(() => {
  console.log('sum.value');
  console.log(sum.value);
  console.log('\n');
});

setTimeout(() => {
  obj.foo++;
}, 2000);