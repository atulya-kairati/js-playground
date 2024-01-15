const fs = require("fs/promises");

async () => {
  console.time("piped");

  const src = await fs.open("streams/even.txt", "r");
  const dest = await fs.open("streams/junk.txt", "w");

  const srcReadable = src.createReadStream();
  const destReadable = dest.createWriteStream();

  console.log(srcReadable.readableFlowing);

  srcReadable.pipe(destReadable);
  console.log(srcReadable.readableFlowing);

  //   srcReadable.unpipe(destReadable); // used to pause piping
  //   console.log(srcReadable.readableFlowing);

  srcReadable.on("end", () => {
    console.timeEnd("piped");
  });
};

/**
 * Pipe alone doesn't help out with error handling and
 * there is no explicit clean up for the streams
 * To do that pipeline can be used
 */
const { pipeline } = require("stream");

(async () => {
  console.time("pipeline");

  const src = await fs.open("streams/even.txt", "r");
  const dest = await fs.open("streams/junk.txt", "w");

  const srcReadable = src.createReadStream();
  const destReadable = dest.createWriteStream();

  // we can pass multiple streams to the pipeline
  pipeline(srcReadable, destReadable, (err) => {
    if (err) console.log(err);
    console.timeEnd("pipeline");
  });
})();
