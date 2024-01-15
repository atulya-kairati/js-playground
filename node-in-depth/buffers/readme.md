### Buffer

> [Buffer Docs](https://nodejs.org/api/buffer.html)

- It is a container of fixed size in memory used to handle raw binary data.
- JS was not equipped to handle binary data so Buffers were introduced in node. Since it needs to deal with binary data on a server.
- Buffers store data as a array of bytes.
- And each value must be >=0 and <= 255 (>=0x0 and <=0xff). 8 bits or 1 Byte.
  - (This also means you can't directly store negetive numbers in a Buffer element)
- Values are stored in hexadecimal format.
