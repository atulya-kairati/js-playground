const { Buffer } = require("buffer");
const fs = require("fs");

const bin = "01001000 01101001 00100001";

const anum = bin.split(" ").map((b) => parseInt(b, 2));

const buffer = Buffer.alloc(3);

for (let i = 0; i < buffer.length; i++) {
  buffer[i] = anum[i];
}

console.log(buffer);

fs.writeFileSync("buffers/junk.txt", buffer);
