// https://nodejs.org/api/stream.html#implementing-a-readable-stream

const fs = require("fs");
const { Readable } = require("stream");

class FileReadableStream extends Readable {
  fileDescriptor;

  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
  }

  /**
   * Called internally by node when initializing the stream.
   * @param {Function} constructed Call this function when the stream has finished initializing. Pass an error as an argument in case of failure.
   */
  _construct(constructed) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) return constructed(err);

      this.fileDescriptor = fd;
      constructed();
    });
  }

  /**
   * @param {number} size Number of bytes to read asynchronously
   */
  _read(size) {
    const buffer = Buffer.alloc(size);

    fs.read(this.fileDescriptor, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);

      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
    });
  }

  /**
   * Called for destroying the stream
   * @param {Error} error Possible error while destroying the stream. `null` if there is no error
   * @param {Function} destroyed Called after destruction of the stream completes. Pass an error as an argument in case of failure.
   */
  _destroy(error, destroyed) {
    if (this.fileDescriptor)
      fs.close(this.fileDescriptor, (err) => destroyed(err || error));
    else destroyed(error);
  }
}

const frs = new FileReadableStream({ fileName: "junk.txt" });

frs.on("data", (data) => {
  console.log(data.toString("utf-8"));
});

frs.on("end", () => {
  console.log("stream ended");
});
