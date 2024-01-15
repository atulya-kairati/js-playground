const { error } = require("console");

// Using Synchronous API
function copyFileSync() {
  const fs = require("fs");

  fs.copyFileSync("readme.md", "readme-clone.txt");
}

// copyFileSync()
// ---------------------------

// Using Callback API
function copyFileWithCallback() {
  const fs = require("fs");

  fs.copyFile("readme.md", "readme-clone.txt", (error) => {
    if (error) return console.log(error);
  });
}

// copyFileWithCallback()
// ---------------------------

// Using Promises API

async function copyFileWithPromise() {
  const fs = require("fs").promises;

  try {
    await fs.copyFile("readme.md", "readme-clone.txt");
  } catch (error) {
    console.log(error);
  }
}

copyFileWithPromise();
