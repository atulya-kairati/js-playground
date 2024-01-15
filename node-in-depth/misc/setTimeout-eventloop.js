console.log(1);
console.log(2);

// setTimeout/setInterval are handed to the event loop and will only be run after the
// main thread is done executing
setTimeout(() => console.log(3), 0);

// this will always execute JUST after the main thread ends
process.nextTick(() => console.log(4));

console.log(5);
