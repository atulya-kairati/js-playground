const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter()

myEmitter.on('hehe', (data) => {
    console.log('hehe occurred with data:', data)
})

myEmitter.on('hehe', () => {
    console.log('hehe occurred with')
})

myEmitter.on('bar', () => {
    console.log('bar occurred');
})

myEmitter.once('bar', () => {
    console.log('bar occurred');
})

myEmitter.emit('hehe', {bing: "chilling"})
myEmitter.emit('hehe')
myEmitter.emit('bar')
myEmitter.emit('bar')