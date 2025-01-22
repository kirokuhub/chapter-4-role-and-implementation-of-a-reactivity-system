import { obj, effect, jobQueue, flushJob, computed } from "./reactivity.js";
const { log } = console;

const sum = computed(() => obj.foo + obj.bar);
setTimeout(() => {
  log('sum.value: ', sum.value);
}, 2000);