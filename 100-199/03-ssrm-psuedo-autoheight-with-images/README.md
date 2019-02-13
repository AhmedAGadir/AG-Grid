BUG: Calling setRowHeight has unexpected effects when the cache block size is larger than the number of rows added to the DOM

To reproduce:

https://next.plnkr.co/edit/6j6ybgTDjiZYrdOt

After initial load look at console messages:

setting row height for node: 42
setting row height for node: 43
setting row height for node: 44

The last index + 1 will tell you how many rows are being loaded in the DOM.

2a) If cacheBlockSize less than or equal to that number, setRowHeight works fine.
2b) If cacheBlockSize is more than that number, setRowHeight has unexpected effects.

Workarounds:

a) Without row buffer

https://next.plnkr.co/edit/6j6ybgTDjiZYrdOt?preview

See how many rows are being loaded into the DOM by inspecting the DOM e.g. 45

Set cacheBlockSize to equal or smaller than that number e.g. gridOptions.cacheBlockSize = 45

b) With row buffer

https://next.plnkr.co/edit/zljCnEOk9uc3HgED?preview

See how many rows are being loaded into the DOM e.g. 45

Set cacheBlockSize to desired size e.g. 100,

Set gridOptions.rowBuffer = 100 + 10 - 45 = 65 // cacheBlockSize + defaultRowBufferSize - numberOfRowsAddedToDOM