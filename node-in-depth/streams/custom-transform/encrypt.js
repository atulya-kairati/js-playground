const fs = require("fs/promises");
const { Transform, pipeline } = require("stream");

class Encrypt extends Transform {
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
        chunk[i]++;
      }
    }

    this.bytesEncrypted += chunk.length;

    const percentageEncrypted = (100 * this.bytesEncrypted) / this.fileSize;
    console.log(`Encrypted ${percentageEncrypted.toFixed(1)}%`);

    this.push(chunk);
    transformed();
  }
}

(async () => {
  const srcFile = await fs.open("even.txt", "r");
  const srcStream = srcFile.createReadStream();

  const outputFile = await fs.open("encrypted.txt", "w");
  const outputStream = outputFile.createWriteStream();

  const srcFileSize = (await srcFile.stat()).size;
  const encrypter = new Encrypt(srcFileSize);

  pipeline(srcStream, encrypter, outputStream, (err) => {
    if (err) console.log(err);
  });
})();
