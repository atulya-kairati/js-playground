// https://nodejs.org/api/stream.html#implementing-a-writable-stream

const { Writable } = require("node:stream");
const fs = require("node:fs");

class FileWritableStream extends Writable {
  fileDescriptor;
  chunks = [];
  chunksSize = 0;
  writeCount = 0;

  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
  }

  /**
   * Called internally by node when initializing the stream.
   * @param {Function} constructed Call this function when the stream has finished initializing. Pass an error as an argument in case of failure.
   * No other method will be called till we have called `constructed`
   */
  _construct(constructed) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) return constructed(err); // stream construction failed

      this.fileDescriptor = fd;
      constructed(); // success
    });
  }

  /**
   *
   * @param {Buffer|string|any} chunk data to be written
   * @param {string} encoding character encoding
   * @param {Function} callback Call this function when processing is complete for the supplied chunk. Pass an error as an argument in case of failure.
   */
  _write(chunk, encoding, callback) {
    // we are going to collect chunks till we have exceeded highWaterMark
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    // we will write to the file after collected chunk size is over highWaterMark
    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fileDescriptor, Buffer.concat(this.chunks), (err) => {
        if (err) return callback(err); // failed

        this.chunks = [];
        this.chunksSize = 0;
        this.writeCount++;
        callback(); // successfully processed the chunk
      });
    } else {
      callback(); // successfully processed the chunk
    }
  }

  /**
   * Called before the stream closes, delaying the 'finish' event until `finished` is called.
   * @param {Function} finished Call after finished writing the remaining data
   */
  _final(finished) {
    fs.write(this.fileDescriptor, Buffer.concat(this.chunks), (err) => {
      if (err) return finished(err); // failed

      this.writeCount++;
      finished(); // successfully wrote the remaining chunks
    });
  }

  /**
   * Called for destroying the stream
   * @param {Error} err Possible error while destroying the stream. `null` if there is no error
   * @param {Function} destroyed Called after destruction of the stream completes. Pass an error as an argument in case of failure.
   */
  _destroy(err, destroyed) {
    console.log(`This stream wrote ${this.writeCount} times.`);

    // close the file only if it was successfully opened
    if (this.fileDescriptor) {
      fs.close(this.fileDescriptor, (error) => destroyed(err || error));
    } else {
      destroyed(err);
    }
  }
}

// ------------------------------ USAGE -------------------------------------------

async function millionWriteStreams() {
  console.time("millionWriteStreams");

  const fileStream = new FileWritableStream({
    fileName: "junk.txt",
  });

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

  fileStream.on("finish", async () => {
    console.timeEnd("millionWriteStreams");
  });
}

millionWriteStreams();
