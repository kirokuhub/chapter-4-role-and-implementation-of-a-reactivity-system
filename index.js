import { obj, effect, jobQueue, flushJob } from "./reactivity.js";
const { log } = console;

effect(() => {
  log(`obj.foo: ${obj.foo}`)
}, {
  scheduler(fn) {
    jobQueue.add(fn);
    flushJob();
  }
})

obj.foo++
obj.foo++