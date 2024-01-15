// Buffer is available globaly but it is recomended to require it.
const { Buffer, constants } = require("buffer");

// max buffer size
constants.MAX_LENGTH;
// it can be changed but it is 4GiB by default

// Allocating a buffer
// this will allocate a memory of size 16 Bytes
// And will zero out all the elements
const buffer1 = Buffer.alloc(16);

// This will allocate the memory of given size and won't bother with 0ing it
// FOr that reason it is slightly faster. But there can be security risks as there
// can be sensitive data in the memory addresses in the buffer.
const unsafeBuffer = Buffer.allocUnsafe(2000);
// What makes allocUnsafe even more faster is that fact that node has a preallocate
// buffer of size Buffer.poolSize (8KiB) and if the size of unsafe buffer is
// less than (Buffer.poolSize >>> 1) then node uses this preallocated buffer to
// create the unsafe buffer
console.log(Buffer.poolSize);

// This doesn't use the preallocated memory ever
const ubs = Buffer.allocUnsafeSlow(200);

// making a buffer directly (we need to specify encoding to convert string to proper numbers)
Buffer.from("ff4e34", "hex");

// writing to a buffer
//It will only write upto its size, rest will be ignored
buffer1.write("Bing Chlling 12_This will be ignored", "utf-8");

// by default, values will be printed in hex format
console.log(buffer1);

// has random access
buffer1[1] = 0xff;

// This will show them in decimal
console.log(buffer1.toJSON());

// writting a number in buffer
buffer1.writeInt8(-32, 2);
// if we try to assign a -ve number directly to a buffer it will wrap around will be saved as some +ve value
console.log(buffer1.readInt8(2));
// similarly other methods are used to read an write other kinds of data

// buffer can be created from a string or array
// Array values must be in [0, 255] or they will be truncated to fit that range
const buffer2 = Buffer.from([66, 105, 110, 103]);

// We need to specify correct encoding to correct string value
// In this case we need utf-8
console.log(buffer2.toString("hex"));
console.log(buffer2.toString("utf-8"));
console.log(buffer2.toString("utf16le"));
