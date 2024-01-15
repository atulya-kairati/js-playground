const fs = require("fs/promises");
const { stdout } = require("process");

(async () => {
  const readFH = await fs.open("streams/read-big/junk.txt", "r");
  const writeFH = await fs.open("streams/read-big/even.txt", "w");

  const rStream = readFH.createReadStream();
  const wStream = writeFH.createWriteStream({ highWaterMark: 64 * 1024 });

  let front = ""; // to save last number if its split, and ad it to the front in the next iteration
  rStream.on("data", (chunk) => {
    let numbers = (front + chunk.toString("utf-8"))
      .split(" ")
      .filter((s) => s.trim().length !== 0)
      .map((n) => +n);

    front =
      numbers[numbers.length - 2] < numbers[numbers.length - 1]
        ? ""
        : numbers.pop();

    // only filter after taking care of split number at the end of the array
    numbers = numbers.filter((n) => (n & 1) == 0); // filter the even numbers

    console.log(numbers[0], numbers[numbers.length - 1]);

    if (!wStream.write(numbers.join(" ") + " ")) {
      rStream.pause();
    }
  });

  wStream.on("drain", () => {
    rStream.resume();
  });

  rStream.on("end", () => {
    readFH.close();
    writeFH.close();
  });
})();
