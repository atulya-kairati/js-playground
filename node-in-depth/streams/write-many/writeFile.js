const fs = require("fs");
const fs_promises = require("fs/promises");

const FILE_PATH = "streams/write-many/junk.txt";

function millionWriteSync() {
  console.time("millionWriteSync");
  const fd = fs.openSync(FILE_PATH, "w");

  for (let i = 0; i < 1e6; i++) {
    fs.writeFileSync(fd, ".");
  }

  // delete file after
  fs.unlinkSync(FILE_PATH);

  console.timeEnd("millionWriteSync");
}

function millionWriteCallback() {
  console.time("millionWriteCallback");
  fs.open(FILE_PATH, "w", (err, fd) => {
    if (err !== null) throw err;

    for (let i = 0; i < 1e6; i++) {
      fs.writeFile(fd, "#", (err) => {
        if (err !== null) throw err;
      });
    }

    fs.unlink(FILE_PATH, (err) => {
      if (err !== null) throw err;

      console.timeEnd("millionWriteCallback");
    });
  });
}

async function millionWritePromises() {
  console.time("millionWritePromises");

  const fileHandle = await fs_promises.open(FILE_PATH, "w");

  for (let i = 0; i < 1e6; i++) {
    await fileHandle.write("$");
  }

  fileHandle.close();

  await fs_promises.unlink(FILE_PATH);
  console.timeEnd("millionWritePromises");
}

async function millionWriteStreams() {
  console.time("millionWriteStreams");

  const fileHandle = await fs_promises.open(FILE_PATH, "w");

  const fileStream = fileHandle.createWriteStream();

  console.log(
    "size of the internal buffer",
    fileStream.writableHighWaterMark,
    "bytes"
  );

  console.log(
    "writeable amount of buffer written",
    fileStream.writableLength,
    "bytes"
  );

  let i = 0;
  const write = () => {
    const times = 1e6;
    while (i < times) {
      i++;

      // the last iteration
      if (i === times) {
        fileStream.end("" + i); // write a value and end the stream
        return;
      }

      // when stream's internal buffer is full stop writing
      if (!fileStream.write(`${i} `)) return;
    }
  };

  // continue writing after the stream is drained. This prevents [backpressure].
  fileStream.on("drain", write);
  write();

  // if you close the file handle then the stream will also close and
  // the drain event won't be fired (better to close it in finished event)
  // fileHandle.close();

  fileStream.on("finish", async () => {
    fileHandle.close();

    // await fs_promises.unlink(FILE_PATH);
    console.timeEnd("millionWriteStreams");
  });
}

// millionWriteSync();
// millionWriteCallback();
// millionWritePromises();
millionWriteStreams();
