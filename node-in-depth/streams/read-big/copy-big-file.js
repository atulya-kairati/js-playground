const fs = require("fs/promises");

(async () => {
  const bigFilePath =
    "/home/atulya/Documents/code/JS/node-in-depth/streams/read-big/junk.txt";
  const destinationPath =
    "/home/atulya/Documents/code/JS/node-in-depth/streams/read-big/garbage.txt";

  const readHandle = await fs.open(bigFilePath, "r");
  const writeHandle = await fs.open(destinationPath, "w");

  const fileReadStream = readHandle.createReadStream();
  const fileWriteStream = writeHandle.createWriteStream({
    highWaterMark: 64 * 1024, // override the default buffer size (equal to the read stream)
  });

  fileWriteStream.on("drain", () => fileReadStream.resume()); // we continue writing after writable stream has been drained.

  fileReadStream.on("data", (chunk) => {
    if (!fileWriteStream.write(chunk)) {
      // buffer full
      // allow write stream to drain
      fileReadStream.pause();
    }
  });

  fileReadStream.on("end", async () => {
    await readHandle.close();
    await writeHandle.close();

    console.log("Done copying");
  });
})();
