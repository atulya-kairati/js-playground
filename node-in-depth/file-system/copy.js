// write a program to copy file
const fs = require("fs/promises");

// Method 1: Read all the data at once and then write it to the destination all at once.
// Fast but highly memory inefficient
async () => {
  console.time("copy");

  const dest = await fs.open("file-system/copy.txt", "w");

  const data = await fs.readFile("file-system/junk.txt");

  await dest.write(data);

  await dest.close();

  console.timeEnd("copy");
};

// Method 2: Read small portions from the source and write it to the destination
// Slower but far better
(async () => {
  console.time("copy");

  const dest = await fs.open("file-system/copy.txt", "w");

  const src = await fs.open("file-system/junk.txt");

  while (true) {
    const data = await src.read();

    // handle the case when its the last read buffer
    // in most cases the last read buffer will have actual bytes less than
    // the buffer size, and we should only write the actual data (bytes read)
    if (data.bytesRead !== data.buffer.length) {
      const actualData = data.buffer.subarray(0, data.bytesRead);

      await dest.write(actualData);
      break;

      // A corner case when the last buffer is exactly full in that case this if wont
      // handle that but the next iteration in which bytes read is 0 this if will handle it.
    }

    await dest.write(data.buffer);
  }

  console.timeEnd("copy");
})();
