// Buffer is available globaly but it is recomended to require it.
const { Buffer } = require('buffer')

// Allocating a buffer
const buffer1 = Buffer.alloc(16)

// writing to a buffer
//It will only write upto its size, rest will be ignored
buffer1.write("Bing Chlling 12_This will be ignored")

// by default, values will be printed in hex format 
console.log(buffer1)

// This will show them in decimal
console.log(buffer1.toJSON())


// buffer can be created from a string or array
// Array values must be in [0, 255] or they will be truncated to fit that range
const buffer2 = Buffer.from([66, 105, 110, 103])

// We need to specify correct encoding to correct string value
// In this case we need utf-8
console.log(buffer2.toString('utf-8'))
console.log(buffer2.toString('utf16le'))
