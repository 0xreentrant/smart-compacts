### Reading IPFS data with `ipfs.cat` proved difficult
- uses iterators to read a data stream, not whole file at once
- grab an async interator all at once w/ `all` from [`it-all`](https://www.npmjs.com/package/it-all) package. Example from the [Mutable File System lesson](https://proto.school/mutable-file-system/05) at proto.school.
- uint8arrays are not common.  The documentation for [ipfs-http-client](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client) didn't explain much.  I got the idea to use [Uint8Arrays](https://www.npmjs.com/package/uint8arrays) from comments at [discuss.ipfs.io](https://discuss.ipfs.io/t/how-to-fetch-content-from-ipfs-with-jsipfs/9912/6).
