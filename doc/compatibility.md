## Engines

 _Zurvan_ is tested using Node.js: 4.x, 5.x, 6.x and newest releases. Currently there is no continous testing in the browser, thus it doesn't work, most probably.
 As for older _node_ engines, all features should work in 0.12 (although CI is not executed due to lack of tool support), but some may not work in 0.10 (like infinite immediate loop detection)

## Libraries

Most libraries should work out of the box. Known problems will be listed below:

 - bluebird - _bluebird_, as a Promise library implements the <a href="https://promisesaplus.com/">A+ promises standard</a>.
 The standard leaves to implementer whether asynchronous actions (`Promise.resolve` and `Promise.reject`) are executed in macroqueue 
 (like `setImmediate` since Node.js 0.10) or in microqueue (like `process.nextTick` since Node.js 0.10). 

 
 Implementers of V8 engine picked up second option (microqueue), while _bluebird_ uses the first one (macroqueue). 
 Additionally, _bluebird_ buffers `setImmediate` on startup, and that means that it won't be using faked version. 

**This is true Up to Node 12. Starting from Node 12 both use a macroqueue scheduler.**
 - unzip2 - _unzip2_ uses busy waiting for actual I/O, so in some cases it may look like `zurvan` freezes the testcases. Actual I/O is 
 not supported by `zurvan`, so integration with `unzip2` may be troublesome (especially that it actually hangs for small invalid files - https://github.com/glebdmitriew/node-unzip-2/issues/9)