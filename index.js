import { obj, effect, jobQueue, flushJob, computed } from "./reactivity.js";
const { log } = console;

const sum = computed(() => obj.foo + obj.bar);
setTimeout(() => {
  log('sum.value: ', sum.value);

  setTimeout(() => {
    obj.foo++;
    log('sum.value - 2: ', sum.value);
  }, 2000);
  log('\n');
}, 2000);