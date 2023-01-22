### Reading IPFS data with `ipfs.cat` proved difficult
- uses iterators to read a data stream, not whole file at once
- uint8arrays are not common.  The documentation for [ipfs-http-client](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client) didn't explain much.  I got the idea to use [Uint8Arrays](https://www.npmjs.com/package/uint8arrays) from comments at [discuss.ipfs.io](https://discuss.ipfs.io/t/how-to-fetch-content-from-ipfs-with-jsipfs/9912/6).
