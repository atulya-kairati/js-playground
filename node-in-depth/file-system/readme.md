### File System

#### What is a File?

- Just a sequence of bits on a storage device.

#### How node.js interacts with file.

- node.js can't directly manipulate files.
- It does that through the OS using system calls.
- Ways to interact with file in node.js:
  - Using Promises API (**Recommended**)
  - Using Callback API (**If performance is critical**)
  - Using Synchronous API (**Not recommended** unless needed because it blocks the main thread)



