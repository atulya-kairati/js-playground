const fs = require("fs/promises");
const { Transform, pipeline } = require("stream");

class Decrypt extends Transform {
  constructor(fileSize) {
    super();

    this.fileSize = fileSize;
    this.bytesEncrypted = 0;
  }

  /**
   * @param {Buffer} chunk data to be transformed
   * @param {string} encoding
   * @param {Function} transformed callback after chunk has been transformed
   */
  _transform(chunk, encoding, transformed) {
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 0xff) {
        chunk[i]--;
      }
    }

    this.bytesEncrypted += chunk.length;

    const percentageEncrypted = (100 * this.bytesEncrypted) / this.fileSize;
    console.log(`Decrypted ${percentageEncrypted.toFixed(1)}%`);

    this.push(chunk);
    transformed();
  }
}

(async () => {
  const srcFile = await fs.open("encrypted.txt", "r");
  const srcStream = srcFile.createReadStream();

  const outputFile = await fs.open("decrypted.txt", "w");
  const outputStream = outputFile.createWriteStream();

  const srcFileSize = (await srcFile.stat()).size;
  const decrypter = new Decrypt(srcFileSize);

  pipeline(srcStream, decrypter, outputStream, (err) => {
    if (err) console.log(err);
  });
})();
