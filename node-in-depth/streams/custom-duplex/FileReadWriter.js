const { Duplex } = require("stream");
const fs = require("fs/promises");

class FileReadWriter extends Duplex {
  readFh;
  writeFh;
  chunks = [];
  chunksSize = 0;

  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ readableHighWaterMark, writableHighWaterMark });

    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
  }

  /**
   *
   * @param {Function} constructed callback to called after stream intialization is done
   */
  async _construct(constructed) {
    try {
      this.readFh = await fs.open(this.readFileName, "r");
      this.writeFh = await fs.open(this.writeFileName, "w");
      constructed(); // succ
    } catch (error) {
      console.log(error);
      constructed(error); // fail
    }
  }

  /**
   * @param {number} size Number of bytes to read asynchronously
   */
  async _read(size) {
    const buffer = Buffer.alloc(size);

    try {
      const result = await this.readFh.read(buffer, 0, size, null);

      this.push(
        result.bytesRead > 0 ? buffer.subarray(0, result.bytesRead) : null
      );
    } catch (error) {
      this.destroy(error);
    }
  }

  /**
   *
   * @param {Buffer|string|any} chunk data to be written
   * @param {string} encoding character encoding
   * @param {Function} callback Call this function when processing is complete for the supplied chunk. Pass an error as an argument in case of failure.
   */
  async _write(chunk, encoding, callback) {
    // we are going to collect chunks till we have exceeded highWaterMark
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    // we will write to the file after collected chunk size is over highWaterMark
    if (this.chunksSize > this.writableHighWaterMark) {
      try {
        await this.writeFh.write(Buffer.concat(this.chunks));

        this.chunks = [];
        this.chunksSize = 0;
        callback(); // successfully processed the chunk
      } catch (error) {
        callback(error); //fail
      }
    } else {
      callback(); // successfully processed the chunk
    }
  }

  /**
   * Called before the stream closes, delaying the 'finish' event until `finished` is called.
   * @param {Function} finished Call after finished writing the remaining data
   */
  async _final(finished) {
    try {
      await this.writeFh.write(Buffer.concat(this.chunks));
      finished(); // successfully wrote the remaining chunks
    } catch (error) {
      console.log(error);
      finished(err); // failed
    }
  }

  /**
   * Called for destroying the stream
   * @param {Error} err Possible error while destroying the stream. `null` if there is no error
   * @param {Function} destroyed Called after destruction of the stream completes. Pass an error as an argument in case of failure.
   */
  async _destroy(err, destroyed) {
    // close the file only if it was successfully opened

    try {
      this.readFh?.close();
      this.writeFh?.close();
      destroyed(err);
    } catch (error) {
      destroyed(err || error);
    }
  }
}

const frw = new FileReadWriter({
  // writableHighWaterMark: 20,
  readFileName: "even.txt",
  writeFileName: "junk.txt",
});

frw.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});

frw.write("Maachaod man.");
frw.write("Maachaod man.");
frw.write("Maachaod man.");
frw.write("Maachaod man.");
frw.write("Maachaod man.");
frw.write("Maachaod man.");

frw.end("\nend");
