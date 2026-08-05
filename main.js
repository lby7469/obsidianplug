/* Simple Git Sync - Obsidian plugin prototype */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target2, all) => {
  for (var name in all)
    __defProp(target2, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target2) => (target2 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target2, "default", { value: mod, enumerable: true }) : target2,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/buffer/index.js
var require_buffer = __commonJS({
  "node_modules/buffer/index.js"(exports) {
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer3;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer3.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer3.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function Buffer3(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer3.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer3.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer3.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer3, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer3.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer3.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer3.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer3.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer3.alloc(+length);
    }
    Buffer3.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer3.prototype;
    };
    Buffer3.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
      if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer3.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer3.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer3.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer = Buffer3.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer3.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer3.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer3.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer3.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer3.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer3.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
    Buffer3.prototype.equals = function equals(b) {
      if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer3.compare(this, b) === 0;
    };
    Buffer3.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
    }
    Buffer3.prototype.compare = function compare(target2, start, end, thisStart, thisEnd) {
      if (isInstance(target2, Uint8Array)) {
        target2 = Buffer3.from(target2, target2.offset, target2.byteLength);
      }
      if (!Buffer3.isBuffer(target2)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target2
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target2 ? target2.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target2.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target2) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target2.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer3.from(val, encoding);
      }
      if (Buffer3.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer3.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer3.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer3.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer3.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer3.prototype.copy = function copy(target2, targetStart, start, end) {
      if (!Buffer3.isBuffer(target2)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target2.length) targetStart = target2.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target2.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target2.length - targetStart < end - start) {
        end = target2.length - targetStart + start;
      }
      const len = end - start;
      if (this === target2 && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target2,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer3.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength2) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length}`,
        value
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = (function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    })();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// buffer-shim.js
var buffer_shim_exports = {};
__export(buffer_shim_exports, {
  Buffer: () => import_buffer.Buffer
});
var import_buffer, target;
var init_buffer_shim = __esm({
  "buffer-shim.js"() {
    import_buffer = __toESM(require_buffer());
    target = globalThis;
    if (!target.Buffer) {
      target.Buffer = import_buffer.Buffer;
    }
  }
});

// node_modules/isomorphic-git/index.umd.min.js
var require_index_umd_min = __commonJS({
  "node_modules/isomorphic-git/index.umd.min.js"(exports, module2) {
    !(function(t, e) {
      "object" == typeof exports && "object" == typeof module2 ? module2.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.git = e() : t.git = e();
    })(self, () => (() => {
      var t = { 41: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(655), n = r2(8068), a = r2(9675), o = r2(5795);
        t2.exports = function(t3, e3, r3) {
          if (!t3 || "object" != typeof t3 && "function" != typeof t3) throw new a("`obj` must be an object or a function`");
          if ("string" != typeof e3 && "symbol" != typeof e3) throw new a("`property` must be a string or a symbol`");
          if (arguments.length > 3 && "boolean" != typeof arguments[3] && null !== arguments[3]) throw new a("`nonEnumerable`, if provided, must be a boolean or null");
          if (arguments.length > 4 && "boolean" != typeof arguments[4] && null !== arguments[4]) throw new a("`nonWritable`, if provided, must be a boolean or null");
          if (arguments.length > 5 && "boolean" != typeof arguments[5] && null !== arguments[5]) throw new a("`nonConfigurable`, if provided, must be a boolean or null");
          if (arguments.length > 6 && "boolean" != typeof arguments[6]) throw new a("`loose`, if provided, must be a boolean");
          var s = arguments.length > 3 ? arguments[3] : null, c = arguments.length > 4 ? arguments[4] : null, f = arguments.length > 5 ? arguments[5] : null, l = arguments.length > 6 && arguments[6], d = !!o && o(t3, e3);
          if (i2) i2(t3, e3, { configurable: null === f && d ? d.configurable : !f, enumerable: null === s && d ? d.enumerable : !s, value: r3, writable: null === c && d ? d.writable : !c });
          else {
            if (!l && (s || c || f)) throw new n("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
            t3[e3] = r3;
          }
        };
      }, 76: (t2) => {
        "use strict";
        t2.exports = Function.prototype.call;
      }, 251: (t2, e2) => {
        e2.read = function(t3, e3, r2, i2, n) {
          var a, o, s = 8 * n - i2 - 1, c = (1 << s) - 1, f = c >> 1, l = -7, d = r2 ? n - 1 : 0, u = r2 ? -1 : 1, h = t3[e3 + d];
          for (d += u, a = h & (1 << -l) - 1, h >>= -l, l += s; l > 0; a = 256 * a + t3[e3 + d], d += u, l -= 8) ;
          for (o = a & (1 << -l) - 1, a >>= -l, l += i2; l > 0; o = 256 * o + t3[e3 + d], d += u, l -= 8) ;
          if (0 === a) a = 1 - f;
          else {
            if (a === c) return o ? NaN : 1 / 0 * (h ? -1 : 1);
            o += Math.pow(2, i2), a -= f;
          }
          return (h ? -1 : 1) * o * Math.pow(2, a - i2);
        }, e2.write = function(t3, e3, r2, i2, n, a) {
          var o, s, c, f = 8 * a - n - 1, l = (1 << f) - 1, d = l >> 1, u = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0, h = i2 ? 0 : a - 1, p = i2 ? 1 : -1, g = e3 < 0 || 0 === e3 && 1 / e3 < 0 ? 1 : 0;
          for (e3 = Math.abs(e3), isNaN(e3) || e3 === 1 / 0 ? (s = isNaN(e3) ? 1 : 0, o = l) : (o = Math.floor(Math.log(e3) / Math.LN2), e3 * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), (e3 += o + d >= 1 ? u / c : u * Math.pow(2, 1 - d)) * c >= 2 && (o++, c /= 2), o + d >= l ? (s = 0, o = l) : o + d >= 1 ? (s = (e3 * c - 1) * Math.pow(2, n), o += d) : (s = e3 * Math.pow(2, d - 1) * Math.pow(2, n), o = 0)); n >= 8; t3[r2 + h] = 255 & s, h += p, s /= 256, n -= 8) ;
          for (o = o << n | s, f += n; f > 0; t3[r2 + h] = 255 & o, h += p, o /= 256, f -= 8) ;
          t3[r2 + h - p] |= 128 * g;
        };
      }, 392: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(8188).Buffer, n = r2(5377);
        function a(t3, e3) {
          this._block = i2.alloc(t3), this._finalSize = e3, this._blockSize = t3, this._len = 0;
        }
        a.prototype.update = function(t3, e3) {
          t3 = n(t3, e3 || "utf8");
          for (var r3 = this._block, i3 = this._blockSize, a2 = t3.length, o = this._len, s = 0; s < a2; ) {
            for (var c = o % i3, f = Math.min(a2 - s, i3 - c), l = 0; l < f; l++) r3[c + l] = t3[s + l];
            s += f, (o += f) % i3 === 0 && this._update(r3);
          }
          return this._len += a2, this;
        }, a.prototype.digest = function(t3) {
          var e3 = this._len % this._blockSize;
          this._block[e3] = 128, this._block.fill(0, e3 + 1), e3 >= this._finalSize && (this._update(this._block), this._block.fill(0));
          var r3 = 8 * this._len;
          if (r3 <= 4294967295) this._block.writeUInt32BE(r3, this._blockSize - 4);
          else {
            var i3 = (4294967295 & r3) >>> 0, n2 = (r3 - i3) / 4294967296;
            this._block.writeUInt32BE(n2, this._blockSize - 8), this._block.writeUInt32BE(i3, this._blockSize - 4);
          }
          this._update(this._block);
          var a2 = this._hash();
          return t3 ? a2.toString(t3) : a2;
        }, a.prototype._update = function() {
          throw new Error("_update must be implemented by subclass");
        }, t2.exports = a;
      }, 414: (t2) => {
        "use strict";
        t2.exports = Math.round;
      }, 453: (t2, e2, r2) => {
        "use strict";
        var i2, n = r2(9612), a = r2(9383), o = r2(1237), s = r2(9290), c = r2(9538), f = r2(8068), l = r2(9675), d = r2(5345), u = r2(1514), h = r2(8968), p = r2(6188), g = r2(8002), w = r2(5880), m = r2(414), y = r2(3093), b = Function, _ = function(t3) {
          try {
            return b('"use strict"; return (' + t3 + ").constructor;")();
          } catch (t4) {
          }
        }, v = r2(5795), x = r2(655), k = function() {
          throw new l();
        }, E = v ? (function() {
          try {
            return k;
          } catch (t3) {
            try {
              return v(arguments, "callee").get;
            } catch (t4) {
              return k;
            }
          }
        })() : k, A = r2(4039)(), S = r2(3628), B = r2(1064), $ = r2(8648), R = r2(1002), P = r2(76), I = {}, O = "undefined" != typeof Uint8Array && S ? S(Uint8Array) : i2, j = { __proto__: null, "%AggregateError%": "undefined" == typeof AggregateError ? i2 : AggregateError, "%Array%": Array, "%ArrayBuffer%": "undefined" == typeof ArrayBuffer ? i2 : ArrayBuffer, "%ArrayIteratorPrototype%": A && S ? S([][Symbol.iterator]()) : i2, "%AsyncFromSyncIteratorPrototype%": i2, "%AsyncFunction%": I, "%AsyncGenerator%": I, "%AsyncGeneratorFunction%": I, "%AsyncIteratorPrototype%": I, "%Atomics%": "undefined" == typeof Atomics ? i2 : Atomics, "%BigInt%": "undefined" == typeof BigInt ? i2 : BigInt, "%BigInt64Array%": "undefined" == typeof BigInt64Array ? i2 : BigInt64Array, "%BigUint64Array%": "undefined" == typeof BigUint64Array ? i2 : BigUint64Array, "%Boolean%": Boolean, "%DataView%": "undefined" == typeof DataView ? i2 : DataView, "%Date%": Date, "%decodeURI%": decodeURI, "%decodeURIComponent%": decodeURIComponent, "%encodeURI%": encodeURI, "%encodeURIComponent%": encodeURIComponent, "%Error%": a, "%eval%": eval, "%EvalError%": o, "%Float16Array%": "undefined" == typeof Float16Array ? i2 : Float16Array, "%Float32Array%": "undefined" == typeof Float32Array ? i2 : Float32Array, "%Float64Array%": "undefined" == typeof Float64Array ? i2 : Float64Array, "%FinalizationRegistry%": "undefined" == typeof FinalizationRegistry ? i2 : FinalizationRegistry, "%Function%": b, "%GeneratorFunction%": I, "%Int8Array%": "undefined" == typeof Int8Array ? i2 : Int8Array, "%Int16Array%": "undefined" == typeof Int16Array ? i2 : Int16Array, "%Int32Array%": "undefined" == typeof Int32Array ? i2 : Int32Array, "%isFinite%": isFinite, "%isNaN%": isNaN, "%IteratorPrototype%": A && S ? S(S([][Symbol.iterator]())) : i2, "%JSON%": "object" == typeof JSON ? JSON : i2, "%Map%": "undefined" == typeof Map ? i2 : Map, "%MapIteratorPrototype%": "undefined" != typeof Map && A && S ? S((/* @__PURE__ */ new Map())[Symbol.iterator]()) : i2, "%Math%": Math, "%Number%": Number, "%Object%": n, "%Object.getOwnPropertyDescriptor%": v, "%parseFloat%": parseFloat, "%parseInt%": parseInt, "%Promise%": "undefined" == typeof Promise ? i2 : Promise, "%Proxy%": "undefined" == typeof Proxy ? i2 : Proxy, "%RangeError%": s, "%ReferenceError%": c, "%Reflect%": "undefined" == typeof Reflect ? i2 : Reflect, "%RegExp%": RegExp, "%Set%": "undefined" == typeof Set ? i2 : Set, "%SetIteratorPrototype%": "undefined" != typeof Set && A && S ? S((/* @__PURE__ */ new Set())[Symbol.iterator]()) : i2, "%SharedArrayBuffer%": "undefined" == typeof SharedArrayBuffer ? i2 : SharedArrayBuffer, "%String%": String, "%StringIteratorPrototype%": A && S ? S(""[Symbol.iterator]()) : i2, "%Symbol%": A ? Symbol : i2, "%SyntaxError%": f, "%ThrowTypeError%": E, "%TypedArray%": O, "%TypeError%": l, "%Uint8Array%": "undefined" == typeof Uint8Array ? i2 : Uint8Array, "%Uint8ClampedArray%": "undefined" == typeof Uint8ClampedArray ? i2 : Uint8ClampedArray, "%Uint16Array%": "undefined" == typeof Uint16Array ? i2 : Uint16Array, "%Uint32Array%": "undefined" == typeof Uint32Array ? i2 : Uint32Array, "%URIError%": d, "%WeakMap%": "undefined" == typeof WeakMap ? i2 : WeakMap, "%WeakRef%": "undefined" == typeof WeakRef ? i2 : WeakRef, "%WeakSet%": "undefined" == typeof WeakSet ? i2 : WeakSet, "%Function.prototype.call%": P, "%Function.prototype.apply%": R, "%Object.defineProperty%": x, "%Object.getPrototypeOf%": B, "%Math.abs%": u, "%Math.floor%": h, "%Math.max%": p, "%Math.min%": g, "%Math.pow%": w, "%Math.round%": m, "%Math.sign%": y, "%Reflect.getPrototypeOf%": $ };
        if (S) try {
          null.error;
        } catch (t3) {
          var U = S(S(t3));
          j["%Error.prototype%"] = U;
        }
        var T = function t3(e3) {
          var r3;
          if ("%AsyncFunction%" === e3) r3 = _("async function () {}");
          else if ("%GeneratorFunction%" === e3) r3 = _("function* () {}");
          else if ("%AsyncGeneratorFunction%" === e3) r3 = _("async function* () {}");
          else if ("%AsyncGenerator%" === e3) {
            var i3 = t3("%AsyncGeneratorFunction%");
            i3 && (r3 = i3.prototype);
          } else if ("%AsyncIteratorPrototype%" === e3) {
            var n2 = t3("%AsyncGenerator%");
            n2 && S && (r3 = S(n2.prototype));
          }
          return j[e3] = r3, r3;
        }, C = { __proto__: null, "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"], "%ArrayPrototype%": ["Array", "prototype"], "%ArrayProto_entries%": ["Array", "prototype", "entries"], "%ArrayProto_forEach%": ["Array", "prototype", "forEach"], "%ArrayProto_keys%": ["Array", "prototype", "keys"], "%ArrayProto_values%": ["Array", "prototype", "values"], "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"], "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"], "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"], "%BooleanPrototype%": ["Boolean", "prototype"], "%DataViewPrototype%": ["DataView", "prototype"], "%DatePrototype%": ["Date", "prototype"], "%ErrorPrototype%": ["Error", "prototype"], "%EvalErrorPrototype%": ["EvalError", "prototype"], "%Float32ArrayPrototype%": ["Float32Array", "prototype"], "%Float64ArrayPrototype%": ["Float64Array", "prototype"], "%FunctionPrototype%": ["Function", "prototype"], "%Generator%": ["GeneratorFunction", "prototype"], "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"], "%Int8ArrayPrototype%": ["Int8Array", "prototype"], "%Int16ArrayPrototype%": ["Int16Array", "prototype"], "%Int32ArrayPrototype%": ["Int32Array", "prototype"], "%JSONParse%": ["JSON", "parse"], "%JSONStringify%": ["JSON", "stringify"], "%MapPrototype%": ["Map", "prototype"], "%NumberPrototype%": ["Number", "prototype"], "%ObjectPrototype%": ["Object", "prototype"], "%ObjProto_toString%": ["Object", "prototype", "toString"], "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"], "%PromisePrototype%": ["Promise", "prototype"], "%PromiseProto_then%": ["Promise", "prototype", "then"], "%Promise_all%": ["Promise", "all"], "%Promise_reject%": ["Promise", "reject"], "%Promise_resolve%": ["Promise", "resolve"], "%RangeErrorPrototype%": ["RangeError", "prototype"], "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"], "%RegExpPrototype%": ["RegExp", "prototype"], "%SetPrototype%": ["Set", "prototype"], "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"], "%StringPrototype%": ["String", "prototype"], "%SymbolPrototype%": ["Symbol", "prototype"], "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"], "%TypedArrayPrototype%": ["TypedArray", "prototype"], "%TypeErrorPrototype%": ["TypeError", "prototype"], "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"], "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"], "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"], "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"], "%URIErrorPrototype%": ["URIError", "prototype"], "%WeakMapPrototype%": ["WeakMap", "prototype"], "%WeakSetPrototype%": ["WeakSet", "prototype"] }, M = r2(6743), D = r2(9957), N = M.call(P, Array.prototype.concat), z = M.call(R, Array.prototype.splice), F = M.call(P, String.prototype.replace), L = M.call(P, String.prototype.slice), H = M.call(P, RegExp.prototype.exec), G = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, W = /\\(\\)?/g, q = function(t3, e3) {
          var r3, i3 = t3;
          if (D(C, i3) && (i3 = "%" + (r3 = C[i3])[0] + "%"), D(j, i3)) {
            var n2 = j[i3];
            if (n2 === I && (n2 = T(i3)), void 0 === n2 && !e3) throw new l("intrinsic " + t3 + " exists, but is not available. Please file an issue!");
            return { alias: r3, name: i3, value: n2 };
          }
          throw new f("intrinsic " + t3 + " does not exist!");
        };
        t2.exports = function(t3, e3) {
          if ("string" != typeof t3 || 0 === t3.length) throw new l("intrinsic name must be a non-empty string");
          if (arguments.length > 1 && "boolean" != typeof e3) throw new l('"allowMissing" argument must be a boolean');
          if (null === H(/^%?[^%]*%?$/, t3)) throw new f("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
          var r3 = (function(t4) {
            var e4 = L(t4, 0, 1), r4 = L(t4, -1);
            if ("%" === e4 && "%" !== r4) throw new f("invalid intrinsic syntax, expected closing `%`");
            if ("%" === r4 && "%" !== e4) throw new f("invalid intrinsic syntax, expected opening `%`");
            var i4 = [];
            return F(t4, G, function(t5, e5, r5, n3) {
              i4[i4.length] = r5 ? F(n3, W, "$1") : e5 || t5;
            }), i4;
          })(t3), i3 = r3.length > 0 ? r3[0] : "", n2 = q("%" + i3 + "%", e3), a2 = n2.name, o2 = n2.value, s2 = false, c2 = n2.alias;
          c2 && (i3 = c2[0], z(r3, N([0, 1], c2)));
          for (var d2 = 1, u2 = true; d2 < r3.length; d2 += 1) {
            var h2 = r3[d2], p2 = L(h2, 0, 1), g2 = L(h2, -1);
            if (('"' === p2 || "'" === p2 || "`" === p2 || '"' === g2 || "'" === g2 || "`" === g2) && p2 !== g2) throw new f("property names with quotes must have matching quotes");
            if ("constructor" !== h2 && u2 || (s2 = true), D(j, a2 = "%" + (i3 += "." + h2) + "%")) o2 = j[a2];
            else if (null != o2) {
              if (!(h2 in o2)) {
                if (!e3) throw new l("base intrinsic for " + t3 + " exists, but the property is not available.");
                return;
              }
              if (v && d2 + 1 >= r3.length) {
                var w2 = v(o2, h2);
                o2 = (u2 = !!w2) && "get" in w2 && !("originalValue" in w2.get) ? w2.get : o2[h2];
              } else u2 = D(o2, h2), o2 = o2[h2];
              u2 && !s2 && (j[a2] = o2);
            }
          }
          return o2;
        };
      }, 487: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(6897), n = r2(655), a = r2(3126), o = r2(2205);
        t2.exports = function(t3) {
          var e3 = a(arguments), r3 = t3.length - (arguments.length - 1);
          return i2(e3, 1 + (r3 > 0 ? r3 : 0), true);
        }, n ? n(t2.exports, "apply", { value: o }) : t2.exports.apply = o;
      }, 592: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(655), n = function() {
          return !!i2;
        };
        n.hasArrayLengthDefineBug = function() {
          if (!i2) return null;
          try {
            return 1 !== i2([], "length", { value: 1 }).length;
          } catch (t3) {
            return true;
          }
        }, t2.exports = n;
      }, 655: (t2) => {
        "use strict";
        var e2 = Object.defineProperty || false;
        if (e2) try {
          e2({}, "a", { value: 1 });
        } catch (t3) {
          e2 = false;
        }
        t2.exports = e2;
      }, 809: (t2) => {
        "use strict";
        var e2 = function(t3) {
          if (t3 = t3 || {}, this.Promise = t3.Promise || Promise, this.queues = /* @__PURE__ */ Object.create(null), this.domainReentrant = t3.domainReentrant || false, this.domainReentrant) {
            if ("undefined" == typeof process || void 0 === process.domain) throw new Error("Domain-reentrant locks require `process.domain` to exist. Please flip `opts.domainReentrant = false`, use a NodeJS version that still implements Domain, or install a browser polyfill.");
            this.domains = /* @__PURE__ */ Object.create(null);
          }
          this.timeout = t3.timeout || e2.DEFAULT_TIMEOUT, this.maxOccupationTime = t3.maxOccupationTime || e2.DEFAULT_MAX_OCCUPATION_TIME, this.maxExecutionTime = t3.maxExecutionTime || e2.DEFAULT_MAX_EXECUTION_TIME, t3.maxPending === 1 / 0 || Number.isInteger(t3.maxPending) && t3.maxPending >= 0 ? this.maxPending = t3.maxPending : this.maxPending = e2.DEFAULT_MAX_PENDING;
        };
        e2.DEFAULT_TIMEOUT = 0, e2.DEFAULT_MAX_OCCUPATION_TIME = 0, e2.DEFAULT_MAX_EXECUTION_TIME = 0, e2.DEFAULT_MAX_PENDING = 1e3, e2.prototype.acquire = function(t3, e3, r2, i2) {
          if (Array.isArray(t3)) return this._acquireBatch(t3, e3, r2, i2);
          if ("function" != typeof e3) throw new Error("You must pass a function to execute");
          var n = null, a = null, o = null;
          "function" != typeof r2 && (i2 = r2, r2 = null, o = new this.Promise(function(t4, e4) {
            n = t4, a = e4;
          })), i2 = i2 || {};
          var s = false, c = null, f = null, l = null, d = this, u = function(e4, i3, c2) {
            f && (clearTimeout(f), f = null), l && (clearTimeout(l), l = null), e4 && (d.queues[t3] && 0 === d.queues[t3].length && delete d.queues[t3], d.domainReentrant && delete d.domains[t3]), s || (o ? i3 ? a(i3) : n(c2) : "function" == typeof r2 && r2(i3, c2), s = true), e4 && d.queues[t3] && d.queues[t3].length > 0 && d.queues[t3].shift()();
          }, h = function(r3) {
            if (s) return u(r3);
            c && (clearTimeout(c), c = null), d.domainReentrant && r3 && (d.domains[t3] = process.domain);
            var n2 = i2.maxExecutionTime || d.maxExecutionTime;
            if (n2 && (l = setTimeout(function() {
              d.queues[t3] && u(r3, new Error("Maximum execution time is exceeded " + t3));
            }, n2)), 1 === e3.length) {
              var a2 = false;
              try {
                e3(function(t4, e4) {
                  a2 || (a2 = true, u(r3, t4, e4));
                });
              } catch (t4) {
                a2 || (a2 = true, u(r3, t4));
              }
            } else d._promiseTry(function() {
              return e3();
            }).then(function(t4) {
              u(r3, void 0, t4);
            }, function(t4) {
              u(r3, t4);
            });
          };
          d.domainReentrant && process.domain && (h = process.domain.bind(h));
          var p = i2.maxPending || d.maxPending;
          if (d.queues[t3]) if (d.domainReentrant && process.domain && process.domain === d.domains[t3]) h(false);
          else if (d.queues[t3].length >= p) u(false, new Error("Too many pending tasks in queue " + t3));
          else {
            var g = function() {
              h(true);
            };
            i2.skipQueue ? d.queues[t3].unshift(g) : d.queues[t3].push(g);
            var w = i2.timeout || d.timeout;
            w && (c = setTimeout(function() {
              c = null, u(false, new Error("async-lock timed out in queue " + t3));
            }, w));
          }
          else d.queues[t3] = [], h(true);
          var m = i2.maxOccupationTime || d.maxOccupationTime;
          return m && (f = setTimeout(function() {
            d.queues[t3] && u(false, new Error("Maximum occupation time is exceeded in queue " + t3));
          }, m)), o || void 0;
        }, e2.prototype._acquireBatch = function(t3, e3, r2, i2) {
          "function" != typeof r2 && (i2 = r2, r2 = null);
          var n = this, a = t3.reduceRight(function(t4, e4) {
            return /* @__PURE__ */ (function(t5, e5) {
              return function(r3) {
                n.acquire(t5, e5, r3, i2);
              };
            })(e4, t4);
          }, e3);
          if ("function" != typeof r2) return new this.Promise(function(t4, e4) {
            1 === a.length ? a(function(r3, i3) {
              r3 ? e4(r3) : t4(i3);
            }) : t4(a());
          });
          a(r2);
        }, e2.prototype.isBusy = function(t3) {
          return t3 ? !!this.queues[t3] : Object.keys(this.queues).length > 0;
        }, e2.prototype._promiseTry = function(t3) {
          try {
            return this.Promise.resolve(t3());
          } catch (t4) {
            return this.Promise.reject(t4);
          }
        }, t2.exports = e2;
      }, 945: (t2, e2, r2) => {
        var i2 = r2(8287), n = i2.Buffer;
        function a(t3, e3) {
          for (var r3 in t3) e3[r3] = t3[r3];
        }
        function o(t3, e3, r3) {
          return n(t3, e3, r3);
        }
        n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? t2.exports = i2 : (a(i2, e2), e2.Buffer = o), o.prototype = Object.create(n.prototype), a(n, o), o.from = function(t3, e3, r3) {
          if ("number" == typeof t3) throw new TypeError("Argument must not be a number");
          return n(t3, e3, r3);
        }, o.alloc = function(t3, e3, r3) {
          if ("number" != typeof t3) throw new TypeError("Argument must be a number");
          var i3 = n(t3);
          return void 0 !== e3 ? "string" == typeof r3 ? i3.fill(e3, r3) : i3.fill(e3) : i3.fill(0), i3;
        }, o.allocUnsafe = function(t3) {
          if ("number" != typeof t3) throw new TypeError("Argument must be a number");
          return n(t3);
        }, o.allocUnsafeSlow = function(t3) {
          if ("number" != typeof t3) throw new TypeError("Argument must be a number");
          return i2.SlowBuffer(t3);
        };
      }, 1002: (t2) => {
        "use strict";
        t2.exports = Function.prototype.apply;
      }, 1064: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(9612);
        t2.exports = i2.getPrototypeOf || null;
      }, 1237: (t2) => {
        "use strict";
        t2.exports = EvalError;
      }, 1333: (t2) => {
        "use strict";
        t2.exports = function() {
          if ("function" != typeof Symbol || "function" != typeof Object.getOwnPropertySymbols) return false;
          if ("symbol" == typeof Symbol.iterator) return true;
          var t3 = {}, e2 = Symbol("test"), r2 = Object(e2);
          if ("string" == typeof e2) return false;
          if ("[object Symbol]" !== Object.prototype.toString.call(e2)) return false;
          if ("[object Symbol]" !== Object.prototype.toString.call(r2)) return false;
          for (var i2 in t3[e2] = 42, t3) return false;
          if ("function" == typeof Object.keys && 0 !== Object.keys(t3).length) return false;
          if ("function" == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(t3).length) return false;
          var n = Object.getOwnPropertySymbols(t3);
          if (1 !== n.length || n[0] !== e2) return false;
          if (!Object.prototype.propertyIsEnumerable.call(t3, e2)) return false;
          if ("function" == typeof Object.getOwnPropertyDescriptor) {
            var a = Object.getOwnPropertyDescriptor(t3, e2);
            if (42 !== a.value || true !== a.enumerable) return false;
          }
          return true;
        };
      }, 1447: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(9805), n = r2(3269), a = r2(4823), o = r2(7293), s = r2(1998), c = -2, f = 12, l = 30;
        function d(t3) {
          return (t3 >>> 24 & 255) + (t3 >>> 8 & 65280) + ((65280 & t3) << 8) + ((255 & t3) << 24);
        }
        function u() {
          this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i2.Buf16(320), this.work = new i2.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function h(t3) {
          var e3;
          return t3 && t3.state ? (e3 = t3.state, t3.total_in = t3.total_out = e3.total = 0, t3.msg = "", e3.wrap && (t3.adler = 1 & e3.wrap), e3.mode = 1, e3.last = 0, e3.havedict = 0, e3.dmax = 32768, e3.head = null, e3.hold = 0, e3.bits = 0, e3.lencode = e3.lendyn = new i2.Buf32(852), e3.distcode = e3.distdyn = new i2.Buf32(592), e3.sane = 1, e3.back = -1, 0) : c;
        }
        function p(t3) {
          var e3;
          return t3 && t3.state ? ((e3 = t3.state).wsize = 0, e3.whave = 0, e3.wnext = 0, h(t3)) : c;
        }
        function g(t3, e3) {
          var r3, i3;
          return t3 && t3.state ? (i3 = t3.state, e3 < 0 ? (r3 = 0, e3 = -e3) : (r3 = 1 + (e3 >> 4), e3 < 48 && (e3 &= 15)), e3 && (e3 < 8 || e3 > 15) ? c : (null !== i3.window && i3.wbits !== e3 && (i3.window = null), i3.wrap = r3, i3.wbits = e3, p(t3))) : c;
        }
        function w(t3, e3) {
          var r3, i3;
          return t3 ? (i3 = new u(), t3.state = i3, i3.window = null, 0 !== (r3 = g(t3, e3)) && (t3.state = null), r3) : c;
        }
        var m, y, b = true;
        function _(t3) {
          if (b) {
            var e3;
            for (m = new i2.Buf32(512), y = new i2.Buf32(32), e3 = 0; e3 < 144; ) t3.lens[e3++] = 8;
            for (; e3 < 256; ) t3.lens[e3++] = 9;
            for (; e3 < 280; ) t3.lens[e3++] = 7;
            for (; e3 < 288; ) t3.lens[e3++] = 8;
            for (s(1, t3.lens, 0, 288, m, 0, t3.work, { bits: 9 }), e3 = 0; e3 < 32; ) t3.lens[e3++] = 5;
            s(2, t3.lens, 0, 32, y, 0, t3.work, { bits: 5 }), b = false;
          }
          t3.lencode = m, t3.lenbits = 9, t3.distcode = y, t3.distbits = 5;
        }
        function v(t3, e3, r3, n2) {
          var a2, o2 = t3.state;
          return null === o2.window && (o2.wsize = 1 << o2.wbits, o2.wnext = 0, o2.whave = 0, o2.window = new i2.Buf8(o2.wsize)), n2 >= o2.wsize ? (i2.arraySet(o2.window, e3, r3 - o2.wsize, o2.wsize, 0), o2.wnext = 0, o2.whave = o2.wsize) : ((a2 = o2.wsize - o2.wnext) > n2 && (a2 = n2), i2.arraySet(o2.window, e3, r3 - n2, a2, o2.wnext), (n2 -= a2) ? (i2.arraySet(o2.window, e3, r3 - n2, n2, 0), o2.wnext = n2, o2.whave = o2.wsize) : (o2.wnext += a2, o2.wnext === o2.wsize && (o2.wnext = 0), o2.whave < o2.wsize && (o2.whave += a2))), 0;
        }
        e2.inflateReset = p, e2.inflateReset2 = g, e2.inflateResetKeep = h, e2.inflateInit = function(t3) {
          return w(t3, 15);
        }, e2.inflateInit2 = w, e2.inflate = function(t3, e3) {
          var r3, u2, h2, p2, g2, w2, m2, y2, b2, x, k, E, A, S, B, $, R, P, I, O, j, U, T, C, M = 0, D = new i2.Buf8(4), N = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!t3 || !t3.state || !t3.output || !t3.input && 0 !== t3.avail_in) return c;
          (r3 = t3.state).mode === f && (r3.mode = 13), g2 = t3.next_out, h2 = t3.output, m2 = t3.avail_out, p2 = t3.next_in, u2 = t3.input, w2 = t3.avail_in, y2 = r3.hold, b2 = r3.bits, x = w2, k = m2, U = 0;
          t: for (; ; ) switch (r3.mode) {
            case 1:
              if (0 === r3.wrap) {
                r3.mode = 13;
                break;
              }
              for (; b2 < 16; ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              if (2 & r3.wrap && 35615 === y2) {
                r3.check = 0, D[0] = 255 & y2, D[1] = y2 >>> 8 & 255, r3.check = a(r3.check, D, 2, 0), y2 = 0, b2 = 0, r3.mode = 2;
                break;
              }
              if (r3.flags = 0, r3.head && (r3.head.done = false), !(1 & r3.wrap) || (((255 & y2) << 8) + (y2 >> 8)) % 31) {
                t3.msg = "incorrect header check", r3.mode = l;
                break;
              }
              if (8 != (15 & y2)) {
                t3.msg = "unknown compression method", r3.mode = l;
                break;
              }
              if (b2 -= 4, j = 8 + (15 & (y2 >>>= 4)), 0 === r3.wbits) r3.wbits = j;
              else if (j > r3.wbits) {
                t3.msg = "invalid window size", r3.mode = l;
                break;
              }
              r3.dmax = 1 << j, t3.adler = r3.check = 1, r3.mode = 512 & y2 ? 10 : f, y2 = 0, b2 = 0;
              break;
            case 2:
              for (; b2 < 16; ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              if (r3.flags = y2, 8 != (255 & r3.flags)) {
                t3.msg = "unknown compression method", r3.mode = l;
                break;
              }
              if (57344 & r3.flags) {
                t3.msg = "unknown header flags set", r3.mode = l;
                break;
              }
              r3.head && (r3.head.text = y2 >> 8 & 1), 512 & r3.flags && (D[0] = 255 & y2, D[1] = y2 >>> 8 & 255, r3.check = a(r3.check, D, 2, 0)), y2 = 0, b2 = 0, r3.mode = 3;
            case 3:
              for (; b2 < 32; ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              r3.head && (r3.head.time = y2), 512 & r3.flags && (D[0] = 255 & y2, D[1] = y2 >>> 8 & 255, D[2] = y2 >>> 16 & 255, D[3] = y2 >>> 24 & 255, r3.check = a(r3.check, D, 4, 0)), y2 = 0, b2 = 0, r3.mode = 4;
            case 4:
              for (; b2 < 16; ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              r3.head && (r3.head.xflags = 255 & y2, r3.head.os = y2 >> 8), 512 & r3.flags && (D[0] = 255 & y2, D[1] = y2 >>> 8 & 255, r3.check = a(r3.check, D, 2, 0)), y2 = 0, b2 = 0, r3.mode = 5;
            case 5:
              if (1024 & r3.flags) {
                for (; b2 < 16; ) {
                  if (0 === w2) break t;
                  w2--, y2 += u2[p2++] << b2, b2 += 8;
                }
                r3.length = y2, r3.head && (r3.head.extra_len = y2), 512 & r3.flags && (D[0] = 255 & y2, D[1] = y2 >>> 8 & 255, r3.check = a(r3.check, D, 2, 0)), y2 = 0, b2 = 0;
              } else r3.head && (r3.head.extra = null);
              r3.mode = 6;
            case 6:
              if (1024 & r3.flags && ((E = r3.length) > w2 && (E = w2), E && (r3.head && (j = r3.head.extra_len - r3.length, r3.head.extra || (r3.head.extra = new Array(r3.head.extra_len)), i2.arraySet(r3.head.extra, u2, p2, E, j)), 512 & r3.flags && (r3.check = a(r3.check, u2, E, p2)), w2 -= E, p2 += E, r3.length -= E), r3.length)) break t;
              r3.length = 0, r3.mode = 7;
            case 7:
              if (2048 & r3.flags) {
                if (0 === w2) break t;
                E = 0;
                do {
                  j = u2[p2 + E++], r3.head && j && r3.length < 65536 && (r3.head.name += String.fromCharCode(j));
                } while (j && E < w2);
                if (512 & r3.flags && (r3.check = a(r3.check, u2, E, p2)), w2 -= E, p2 += E, j) break t;
              } else r3.head && (r3.head.name = null);
              r3.length = 0, r3.mode = 8;
            case 8:
              if (4096 & r3.flags) {
                if (0 === w2) break t;
                E = 0;
                do {
                  j = u2[p2 + E++], r3.head && j && r3.length < 65536 && (r3.head.comment += String.fromCharCode(j));
                } while (j && E < w2);
                if (512 & r3.flags && (r3.check = a(r3.check, u2, E, p2)), w2 -= E, p2 += E, j) break t;
              } else r3.head && (r3.head.comment = null);
              r3.mode = 9;
            case 9:
              if (512 & r3.flags) {
                for (; b2 < 16; ) {
                  if (0 === w2) break t;
                  w2--, y2 += u2[p2++] << b2, b2 += 8;
                }
                if (y2 !== (65535 & r3.check)) {
                  t3.msg = "header crc mismatch", r3.mode = l;
                  break;
                }
                y2 = 0, b2 = 0;
              }
              r3.head && (r3.head.hcrc = r3.flags >> 9 & 1, r3.head.done = true), t3.adler = r3.check = 0, r3.mode = f;
              break;
            case 10:
              for (; b2 < 32; ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              t3.adler = r3.check = d(y2), y2 = 0, b2 = 0, r3.mode = 11;
            case 11:
              if (0 === r3.havedict) return t3.next_out = g2, t3.avail_out = m2, t3.next_in = p2, t3.avail_in = w2, r3.hold = y2, r3.bits = b2, 2;
              t3.adler = r3.check = 1, r3.mode = f;
            case f:
              if (5 === e3 || 6 === e3) break t;
            case 13:
              if (r3.last) {
                y2 >>>= 7 & b2, b2 -= 7 & b2, r3.mode = 27;
                break;
              }
              for (; b2 < 3; ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              switch (r3.last = 1 & y2, b2 -= 1, 3 & (y2 >>>= 1)) {
                case 0:
                  r3.mode = 14;
                  break;
                case 1:
                  if (_(r3), r3.mode = 20, 6 === e3) {
                    y2 >>>= 2, b2 -= 2;
                    break t;
                  }
                  break;
                case 2:
                  r3.mode = 17;
                  break;
                case 3:
                  t3.msg = "invalid block type", r3.mode = l;
              }
              y2 >>>= 2, b2 -= 2;
              break;
            case 14:
              for (y2 >>>= 7 & b2, b2 -= 7 & b2; b2 < 32; ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              if ((65535 & y2) != (y2 >>> 16 ^ 65535)) {
                t3.msg = "invalid stored block lengths", r3.mode = l;
                break;
              }
              if (r3.length = 65535 & y2, y2 = 0, b2 = 0, r3.mode = 15, 6 === e3) break t;
            case 15:
              r3.mode = 16;
            case 16:
              if (E = r3.length) {
                if (E > w2 && (E = w2), E > m2 && (E = m2), 0 === E) break t;
                i2.arraySet(h2, u2, p2, E, g2), w2 -= E, p2 += E, m2 -= E, g2 += E, r3.length -= E;
                break;
              }
              r3.mode = f;
              break;
            case 17:
              for (; b2 < 14; ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              if (r3.nlen = 257 + (31 & y2), y2 >>>= 5, b2 -= 5, r3.ndist = 1 + (31 & y2), y2 >>>= 5, b2 -= 5, r3.ncode = 4 + (15 & y2), y2 >>>= 4, b2 -= 4, r3.nlen > 286 || r3.ndist > 30) {
                t3.msg = "too many length or distance symbols", r3.mode = l;
                break;
              }
              r3.have = 0, r3.mode = 18;
            case 18:
              for (; r3.have < r3.ncode; ) {
                for (; b2 < 3; ) {
                  if (0 === w2) break t;
                  w2--, y2 += u2[p2++] << b2, b2 += 8;
                }
                r3.lens[N[r3.have++]] = 7 & y2, y2 >>>= 3, b2 -= 3;
              }
              for (; r3.have < 19; ) r3.lens[N[r3.have++]] = 0;
              if (r3.lencode = r3.lendyn, r3.lenbits = 7, T = { bits: r3.lenbits }, U = s(0, r3.lens, 0, 19, r3.lencode, 0, r3.work, T), r3.lenbits = T.bits, U) {
                t3.msg = "invalid code lengths set", r3.mode = l;
                break;
              }
              r3.have = 0, r3.mode = 19;
            case 19:
              for (; r3.have < r3.nlen + r3.ndist; ) {
                for (; $ = (M = r3.lencode[y2 & (1 << r3.lenbits) - 1]) >>> 16 & 255, R = 65535 & M, !((B = M >>> 24) <= b2); ) {
                  if (0 === w2) break t;
                  w2--, y2 += u2[p2++] << b2, b2 += 8;
                }
                if (R < 16) y2 >>>= B, b2 -= B, r3.lens[r3.have++] = R;
                else {
                  if (16 === R) {
                    for (C = B + 2; b2 < C; ) {
                      if (0 === w2) break t;
                      w2--, y2 += u2[p2++] << b2, b2 += 8;
                    }
                    if (y2 >>>= B, b2 -= B, 0 === r3.have) {
                      t3.msg = "invalid bit length repeat", r3.mode = l;
                      break;
                    }
                    j = r3.lens[r3.have - 1], E = 3 + (3 & y2), y2 >>>= 2, b2 -= 2;
                  } else if (17 === R) {
                    for (C = B + 3; b2 < C; ) {
                      if (0 === w2) break t;
                      w2--, y2 += u2[p2++] << b2, b2 += 8;
                    }
                    b2 -= B, j = 0, E = 3 + (7 & (y2 >>>= B)), y2 >>>= 3, b2 -= 3;
                  } else {
                    for (C = B + 7; b2 < C; ) {
                      if (0 === w2) break t;
                      w2--, y2 += u2[p2++] << b2, b2 += 8;
                    }
                    b2 -= B, j = 0, E = 11 + (127 & (y2 >>>= B)), y2 >>>= 7, b2 -= 7;
                  }
                  if (r3.have + E > r3.nlen + r3.ndist) {
                    t3.msg = "invalid bit length repeat", r3.mode = l;
                    break;
                  }
                  for (; E--; ) r3.lens[r3.have++] = j;
                }
              }
              if (r3.mode === l) break;
              if (0 === r3.lens[256]) {
                t3.msg = "invalid code -- missing end-of-block", r3.mode = l;
                break;
              }
              if (r3.lenbits = 9, T = { bits: r3.lenbits }, U = s(1, r3.lens, 0, r3.nlen, r3.lencode, 0, r3.work, T), r3.lenbits = T.bits, U) {
                t3.msg = "invalid literal/lengths set", r3.mode = l;
                break;
              }
              if (r3.distbits = 6, r3.distcode = r3.distdyn, T = { bits: r3.distbits }, U = s(2, r3.lens, r3.nlen, r3.ndist, r3.distcode, 0, r3.work, T), r3.distbits = T.bits, U) {
                t3.msg = "invalid distances set", r3.mode = l;
                break;
              }
              if (r3.mode = 20, 6 === e3) break t;
            case 20:
              r3.mode = 21;
            case 21:
              if (w2 >= 6 && m2 >= 258) {
                t3.next_out = g2, t3.avail_out = m2, t3.next_in = p2, t3.avail_in = w2, r3.hold = y2, r3.bits = b2, o(t3, k), g2 = t3.next_out, h2 = t3.output, m2 = t3.avail_out, p2 = t3.next_in, u2 = t3.input, w2 = t3.avail_in, y2 = r3.hold, b2 = r3.bits, r3.mode === f && (r3.back = -1);
                break;
              }
              for (r3.back = 0; $ = (M = r3.lencode[y2 & (1 << r3.lenbits) - 1]) >>> 16 & 255, R = 65535 & M, !((B = M >>> 24) <= b2); ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              if ($ && !(240 & $)) {
                for (P = B, I = $, O = R; $ = (M = r3.lencode[O + ((y2 & (1 << P + I) - 1) >> P)]) >>> 16 & 255, R = 65535 & M, !(P + (B = M >>> 24) <= b2); ) {
                  if (0 === w2) break t;
                  w2--, y2 += u2[p2++] << b2, b2 += 8;
                }
                y2 >>>= P, b2 -= P, r3.back += P;
              }
              if (y2 >>>= B, b2 -= B, r3.back += B, r3.length = R, 0 === $) {
                r3.mode = 26;
                break;
              }
              if (32 & $) {
                r3.back = -1, r3.mode = f;
                break;
              }
              if (64 & $) {
                t3.msg = "invalid literal/length code", r3.mode = l;
                break;
              }
              r3.extra = 15 & $, r3.mode = 22;
            case 22:
              if (r3.extra) {
                for (C = r3.extra; b2 < C; ) {
                  if (0 === w2) break t;
                  w2--, y2 += u2[p2++] << b2, b2 += 8;
                }
                r3.length += y2 & (1 << r3.extra) - 1, y2 >>>= r3.extra, b2 -= r3.extra, r3.back += r3.extra;
              }
              r3.was = r3.length, r3.mode = 23;
            case 23:
              for (; $ = (M = r3.distcode[y2 & (1 << r3.distbits) - 1]) >>> 16 & 255, R = 65535 & M, !((B = M >>> 24) <= b2); ) {
                if (0 === w2) break t;
                w2--, y2 += u2[p2++] << b2, b2 += 8;
              }
              if (!(240 & $)) {
                for (P = B, I = $, O = R; $ = (M = r3.distcode[O + ((y2 & (1 << P + I) - 1) >> P)]) >>> 16 & 255, R = 65535 & M, !(P + (B = M >>> 24) <= b2); ) {
                  if (0 === w2) break t;
                  w2--, y2 += u2[p2++] << b2, b2 += 8;
                }
                y2 >>>= P, b2 -= P, r3.back += P;
              }
              if (y2 >>>= B, b2 -= B, r3.back += B, 64 & $) {
                t3.msg = "invalid distance code", r3.mode = l;
                break;
              }
              r3.offset = R, r3.extra = 15 & $, r3.mode = 24;
            case 24:
              if (r3.extra) {
                for (C = r3.extra; b2 < C; ) {
                  if (0 === w2) break t;
                  w2--, y2 += u2[p2++] << b2, b2 += 8;
                }
                r3.offset += y2 & (1 << r3.extra) - 1, y2 >>>= r3.extra, b2 -= r3.extra, r3.back += r3.extra;
              }
              if (r3.offset > r3.dmax) {
                t3.msg = "invalid distance too far back", r3.mode = l;
                break;
              }
              r3.mode = 25;
            case 25:
              if (0 === m2) break t;
              if (E = k - m2, r3.offset > E) {
                if ((E = r3.offset - E) > r3.whave && r3.sane) {
                  t3.msg = "invalid distance too far back", r3.mode = l;
                  break;
                }
                E > r3.wnext ? (E -= r3.wnext, A = r3.wsize - E) : A = r3.wnext - E, E > r3.length && (E = r3.length), S = r3.window;
              } else S = h2, A = g2 - r3.offset, E = r3.length;
              E > m2 && (E = m2), m2 -= E, r3.length -= E;
              do {
                h2[g2++] = S[A++];
              } while (--E);
              0 === r3.length && (r3.mode = 21);
              break;
            case 26:
              if (0 === m2) break t;
              h2[g2++] = r3.length, m2--, r3.mode = 21;
              break;
            case 27:
              if (r3.wrap) {
                for (; b2 < 32; ) {
                  if (0 === w2) break t;
                  w2--, y2 |= u2[p2++] << b2, b2 += 8;
                }
                if (k -= m2, t3.total_out += k, r3.total += k, k && (t3.adler = r3.check = r3.flags ? a(r3.check, h2, k, g2 - k) : n(r3.check, h2, k, g2 - k)), k = m2, (r3.flags ? y2 : d(y2)) !== r3.check) {
                  t3.msg = "incorrect data check", r3.mode = l;
                  break;
                }
                y2 = 0, b2 = 0;
              }
              r3.mode = 28;
            case 28:
              if (r3.wrap && r3.flags) {
                for (; b2 < 32; ) {
                  if (0 === w2) break t;
                  w2--, y2 += u2[p2++] << b2, b2 += 8;
                }
                if (y2 !== (4294967295 & r3.total)) {
                  t3.msg = "incorrect length check", r3.mode = l;
                  break;
                }
                y2 = 0, b2 = 0;
              }
              r3.mode = 29;
            case 29:
              U = 1;
              break t;
            case l:
              U = -3;
              break t;
            case 31:
              return -4;
            default:
              return c;
          }
          return t3.next_out = g2, t3.avail_out = m2, t3.next_in = p2, t3.avail_in = w2, r3.hold = y2, r3.bits = b2, (r3.wsize || k !== t3.avail_out && r3.mode < l && (r3.mode < 27 || 4 !== e3)) && v(t3, t3.output, t3.next_out, k - t3.avail_out) ? (r3.mode = 31, -4) : (x -= t3.avail_in, k -= t3.avail_out, t3.total_in += x, t3.total_out += k, r3.total += k, r3.wrap && k && (t3.adler = r3.check = r3.flags ? a(r3.check, h2, k, t3.next_out - k) : n(r3.check, h2, k, t3.next_out - k)), t3.data_type = r3.bits + (r3.last ? 64 : 0) + (r3.mode === f ? 128 : 0) + (20 === r3.mode || 15 === r3.mode ? 256 : 0), (0 === x && 0 === k || 4 === e3) && 0 === U && (U = -5), U);
        }, e2.inflateEnd = function(t3) {
          if (!t3 || !t3.state) return c;
          var e3 = t3.state;
          return e3.window && (e3.window = null), t3.state = null, 0;
        }, e2.inflateGetHeader = function(t3, e3) {
          var r3;
          return t3 && t3.state && 2 & (r3 = t3.state).wrap ? (r3.head = e3, e3.done = false, 0) : c;
        }, e2.inflateSetDictionary = function(t3, e3) {
          var r3, i3 = e3.length;
          return t3 && t3.state ? 0 !== (r3 = t3.state).wrap && 11 !== r3.mode ? c : 11 === r3.mode && n(1, e3, i3, 0) !== r3.check ? -3 : v(t3, e3, i3, i3) ? (r3.mode = 31, -4) : (r3.havedict = 1, 0) : c;
        }, e2.inflateInfo = "pako inflate (from Nodeca project)";
      }, 1514: (t2) => {
        "use strict";
        t2.exports = Math.abs;
      }, 1668: (t2, e2, r2) => {
        "use strict";
        var i2 = {};
        (0, r2(9805).assign)(i2, r2(3303), r2(7083), r2(9681)), t2.exports = i2;
      }, 1996: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(9805), n = true, a = true;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch (t3) {
          n = false;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch (t3) {
          a = false;
        }
        for (var o = new i2.Buf8(256), s = 0; s < 256; s++) o[s] = s >= 252 ? 6 : s >= 248 ? 5 : s >= 240 ? 4 : s >= 224 ? 3 : s >= 192 ? 2 : 1;
        function c(t3, e3) {
          if (e3 < 65534 && (t3.subarray && a || !t3.subarray && n)) return String.fromCharCode.apply(null, i2.shrinkBuf(t3, e3));
          for (var r3 = "", o2 = 0; o2 < e3; o2++) r3 += String.fromCharCode(t3[o2]);
          return r3;
        }
        o[254] = o[254] = 1, e2.string2buf = function(t3) {
          var e3, r3, n2, a2, o2, s2 = t3.length, c2 = 0;
          for (a2 = 0; a2 < s2; a2++) 55296 == (64512 & (r3 = t3.charCodeAt(a2))) && a2 + 1 < s2 && 56320 == (64512 & (n2 = t3.charCodeAt(a2 + 1))) && (r3 = 65536 + (r3 - 55296 << 10) + (n2 - 56320), a2++), c2 += r3 < 128 ? 1 : r3 < 2048 ? 2 : r3 < 65536 ? 3 : 4;
          for (e3 = new i2.Buf8(c2), o2 = 0, a2 = 0; o2 < c2; a2++) 55296 == (64512 & (r3 = t3.charCodeAt(a2))) && a2 + 1 < s2 && 56320 == (64512 & (n2 = t3.charCodeAt(a2 + 1))) && (r3 = 65536 + (r3 - 55296 << 10) + (n2 - 56320), a2++), r3 < 128 ? e3[o2++] = r3 : r3 < 2048 ? (e3[o2++] = 192 | r3 >>> 6, e3[o2++] = 128 | 63 & r3) : r3 < 65536 ? (e3[o2++] = 224 | r3 >>> 12, e3[o2++] = 128 | r3 >>> 6 & 63, e3[o2++] = 128 | 63 & r3) : (e3[o2++] = 240 | r3 >>> 18, e3[o2++] = 128 | r3 >>> 12 & 63, e3[o2++] = 128 | r3 >>> 6 & 63, e3[o2++] = 128 | 63 & r3);
          return e3;
        }, e2.buf2binstring = function(t3) {
          return c(t3, t3.length);
        }, e2.binstring2buf = function(t3) {
          for (var e3 = new i2.Buf8(t3.length), r3 = 0, n2 = e3.length; r3 < n2; r3++) e3[r3] = t3.charCodeAt(r3);
          return e3;
        }, e2.buf2string = function(t3, e3) {
          var r3, i3, n2, a2, s2 = e3 || t3.length, f = new Array(2 * s2);
          for (i3 = 0, r3 = 0; r3 < s2; ) if ((n2 = t3[r3++]) < 128) f[i3++] = n2;
          else if ((a2 = o[n2]) > 4) f[i3++] = 65533, r3 += a2 - 1;
          else {
            for (n2 &= 2 === a2 ? 31 : 3 === a2 ? 15 : 7; a2 > 1 && r3 < s2; ) n2 = n2 << 6 | 63 & t3[r3++], a2--;
            a2 > 1 ? f[i3++] = 65533 : n2 < 65536 ? f[i3++] = n2 : (n2 -= 65536, f[i3++] = 55296 | n2 >> 10 & 1023, f[i3++] = 56320 | 1023 & n2);
          }
          return c(f, i3);
        }, e2.utf8border = function(t3, e3) {
          var r3;
          for ((e3 = e3 || t3.length) > t3.length && (e3 = t3.length), r3 = e3 - 1; r3 >= 0 && 128 == (192 & t3[r3]); ) r3--;
          return r3 < 0 || 0 === r3 ? e3 : r3 + o[t3[r3]] > e3 ? r3 : e3;
        };
      }, 1998: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(9805), n = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], a = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], o = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], s = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        t2.exports = function(t3, e3, r3, c, f, l, d, u) {
          var h, p, g, w, m, y, b, _, v, x = u.bits, k = 0, E = 0, A = 0, S = 0, B = 0, $ = 0, R = 0, P = 0, I = 0, O = 0, j = null, U = 0, T = new i2.Buf16(16), C = new i2.Buf16(16), M = null, D = 0;
          for (k = 0; k <= 15; k++) T[k] = 0;
          for (E = 0; E < c; E++) T[e3[r3 + E]]++;
          for (B = x, S = 15; S >= 1 && 0 === T[S]; S--) ;
          if (B > S && (B = S), 0 === S) return f[l++] = 20971520, f[l++] = 20971520, u.bits = 1, 0;
          for (A = 1; A < S && 0 === T[A]; A++) ;
          for (B < A && (B = A), P = 1, k = 1; k <= 15; k++) if (P <<= 1, (P -= T[k]) < 0) return -1;
          if (P > 0 && (0 === t3 || 1 !== S)) return -1;
          for (C[1] = 0, k = 1; k < 15; k++) C[k + 1] = C[k] + T[k];
          for (E = 0; E < c; E++) 0 !== e3[r3 + E] && (d[C[e3[r3 + E]]++] = E);
          if (0 === t3 ? (j = M = d, y = 19) : 1 === t3 ? (j = n, U -= 257, M = a, D -= 257, y = 256) : (j = o, M = s, y = -1), O = 0, E = 0, k = A, m = l, $ = B, R = 0, g = -1, w = (I = 1 << B) - 1, 1 === t3 && I > 852 || 2 === t3 && I > 592) return 1;
          for (; ; ) {
            b = k - R, d[E] < y ? (_ = 0, v = d[E]) : d[E] > y ? (_ = M[D + d[E]], v = j[U + d[E]]) : (_ = 96, v = 0), h = 1 << k - R, A = p = 1 << $;
            do {
              f[m + (O >> R) + (p -= h)] = b << 24 | _ << 16 | v;
            } while (0 !== p);
            for (h = 1 << k - 1; O & h; ) h >>= 1;
            if (0 !== h ? (O &= h - 1, O += h) : O = 0, E++, 0 === --T[k]) {
              if (k === S) break;
              k = e3[r3 + d[E]];
            }
            if (k > B && (O & w) !== g) {
              for (0 === R && (R = B), m += A, P = 1 << ($ = k - R); $ + R < S && !((P -= T[$ + R]) <= 0); ) $++, P <<= 1;
              if (I += 1 << $, 1 === t3 && I > 852 || 2 === t3 && I > 592) return 1;
              f[g = O & w] = B << 24 | $ << 16 | m - l;
            }
          }
          return 0 !== O && (f[m + O] = k - R << 24 | 64 << 16), u.bits = B, 0;
        };
      }, 2205: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(6743), n = r2(1002), a = r2(3144);
        t2.exports = function() {
          return a(i2, n, arguments);
        };
      }, 2535: (t2) => {
        function e2(t3) {
          return Array.isArray(t3) ? t3 : [t3];
        }
        const r2 = /^\s+$/, i2 = /(?:[^\\]|^)\\$/, n = /^\\!/, a = /^\\#/, o = /\r?\n/g, s = /^\.*\/|^\.+$/;
        let c = "node-ignore";
        "undefined" != typeof Symbol && (c = Symbol.for("node-ignore"));
        const f = c, l = /([0-z])-([0-z])/g, d = () => false, u = [[/^\uFEFF/, () => ""], [/((?:\\\\)*?)(\\?\s+)$/, (t3, e3, r3) => e3 + (0 === r3.indexOf("\\") ? " " : "")], [/(\\+?)\s/g, (t3, e3) => {
          const { length: r3 } = e3;
          return e3.slice(0, r3 - r3 % 2) + " ";
        }], [/[\\$.|*+(){^]/g, (t3) => `\\${t3}`], [/(?!\\)\?/g, () => "[^/]"], [/^\//, () => "^"], [/\//g, () => "\\/"], [/^\^*\\\*\\\*\\\//, () => "^(?:.*\\/)?"], [/^(?=[^^])/, function() {
          return /\/(?!$)/.test(this) ? "^" : "(?:^|\\/)";
        }], [/\\\/\\\*\\\*(?=\\\/|$)/g, (t3, e3, r3) => e3 + 6 < r3.length ? "(?:\\/[^\\/]+)*" : "\\/.+"], [/(^|[^\\]+)(\\\*)+(?=.+)/g, (t3, e3, r3) => e3 + r3.replace(/\\\*/g, "[^\\/]*")], [/\\\\\\(?=[$.|*+(){^])/g, () => "\\"], [/\\\\/g, () => "\\"], [/(\\)?\[([^\]/]*?)(\\*)($|\])/g, (t3, e3, r3, i3, n2) => "\\" === e3 ? `\\[${r3}${((t4) => {
          const { length: e4 } = t4;
          return t4.slice(0, e4 - e4 % 2);
        })(i3)}${n2}` : "]" === n2 && i3.length % 2 == 0 ? `[${((t4) => t4.replace(l, (t5, e4, r4) => e4.charCodeAt(0) <= r4.charCodeAt(0) ? t5 : ""))(r3)}${i3}]` : "[]"], [/(?:[^*])$/, (t3) => /\/$/.test(t3) ? `${t3}$` : `${t3}(?=$|\\/$)`], [/(\^|\\\/)?\\\*$/, (t3, e3) => (e3 ? `${e3}[^/]+` : "[^/]*") + "(?=$|\\/$)"]], h = /* @__PURE__ */ Object.create(null), p = (t3) => "string" == typeof t3;
        class g {
          constructor(t3, e3, r3, i3) {
            this.origin = t3, this.pattern = e3, this.negative = r3, this.regex = i3;
          }
        }
        const w = (t3, e3) => {
          throw new e3(t3);
        }, m = (t3, e3, r3) => p(t3) ? t3 ? !m.isNotRelative(t3) || r3(`path should be a \`path.relative()\`d string, but got "${e3}"`, RangeError) : r3("path must not be empty", TypeError) : r3(`path must be a string, but got \`${e3}\``, TypeError), y = (t3) => s.test(t3);
        m.isNotRelative = y, m.convert = (t3) => t3;
        class b {
          constructor({ ignorecase: t3 = true, ignoreCase: e3 = t3, allowRelativePaths: r3 = false } = {}) {
            var i3;
            i3 = f, Object.defineProperty(this, i3, { value: true }), this._rules = [], this._ignoreCase = e3, this._allowRelativePaths = r3, this._initCache();
          }
          _initCache() {
            this._ignoreCache = /* @__PURE__ */ Object.create(null), this._testCache = /* @__PURE__ */ Object.create(null);
          }
          _addPattern(t3) {
            if (t3 && t3[f]) return this._rules = this._rules.concat(t3._rules), void (this._added = true);
            if (((t4) => t4 && p(t4) && !r2.test(t4) && !i2.test(t4) && 0 !== t4.indexOf("#"))(t3)) {
              const e3 = ((t4, e4) => {
                const r3 = t4;
                let i3 = false;
                0 === t4.indexOf("!") && (i3 = true, t4 = t4.substr(1));
                const o2 = ((t5, e5) => {
                  let r4 = h[t5];
                  return r4 || (r4 = u.reduce((e6, [r5, i4]) => e6.replace(r5, i4.bind(t5)), t5), h[t5] = r4), e5 ? new RegExp(r4, "i") : new RegExp(r4);
                })(t4 = t4.replace(n, "!").replace(a, "#"), e4);
                return new g(r3, t4, i3, o2);
              })(t3, this._ignoreCase);
              this._added = true, this._rules.push(e3);
            }
          }
          add(t3) {
            return this._added = false, e2(p(t3) ? ((t4) => t4.split(o))(t3) : t3).forEach(this._addPattern, this), this._added && this._initCache(), this;
          }
          addPattern(t3) {
            return this.add(t3);
          }
          _testOne(t3, e3) {
            let r3 = false, i3 = false;
            return this._rules.forEach((n2) => {
              const { negative: a2 } = n2;
              i3 === a2 && r3 !== i3 || a2 && !r3 && !i3 && !e3 || n2.regex.test(t3) && (r3 = !a2, i3 = a2);
            }), { ignored: r3, unignored: i3 };
          }
          _test(t3, e3, r3, i3) {
            const n2 = t3 && m.convert(t3);
            return m(n2, t3, this._allowRelativePaths ? d : w), this._t(n2, e3, r3, i3);
          }
          _t(t3, e3, r3, i3) {
            if (t3 in e3) return e3[t3];
            if (i3 || (i3 = t3.split("/")), i3.pop(), !i3.length) return e3[t3] = this._testOne(t3, r3);
            const n2 = this._t(i3.join("/") + "/", e3, r3, i3);
            return e3[t3] = n2.ignored ? n2 : this._testOne(t3, r3);
          }
          ignores(t3) {
            return this._test(t3, this._ignoreCache, false).ignored;
          }
          createFilter() {
            return (t3) => !this.ignores(t3);
          }
          filter(t3) {
            return e2(t3).filter(this.createFilter());
          }
          test(t3) {
            return this._test(t3, this._testCache, true);
          }
        }
        const _ = (t3) => new b(t3);
        if (_.isPathValid = (t3) => m(t3 && m.convert(t3), t3, d), _.default = _, t2.exports = _, "undefined" != typeof process && (process.env && process.env.IGNORE_TEST_WIN32 || "win32" === process.platform)) {
          const t3 = (t4) => /^\\\\\?\\/.test(t4) || /["<>|\u0000-\u001F]+/u.test(t4) ? t4 : t4.replace(/\\/g, "/");
          m.convert = t3;
          const e3 = /^[a-z]:\//i;
          m.isNotRelative = (t4) => e3.test(t4) || y(t4);
        }
      }, 2566: (t2, e2) => {
        var r2;
        r2 = function(t3) {
          t3.version = "1.2.2";
          var e3 = (function() {
            for (var t4 = 0, e4 = new Array(256), r4 = 0; 256 != r4; ++r4) t4 = 1 & (t4 = 1 & (t4 = 1 & (t4 = 1 & (t4 = 1 & (t4 = 1 & (t4 = 1 & (t4 = 1 & (t4 = r4) ? -306674912 ^ t4 >>> 1 : t4 >>> 1) ? -306674912 ^ t4 >>> 1 : t4 >>> 1) ? -306674912 ^ t4 >>> 1 : t4 >>> 1) ? -306674912 ^ t4 >>> 1 : t4 >>> 1) ? -306674912 ^ t4 >>> 1 : t4 >>> 1) ? -306674912 ^ t4 >>> 1 : t4 >>> 1) ? -306674912 ^ t4 >>> 1 : t4 >>> 1) ? -306674912 ^ t4 >>> 1 : t4 >>> 1, e4[r4] = t4;
            return "undefined" != typeof Int32Array ? new Int32Array(e4) : e4;
          })(), r3 = (function(t4) {
            var e4 = 0, r4 = 0, i3 = 0, n2 = "undefined" != typeof Int32Array ? new Int32Array(4096) : new Array(4096);
            for (i3 = 0; 256 != i3; ++i3) n2[i3] = t4[i3];
            for (i3 = 0; 256 != i3; ++i3) for (r4 = t4[i3], e4 = 256 + i3; e4 < 4096; e4 += 256) r4 = n2[e4] = r4 >>> 8 ^ t4[255 & r4];
            var a2 = [];
            for (i3 = 1; 16 != i3; ++i3) a2[i3 - 1] = "undefined" != typeof Int32Array ? n2.subarray(256 * i3, 256 * i3 + 256) : n2.slice(256 * i3, 256 * i3 + 256);
            return a2;
          })(e3), i2 = r3[0], n = r3[1], a = r3[2], o = r3[3], s = r3[4], c = r3[5], f = r3[6], l = r3[7], d = r3[8], u = r3[9], h = r3[10], p = r3[11], g = r3[12], w = r3[13], m = r3[14];
          t3.table = e3, t3.bstr = function(t4, r4) {
            for (var i3 = -1 ^ r4, n2 = 0, a2 = t4.length; n2 < a2; ) i3 = i3 >>> 8 ^ e3[255 & (i3 ^ t4.charCodeAt(n2++))];
            return ~i3;
          }, t3.buf = function(t4, r4) {
            for (var y = -1 ^ r4, b = t4.length - 15, _ = 0; _ < b; ) y = m[t4[_++] ^ 255 & y] ^ w[t4[_++] ^ y >> 8 & 255] ^ g[t4[_++] ^ y >> 16 & 255] ^ p[t4[_++] ^ y >>> 24] ^ h[t4[_++]] ^ u[t4[_++]] ^ d[t4[_++]] ^ l[t4[_++]] ^ f[t4[_++]] ^ c[t4[_++]] ^ s[t4[_++]] ^ o[t4[_++]] ^ a[t4[_++]] ^ n[t4[_++]] ^ i2[t4[_++]] ^ e3[t4[_++]];
            for (b += 15; _ < b; ) y = y >>> 8 ^ e3[255 & (y ^ t4[_++])];
            return ~y;
          }, t3.str = function(t4, r4) {
            for (var i3 = -1 ^ r4, n2 = 0, a2 = t4.length, o2 = 0, s2 = 0; n2 < a2; ) (o2 = t4.charCodeAt(n2++)) < 128 ? i3 = i3 >>> 8 ^ e3[255 & (i3 ^ o2)] : o2 < 2048 ? i3 = (i3 = i3 >>> 8 ^ e3[255 & (i3 ^ (192 | o2 >> 6 & 31))]) >>> 8 ^ e3[255 & (i3 ^ (128 | 63 & o2))] : o2 >= 55296 && o2 < 57344 ? (o2 = 64 + (1023 & o2), s2 = 1023 & t4.charCodeAt(n2++), i3 = (i3 = (i3 = (i3 = i3 >>> 8 ^ e3[255 & (i3 ^ (240 | o2 >> 8 & 7))]) >>> 8 ^ e3[255 & (i3 ^ (128 | o2 >> 2 & 63))]) >>> 8 ^ e3[255 & (i3 ^ (128 | s2 >> 6 & 15 | (3 & o2) << 4))]) >>> 8 ^ e3[255 & (i3 ^ (128 | 63 & s2))]) : i3 = (i3 = (i3 = i3 >>> 8 ^ e3[255 & (i3 ^ (224 | o2 >> 12 & 15))]) >>> 8 ^ e3[255 & (i3 ^ (128 | o2 >> 6 & 63))]) >>> 8 ^ e3[255 & (i3 ^ (128 | 63 & o2))];
            return ~i3;
          };
        }, "undefined" == typeof DO_NOT_EXPORT_CRC ? r2(e2) : r2({});
      }, 2682: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(9600), n = Object.prototype.toString, a = Object.prototype.hasOwnProperty;
        t2.exports = function(t3, e3, r3) {
          if (!i2(e3)) throw new TypeError("iterator must be a function");
          var o, s;
          arguments.length >= 3 && (o = r3), s = t3, "[object Array]" === n.call(s) ? (function(t4, e4, r4) {
            for (var i3 = 0, n2 = t4.length; i3 < n2; i3++) a.call(t4, i3) && (null == r4 ? e4(t4[i3], i3, t4) : e4.call(r4, t4[i3], i3, t4));
          })(t3, e3, o) : "string" == typeof t3 ? (function(t4, e4, r4) {
            for (var i3 = 0, n2 = t4.length; i3 < n2; i3++) null == r4 ? e4(t4.charAt(i3), i3, t4) : e4.call(r4, t4.charAt(i3), i3, t4);
          })(t3, e3, o) : (function(t4, e4, r4) {
            for (var i3 in t4) a.call(t4, i3) && (null == r4 ? e4(t4[i3], i3, t4) : e4.call(r4, t4[i3], i3, t4));
          })(t3, e3, o);
        };
      }, 3093: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(4459);
        t2.exports = function(t3) {
          return i2(t3) || 0 === t3 ? t3 : t3 < 0 ? -1 : 1;
        };
      }, 3126: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(6743), n = r2(9675), a = r2(76), o = r2(3144);
        t2.exports = function(t3) {
          if (t3.length < 1 || "function" != typeof t3[0]) throw new n("a function is required");
          return o(i2, a, t3);
        };
      }, 3144: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(6743), n = r2(1002), a = r2(76), o = r2(7119);
        t2.exports = o || i2.call(a, n);
      }, 3269: (t2) => {
        "use strict";
        t2.exports = function(t3, e2, r2, i2) {
          for (var n = 65535 & t3, a = t3 >>> 16 & 65535, o = 0; 0 !== r2; ) {
            r2 -= o = r2 > 2e3 ? 2e3 : r2;
            do {
              a = a + (n = n + e2[i2++] | 0) | 0;
            } while (--o);
            n %= 65521, a %= 65521;
          }
          return n | a << 16;
        };
      }, 3303: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(8411), n = r2(9805), a = r2(1996), o = r2(4674), s = r2(4442), c = Object.prototype.toString;
        function f(t3) {
          if (!(this instanceof f)) return new f(t3);
          this.options = n.assign({ level: -1, method: 8, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: 0, to: "" }, t3 || {});
          var e3 = this.options;
          e3.raw && e3.windowBits > 0 ? e3.windowBits = -e3.windowBits : e3.gzip && e3.windowBits > 0 && e3.windowBits < 16 && (e3.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
          var r3 = i2.deflateInit2(this.strm, e3.level, e3.method, e3.windowBits, e3.memLevel, e3.strategy);
          if (0 !== r3) throw new Error(o[r3]);
          if (e3.header && i2.deflateSetHeader(this.strm, e3.header), e3.dictionary) {
            var l2;
            if (l2 = "string" == typeof e3.dictionary ? a.string2buf(e3.dictionary) : "[object ArrayBuffer]" === c.call(e3.dictionary) ? new Uint8Array(e3.dictionary) : e3.dictionary, 0 !== (r3 = i2.deflateSetDictionary(this.strm, l2))) throw new Error(o[r3]);
            this._dict_set = true;
          }
        }
        function l(t3, e3) {
          var r3 = new f(e3);
          if (r3.push(t3, true), r3.err) throw r3.msg || o[r3.err];
          return r3.result;
        }
        f.prototype.push = function(t3, e3) {
          var r3, o2, s2 = this.strm, f2 = this.options.chunkSize;
          if (this.ended) return false;
          o2 = e3 === ~~e3 ? e3 : true === e3 ? 4 : 0, "string" == typeof t3 ? s2.input = a.string2buf(t3) : "[object ArrayBuffer]" === c.call(t3) ? s2.input = new Uint8Array(t3) : s2.input = t3, s2.next_in = 0, s2.avail_in = s2.input.length;
          do {
            if (0 === s2.avail_out && (s2.output = new n.Buf8(f2), s2.next_out = 0, s2.avail_out = f2), 1 !== (r3 = i2.deflate(s2, o2)) && 0 !== r3) return this.onEnd(r3), this.ended = true, false;
            0 !== s2.avail_out && (0 !== s2.avail_in || 4 !== o2 && 2 !== o2) || ("string" === this.options.to ? this.onData(a.buf2binstring(n.shrinkBuf(s2.output, s2.next_out))) : this.onData(n.shrinkBuf(s2.output, s2.next_out)));
          } while ((s2.avail_in > 0 || 0 === s2.avail_out) && 1 !== r3);
          return 4 === o2 ? (r3 = i2.deflateEnd(this.strm), this.onEnd(r3), this.ended = true, 0 === r3) : 2 !== o2 || (this.onEnd(0), s2.avail_out = 0, true);
        }, f.prototype.onData = function(t3) {
          this.chunks.push(t3);
        }, f.prototype.onEnd = function(t3) {
          0 === t3 && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)), this.chunks = [], this.err = t3, this.msg = this.strm.msg;
        }, e2.Deflate = f, e2.deflate = l, e2.deflateRaw = function(t3, e3) {
          return (e3 = e3 || {}).raw = true, l(t3, e3);
        }, e2.gzip = function(t3, e3) {
          return (e3 = e3 || {}).gzip = true, l(t3, e3);
        };
      }, 3548: (t2) => {
        t2.exports = function(t3, e2) {
          var r2, i2, n = t3, a = e2, o = n.length, s = a.length, c = false, f = null, l = o + 1, d = [], u = [], h = [], p = "", g = function(t4, e3, r3) {
            return { x: t4, y: e3, k: r3 };
          }, w = function(t4, e3) {
            return { elem: t4, t: e3 };
          }, m = function(t4, e3, r3) {
            var i3, c2, f2;
            for (i3 = e3 > r3 ? d[t4 - 1 + l] : d[t4 + 1 + l], c2 = (f2 = Math.max(e3, r3)) - t4; c2 < o && f2 < s && n[c2] === a[f2]; ) ++c2, ++f2;
            return d[t4 + l] = u.length, u[u.length] = new g(c2, f2, i3), f2;
          };
          return o >= s && (r2 = n, i2 = o, n = a, a = r2, o = s, s = i2, c = true, l = o + 1), { SES_DELETE: -1, SES_COMMON: 0, SES_ADD: 1, editdistance: function() {
            return f;
          }, getlcs: function() {
            return p;
          }, getses: function() {
            return h;
          }, compose: function() {
            var t4, e3, r3, i3, y, b, _, v;
            for (t4 = s - o, e3 = o + s + 3, r3 = {}, _ = 0; _ < e3; ++_) r3[_] = -1, d[_] = -1;
            i3 = -1;
            do {
              for (v = -++i3; v <= t4 - 1; ++v) r3[v + l] = m(v, r3[v - 1 + l] + 1, r3[v + 1 + l]);
              for (v = t4 + i3; v >= t4 + 1; --v) r3[v + l] = m(v, r3[v - 1 + l] + 1, r3[v + 1 + l]);
              r3[t4 + l] = m(t4, r3[t4 - 1 + l] + 1, r3[t4 + 1 + l]);
            } while (r3[t4 + l] !== s);
            for (f = t4 + 2 * i3, y = d[t4 + l], b = []; -1 !== y; ) b[b.length] = new g(u[y].x, u[y].y, null), y = u[y].k;
            !(function(t5) {
              var e4, r4, i4;
              for (e4 = r4 = 0, i4 = t5.length - 1; i4 >= 0; --i4) for (; e4 < t5[i4].x || r4 < t5[i4].y; ) t5[i4].y - t5[i4].x > r4 - e4 ? (h[h.length] = new w(a[r4], c ? -1 : 1), ++r4) : t5[i4].y - t5[i4].x < r4 - e4 ? (h[h.length] = new w(n[e4], c ? 1 : -1), ++e4) : (h[h.length] = new w(n[e4], 0), p += n[e4], ++e4, ++r4);
            })(b);
          } };
        };
      }, 3628: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(8648), n = r2(1064), a = r2(7176);
        t2.exports = i2 ? function(t3) {
          return i2(t3);
        } : n ? function(t3) {
          if (!t3 || "object" != typeof t3 && "function" != typeof t3) throw new TypeError("getProto: not an object");
          return n(t3);
        } : a ? function(t3) {
          return a(t3);
        } : null;
      }, 3665: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(9805);
        function n(t3) {
          for (var e3 = t3.length; --e3 >= 0; ) t3[e3] = 0;
        }
        var a = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], o = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], c = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], f = new Array(576);
        n(f);
        var l = new Array(60);
        n(l);
        var d = new Array(512);
        n(d);
        var u = new Array(256);
        n(u);
        var h = new Array(29);
        n(h);
        var p, g, w, m = new Array(30);
        function y(t3, e3, r3, i3, n2) {
          this.static_tree = t3, this.extra_bits = e3, this.extra_base = r3, this.elems = i3, this.max_length = n2, this.has_stree = t3 && t3.length;
        }
        function b(t3, e3) {
          this.dyn_tree = t3, this.max_code = 0, this.stat_desc = e3;
        }
        function _(t3) {
          return t3 < 256 ? d[t3] : d[256 + (t3 >>> 7)];
        }
        function v(t3, e3) {
          t3.pending_buf[t3.pending++] = 255 & e3, t3.pending_buf[t3.pending++] = e3 >>> 8 & 255;
        }
        function x(t3, e3, r3) {
          t3.bi_valid > 16 - r3 ? (t3.bi_buf |= e3 << t3.bi_valid & 65535, v(t3, t3.bi_buf), t3.bi_buf = e3 >> 16 - t3.bi_valid, t3.bi_valid += r3 - 16) : (t3.bi_buf |= e3 << t3.bi_valid & 65535, t3.bi_valid += r3);
        }
        function k(t3, e3, r3) {
          x(t3, r3[2 * e3], r3[2 * e3 + 1]);
        }
        function E(t3, e3) {
          var r3 = 0;
          do {
            r3 |= 1 & t3, t3 >>>= 1, r3 <<= 1;
          } while (--e3 > 0);
          return r3 >>> 1;
        }
        function A(t3, e3, r3) {
          var i3, n2, a2 = new Array(16), o2 = 0;
          for (i3 = 1; i3 <= 15; i3++) a2[i3] = o2 = o2 + r3[i3 - 1] << 1;
          for (n2 = 0; n2 <= e3; n2++) {
            var s2 = t3[2 * n2 + 1];
            0 !== s2 && (t3[2 * n2] = E(a2[s2]++, s2));
          }
        }
        function S(t3) {
          var e3;
          for (e3 = 0; e3 < 286; e3++) t3.dyn_ltree[2 * e3] = 0;
          for (e3 = 0; e3 < 30; e3++) t3.dyn_dtree[2 * e3] = 0;
          for (e3 = 0; e3 < 19; e3++) t3.bl_tree[2 * e3] = 0;
          t3.dyn_ltree[512] = 1, t3.opt_len = t3.static_len = 0, t3.last_lit = t3.matches = 0;
        }
        function B(t3) {
          t3.bi_valid > 8 ? v(t3, t3.bi_buf) : t3.bi_valid > 0 && (t3.pending_buf[t3.pending++] = t3.bi_buf), t3.bi_buf = 0, t3.bi_valid = 0;
        }
        function $(t3, e3, r3, i3) {
          var n2 = 2 * e3, a2 = 2 * r3;
          return t3[n2] < t3[a2] || t3[n2] === t3[a2] && i3[e3] <= i3[r3];
        }
        function R(t3, e3, r3) {
          for (var i3 = t3.heap[r3], n2 = r3 << 1; n2 <= t3.heap_len && (n2 < t3.heap_len && $(e3, t3.heap[n2 + 1], t3.heap[n2], t3.depth) && n2++, !$(e3, i3, t3.heap[n2], t3.depth)); ) t3.heap[r3] = t3.heap[n2], r3 = n2, n2 <<= 1;
          t3.heap[r3] = i3;
        }
        function P(t3, e3, r3) {
          var i3, n2, s2, c2, f2 = 0;
          if (0 !== t3.last_lit) do {
            i3 = t3.pending_buf[t3.d_buf + 2 * f2] << 8 | t3.pending_buf[t3.d_buf + 2 * f2 + 1], n2 = t3.pending_buf[t3.l_buf + f2], f2++, 0 === i3 ? k(t3, n2, e3) : (k(t3, (s2 = u[n2]) + 256 + 1, e3), 0 !== (c2 = a[s2]) && x(t3, n2 -= h[s2], c2), k(t3, s2 = _(--i3), r3), 0 !== (c2 = o[s2]) && x(t3, i3 -= m[s2], c2));
          } while (f2 < t3.last_lit);
          k(t3, 256, e3);
        }
        function I(t3, e3) {
          var r3, i3, n2, a2 = e3.dyn_tree, o2 = e3.stat_desc.static_tree, s2 = e3.stat_desc.has_stree, c2 = e3.stat_desc.elems, f2 = -1;
          for (t3.heap_len = 0, t3.heap_max = 573, r3 = 0; r3 < c2; r3++) 0 !== a2[2 * r3] ? (t3.heap[++t3.heap_len] = f2 = r3, t3.depth[r3] = 0) : a2[2 * r3 + 1] = 0;
          for (; t3.heap_len < 2; ) a2[2 * (n2 = t3.heap[++t3.heap_len] = f2 < 2 ? ++f2 : 0)] = 1, t3.depth[n2] = 0, t3.opt_len--, s2 && (t3.static_len -= o2[2 * n2 + 1]);
          for (e3.max_code = f2, r3 = t3.heap_len >> 1; r3 >= 1; r3--) R(t3, a2, r3);
          n2 = c2;
          do {
            r3 = t3.heap[1], t3.heap[1] = t3.heap[t3.heap_len--], R(t3, a2, 1), i3 = t3.heap[1], t3.heap[--t3.heap_max] = r3, t3.heap[--t3.heap_max] = i3, a2[2 * n2] = a2[2 * r3] + a2[2 * i3], t3.depth[n2] = (t3.depth[r3] >= t3.depth[i3] ? t3.depth[r3] : t3.depth[i3]) + 1, a2[2 * r3 + 1] = a2[2 * i3 + 1] = n2, t3.heap[1] = n2++, R(t3, a2, 1);
          } while (t3.heap_len >= 2);
          t3.heap[--t3.heap_max] = t3.heap[1], (function(t4, e4) {
            var r4, i4, n3, a3, o3, s3, c3 = e4.dyn_tree, f3 = e4.max_code, l2 = e4.stat_desc.static_tree, d2 = e4.stat_desc.has_stree, u2 = e4.stat_desc.extra_bits, h2 = e4.stat_desc.extra_base, p2 = e4.stat_desc.max_length, g2 = 0;
            for (a3 = 0; a3 <= 15; a3++) t4.bl_count[a3] = 0;
            for (c3[2 * t4.heap[t4.heap_max] + 1] = 0, r4 = t4.heap_max + 1; r4 < 573; r4++) (a3 = c3[2 * c3[2 * (i4 = t4.heap[r4]) + 1] + 1] + 1) > p2 && (a3 = p2, g2++), c3[2 * i4 + 1] = a3, i4 > f3 || (t4.bl_count[a3]++, o3 = 0, i4 >= h2 && (o3 = u2[i4 - h2]), s3 = c3[2 * i4], t4.opt_len += s3 * (a3 + o3), d2 && (t4.static_len += s3 * (l2[2 * i4 + 1] + o3)));
            if (0 !== g2) {
              do {
                for (a3 = p2 - 1; 0 === t4.bl_count[a3]; ) a3--;
                t4.bl_count[a3]--, t4.bl_count[a3 + 1] += 2, t4.bl_count[p2]--, g2 -= 2;
              } while (g2 > 0);
              for (a3 = p2; 0 !== a3; a3--) for (i4 = t4.bl_count[a3]; 0 !== i4; ) (n3 = t4.heap[--r4]) > f3 || (c3[2 * n3 + 1] !== a3 && (t4.opt_len += (a3 - c3[2 * n3 + 1]) * c3[2 * n3], c3[2 * n3 + 1] = a3), i4--);
            }
          })(t3, e3), A(a2, f2, t3.bl_count);
        }
        function O(t3, e3, r3) {
          var i3, n2, a2 = -1, o2 = e3[1], s2 = 0, c2 = 7, f2 = 4;
          for (0 === o2 && (c2 = 138, f2 = 3), e3[2 * (r3 + 1) + 1] = 65535, i3 = 0; i3 <= r3; i3++) n2 = o2, o2 = e3[2 * (i3 + 1) + 1], ++s2 < c2 && n2 === o2 || (s2 < f2 ? t3.bl_tree[2 * n2] += s2 : 0 !== n2 ? (n2 !== a2 && t3.bl_tree[2 * n2]++, t3.bl_tree[32]++) : s2 <= 10 ? t3.bl_tree[34]++ : t3.bl_tree[36]++, s2 = 0, a2 = n2, 0 === o2 ? (c2 = 138, f2 = 3) : n2 === o2 ? (c2 = 6, f2 = 3) : (c2 = 7, f2 = 4));
        }
        function j(t3, e3, r3) {
          var i3, n2, a2 = -1, o2 = e3[1], s2 = 0, c2 = 7, f2 = 4;
          for (0 === o2 && (c2 = 138, f2 = 3), i3 = 0; i3 <= r3; i3++) if (n2 = o2, o2 = e3[2 * (i3 + 1) + 1], !(++s2 < c2 && n2 === o2)) {
            if (s2 < f2) do {
              k(t3, n2, t3.bl_tree);
            } while (0 !== --s2);
            else 0 !== n2 ? (n2 !== a2 && (k(t3, n2, t3.bl_tree), s2--), k(t3, 16, t3.bl_tree), x(t3, s2 - 3, 2)) : s2 <= 10 ? (k(t3, 17, t3.bl_tree), x(t3, s2 - 3, 3)) : (k(t3, 18, t3.bl_tree), x(t3, s2 - 11, 7));
            s2 = 0, a2 = n2, 0 === o2 ? (c2 = 138, f2 = 3) : n2 === o2 ? (c2 = 6, f2 = 3) : (c2 = 7, f2 = 4);
          }
        }
        n(m);
        var U = false;
        function T(t3, e3, r3, n2) {
          x(t3, 0 + (n2 ? 1 : 0), 3), (function(t4, e4, r4) {
            B(t4), v(t4, r4), v(t4, ~r4), i2.arraySet(t4.pending_buf, t4.window, e4, r4, t4.pending), t4.pending += r4;
          })(t3, e3, r3);
        }
        e2._tr_init = function(t3) {
          U || ((function() {
            var t4, e3, r3, i3, n2, c2 = new Array(16);
            for (r3 = 0, i3 = 0; i3 < 28; i3++) for (h[i3] = r3, t4 = 0; t4 < 1 << a[i3]; t4++) u[r3++] = i3;
            for (u[r3 - 1] = i3, n2 = 0, i3 = 0; i3 < 16; i3++) for (m[i3] = n2, t4 = 0; t4 < 1 << o[i3]; t4++) d[n2++] = i3;
            for (n2 >>= 7; i3 < 30; i3++) for (m[i3] = n2 << 7, t4 = 0; t4 < 1 << o[i3] - 7; t4++) d[256 + n2++] = i3;
            for (e3 = 0; e3 <= 15; e3++) c2[e3] = 0;
            for (t4 = 0; t4 <= 143; ) f[2 * t4 + 1] = 8, t4++, c2[8]++;
            for (; t4 <= 255; ) f[2 * t4 + 1] = 9, t4++, c2[9]++;
            for (; t4 <= 279; ) f[2 * t4 + 1] = 7, t4++, c2[7]++;
            for (; t4 <= 287; ) f[2 * t4 + 1] = 8, t4++, c2[8]++;
            for (A(f, 287, c2), t4 = 0; t4 < 30; t4++) l[2 * t4 + 1] = 5, l[2 * t4] = E(t4, 5);
            p = new y(f, a, 257, 286, 15), g = new y(l, o, 0, 30, 15), w = new y(new Array(0), s, 0, 19, 7);
          })(), U = true), t3.l_desc = new b(t3.dyn_ltree, p), t3.d_desc = new b(t3.dyn_dtree, g), t3.bl_desc = new b(t3.bl_tree, w), t3.bi_buf = 0, t3.bi_valid = 0, S(t3);
        }, e2._tr_stored_block = T, e2._tr_flush_block = function(t3, e3, r3, i3) {
          var n2, a2, o2 = 0;
          t3.level > 0 ? (2 === t3.strm.data_type && (t3.strm.data_type = (function(t4) {
            var e4, r4 = 4093624447;
            for (e4 = 0; e4 <= 31; e4++, r4 >>>= 1) if (1 & r4 && 0 !== t4.dyn_ltree[2 * e4]) return 0;
            if (0 !== t4.dyn_ltree[18] || 0 !== t4.dyn_ltree[20] || 0 !== t4.dyn_ltree[26]) return 1;
            for (e4 = 32; e4 < 256; e4++) if (0 !== t4.dyn_ltree[2 * e4]) return 1;
            return 0;
          })(t3)), I(t3, t3.l_desc), I(t3, t3.d_desc), o2 = (function(t4) {
            var e4;
            for (O(t4, t4.dyn_ltree, t4.l_desc.max_code), O(t4, t4.dyn_dtree, t4.d_desc.max_code), I(t4, t4.bl_desc), e4 = 18; e4 >= 3 && 0 === t4.bl_tree[2 * c[e4] + 1]; e4--) ;
            return t4.opt_len += 3 * (e4 + 1) + 5 + 5 + 4, e4;
          })(t3), n2 = t3.opt_len + 3 + 7 >>> 3, (a2 = t3.static_len + 3 + 7 >>> 3) <= n2 && (n2 = a2)) : n2 = a2 = r3 + 5, r3 + 4 <= n2 && -1 !== e3 ? T(t3, e3, r3, i3) : 4 === t3.strategy || a2 === n2 ? (x(t3, 2 + (i3 ? 1 : 0), 3), P(t3, f, l)) : (x(t3, 4 + (i3 ? 1 : 0), 3), (function(t4, e4, r4, i4) {
            var n3;
            for (x(t4, e4 - 257, 5), x(t4, r4 - 1, 5), x(t4, i4 - 4, 4), n3 = 0; n3 < i4; n3++) x(t4, t4.bl_tree[2 * c[n3] + 1], 3);
            j(t4, t4.dyn_ltree, e4 - 1), j(t4, t4.dyn_dtree, r4 - 1);
          })(t3, t3.l_desc.max_code + 1, t3.d_desc.max_code + 1, o2 + 1), P(t3, t3.dyn_ltree, t3.dyn_dtree)), S(t3), i3 && B(t3);
        }, e2._tr_tally = function(t3, e3, r3) {
          return t3.pending_buf[t3.d_buf + 2 * t3.last_lit] = e3 >>> 8 & 255, t3.pending_buf[t3.d_buf + 2 * t3.last_lit + 1] = 255 & e3, t3.pending_buf[t3.l_buf + t3.last_lit] = 255 & r3, t3.last_lit++, 0 === e3 ? t3.dyn_ltree[2 * r3]++ : (t3.matches++, e3--, t3.dyn_ltree[2 * (u[r3] + 256 + 1)]++, t3.dyn_dtree[2 * _(e3)]++), t3.last_lit === t3.lit_bufsize - 1;
        }, e2._tr_align = function(t3) {
          x(t3, 2, 3), k(t3, 256, f), (function(t4) {
            16 === t4.bi_valid ? (v(t4, t4.bi_buf), t4.bi_buf = 0, t4.bi_valid = 0) : t4.bi_valid >= 8 && (t4.pending_buf[t4.pending++] = 255 & t4.bi_buf, t4.bi_buf >>= 8, t4.bi_valid -= 8);
          })(t3);
        };
      }, 3737: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(6698), n = r2(392), a = r2(8188).Buffer, o = [1518500249, 1859775393, -1894007588, -899497514], s = new Array(80);
        function c() {
          this.init(), this._w = s, n.call(this, 64, 56);
        }
        function f(t3) {
          return t3 << 1 | t3 >>> 31;
        }
        function l(t3) {
          return t3 << 5 | t3 >>> 27;
        }
        function d(t3) {
          return t3 << 30 | t3 >>> 2;
        }
        function u(t3, e3, r3, i3) {
          return 0 === t3 ? e3 & r3 | ~e3 & i3 : 2 === t3 ? e3 & r3 | e3 & i3 | r3 & i3 : e3 ^ r3 ^ i3;
        }
        i2(c, n), c.prototype.init = function() {
          return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
        }, c.prototype._update = function(t3) {
          for (var e3 = this._w, r3 = 0 | this._a, i3 = 0 | this._b, n2 = 0 | this._c, a2 = 0 | this._d, s2 = 0 | this._e, c2 = 0; c2 < 16; ++c2) e3[c2] = t3.readInt32BE(4 * c2);
          for (; c2 < 80; ++c2) e3[c2] = f(e3[c2 - 3] ^ e3[c2 - 8] ^ e3[c2 - 14] ^ e3[c2 - 16]);
          for (var h = 0; h < 80; ++h) {
            var p = ~~(h / 20), g = l(r3) + u(p, i3, n2, a2) + s2 + e3[h] + o[p] | 0;
            s2 = a2, a2 = n2, n2 = d(i3), i3 = r3, r3 = g;
          }
          this._a = r3 + this._a | 0, this._b = i3 + this._b | 0, this._c = n2 + this._c | 0, this._d = a2 + this._d | 0, this._e = s2 + this._e | 0;
        }, c.prototype._hash = function() {
          var t3 = a.allocUnsafe(20);
          return t3.writeInt32BE(0 | this._a, 0), t3.writeInt32BE(0 | this._b, 4), t3.writeInt32BE(0 | this._c, 8), t3.writeInt32BE(0 | this._d, 12), t3.writeInt32BE(0 | this._e, 16), t3;
        }, t2.exports = c;
      }, 4039: (t2, e2, r2) => {
        "use strict";
        var i2 = "undefined" != typeof Symbol && Symbol, n = r2(1333);
        t2.exports = function() {
          return "function" == typeof i2 && "function" == typeof Symbol && "symbol" == typeof i2("foo") && "symbol" == typeof Symbol("bar") && n();
        };
      }, 4372: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(9675), n = r2(6556)("TypedArray.prototype.buffer", true), a = r2(5680);
        t2.exports = n || function(t3) {
          if (!a(t3)) throw new i2("Not a Typed Array");
          return t3.buffer;
        };
      }, 4442: (t2) => {
        "use strict";
        t2.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, 4459: (t2) => {
        "use strict";
        t2.exports = Number.isNaN || function(t3) {
          return t3 != t3;
        };
      }, 4634: (t2) => {
        var e2 = {}.toString;
        t2.exports = Array.isArray || function(t3) {
          return "[object Array]" == e2.call(t3);
        };
      }, 4674: (t2) => {
        "use strict";
        t2.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, 4823: (t2) => {
        "use strict";
        var e2 = (function() {
          for (var t3, e3 = [], r2 = 0; r2 < 256; r2++) {
            t3 = r2;
            for (var i2 = 0; i2 < 8; i2++) t3 = 1 & t3 ? 3988292384 ^ t3 >>> 1 : t3 >>> 1;
            e3[r2] = t3;
          }
          return e3;
        })();
        t2.exports = function(t3, r2, i2, n) {
          var a = e2, o = n + i2;
          t3 ^= -1;
          for (var s = n; s < o; s++) t3 = t3 >>> 8 ^ a[255 & (t3 ^ r2[s])];
          return -1 ^ t3;
        };
      }, 5345: (t2) => {
        "use strict";
        t2.exports = URIError;
      }, 5377: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(945).Buffer, n = r2(4634), a = r2(4372), o = ArrayBuffer.isView || function(t3) {
          try {
            return a(t3), true;
          } catch (t4) {
            return false;
          }
        }, s = "undefined" != typeof Uint8Array, c = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, f = c && (i2.prototype instanceof Uint8Array || i2.TYPED_ARRAY_SUPPORT);
        t2.exports = function(t3, e3) {
          if (t3 instanceof i2) return t3;
          if ("string" == typeof t3) return i2.from(t3, e3);
          if (c && o(t3)) {
            if (0 === t3.byteLength) return i2.alloc(0);
            if (f) {
              var r3 = i2.from(t3.buffer, t3.byteOffset, t3.byteLength);
              if (r3.byteLength === t3.byteLength) return r3;
            }
            var a2 = t3 instanceof Uint8Array ? t3 : new Uint8Array(t3.buffer, t3.byteOffset, t3.byteLength), l = i2.from(a2);
            if (l.length === t3.byteLength) return l;
          }
          if (s && t3 instanceof Uint8Array) return i2.from(t3);
          var d = n(t3);
          if (d) for (var u = 0; u < t3.length; u += 1) {
            var h = t3[u];
            if ("number" != typeof h || h < 0 || h > 255 || ~~h !== h) throw new RangeError("Array items must be numbers in the range 0-255.");
          }
          if (d || i2.isBuffer(t3) && t3.constructor && "function" == typeof t3.constructor.isBuffer && t3.constructor.isBuffer(t3)) return i2.from(t3);
          throw new TypeError('The "data" argument must be a string, an Array, a Buffer, a Uint8Array, or a DataView.');
        };
      }, 5680: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(5767);
        t2.exports = function(t3) {
          return !!i2(t3);
        };
      }, 5767: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(2682), n = r2(9209), a = r2(487), o = r2(6556), s = r2(5795), c = r2(3628), f = o("Object.prototype.toString"), l = r2(9092)(), d = "undefined" == typeof globalThis ? r2.g : globalThis, u = n(), h = o("String.prototype.slice"), p = o("Array.prototype.indexOf", true) || function(t3, e3) {
          for (var r3 = 0; r3 < t3.length; r3 += 1) if (t3[r3] === e3) return r3;
          return -1;
        }, g = { __proto__: null };
        i2(u, l && s && c ? function(t3) {
          var e3 = new d[t3]();
          if (Symbol.toStringTag in e3 && c) {
            var r3 = c(e3), i3 = s(r3, Symbol.toStringTag);
            if (!i3 && r3) {
              var n2 = c(r3);
              i3 = s(n2, Symbol.toStringTag);
            }
            g["$" + t3] = a(i3.get);
          }
        } : function(t3) {
          var e3 = new d[t3](), r3 = e3.slice || e3.set;
          r3 && (g["$" + t3] = a(r3));
        }), t2.exports = function(t3) {
          if (!t3 || "object" != typeof t3) return false;
          if (!l) {
            var e3 = h(f(t3), 8, -1);
            return p(u, e3) > -1 ? e3 : "Object" === e3 && (function(t4) {
              var e4 = false;
              return i2(g, function(r3, i3) {
                if (!e4) try {
                  r3(t4), e4 = h(i3, 1);
                } catch (t5) {
                }
              }), e4;
            })(t3);
          }
          return s ? (function(t4) {
            var e4 = false;
            return i2(g, function(r3, i3) {
              if (!e4) try {
                "$" + r3(t4) === i3 && (e4 = h(i3, 1));
              } catch (t5) {
              }
            }), e4;
          })(t3) : null;
        };
      }, 5795: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(6549);
        if (i2) try {
          i2([], "length");
        } catch (t3) {
          i2 = null;
        }
        t2.exports = i2;
      }, 5880: (t2) => {
        "use strict";
        t2.exports = Math.pow;
      }, 6188: (t2) => {
        "use strict";
        t2.exports = Math.max;
      }, 6219: (t2) => {
        "use strict";
        function e2(t3, e3, r3) {
          return e3 = e3 instanceof RegExp ? e3 : new RegExp(e3.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), t3.replace(e3, r3);
        }
        var r2 = { clean: function(t3) {
          if ("string" != typeof t3) throw new Error("Expected a string, received: " + t3);
          return t3 = e2(t3, "./", "/"), t3 = e2(t3, "..", "."), t3 = e2(t3, " ", "-"), t3 = e2(t3, /^[~^:?*\\\-]/g, ""), t3 = e2(t3, /[~^:?*\\]/g, "-"), t3 = e2(t3, /[~^:?*\\\-]$/g, ""), t3 = e2(t3, "@{", "-"), t3 = e2(t3, /\.$/g, ""), t3 = e2(t3, /\/$/g, ""), e2(t3, /\.lock$/g, "");
        } };
        t2.exports = r2;
      }, 6549: (t2) => {
        "use strict";
        t2.exports = Object.getOwnPropertyDescriptor;
      }, 6556: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(453), n = r2(3126), a = n([i2("%String.prototype.indexOf%")]);
        t2.exports = function(t3, e3) {
          var r3 = i2(t3, !!e3);
          return "function" == typeof r3 && a(t3, ".prototype.") > -1 ? n([r3]) : r3;
        };
      }, 6578: (t2) => {
        "use strict";
        t2.exports = ["Float16Array", "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array"];
      }, 6698: (t2) => {
        "function" == typeof Object.create ? t2.exports = function(t3, e2) {
          e2 && (t3.super_ = e2, t3.prototype = Object.create(e2.prototype, { constructor: { value: t3, enumerable: false, writable: true, configurable: true } }));
        } : t2.exports = function(t3, e2) {
          if (e2) {
            t3.super_ = e2;
            var r2 = function() {
            };
            r2.prototype = e2.prototype, t3.prototype = new r2(), t3.prototype.constructor = t3;
          }
        };
      }, 6743: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(9353);
        t2.exports = Function.prototype.bind || i2;
      }, 6867: (t2) => {
        "use strict";
        const e2 = (t3, e3) => function(...r2) {
          return new (0, e3.promiseModule)((i2, n) => {
            e3.multiArgs ? r2.push((...t4) => {
              e3.errorFirst ? t4[0] ? n(t4) : (t4.shift(), i2(t4)) : i2(t4);
            }) : e3.errorFirst ? r2.push((t4, e4) => {
              t4 ? n(t4) : i2(e4);
            }) : r2.push(i2), t3.apply(this, r2);
          });
        };
        t2.exports = (t3, r2) => {
          r2 = Object.assign({ exclude: [/.+(Sync|Stream)$/], errorFirst: true, promiseModule: Promise }, r2);
          const i2 = typeof t3;
          if (null === t3 || "object" !== i2 && "function" !== i2) throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${null === t3 ? "null" : i2}\``);
          const n = (t4) => {
            const e3 = (e4) => "string" == typeof e4 ? t4 === e4 : e4.test(t4);
            return r2.include ? r2.include.some(e3) : !r2.exclude.some(e3);
          };
          let a;
          a = "function" === i2 ? function(...i3) {
            return r2.excludeMain ? t3(...i3) : e2(t3, r2).apply(this, i3);
          } : Object.create(Object.getPrototypeOf(t3));
          for (const i3 in t3) {
            const o = t3[i3];
            a[i3] = "function" == typeof o && n(i3) ? e2(o, r2) : o;
          }
          return a;
        };
      }, 6895: (t2, e2, r2) => {
        var i2 = r2(3548);
        function n(t3, e3) {
          for (var r3 = [], n2 = t3.length, a = e3.length, o = (function(t4, e4) {
            var r4 = new i2(t4, e4);
            r4.compose();
            for (var n3, a2, o2 = r4.getses(), s2 = t4.length - 1, c2 = e4.length - 1, f = o2.length - 1; f >= 0; --f) o2[f].t === r4.SES_COMMON ? (a2 ? (a2.chain = { file1index: s2, file2index: c2, chain: null }, a2 = a2.chain) : a2 = n3 = { file1index: s2, file2index: c2, chain: null }, s2--, c2--) : o2[f].t === r4.SES_DELETE ? s2-- : o2[f].t === r4.SES_ADD && c2--;
            var l = { file1index: -1, file2index: -1, chain: null };
            return a2 ? (a2.chain = l, n3) : l;
          })(t3, e3); null !== o; o = o.chain) {
            var s = n2 - o.file1index - 1, c = a - o.file2index - 1;
            n2 = o.file1index, a = o.file2index, (s || c) && r3.push({ file1: [n2 + 1, s], file2: [a + 1, c] });
          }
          return r3.reverse(), r3;
        }
        t2.exports = function(t3, e3, r3) {
          var i3 = [], a = [t3, e3, r3], o = (function(t4, e4, r4) {
            var i4, a2 = n(e4, t4), o2 = n(e4, r4), s2 = [];
            function c2(t5, e5) {
              s2.push([t5.file1[0], e5, t5.file1[1], t5.file2[0], t5.file2[1]]);
            }
            for (i4 = 0; i4 < a2.length; i4++) c2(a2[i4], 0);
            for (i4 = 0; i4 < o2.length; i4++) c2(o2[i4], 2);
            s2.sort(function(t5, e5) {
              return t5[0] - e5[0];
            });
            var f2 = [], l2 = 0;
            function d2(t5) {
              t5 > l2 && (f2.push([1, l2, t5 - l2]), l2 = t5);
            }
            for (var u2 = 0; u2 < s2.length; u2++) {
              for (var h2 = u2, p = s2[u2], g = p[0], w = g + p[2]; u2 < s2.length - 1; ) {
                var m = s2[u2 + 1], y = m[0];
                if (y > w) break;
                w = Math.max(w, y + m[2]), u2++;
              }
              if (d2(g), h2 == u2) p[4] > 0 && f2.push([p[1], p[3], p[4]]);
              else {
                var b = { 0: [t4.length, -1, e4.length, -1], 2: [r4.length, -1, e4.length, -1] };
                for (i4 = h2; i4 <= u2; i4++) {
                  var _ = b[(p = s2[i4])[1]], v = p[0], x = v + p[2], k = p[3], E = k + p[4];
                  _[0] = Math.min(k, _[0]), _[1] = Math.max(E, _[1]), _[2] = Math.min(v, _[2]), _[3] = Math.max(x, _[3]);
                }
                var A = b[0][0] + (g - b[0][2]), S = b[0][1] + (w - b[0][3]), B = b[2][0] + (g - b[2][2]), $ = b[2][1] + (w - b[2][3]);
                f2.push([-1, A, S - A, g, w - g, B, $ - B]);
              }
              l2 = w;
            }
            return d2(e4.length), f2;
          })(t3, e3, r3), s = [];
          function c() {
            s.length && i3.push({ ok: s }), s = [];
          }
          function f(t4) {
            for (var e4 = 0; e4 < t4.length; e4++) s.push(t4[e4]);
          }
          function l(e4) {
            if (e4[2] != e4[6]) return true;
            for (var i4 = e4[1], n2 = e4[5], a2 = 0; a2 < e4[2]; a2++) if (t3[a2 + i4] != r3[a2 + n2]) return true;
            return false;
          }
          for (var d = 0; d < o.length; d++) {
            var u = o[d], h = u[0];
            -1 == h ? l(u) ? (c(), i3.push({ conflict: { a: t3.slice(u[1], u[1] + u[2]), aIndex: u[1], o: e3.slice(u[3], u[3] + u[4]), oIndex: u[3], b: r3.slice(u[5], u[5] + u[6]), bIndex: u[5] } })) : f(a[0].slice(u[1], u[1] + u[2])) : f(a[h].slice(u[1], u[1] + u[2]));
          }
          return c(), i3;
        };
      }, 6897: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(453), n = r2(41), a = r2(592)(), o = r2(5795), s = r2(9675), c = i2("%Math.floor%");
        t2.exports = function(t3, e3) {
          if ("function" != typeof t3) throw new s("`fn` is not a function");
          if ("number" != typeof e3 || e3 < 0 || e3 > 4294967295 || c(e3) !== e3) throw new s("`length` must be a positive 32-bit integer");
          var r3 = arguments.length > 2 && !!arguments[2], i3 = true, f = true;
          if ("length" in t3 && o) {
            var l = o(t3, "length");
            l && !l.configurable && (i3 = false), l && !l.writable && (f = false);
          }
          return (i3 || f || !r3) && (a ? n(t3, "length", e3, true, true) : n(t3, "length", e3)), t3;
        };
      }, 7083: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(1447), n = r2(9805), a = r2(1996), o = r2(9681), s = r2(4674), c = r2(4442), f = r2(7414), l = Object.prototype.toString;
        function d(t3) {
          if (!(this instanceof d)) return new d(t3);
          this.options = n.assign({ chunkSize: 16384, windowBits: 0, to: "" }, t3 || {});
          var e3 = this.options;
          e3.raw && e3.windowBits >= 0 && e3.windowBits < 16 && (e3.windowBits = -e3.windowBits, 0 === e3.windowBits && (e3.windowBits = -15)), !(e3.windowBits >= 0 && e3.windowBits < 16) || t3 && t3.windowBits || (e3.windowBits += 32), e3.windowBits > 15 && e3.windowBits < 48 && (15 & e3.windowBits || (e3.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new c(), this.strm.avail_out = 0;
          var r3 = i2.inflateInit2(this.strm, e3.windowBits);
          if (r3 !== o.Z_OK) throw new Error(s[r3]);
          if (this.header = new f(), i2.inflateGetHeader(this.strm, this.header), e3.dictionary && ("string" == typeof e3.dictionary ? e3.dictionary = a.string2buf(e3.dictionary) : "[object ArrayBuffer]" === l.call(e3.dictionary) && (e3.dictionary = new Uint8Array(e3.dictionary)), e3.raw && (r3 = i2.inflateSetDictionary(this.strm, e3.dictionary)) !== o.Z_OK)) throw new Error(s[r3]);
        }
        function u(t3, e3) {
          var r3 = new d(e3);
          if (r3.push(t3, true), r3.err) throw r3.msg || s[r3.err];
          return r3.result;
        }
        d.prototype.push = function(t3, e3) {
          var r3, s2, c2, f2, d2, u2 = this.strm, h = this.options.chunkSize, p = this.options.dictionary, g = false;
          if (this.ended) return false;
          s2 = e3 === ~~e3 ? e3 : true === e3 ? o.Z_FINISH : o.Z_NO_FLUSH, "string" == typeof t3 ? u2.input = a.binstring2buf(t3) : "[object ArrayBuffer]" === l.call(t3) ? u2.input = new Uint8Array(t3) : u2.input = t3, u2.next_in = 0, u2.avail_in = u2.input.length;
          do {
            if (0 === u2.avail_out && (u2.output = new n.Buf8(h), u2.next_out = 0, u2.avail_out = h), (r3 = i2.inflate(u2, o.Z_NO_FLUSH)) === o.Z_NEED_DICT && p && (r3 = i2.inflateSetDictionary(this.strm, p)), r3 === o.Z_BUF_ERROR && true === g && (r3 = o.Z_OK, g = false), r3 !== o.Z_STREAM_END && r3 !== o.Z_OK) return this.onEnd(r3), this.ended = true, false;
            u2.next_out && (0 !== u2.avail_out && r3 !== o.Z_STREAM_END && (0 !== u2.avail_in || s2 !== o.Z_FINISH && s2 !== o.Z_SYNC_FLUSH) || ("string" === this.options.to ? (c2 = a.utf8border(u2.output, u2.next_out), f2 = u2.next_out - c2, d2 = a.buf2string(u2.output, c2), u2.next_out = f2, u2.avail_out = h - f2, f2 && n.arraySet(u2.output, u2.output, c2, f2, 0), this.onData(d2)) : this.onData(n.shrinkBuf(u2.output, u2.next_out)))), 0 === u2.avail_in && 0 === u2.avail_out && (g = true);
          } while ((u2.avail_in > 0 || 0 === u2.avail_out) && r3 !== o.Z_STREAM_END);
          return r3 === o.Z_STREAM_END && (s2 = o.Z_FINISH), s2 === o.Z_FINISH ? (r3 = i2.inflateEnd(this.strm), this.onEnd(r3), this.ended = true, r3 === o.Z_OK) : s2 !== o.Z_SYNC_FLUSH || (this.onEnd(o.Z_OK), u2.avail_out = 0, true);
        }, d.prototype.onData = function(t3) {
          this.chunks.push(t3);
        }, d.prototype.onEnd = function(t3) {
          t3 === o.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)), this.chunks = [], this.err = t3, this.msg = this.strm.msg;
        }, e2.Inflate = d, e2.inflate = u, e2.inflateRaw = function(t3, e3) {
          return (e3 = e3 || {}).raw = true, u(t3, e3);
        }, e2.ungzip = u;
      }, 7119: (t2) => {
        "use strict";
        t2.exports = "undefined" != typeof Reflect && Reflect && Reflect.apply;
      }, 7176: (t2, e2, r2) => {
        "use strict";
        var i2, n = r2(3126), a = r2(5795);
        try {
          i2 = [].__proto__ === Array.prototype;
        } catch (t3) {
          if (!t3 || "object" != typeof t3 || !("code" in t3) || "ERR_PROTO_ACCESS" !== t3.code) throw t3;
        }
        var o = !!i2 && a && a(Object.prototype, "__proto__"), s = Object, c = s.getPrototypeOf;
        t2.exports = o && "function" == typeof o.get ? n([o.get]) : "function" == typeof c && function(t3) {
          return c(null == t3 ? t3 : s(t3));
        };
      }, 7293: (t2) => {
        "use strict";
        t2.exports = function(t3, e2) {
          var r2, i2, n, a, o, s, c, f, l, d, u, h, p, g, w, m, y, b, _, v, x, k, E, A, S;
          r2 = t3.state, i2 = t3.next_in, A = t3.input, n = i2 + (t3.avail_in - 5), a = t3.next_out, S = t3.output, o = a - (e2 - t3.avail_out), s = a + (t3.avail_out - 257), c = r2.dmax, f = r2.wsize, l = r2.whave, d = r2.wnext, u = r2.window, h = r2.hold, p = r2.bits, g = r2.lencode, w = r2.distcode, m = (1 << r2.lenbits) - 1, y = (1 << r2.distbits) - 1;
          t: do {
            p < 15 && (h += A[i2++] << p, p += 8, h += A[i2++] << p, p += 8), b = g[h & m];
            e: for (; ; ) {
              if (h >>>= _ = b >>> 24, p -= _, 0 == (_ = b >>> 16 & 255)) S[a++] = 65535 & b;
              else {
                if (!(16 & _)) {
                  if (64 & _) {
                    if (32 & _) {
                      r2.mode = 12;
                      break t;
                    }
                    t3.msg = "invalid literal/length code", r2.mode = 30;
                    break t;
                  }
                  b = g[(65535 & b) + (h & (1 << _) - 1)];
                  continue e;
                }
                for (v = 65535 & b, (_ &= 15) && (p < _ && (h += A[i2++] << p, p += 8), v += h & (1 << _) - 1, h >>>= _, p -= _), p < 15 && (h += A[i2++] << p, p += 8, h += A[i2++] << p, p += 8), b = w[h & y]; ; ) {
                  if (h >>>= _ = b >>> 24, p -= _, 16 & (_ = b >>> 16 & 255)) {
                    if (x = 65535 & b, p < (_ &= 15) && (h += A[i2++] << p, (p += 8) < _ && (h += A[i2++] << p, p += 8)), (x += h & (1 << _) - 1) > c) {
                      t3.msg = "invalid distance too far back", r2.mode = 30;
                      break t;
                    }
                    if (h >>>= _, p -= _, x > (_ = a - o)) {
                      if ((_ = x - _) > l && r2.sane) {
                        t3.msg = "invalid distance too far back", r2.mode = 30;
                        break t;
                      }
                      if (k = 0, E = u, 0 === d) {
                        if (k += f - _, _ < v) {
                          v -= _;
                          do {
                            S[a++] = u[k++];
                          } while (--_);
                          k = a - x, E = S;
                        }
                      } else if (d < _) {
                        if (k += f + d - _, (_ -= d) < v) {
                          v -= _;
                          do {
                            S[a++] = u[k++];
                          } while (--_);
                          if (k = 0, d < v) {
                            v -= _ = d;
                            do {
                              S[a++] = u[k++];
                            } while (--_);
                            k = a - x, E = S;
                          }
                        }
                      } else if (k += d - _, _ < v) {
                        v -= _;
                        do {
                          S[a++] = u[k++];
                        } while (--_);
                        k = a - x, E = S;
                      }
                      for (; v > 2; ) S[a++] = E[k++], S[a++] = E[k++], S[a++] = E[k++], v -= 3;
                      v && (S[a++] = E[k++], v > 1 && (S[a++] = E[k++]));
                    } else {
                      k = a - x;
                      do {
                        S[a++] = S[k++], S[a++] = S[k++], S[a++] = S[k++], v -= 3;
                      } while (v > 2);
                      v && (S[a++] = S[k++], v > 1 && (S[a++] = S[k++]));
                    }
                    break;
                  }
                  if (64 & _) {
                    t3.msg = "invalid distance code", r2.mode = 30;
                    break t;
                  }
                  b = w[(65535 & b) + (h & (1 << _) - 1)];
                }
              }
              break;
            }
          } while (i2 < n && a < s);
          i2 -= v = p >> 3, h &= (1 << (p -= v << 3)) - 1, t3.next_in = i2, t3.next_out = a, t3.avail_in = i2 < n ? n - i2 + 5 : 5 - (i2 - n), t3.avail_out = a < s ? s - a + 257 : 257 - (a - s), r2.hold = h, r2.bits = p;
        };
      }, 7414: (t2) => {
        "use strict";
        t2.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
        };
      }, 7526: (t2, e2) => {
        "use strict";
        e2.byteLength = function(t3) {
          var e3 = s(t3), r3 = e3[0], i3 = e3[1];
          return 3 * (r3 + i3) / 4 - i3;
        }, e2.toByteArray = function(t3) {
          var e3, r3, a2 = s(t3), o2 = a2[0], c2 = a2[1], f2 = new n((function(t4, e4, r4) {
            return 3 * (e4 + r4) / 4 - r4;
          })(0, o2, c2)), l = 0, d = c2 > 0 ? o2 - 4 : o2;
          for (r3 = 0; r3 < d; r3 += 4) e3 = i2[t3.charCodeAt(r3)] << 18 | i2[t3.charCodeAt(r3 + 1)] << 12 | i2[t3.charCodeAt(r3 + 2)] << 6 | i2[t3.charCodeAt(r3 + 3)], f2[l++] = e3 >> 16 & 255, f2[l++] = e3 >> 8 & 255, f2[l++] = 255 & e3;
          return 2 === c2 && (e3 = i2[t3.charCodeAt(r3)] << 2 | i2[t3.charCodeAt(r3 + 1)] >> 4, f2[l++] = 255 & e3), 1 === c2 && (e3 = i2[t3.charCodeAt(r3)] << 10 | i2[t3.charCodeAt(r3 + 1)] << 4 | i2[t3.charCodeAt(r3 + 2)] >> 2, f2[l++] = e3 >> 8 & 255, f2[l++] = 255 & e3), f2;
        }, e2.fromByteArray = function(t3) {
          for (var e3, i3 = t3.length, n2 = i3 % 3, a2 = [], o2 = 16383, s2 = 0, c2 = i3 - n2; s2 < c2; s2 += o2) a2.push(f(t3, s2, s2 + o2 > c2 ? c2 : s2 + o2));
          return 1 === n2 ? (e3 = t3[i3 - 1], a2.push(r2[e3 >> 2] + r2[e3 << 4 & 63] + "==")) : 2 === n2 && (e3 = (t3[i3 - 2] << 8) + t3[i3 - 1], a2.push(r2[e3 >> 10] + r2[e3 >> 4 & 63] + r2[e3 << 2 & 63] + "=")), a2.join("");
        };
        for (var r2 = [], i2 = [], n = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0; o < 64; ++o) r2[o] = a[o], i2[a.charCodeAt(o)] = o;
        function s(t3) {
          var e3 = t3.length;
          if (e3 % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
          var r3 = t3.indexOf("=");
          return -1 === r3 && (r3 = e3), [r3, r3 === e3 ? 0 : 4 - r3 % 4];
        }
        function c(t3) {
          return r2[t3 >> 18 & 63] + r2[t3 >> 12 & 63] + r2[t3 >> 6 & 63] + r2[63 & t3];
        }
        function f(t3, e3, r3) {
          for (var i3, n2 = [], a2 = e3; a2 < r3; a2 += 3) i3 = (t3[a2] << 16 & 16711680) + (t3[a2 + 1] << 8 & 65280) + (255 & t3[a2 + 2]), n2.push(c(i3));
          return n2.join("");
        }
        i2["-".charCodeAt(0)] = 62, i2["_".charCodeAt(0)] = 63;
      }, 8002: (t2) => {
        "use strict";
        t2.exports = Math.min;
      }, 8068: (t2) => {
        "use strict";
        t2.exports = SyntaxError;
      }, 8188: (t2, e2, r2) => {
        var i2 = r2(8287), n = i2.Buffer;
        function a(t3, e3) {
          for (var r3 in t3) e3[r3] = t3[r3];
        }
        function o(t3, e3, r3) {
          return n(t3, e3, r3);
        }
        n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? t2.exports = i2 : (a(i2, e2), e2.Buffer = o), o.prototype = Object.create(n.prototype), a(n, o), o.from = function(t3, e3, r3) {
          if ("number" == typeof t3) throw new TypeError("Argument must not be a number");
          return n(t3, e3, r3);
        }, o.alloc = function(t3, e3, r3) {
          if ("number" != typeof t3) throw new TypeError("Argument must be a number");
          var i3 = n(t3);
          return void 0 !== e3 ? "string" == typeof r3 ? i3.fill(e3, r3) : i3.fill(e3) : i3.fill(0), i3;
        }, o.allocUnsafe = function(t3) {
          if ("number" != typeof t3) throw new TypeError("Argument must be a number");
          return n(t3);
        }, o.allocUnsafeSlow = function(t3) {
          if ("number" != typeof t3) throw new TypeError("Argument must be a number");
          return i2.SlowBuffer(t3);
        };
      }, 8287: (t2, e2, r2) => {
        "use strict";
        const i2 = r2(7526), n = r2(251), a = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
        e2.Buffer = c, e2.SlowBuffer = function(t3) {
          return +t3 != t3 && (t3 = 0), c.alloc(+t3);
        }, e2.INSPECT_MAX_BYTES = 50;
        const o = 2147483647;
        function s(t3) {
          if (t3 > o) throw new RangeError('The value "' + t3 + '" is invalid for option "size"');
          const e3 = new Uint8Array(t3);
          return Object.setPrototypeOf(e3, c.prototype), e3;
        }
        function c(t3, e3, r3) {
          if ("number" == typeof t3) {
            if ("string" == typeof e3) throw new TypeError('The "string" argument must be of type string. Received type number');
            return d(t3);
          }
          return f(t3, e3, r3);
        }
        function f(t3, e3, r3) {
          if ("string" == typeof t3) return (function(t4, e4) {
            if ("string" == typeof e4 && "" !== e4 || (e4 = "utf8"), !c.isEncoding(e4)) throw new TypeError("Unknown encoding: " + e4);
            const r4 = 0 | g(t4, e4);
            let i4 = s(r4);
            const n3 = i4.write(t4, e4);
            return n3 !== r4 && (i4 = i4.slice(0, n3)), i4;
          })(t3, e3);
          if (ArrayBuffer.isView(t3)) return (function(t4) {
            if (V(t4, Uint8Array)) {
              const e4 = new Uint8Array(t4);
              return h(e4.buffer, e4.byteOffset, e4.byteLength);
            }
            return u(t4);
          })(t3);
          if (null == t3) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t3);
          if (V(t3, ArrayBuffer) || t3 && V(t3.buffer, ArrayBuffer)) return h(t3, e3, r3);
          if ("undefined" != typeof SharedArrayBuffer && (V(t3, SharedArrayBuffer) || t3 && V(t3.buffer, SharedArrayBuffer))) return h(t3, e3, r3);
          if ("number" == typeof t3) throw new TypeError('The "value" argument must not be of type number. Received type number');
          const i3 = t3.valueOf && t3.valueOf();
          if (null != i3 && i3 !== t3) return c.from(i3, e3, r3);
          const n2 = (function(t4) {
            if (c.isBuffer(t4)) {
              const e4 = 0 | p(t4.length), r4 = s(e4);
              return 0 === r4.length || t4.copy(r4, 0, 0, e4), r4;
            }
            return void 0 !== t4.length ? "number" != typeof t4.length || Y(t4.length) ? s(0) : u(t4) : "Buffer" === t4.type && Array.isArray(t4.data) ? u(t4.data) : void 0;
          })(t3);
          if (n2) return n2;
          if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t3[Symbol.toPrimitive]) return c.from(t3[Symbol.toPrimitive]("string"), e3, r3);
          throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t3);
        }
        function l(t3) {
          if ("number" != typeof t3) throw new TypeError('"size" argument must be of type number');
          if (t3 < 0) throw new RangeError('The value "' + t3 + '" is invalid for option "size"');
        }
        function d(t3) {
          return l(t3), s(t3 < 0 ? 0 : 0 | p(t3));
        }
        function u(t3) {
          const e3 = t3.length < 0 ? 0 : 0 | p(t3.length), r3 = s(e3);
          for (let i3 = 0; i3 < e3; i3 += 1) r3[i3] = 255 & t3[i3];
          return r3;
        }
        function h(t3, e3, r3) {
          if (e3 < 0 || t3.byteLength < e3) throw new RangeError('"offset" is outside of buffer bounds');
          if (t3.byteLength < e3 + (r3 || 0)) throw new RangeError('"length" is outside of buffer bounds');
          let i3;
          return i3 = void 0 === e3 && void 0 === r3 ? new Uint8Array(t3) : void 0 === r3 ? new Uint8Array(t3, e3) : new Uint8Array(t3, e3, r3), Object.setPrototypeOf(i3, c.prototype), i3;
        }
        function p(t3) {
          if (t3 >= o) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o.toString(16) + " bytes");
          return 0 | t3;
        }
        function g(t3, e3) {
          if (c.isBuffer(t3)) return t3.length;
          if (ArrayBuffer.isView(t3) || V(t3, ArrayBuffer)) return t3.byteLength;
          if ("string" != typeof t3) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t3);
          const r3 = t3.length, i3 = arguments.length > 2 && true === arguments[2];
          if (!i3 && 0 === r3) return 0;
          let n2 = false;
          for (; ; ) switch (e3) {
            case "ascii":
            case "latin1":
            case "binary":
              return r3;
            case "utf8":
            case "utf-8":
              return q(t3).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return 2 * r3;
            case "hex":
              return r3 >>> 1;
            case "base64":
              return Z(t3).length;
            default:
              if (n2) return i3 ? -1 : q(t3).length;
              e3 = ("" + e3).toLowerCase(), n2 = true;
          }
        }
        function w(t3, e3, r3) {
          let i3 = false;
          if ((void 0 === e3 || e3 < 0) && (e3 = 0), e3 > this.length) return "";
          if ((void 0 === r3 || r3 > this.length) && (r3 = this.length), r3 <= 0) return "";
          if ((r3 >>>= 0) <= (e3 >>>= 0)) return "";
          for (t3 || (t3 = "utf8"); ; ) switch (t3) {
            case "hex":
              return P(this, e3, r3);
            case "utf8":
            case "utf-8":
              return S(this, e3, r3);
            case "ascii":
              return $(this, e3, r3);
            case "latin1":
            case "binary":
              return R(this, e3, r3);
            case "base64":
              return A(this, e3, r3);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return I(this, e3, r3);
            default:
              if (i3) throw new TypeError("Unknown encoding: " + t3);
              t3 = (t3 + "").toLowerCase(), i3 = true;
          }
        }
        function m(t3, e3, r3) {
          const i3 = t3[e3];
          t3[e3] = t3[r3], t3[r3] = i3;
        }
        function y(t3, e3, r3, i3, n2) {
          if (0 === t3.length) return -1;
          if ("string" == typeof r3 ? (i3 = r3, r3 = 0) : r3 > 2147483647 ? r3 = 2147483647 : r3 < -2147483648 && (r3 = -2147483648), Y(r3 = +r3) && (r3 = n2 ? 0 : t3.length - 1), r3 < 0 && (r3 = t3.length + r3), r3 >= t3.length) {
            if (n2) return -1;
            r3 = t3.length - 1;
          } else if (r3 < 0) {
            if (!n2) return -1;
            r3 = 0;
          }
          if ("string" == typeof e3 && (e3 = c.from(e3, i3)), c.isBuffer(e3)) return 0 === e3.length ? -1 : b(t3, e3, r3, i3, n2);
          if ("number" == typeof e3) return e3 &= 255, "function" == typeof Uint8Array.prototype.indexOf ? n2 ? Uint8Array.prototype.indexOf.call(t3, e3, r3) : Uint8Array.prototype.lastIndexOf.call(t3, e3, r3) : b(t3, [e3], r3, i3, n2);
          throw new TypeError("val must be string, number or Buffer");
        }
        function b(t3, e3, r3, i3, n2) {
          let a2, o2 = 1, s2 = t3.length, c2 = e3.length;
          if (void 0 !== i3 && ("ucs2" === (i3 = String(i3).toLowerCase()) || "ucs-2" === i3 || "utf16le" === i3 || "utf-16le" === i3)) {
            if (t3.length < 2 || e3.length < 2) return -1;
            o2 = 2, s2 /= 2, c2 /= 2, r3 /= 2;
          }
          function f2(t4, e4) {
            return 1 === o2 ? t4[e4] : t4.readUInt16BE(e4 * o2);
          }
          if (n2) {
            let i4 = -1;
            for (a2 = r3; a2 < s2; a2++) if (f2(t3, a2) === f2(e3, -1 === i4 ? 0 : a2 - i4)) {
              if (-1 === i4 && (i4 = a2), a2 - i4 + 1 === c2) return i4 * o2;
            } else -1 !== i4 && (a2 -= a2 - i4), i4 = -1;
          } else for (r3 + c2 > s2 && (r3 = s2 - c2), a2 = r3; a2 >= 0; a2--) {
            let r4 = true;
            for (let i4 = 0; i4 < c2; i4++) if (f2(t3, a2 + i4) !== f2(e3, i4)) {
              r4 = false;
              break;
            }
            if (r4) return a2;
          }
          return -1;
        }
        function _(t3, e3, r3, i3) {
          r3 = Number(r3) || 0;
          const n2 = t3.length - r3;
          i3 ? (i3 = Number(i3)) > n2 && (i3 = n2) : i3 = n2;
          const a2 = e3.length;
          let o2;
          for (i3 > a2 / 2 && (i3 = a2 / 2), o2 = 0; o2 < i3; ++o2) {
            const i4 = parseInt(e3.substr(2 * o2, 2), 16);
            if (Y(i4)) return o2;
            t3[r3 + o2] = i4;
          }
          return o2;
        }
        function v(t3, e3, r3, i3) {
          return K(q(e3, t3.length - r3), t3, r3, i3);
        }
        function x(t3, e3, r3, i3) {
          return K((function(t4) {
            const e4 = [];
            for (let r4 = 0; r4 < t4.length; ++r4) e4.push(255 & t4.charCodeAt(r4));
            return e4;
          })(e3), t3, r3, i3);
        }
        function k(t3, e3, r3, i3) {
          return K(Z(e3), t3, r3, i3);
        }
        function E(t3, e3, r3, i3) {
          return K((function(t4, e4) {
            let r4, i4, n2;
            const a2 = [];
            for (let o2 = 0; o2 < t4.length && !((e4 -= 2) < 0); ++o2) r4 = t4.charCodeAt(o2), i4 = r4 >> 8, n2 = r4 % 256, a2.push(n2), a2.push(i4);
            return a2;
          })(e3, t3.length - r3), t3, r3, i3);
        }
        function A(t3, e3, r3) {
          return 0 === e3 && r3 === t3.length ? i2.fromByteArray(t3) : i2.fromByteArray(t3.slice(e3, r3));
        }
        function S(t3, e3, r3) {
          r3 = Math.min(t3.length, r3);
          const i3 = [];
          let n2 = e3;
          for (; n2 < r3; ) {
            const e4 = t3[n2];
            let a2 = null, o2 = e4 > 239 ? 4 : e4 > 223 ? 3 : e4 > 191 ? 2 : 1;
            if (n2 + o2 <= r3) {
              let r4, i4, s2, c2;
              switch (o2) {
                case 1:
                  e4 < 128 && (a2 = e4);
                  break;
                case 2:
                  r4 = t3[n2 + 1], 128 == (192 & r4) && (c2 = (31 & e4) << 6 | 63 & r4, c2 > 127 && (a2 = c2));
                  break;
                case 3:
                  r4 = t3[n2 + 1], i4 = t3[n2 + 2], 128 == (192 & r4) && 128 == (192 & i4) && (c2 = (15 & e4) << 12 | (63 & r4) << 6 | 63 & i4, c2 > 2047 && (c2 < 55296 || c2 > 57343) && (a2 = c2));
                  break;
                case 4:
                  r4 = t3[n2 + 1], i4 = t3[n2 + 2], s2 = t3[n2 + 3], 128 == (192 & r4) && 128 == (192 & i4) && 128 == (192 & s2) && (c2 = (15 & e4) << 18 | (63 & r4) << 12 | (63 & i4) << 6 | 63 & s2, c2 > 65535 && c2 < 1114112 && (a2 = c2));
              }
            }
            null === a2 ? (a2 = 65533, o2 = 1) : a2 > 65535 && (a2 -= 65536, i3.push(a2 >>> 10 & 1023 | 55296), a2 = 56320 | 1023 & a2), i3.push(a2), n2 += o2;
          }
          return (function(t4) {
            const e4 = t4.length;
            if (e4 <= B) return String.fromCharCode.apply(String, t4);
            let r4 = "", i4 = 0;
            for (; i4 < e4; ) r4 += String.fromCharCode.apply(String, t4.slice(i4, i4 += B));
            return r4;
          })(i3);
        }
        e2.kMaxLength = o, c.TYPED_ARRAY_SUPPORT = (function() {
          try {
            const t3 = new Uint8Array(1), e3 = { foo: function() {
              return 42;
            } };
            return Object.setPrototypeOf(e3, Uint8Array.prototype), Object.setPrototypeOf(t3, e3), 42 === t3.foo();
          } catch (t3) {
            return false;
          }
        })(), c.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(c.prototype, "parent", { enumerable: true, get: function() {
          if (c.isBuffer(this)) return this.buffer;
        } }), Object.defineProperty(c.prototype, "offset", { enumerable: true, get: function() {
          if (c.isBuffer(this)) return this.byteOffset;
        } }), c.poolSize = 8192, c.from = function(t3, e3, r3) {
          return f(t3, e3, r3);
        }, Object.setPrototypeOf(c.prototype, Uint8Array.prototype), Object.setPrototypeOf(c, Uint8Array), c.alloc = function(t3, e3, r3) {
          return (function(t4, e4, r4) {
            return l(t4), t4 <= 0 ? s(t4) : void 0 !== e4 ? "string" == typeof r4 ? s(t4).fill(e4, r4) : s(t4).fill(e4) : s(t4);
          })(t3, e3, r3);
        }, c.allocUnsafe = function(t3) {
          return d(t3);
        }, c.allocUnsafeSlow = function(t3) {
          return d(t3);
        }, c.isBuffer = function(t3) {
          return null != t3 && true === t3._isBuffer && t3 !== c.prototype;
        }, c.compare = function(t3, e3) {
          if (V(t3, Uint8Array) && (t3 = c.from(t3, t3.offset, t3.byteLength)), V(e3, Uint8Array) && (e3 = c.from(e3, e3.offset, e3.byteLength)), !c.isBuffer(t3) || !c.isBuffer(e3)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
          if (t3 === e3) return 0;
          let r3 = t3.length, i3 = e3.length;
          for (let n2 = 0, a2 = Math.min(r3, i3); n2 < a2; ++n2) if (t3[n2] !== e3[n2]) {
            r3 = t3[n2], i3 = e3[n2];
            break;
          }
          return r3 < i3 ? -1 : i3 < r3 ? 1 : 0;
        }, c.isEncoding = function(t3) {
          switch (String(t3).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return true;
            default:
              return false;
          }
        }, c.concat = function(t3, e3) {
          if (!Array.isArray(t3)) throw new TypeError('"list" argument must be an Array of Buffers');
          if (0 === t3.length) return c.alloc(0);
          let r3;
          if (void 0 === e3) for (e3 = 0, r3 = 0; r3 < t3.length; ++r3) e3 += t3[r3].length;
          const i3 = c.allocUnsafe(e3);
          let n2 = 0;
          for (r3 = 0; r3 < t3.length; ++r3) {
            let e4 = t3[r3];
            if (V(e4, Uint8Array)) n2 + e4.length > i3.length ? (c.isBuffer(e4) || (e4 = c.from(e4)), e4.copy(i3, n2)) : Uint8Array.prototype.set.call(i3, e4, n2);
            else {
              if (!c.isBuffer(e4)) throw new TypeError('"list" argument must be an Array of Buffers');
              e4.copy(i3, n2);
            }
            n2 += e4.length;
          }
          return i3;
        }, c.byteLength = g, c.prototype._isBuffer = true, c.prototype.swap16 = function() {
          const t3 = this.length;
          if (t3 % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
          for (let e3 = 0; e3 < t3; e3 += 2) m(this, e3, e3 + 1);
          return this;
        }, c.prototype.swap32 = function() {
          const t3 = this.length;
          if (t3 % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
          for (let e3 = 0; e3 < t3; e3 += 4) m(this, e3, e3 + 3), m(this, e3 + 1, e3 + 2);
          return this;
        }, c.prototype.swap64 = function() {
          const t3 = this.length;
          if (t3 % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
          for (let e3 = 0; e3 < t3; e3 += 8) m(this, e3, e3 + 7), m(this, e3 + 1, e3 + 6), m(this, e3 + 2, e3 + 5), m(this, e3 + 3, e3 + 4);
          return this;
        }, c.prototype.toString = function() {
          const t3 = this.length;
          return 0 === t3 ? "" : 0 === arguments.length ? S(this, 0, t3) : w.apply(this, arguments);
        }, c.prototype.toLocaleString = c.prototype.toString, c.prototype.equals = function(t3) {
          if (!c.isBuffer(t3)) throw new TypeError("Argument must be a Buffer");
          return this === t3 || 0 === c.compare(this, t3);
        }, c.prototype.inspect = function() {
          let t3 = "";
          const r3 = e2.INSPECT_MAX_BYTES;
          return t3 = this.toString("hex", 0, r3).replace(/(.{2})/g, "$1 ").trim(), this.length > r3 && (t3 += " ... "), "<Buffer " + t3 + ">";
        }, a && (c.prototype[a] = c.prototype.inspect), c.prototype.compare = function(t3, e3, r3, i3, n2) {
          if (V(t3, Uint8Array) && (t3 = c.from(t3, t3.offset, t3.byteLength)), !c.isBuffer(t3)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t3);
          if (void 0 === e3 && (e3 = 0), void 0 === r3 && (r3 = t3 ? t3.length : 0), void 0 === i3 && (i3 = 0), void 0 === n2 && (n2 = this.length), e3 < 0 || r3 > t3.length || i3 < 0 || n2 > this.length) throw new RangeError("out of range index");
          if (i3 >= n2 && e3 >= r3) return 0;
          if (i3 >= n2) return -1;
          if (e3 >= r3) return 1;
          if (this === t3) return 0;
          let a2 = (n2 >>>= 0) - (i3 >>>= 0), o2 = (r3 >>>= 0) - (e3 >>>= 0);
          const s2 = Math.min(a2, o2), f2 = this.slice(i3, n2), l2 = t3.slice(e3, r3);
          for (let t4 = 0; t4 < s2; ++t4) if (f2[t4] !== l2[t4]) {
            a2 = f2[t4], o2 = l2[t4];
            break;
          }
          return a2 < o2 ? -1 : o2 < a2 ? 1 : 0;
        }, c.prototype.includes = function(t3, e3, r3) {
          return -1 !== this.indexOf(t3, e3, r3);
        }, c.prototype.indexOf = function(t3, e3, r3) {
          return y(this, t3, e3, r3, true);
        }, c.prototype.lastIndexOf = function(t3, e3, r3) {
          return y(this, t3, e3, r3, false);
        }, c.prototype.write = function(t3, e3, r3, i3) {
          if (void 0 === e3) i3 = "utf8", r3 = this.length, e3 = 0;
          else if (void 0 === r3 && "string" == typeof e3) i3 = e3, r3 = this.length, e3 = 0;
          else {
            if (!isFinite(e3)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
            e3 >>>= 0, isFinite(r3) ? (r3 >>>= 0, void 0 === i3 && (i3 = "utf8")) : (i3 = r3, r3 = void 0);
          }
          const n2 = this.length - e3;
          if ((void 0 === r3 || r3 > n2) && (r3 = n2), t3.length > 0 && (r3 < 0 || e3 < 0) || e3 > this.length) throw new RangeError("Attempt to write outside buffer bounds");
          i3 || (i3 = "utf8");
          let a2 = false;
          for (; ; ) switch (i3) {
            case "hex":
              return _(this, t3, e3, r3);
            case "utf8":
            case "utf-8":
              return v(this, t3, e3, r3);
            case "ascii":
            case "latin1":
            case "binary":
              return x(this, t3, e3, r3);
            case "base64":
              return k(this, t3, e3, r3);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return E(this, t3, e3, r3);
            default:
              if (a2) throw new TypeError("Unknown encoding: " + i3);
              i3 = ("" + i3).toLowerCase(), a2 = true;
          }
        }, c.prototype.toJSON = function() {
          return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
        };
        const B = 4096;
        function $(t3, e3, r3) {
          let i3 = "";
          r3 = Math.min(t3.length, r3);
          for (let n2 = e3; n2 < r3; ++n2) i3 += String.fromCharCode(127 & t3[n2]);
          return i3;
        }
        function R(t3, e3, r3) {
          let i3 = "";
          r3 = Math.min(t3.length, r3);
          for (let n2 = e3; n2 < r3; ++n2) i3 += String.fromCharCode(t3[n2]);
          return i3;
        }
        function P(t3, e3, r3) {
          const i3 = t3.length;
          (!e3 || e3 < 0) && (e3 = 0), (!r3 || r3 < 0 || r3 > i3) && (r3 = i3);
          let n2 = "";
          for (let i4 = e3; i4 < r3; ++i4) n2 += X[t3[i4]];
          return n2;
        }
        function I(t3, e3, r3) {
          const i3 = t3.slice(e3, r3);
          let n2 = "";
          for (let t4 = 0; t4 < i3.length - 1; t4 += 2) n2 += String.fromCharCode(i3[t4] + 256 * i3[t4 + 1]);
          return n2;
        }
        function O(t3, e3, r3) {
          if (t3 % 1 != 0 || t3 < 0) throw new RangeError("offset is not uint");
          if (t3 + e3 > r3) throw new RangeError("Trying to access beyond buffer length");
        }
        function j(t3, e3, r3, i3, n2, a2) {
          if (!c.isBuffer(t3)) throw new TypeError('"buffer" argument must be a Buffer instance');
          if (e3 > n2 || e3 < a2) throw new RangeError('"value" argument is out of bounds');
          if (r3 + i3 > t3.length) throw new RangeError("Index out of range");
        }
        function U(t3, e3, r3, i3, n2) {
          L(e3, i3, n2, t3, r3, 7);
          let a2 = Number(e3 & BigInt(4294967295));
          t3[r3++] = a2, a2 >>= 8, t3[r3++] = a2, a2 >>= 8, t3[r3++] = a2, a2 >>= 8, t3[r3++] = a2;
          let o2 = Number(e3 >> BigInt(32) & BigInt(4294967295));
          return t3[r3++] = o2, o2 >>= 8, t3[r3++] = o2, o2 >>= 8, t3[r3++] = o2, o2 >>= 8, t3[r3++] = o2, r3;
        }
        function T(t3, e3, r3, i3, n2) {
          L(e3, i3, n2, t3, r3, 7);
          let a2 = Number(e3 & BigInt(4294967295));
          t3[r3 + 7] = a2, a2 >>= 8, t3[r3 + 6] = a2, a2 >>= 8, t3[r3 + 5] = a2, a2 >>= 8, t3[r3 + 4] = a2;
          let o2 = Number(e3 >> BigInt(32) & BigInt(4294967295));
          return t3[r3 + 3] = o2, o2 >>= 8, t3[r3 + 2] = o2, o2 >>= 8, t3[r3 + 1] = o2, o2 >>= 8, t3[r3] = o2, r3 + 8;
        }
        function C(t3, e3, r3, i3, n2, a2) {
          if (r3 + i3 > t3.length) throw new RangeError("Index out of range");
          if (r3 < 0) throw new RangeError("Index out of range");
        }
        function M(t3, e3, r3, i3, a2) {
          return e3 = +e3, r3 >>>= 0, a2 || C(t3, 0, r3, 4), n.write(t3, e3, r3, i3, 23, 4), r3 + 4;
        }
        function D(t3, e3, r3, i3, a2) {
          return e3 = +e3, r3 >>>= 0, a2 || C(t3, 0, r3, 8), n.write(t3, e3, r3, i3, 52, 8), r3 + 8;
        }
        c.prototype.slice = function(t3, e3) {
          const r3 = this.length;
          (t3 = ~~t3) < 0 ? (t3 += r3) < 0 && (t3 = 0) : t3 > r3 && (t3 = r3), (e3 = void 0 === e3 ? r3 : ~~e3) < 0 ? (e3 += r3) < 0 && (e3 = 0) : e3 > r3 && (e3 = r3), e3 < t3 && (e3 = t3);
          const i3 = this.subarray(t3, e3);
          return Object.setPrototypeOf(i3, c.prototype), i3;
        }, c.prototype.readUintLE = c.prototype.readUIntLE = function(t3, e3, r3) {
          t3 >>>= 0, e3 >>>= 0, r3 || O(t3, e3, this.length);
          let i3 = this[t3], n2 = 1, a2 = 0;
          for (; ++a2 < e3 && (n2 *= 256); ) i3 += this[t3 + a2] * n2;
          return i3;
        }, c.prototype.readUintBE = c.prototype.readUIntBE = function(t3, e3, r3) {
          t3 >>>= 0, e3 >>>= 0, r3 || O(t3, e3, this.length);
          let i3 = this[t3 + --e3], n2 = 1;
          for (; e3 > 0 && (n2 *= 256); ) i3 += this[t3 + --e3] * n2;
          return i3;
        }, c.prototype.readUint8 = c.prototype.readUInt8 = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 1, this.length), this[t3];
        }, c.prototype.readUint16LE = c.prototype.readUInt16LE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 2, this.length), this[t3] | this[t3 + 1] << 8;
        }, c.prototype.readUint16BE = c.prototype.readUInt16BE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 2, this.length), this[t3] << 8 | this[t3 + 1];
        }, c.prototype.readUint32LE = c.prototype.readUInt32LE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 4, this.length), (this[t3] | this[t3 + 1] << 8 | this[t3 + 2] << 16) + 16777216 * this[t3 + 3];
        }, c.prototype.readUint32BE = c.prototype.readUInt32BE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 4, this.length), 16777216 * this[t3] + (this[t3 + 1] << 16 | this[t3 + 2] << 8 | this[t3 + 3]);
        }, c.prototype.readBigUInt64LE = J(function(t3) {
          H(t3 >>>= 0, "offset");
          const e3 = this[t3], r3 = this[t3 + 7];
          void 0 !== e3 && void 0 !== r3 || G(t3, this.length - 8);
          const i3 = e3 + 256 * this[++t3] + 65536 * this[++t3] + this[++t3] * 2 ** 24, n2 = this[++t3] + 256 * this[++t3] + 65536 * this[++t3] + r3 * 2 ** 24;
          return BigInt(i3) + (BigInt(n2) << BigInt(32));
        }), c.prototype.readBigUInt64BE = J(function(t3) {
          H(t3 >>>= 0, "offset");
          const e3 = this[t3], r3 = this[t3 + 7];
          void 0 !== e3 && void 0 !== r3 || G(t3, this.length - 8);
          const i3 = e3 * 2 ** 24 + 65536 * this[++t3] + 256 * this[++t3] + this[++t3], n2 = this[++t3] * 2 ** 24 + 65536 * this[++t3] + 256 * this[++t3] + r3;
          return (BigInt(i3) << BigInt(32)) + BigInt(n2);
        }), c.prototype.readIntLE = function(t3, e3, r3) {
          t3 >>>= 0, e3 >>>= 0, r3 || O(t3, e3, this.length);
          let i3 = this[t3], n2 = 1, a2 = 0;
          for (; ++a2 < e3 && (n2 *= 256); ) i3 += this[t3 + a2] * n2;
          return n2 *= 128, i3 >= n2 && (i3 -= Math.pow(2, 8 * e3)), i3;
        }, c.prototype.readIntBE = function(t3, e3, r3) {
          t3 >>>= 0, e3 >>>= 0, r3 || O(t3, e3, this.length);
          let i3 = e3, n2 = 1, a2 = this[t3 + --i3];
          for (; i3 > 0 && (n2 *= 256); ) a2 += this[t3 + --i3] * n2;
          return n2 *= 128, a2 >= n2 && (a2 -= Math.pow(2, 8 * e3)), a2;
        }, c.prototype.readInt8 = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 1, this.length), 128 & this[t3] ? -1 * (255 - this[t3] + 1) : this[t3];
        }, c.prototype.readInt16LE = function(t3, e3) {
          t3 >>>= 0, e3 || O(t3, 2, this.length);
          const r3 = this[t3] | this[t3 + 1] << 8;
          return 32768 & r3 ? 4294901760 | r3 : r3;
        }, c.prototype.readInt16BE = function(t3, e3) {
          t3 >>>= 0, e3 || O(t3, 2, this.length);
          const r3 = this[t3 + 1] | this[t3] << 8;
          return 32768 & r3 ? 4294901760 | r3 : r3;
        }, c.prototype.readInt32LE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 4, this.length), this[t3] | this[t3 + 1] << 8 | this[t3 + 2] << 16 | this[t3 + 3] << 24;
        }, c.prototype.readInt32BE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 4, this.length), this[t3] << 24 | this[t3 + 1] << 16 | this[t3 + 2] << 8 | this[t3 + 3];
        }, c.prototype.readBigInt64LE = J(function(t3) {
          H(t3 >>>= 0, "offset");
          const e3 = this[t3], r3 = this[t3 + 7];
          void 0 !== e3 && void 0 !== r3 || G(t3, this.length - 8);
          const i3 = this[t3 + 4] + 256 * this[t3 + 5] + 65536 * this[t3 + 6] + (r3 << 24);
          return (BigInt(i3) << BigInt(32)) + BigInt(e3 + 256 * this[++t3] + 65536 * this[++t3] + this[++t3] * 2 ** 24);
        }), c.prototype.readBigInt64BE = J(function(t3) {
          H(t3 >>>= 0, "offset");
          const e3 = this[t3], r3 = this[t3 + 7];
          void 0 !== e3 && void 0 !== r3 || G(t3, this.length - 8);
          const i3 = (e3 << 24) + 65536 * this[++t3] + 256 * this[++t3] + this[++t3];
          return (BigInt(i3) << BigInt(32)) + BigInt(this[++t3] * 2 ** 24 + 65536 * this[++t3] + 256 * this[++t3] + r3);
        }), c.prototype.readFloatLE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 4, this.length), n.read(this, t3, true, 23, 4);
        }, c.prototype.readFloatBE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 4, this.length), n.read(this, t3, false, 23, 4);
        }, c.prototype.readDoubleLE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 8, this.length), n.read(this, t3, true, 52, 8);
        }, c.prototype.readDoubleBE = function(t3, e3) {
          return t3 >>>= 0, e3 || O(t3, 8, this.length), n.read(this, t3, false, 52, 8);
        }, c.prototype.writeUintLE = c.prototype.writeUIntLE = function(t3, e3, r3, i3) {
          t3 = +t3, e3 >>>= 0, r3 >>>= 0, i3 || j(this, t3, e3, r3, Math.pow(2, 8 * r3) - 1, 0);
          let n2 = 1, a2 = 0;
          for (this[e3] = 255 & t3; ++a2 < r3 && (n2 *= 256); ) this[e3 + a2] = t3 / n2 & 255;
          return e3 + r3;
        }, c.prototype.writeUintBE = c.prototype.writeUIntBE = function(t3, e3, r3, i3) {
          t3 = +t3, e3 >>>= 0, r3 >>>= 0, i3 || j(this, t3, e3, r3, Math.pow(2, 8 * r3) - 1, 0);
          let n2 = r3 - 1, a2 = 1;
          for (this[e3 + n2] = 255 & t3; --n2 >= 0 && (a2 *= 256); ) this[e3 + n2] = t3 / a2 & 255;
          return e3 + r3;
        }, c.prototype.writeUint8 = c.prototype.writeUInt8 = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 1, 255, 0), this[e3] = 255 & t3, e3 + 1;
        }, c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 2, 65535, 0), this[e3] = 255 & t3, this[e3 + 1] = t3 >>> 8, e3 + 2;
        }, c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 2, 65535, 0), this[e3] = t3 >>> 8, this[e3 + 1] = 255 & t3, e3 + 2;
        }, c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 4, 4294967295, 0), this[e3 + 3] = t3 >>> 24, this[e3 + 2] = t3 >>> 16, this[e3 + 1] = t3 >>> 8, this[e3] = 255 & t3, e3 + 4;
        }, c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 4, 4294967295, 0), this[e3] = t3 >>> 24, this[e3 + 1] = t3 >>> 16, this[e3 + 2] = t3 >>> 8, this[e3 + 3] = 255 & t3, e3 + 4;
        }, c.prototype.writeBigUInt64LE = J(function(t3, e3 = 0) {
          return U(this, t3, e3, BigInt(0), BigInt("0xffffffffffffffff"));
        }), c.prototype.writeBigUInt64BE = J(function(t3, e3 = 0) {
          return T(this, t3, e3, BigInt(0), BigInt("0xffffffffffffffff"));
        }), c.prototype.writeIntLE = function(t3, e3, r3, i3) {
          if (t3 = +t3, e3 >>>= 0, !i3) {
            const i4 = Math.pow(2, 8 * r3 - 1);
            j(this, t3, e3, r3, i4 - 1, -i4);
          }
          let n2 = 0, a2 = 1, o2 = 0;
          for (this[e3] = 255 & t3; ++n2 < r3 && (a2 *= 256); ) t3 < 0 && 0 === o2 && 0 !== this[e3 + n2 - 1] && (o2 = 1), this[e3 + n2] = (t3 / a2 | 0) - o2 & 255;
          return e3 + r3;
        }, c.prototype.writeIntBE = function(t3, e3, r3, i3) {
          if (t3 = +t3, e3 >>>= 0, !i3) {
            const i4 = Math.pow(2, 8 * r3 - 1);
            j(this, t3, e3, r3, i4 - 1, -i4);
          }
          let n2 = r3 - 1, a2 = 1, o2 = 0;
          for (this[e3 + n2] = 255 & t3; --n2 >= 0 && (a2 *= 256); ) t3 < 0 && 0 === o2 && 0 !== this[e3 + n2 + 1] && (o2 = 1), this[e3 + n2] = (t3 / a2 | 0) - o2 & 255;
          return e3 + r3;
        }, c.prototype.writeInt8 = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 1, 127, -128), t3 < 0 && (t3 = 255 + t3 + 1), this[e3] = 255 & t3, e3 + 1;
        }, c.prototype.writeInt16LE = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 2, 32767, -32768), this[e3] = 255 & t3, this[e3 + 1] = t3 >>> 8, e3 + 2;
        }, c.prototype.writeInt16BE = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 2, 32767, -32768), this[e3] = t3 >>> 8, this[e3 + 1] = 255 & t3, e3 + 2;
        }, c.prototype.writeInt32LE = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 4, 2147483647, -2147483648), this[e3] = 255 & t3, this[e3 + 1] = t3 >>> 8, this[e3 + 2] = t3 >>> 16, this[e3 + 3] = t3 >>> 24, e3 + 4;
        }, c.prototype.writeInt32BE = function(t3, e3, r3) {
          return t3 = +t3, e3 >>>= 0, r3 || j(this, t3, e3, 4, 2147483647, -2147483648), t3 < 0 && (t3 = 4294967295 + t3 + 1), this[e3] = t3 >>> 24, this[e3 + 1] = t3 >>> 16, this[e3 + 2] = t3 >>> 8, this[e3 + 3] = 255 & t3, e3 + 4;
        }, c.prototype.writeBigInt64LE = J(function(t3, e3 = 0) {
          return U(this, t3, e3, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
        }), c.prototype.writeBigInt64BE = J(function(t3, e3 = 0) {
          return T(this, t3, e3, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
        }), c.prototype.writeFloatLE = function(t3, e3, r3) {
          return M(this, t3, e3, true, r3);
        }, c.prototype.writeFloatBE = function(t3, e3, r3) {
          return M(this, t3, e3, false, r3);
        }, c.prototype.writeDoubleLE = function(t3, e3, r3) {
          return D(this, t3, e3, true, r3);
        }, c.prototype.writeDoubleBE = function(t3, e3, r3) {
          return D(this, t3, e3, false, r3);
        }, c.prototype.copy = function(t3, e3, r3, i3) {
          if (!c.isBuffer(t3)) throw new TypeError("argument should be a Buffer");
          if (r3 || (r3 = 0), i3 || 0 === i3 || (i3 = this.length), e3 >= t3.length && (e3 = t3.length), e3 || (e3 = 0), i3 > 0 && i3 < r3 && (i3 = r3), i3 === r3) return 0;
          if (0 === t3.length || 0 === this.length) return 0;
          if (e3 < 0) throw new RangeError("targetStart out of bounds");
          if (r3 < 0 || r3 >= this.length) throw new RangeError("Index out of range");
          if (i3 < 0) throw new RangeError("sourceEnd out of bounds");
          i3 > this.length && (i3 = this.length), t3.length - e3 < i3 - r3 && (i3 = t3.length - e3 + r3);
          const n2 = i3 - r3;
          return this === t3 && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(e3, r3, i3) : Uint8Array.prototype.set.call(t3, this.subarray(r3, i3), e3), n2;
        }, c.prototype.fill = function(t3, e3, r3, i3) {
          if ("string" == typeof t3) {
            if ("string" == typeof e3 ? (i3 = e3, e3 = 0, r3 = this.length) : "string" == typeof r3 && (i3 = r3, r3 = this.length), void 0 !== i3 && "string" != typeof i3) throw new TypeError("encoding must be a string");
            if ("string" == typeof i3 && !c.isEncoding(i3)) throw new TypeError("Unknown encoding: " + i3);
            if (1 === t3.length) {
              const e4 = t3.charCodeAt(0);
              ("utf8" === i3 && e4 < 128 || "latin1" === i3) && (t3 = e4);
            }
          } else "number" == typeof t3 ? t3 &= 255 : "boolean" == typeof t3 && (t3 = Number(t3));
          if (e3 < 0 || this.length < e3 || this.length < r3) throw new RangeError("Out of range index");
          if (r3 <= e3) return this;
          let n2;
          if (e3 >>>= 0, r3 = void 0 === r3 ? this.length : r3 >>> 0, t3 || (t3 = 0), "number" == typeof t3) for (n2 = e3; n2 < r3; ++n2) this[n2] = t3;
          else {
            const a2 = c.isBuffer(t3) ? t3 : c.from(t3, i3), o2 = a2.length;
            if (0 === o2) throw new TypeError('The value "' + t3 + '" is invalid for argument "value"');
            for (n2 = 0; n2 < r3 - e3; ++n2) this[n2 + e3] = a2[n2 % o2];
          }
          return this;
        };
        const N = {};
        function z(t3, e3, r3) {
          N[t3] = class extends r3 {
            constructor() {
              super(), Object.defineProperty(this, "message", { value: e3.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${t3}]`, this.stack, delete this.name;
            }
            get code() {
              return t3;
            }
            set code(t4) {
              Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: t4, writable: true });
            }
            toString() {
              return `${this.name} [${t3}]: ${this.message}`;
            }
          };
        }
        function F(t3) {
          let e3 = "", r3 = t3.length;
          const i3 = "-" === t3[0] ? 1 : 0;
          for (; r3 >= i3 + 4; r3 -= 3) e3 = `_${t3.slice(r3 - 3, r3)}${e3}`;
          return `${t3.slice(0, r3)}${e3}`;
        }
        function L(t3, e3, r3, i3, n2, a2) {
          if (t3 > r3 || t3 < e3) {
            const i4 = "bigint" == typeof e3 ? "n" : "";
            let n3;
            throw n3 = a2 > 3 ? 0 === e3 || e3 === BigInt(0) ? `>= 0${i4} and < 2${i4} ** ${8 * (a2 + 1)}${i4}` : `>= -(2${i4} ** ${8 * (a2 + 1) - 1}${i4}) and < 2 ** ${8 * (a2 + 1) - 1}${i4}` : `>= ${e3}${i4} and <= ${r3}${i4}`, new N.ERR_OUT_OF_RANGE("value", n3, t3);
          }
          !(function(t4, e4, r4) {
            H(e4, "offset"), void 0 !== t4[e4] && void 0 !== t4[e4 + r4] || G(e4, t4.length - (r4 + 1));
          })(i3, n2, a2);
        }
        function H(t3, e3) {
          if ("number" != typeof t3) throw new N.ERR_INVALID_ARG_TYPE(e3, "number", t3);
        }
        function G(t3, e3, r3) {
          if (Math.floor(t3) !== t3) throw H(t3, r3), new N.ERR_OUT_OF_RANGE(r3 || "offset", "an integer", t3);
          if (e3 < 0) throw new N.ERR_BUFFER_OUT_OF_BOUNDS();
          throw new N.ERR_OUT_OF_RANGE(r3 || "offset", `>= ${r3 ? 1 : 0} and <= ${e3}`, t3);
        }
        z("ERR_BUFFER_OUT_OF_BOUNDS", function(t3) {
          return t3 ? `${t3} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
        }, RangeError), z("ERR_INVALID_ARG_TYPE", function(t3, e3) {
          return `The "${t3}" argument must be of type number. Received type ${typeof e3}`;
        }, TypeError), z("ERR_OUT_OF_RANGE", function(t3, e3, r3) {
          let i3 = `The value of "${t3}" is out of range.`, n2 = r3;
          return Number.isInteger(r3) && Math.abs(r3) > 2 ** 32 ? n2 = F(String(r3)) : "bigint" == typeof r3 && (n2 = String(r3), (r3 > BigInt(2) ** BigInt(32) || r3 < -(BigInt(2) ** BigInt(32))) && (n2 = F(n2)), n2 += "n"), i3 += ` It must be ${e3}. Received ${n2}`, i3;
        }, RangeError);
        const W = /[^+/0-9A-Za-z-_]/g;
        function q(t3, e3) {
          let r3;
          e3 = e3 || 1 / 0;
          const i3 = t3.length;
          let n2 = null;
          const a2 = [];
          for (let o2 = 0; o2 < i3; ++o2) {
            if (r3 = t3.charCodeAt(o2), r3 > 55295 && r3 < 57344) {
              if (!n2) {
                if (r3 > 56319) {
                  (e3 -= 3) > -1 && a2.push(239, 191, 189);
                  continue;
                }
                if (o2 + 1 === i3) {
                  (e3 -= 3) > -1 && a2.push(239, 191, 189);
                  continue;
                }
                n2 = r3;
                continue;
              }
              if (r3 < 56320) {
                (e3 -= 3) > -1 && a2.push(239, 191, 189), n2 = r3;
                continue;
              }
              r3 = 65536 + (n2 - 55296 << 10 | r3 - 56320);
            } else n2 && (e3 -= 3) > -1 && a2.push(239, 191, 189);
            if (n2 = null, r3 < 128) {
              if ((e3 -= 1) < 0) break;
              a2.push(r3);
            } else if (r3 < 2048) {
              if ((e3 -= 2) < 0) break;
              a2.push(r3 >> 6 | 192, 63 & r3 | 128);
            } else if (r3 < 65536) {
              if ((e3 -= 3) < 0) break;
              a2.push(r3 >> 12 | 224, r3 >> 6 & 63 | 128, 63 & r3 | 128);
            } else {
              if (!(r3 < 1114112)) throw new Error("Invalid code point");
              if ((e3 -= 4) < 0) break;
              a2.push(r3 >> 18 | 240, r3 >> 12 & 63 | 128, r3 >> 6 & 63 | 128, 63 & r3 | 128);
            }
          }
          return a2;
        }
        function Z(t3) {
          return i2.toByteArray((function(t4) {
            if ((t4 = (t4 = t4.split("=")[0]).trim().replace(W, "")).length < 2) return "";
            for (; t4.length % 4 != 0; ) t4 += "=";
            return t4;
          })(t3));
        }
        function K(t3, e3, r3, i3) {
          let n2;
          for (n2 = 0; n2 < i3 && !(n2 + r3 >= e3.length || n2 >= t3.length); ++n2) e3[n2 + r3] = t3[n2];
          return n2;
        }
        function V(t3, e3) {
          return t3 instanceof e3 || null != t3 && null != t3.constructor && null != t3.constructor.name && t3.constructor.name === e3.name;
        }
        function Y(t3) {
          return t3 != t3;
        }
        const X = (function() {
          const t3 = "0123456789abcdef", e3 = new Array(256);
          for (let r3 = 0; r3 < 16; ++r3) {
            const i3 = 16 * r3;
            for (let n2 = 0; n2 < 16; ++n2) e3[i3 + n2] = t3[r3] + t3[n2];
          }
          return e3;
        })();
        function J(t3) {
          return "undefined" == typeof BigInt ? Q : t3;
        }
        function Q() {
          throw new Error("BigInt not supported");
        }
      }, 8411: (t2, e2, r2) => {
        "use strict";
        var i2, n = r2(9805), a = r2(3665), o = r2(3269), s = r2(4823), c = r2(4674), f = -2, l = 258, d = 262, u = 103, h = 113, p = 666;
        function g(t3, e3) {
          return t3.msg = c[e3], e3;
        }
        function w(t3) {
          return (t3 << 1) - (t3 > 4 ? 9 : 0);
        }
        function m(t3) {
          for (var e3 = t3.length; --e3 >= 0; ) t3[e3] = 0;
        }
        function y(t3) {
          var e3 = t3.state, r3 = e3.pending;
          r3 > t3.avail_out && (r3 = t3.avail_out), 0 !== r3 && (n.arraySet(t3.output, e3.pending_buf, e3.pending_out, r3, t3.next_out), t3.next_out += r3, e3.pending_out += r3, t3.total_out += r3, t3.avail_out -= r3, e3.pending -= r3, 0 === e3.pending && (e3.pending_out = 0));
        }
        function b(t3, e3) {
          a._tr_flush_block(t3, t3.block_start >= 0 ? t3.block_start : -1, t3.strstart - t3.block_start, e3), t3.block_start = t3.strstart, y(t3.strm);
        }
        function _(t3, e3) {
          t3.pending_buf[t3.pending++] = e3;
        }
        function v(t3, e3) {
          t3.pending_buf[t3.pending++] = e3 >>> 8 & 255, t3.pending_buf[t3.pending++] = 255 & e3;
        }
        function x(t3, e3, r3, i3) {
          var a2 = t3.avail_in;
          return a2 > i3 && (a2 = i3), 0 === a2 ? 0 : (t3.avail_in -= a2, n.arraySet(e3, t3.input, t3.next_in, a2, r3), 1 === t3.state.wrap ? t3.adler = o(t3.adler, e3, a2, r3) : 2 === t3.state.wrap && (t3.adler = s(t3.adler, e3, a2, r3)), t3.next_in += a2, t3.total_in += a2, a2);
        }
        function k(t3, e3) {
          var r3, i3, n2 = t3.max_chain_length, a2 = t3.strstart, o2 = t3.prev_length, s2 = t3.nice_match, c2 = t3.strstart > t3.w_size - d ? t3.strstart - (t3.w_size - d) : 0, f2 = t3.window, u2 = t3.w_mask, h2 = t3.prev, p2 = t3.strstart + l, g2 = f2[a2 + o2 - 1], w2 = f2[a2 + o2];
          t3.prev_length >= t3.good_match && (n2 >>= 2), s2 > t3.lookahead && (s2 = t3.lookahead);
          do {
            if (f2[(r3 = e3) + o2] === w2 && f2[r3 + o2 - 1] === g2 && f2[r3] === f2[a2] && f2[++r3] === f2[a2 + 1]) {
              a2 += 2, r3++;
              do {
              } while (f2[++a2] === f2[++r3] && f2[++a2] === f2[++r3] && f2[++a2] === f2[++r3] && f2[++a2] === f2[++r3] && f2[++a2] === f2[++r3] && f2[++a2] === f2[++r3] && f2[++a2] === f2[++r3] && f2[++a2] === f2[++r3] && a2 < p2);
              if (i3 = l - (p2 - a2), a2 = p2 - l, i3 > o2) {
                if (t3.match_start = e3, o2 = i3, i3 >= s2) break;
                g2 = f2[a2 + o2 - 1], w2 = f2[a2 + o2];
              }
            }
          } while ((e3 = h2[e3 & u2]) > c2 && 0 !== --n2);
          return o2 <= t3.lookahead ? o2 : t3.lookahead;
        }
        function E(t3) {
          var e3, r3, i3, a2, o2, s2 = t3.w_size;
          do {
            if (a2 = t3.window_size - t3.lookahead - t3.strstart, t3.strstart >= s2 + (s2 - d)) {
              n.arraySet(t3.window, t3.window, s2, s2, 0), t3.match_start -= s2, t3.strstart -= s2, t3.block_start -= s2, e3 = r3 = t3.hash_size;
              do {
                i3 = t3.head[--e3], t3.head[e3] = i3 >= s2 ? i3 - s2 : 0;
              } while (--r3);
              e3 = r3 = s2;
              do {
                i3 = t3.prev[--e3], t3.prev[e3] = i3 >= s2 ? i3 - s2 : 0;
              } while (--r3);
              a2 += s2;
            }
            if (0 === t3.strm.avail_in) break;
            if (r3 = x(t3.strm, t3.window, t3.strstart + t3.lookahead, a2), t3.lookahead += r3, t3.lookahead + t3.insert >= 3) for (o2 = t3.strstart - t3.insert, t3.ins_h = t3.window[o2], t3.ins_h = (t3.ins_h << t3.hash_shift ^ t3.window[o2 + 1]) & t3.hash_mask; t3.insert && (t3.ins_h = (t3.ins_h << t3.hash_shift ^ t3.window[o2 + 3 - 1]) & t3.hash_mask, t3.prev[o2 & t3.w_mask] = t3.head[t3.ins_h], t3.head[t3.ins_h] = o2, o2++, t3.insert--, !(t3.lookahead + t3.insert < 3)); ) ;
          } while (t3.lookahead < d && 0 !== t3.strm.avail_in);
        }
        function A(t3, e3) {
          for (var r3, i3; ; ) {
            if (t3.lookahead < d) {
              if (E(t3), t3.lookahead < d && 0 === e3) return 1;
              if (0 === t3.lookahead) break;
            }
            if (r3 = 0, t3.lookahead >= 3 && (t3.ins_h = (t3.ins_h << t3.hash_shift ^ t3.window[t3.strstart + 3 - 1]) & t3.hash_mask, r3 = t3.prev[t3.strstart & t3.w_mask] = t3.head[t3.ins_h], t3.head[t3.ins_h] = t3.strstart), 0 !== r3 && t3.strstart - r3 <= t3.w_size - d && (t3.match_length = k(t3, r3)), t3.match_length >= 3) if (i3 = a._tr_tally(t3, t3.strstart - t3.match_start, t3.match_length - 3), t3.lookahead -= t3.match_length, t3.match_length <= t3.max_lazy_match && t3.lookahead >= 3) {
              t3.match_length--;
              do {
                t3.strstart++, t3.ins_h = (t3.ins_h << t3.hash_shift ^ t3.window[t3.strstart + 3 - 1]) & t3.hash_mask, r3 = t3.prev[t3.strstart & t3.w_mask] = t3.head[t3.ins_h], t3.head[t3.ins_h] = t3.strstart;
              } while (0 !== --t3.match_length);
              t3.strstart++;
            } else t3.strstart += t3.match_length, t3.match_length = 0, t3.ins_h = t3.window[t3.strstart], t3.ins_h = (t3.ins_h << t3.hash_shift ^ t3.window[t3.strstart + 1]) & t3.hash_mask;
            else i3 = a._tr_tally(t3, 0, t3.window[t3.strstart]), t3.lookahead--, t3.strstart++;
            if (i3 && (b(t3, false), 0 === t3.strm.avail_out)) return 1;
          }
          return t3.insert = t3.strstart < 2 ? t3.strstart : 2, 4 === e3 ? (b(t3, true), 0 === t3.strm.avail_out ? 3 : 4) : t3.last_lit && (b(t3, false), 0 === t3.strm.avail_out) ? 1 : 2;
        }
        function S(t3, e3) {
          for (var r3, i3, n2; ; ) {
            if (t3.lookahead < d) {
              if (E(t3), t3.lookahead < d && 0 === e3) return 1;
              if (0 === t3.lookahead) break;
            }
            if (r3 = 0, t3.lookahead >= 3 && (t3.ins_h = (t3.ins_h << t3.hash_shift ^ t3.window[t3.strstart + 3 - 1]) & t3.hash_mask, r3 = t3.prev[t3.strstart & t3.w_mask] = t3.head[t3.ins_h], t3.head[t3.ins_h] = t3.strstart), t3.prev_length = t3.match_length, t3.prev_match = t3.match_start, t3.match_length = 2, 0 !== r3 && t3.prev_length < t3.max_lazy_match && t3.strstart - r3 <= t3.w_size - d && (t3.match_length = k(t3, r3), t3.match_length <= 5 && (1 === t3.strategy || 3 === t3.match_length && t3.strstart - t3.match_start > 4096) && (t3.match_length = 2)), t3.prev_length >= 3 && t3.match_length <= t3.prev_length) {
              n2 = t3.strstart + t3.lookahead - 3, i3 = a._tr_tally(t3, t3.strstart - 1 - t3.prev_match, t3.prev_length - 3), t3.lookahead -= t3.prev_length - 1, t3.prev_length -= 2;
              do {
                ++t3.strstart <= n2 && (t3.ins_h = (t3.ins_h << t3.hash_shift ^ t3.window[t3.strstart + 3 - 1]) & t3.hash_mask, r3 = t3.prev[t3.strstart & t3.w_mask] = t3.head[t3.ins_h], t3.head[t3.ins_h] = t3.strstart);
              } while (0 !== --t3.prev_length);
              if (t3.match_available = 0, t3.match_length = 2, t3.strstart++, i3 && (b(t3, false), 0 === t3.strm.avail_out)) return 1;
            } else if (t3.match_available) {
              if ((i3 = a._tr_tally(t3, 0, t3.window[t3.strstart - 1])) && b(t3, false), t3.strstart++, t3.lookahead--, 0 === t3.strm.avail_out) return 1;
            } else t3.match_available = 1, t3.strstart++, t3.lookahead--;
          }
          return t3.match_available && (i3 = a._tr_tally(t3, 0, t3.window[t3.strstart - 1]), t3.match_available = 0), t3.insert = t3.strstart < 2 ? t3.strstart : 2, 4 === e3 ? (b(t3, true), 0 === t3.strm.avail_out ? 3 : 4) : t3.last_lit && (b(t3, false), 0 === t3.strm.avail_out) ? 1 : 2;
        }
        function B(t3, e3, r3, i3, n2) {
          this.good_length = t3, this.max_lazy = e3, this.nice_length = r3, this.max_chain = i3, this.func = n2;
        }
        function $() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = 8, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new n.Buf16(1146), this.dyn_dtree = new n.Buf16(122), this.bl_tree = new n.Buf16(78), m(this.dyn_ltree), m(this.dyn_dtree), m(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new n.Buf16(16), this.heap = new n.Buf16(573), m(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new n.Buf16(573), m(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function R(t3) {
          var e3;
          return t3 && t3.state ? (t3.total_in = t3.total_out = 0, t3.data_type = 2, (e3 = t3.state).pending = 0, e3.pending_out = 0, e3.wrap < 0 && (e3.wrap = -e3.wrap), e3.status = e3.wrap ? 42 : h, t3.adler = 2 === e3.wrap ? 0 : 1, e3.last_flush = 0, a._tr_init(e3), 0) : g(t3, f);
        }
        function P(t3) {
          var e3, r3 = R(t3);
          return 0 === r3 && ((e3 = t3.state).window_size = 2 * e3.w_size, m(e3.head), e3.max_lazy_match = i2[e3.level].max_lazy, e3.good_match = i2[e3.level].good_length, e3.nice_match = i2[e3.level].nice_length, e3.max_chain_length = i2[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = 2, e3.match_available = 0, e3.ins_h = 0), r3;
        }
        function I(t3, e3, r3, i3, a2, o2) {
          if (!t3) return f;
          var s2 = 1;
          if (-1 === e3 && (e3 = 6), i3 < 0 ? (s2 = 0, i3 = -i3) : i3 > 15 && (s2 = 2, i3 -= 16), a2 < 1 || a2 > 9 || 8 !== r3 || i3 < 8 || i3 > 15 || e3 < 0 || e3 > 9 || o2 < 0 || o2 > 4) return g(t3, f);
          8 === i3 && (i3 = 9);
          var c2 = new $();
          return t3.state = c2, c2.strm = t3, c2.wrap = s2, c2.gzhead = null, c2.w_bits = i3, c2.w_size = 1 << c2.w_bits, c2.w_mask = c2.w_size - 1, c2.hash_bits = a2 + 7, c2.hash_size = 1 << c2.hash_bits, c2.hash_mask = c2.hash_size - 1, c2.hash_shift = ~~((c2.hash_bits + 3 - 1) / 3), c2.window = new n.Buf8(2 * c2.w_size), c2.head = new n.Buf16(c2.hash_size), c2.prev = new n.Buf16(c2.w_size), c2.lit_bufsize = 1 << a2 + 6, c2.pending_buf_size = 4 * c2.lit_bufsize, c2.pending_buf = new n.Buf8(c2.pending_buf_size), c2.d_buf = 1 * c2.lit_bufsize, c2.l_buf = 3 * c2.lit_bufsize, c2.level = e3, c2.strategy = o2, c2.method = r3, P(t3);
        }
        i2 = [new B(0, 0, 0, 0, function(t3, e3) {
          var r3 = 65535;
          for (r3 > t3.pending_buf_size - 5 && (r3 = t3.pending_buf_size - 5); ; ) {
            if (t3.lookahead <= 1) {
              if (E(t3), 0 === t3.lookahead && 0 === e3) return 1;
              if (0 === t3.lookahead) break;
            }
            t3.strstart += t3.lookahead, t3.lookahead = 0;
            var i3 = t3.block_start + r3;
            if ((0 === t3.strstart || t3.strstart >= i3) && (t3.lookahead = t3.strstart - i3, t3.strstart = i3, b(t3, false), 0 === t3.strm.avail_out)) return 1;
            if (t3.strstart - t3.block_start >= t3.w_size - d && (b(t3, false), 0 === t3.strm.avail_out)) return 1;
          }
          return t3.insert = 0, 4 === e3 ? (b(t3, true), 0 === t3.strm.avail_out ? 3 : 4) : (t3.strstart > t3.block_start && (b(t3, false), t3.strm.avail_out), 1);
        }), new B(4, 4, 8, 4, A), new B(4, 5, 16, 8, A), new B(4, 6, 32, 32, A), new B(4, 4, 16, 16, S), new B(8, 16, 32, 32, S), new B(8, 16, 128, 128, S), new B(8, 32, 128, 256, S), new B(32, 128, 258, 1024, S), new B(32, 258, 258, 4096, S)], e2.deflateInit = function(t3, e3) {
          return I(t3, e3, 8, 15, 8, 0);
        }, e2.deflateInit2 = I, e2.deflateReset = P, e2.deflateResetKeep = R, e2.deflateSetHeader = function(t3, e3) {
          return t3 && t3.state ? 2 !== t3.state.wrap ? f : (t3.state.gzhead = e3, 0) : f;
        }, e2.deflate = function(t3, e3) {
          var r3, n2, o2, c2;
          if (!t3 || !t3.state || e3 > 5 || e3 < 0) return t3 ? g(t3, f) : f;
          if (n2 = t3.state, !t3.output || !t3.input && 0 !== t3.avail_in || n2.status === p && 4 !== e3) return g(t3, 0 === t3.avail_out ? -5 : f);
          if (n2.strm = t3, r3 = n2.last_flush, n2.last_flush = e3, 42 === n2.status) if (2 === n2.wrap) t3.adler = 0, _(n2, 31), _(n2, 139), _(n2, 8), n2.gzhead ? (_(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), _(n2, 255 & n2.gzhead.time), _(n2, n2.gzhead.time >> 8 & 255), _(n2, n2.gzhead.time >> 16 & 255), _(n2, n2.gzhead.time >> 24 & 255), _(n2, 9 === n2.level ? 2 : n2.strategy >= 2 || n2.level < 2 ? 4 : 0), _(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (_(n2, 255 & n2.gzhead.extra.length), _(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (t3.adler = s(t3.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (_(n2, 0), _(n2, 0), _(n2, 0), _(n2, 0), _(n2, 0), _(n2, 9 === n2.level ? 2 : n2.strategy >= 2 || n2.level < 2 ? 4 : 0), _(n2, 3), n2.status = h);
          else {
            var d2 = 8 + (n2.w_bits - 8 << 4) << 8;
            d2 |= (n2.strategy >= 2 || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (d2 |= 32), d2 += 31 - d2 % 31, n2.status = h, v(n2, d2), 0 !== n2.strstart && (v(n2, t3.adler >>> 16), v(n2, 65535 & t3.adler)), t3.adler = 1;
          }
          if (69 === n2.status) if (n2.gzhead.extra) {
            for (o2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > o2 && (t3.adler = s(t3.adler, n2.pending_buf, n2.pending - o2, o2)), y(t3), o2 = n2.pending, n2.pending !== n2.pending_buf_size)); ) _(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
            n2.gzhead.hcrc && n2.pending > o2 && (t3.adler = s(t3.adler, n2.pending_buf, n2.pending - o2, o2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
          } else n2.status = 73;
          if (73 === n2.status) if (n2.gzhead.name) {
            o2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > o2 && (t3.adler = s(t3.adler, n2.pending_buf, n2.pending - o2, o2)), y(t3), o2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                c2 = 1;
                break;
              }
              c2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, _(n2, c2);
            } while (0 !== c2);
            n2.gzhead.hcrc && n2.pending > o2 && (t3.adler = s(t3.adler, n2.pending_buf, n2.pending - o2, o2)), 0 === c2 && (n2.gzindex = 0, n2.status = 91);
          } else n2.status = 91;
          if (91 === n2.status) if (n2.gzhead.comment) {
            o2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > o2 && (t3.adler = s(t3.adler, n2.pending_buf, n2.pending - o2, o2)), y(t3), o2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                c2 = 1;
                break;
              }
              c2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, _(n2, c2);
            } while (0 !== c2);
            n2.gzhead.hcrc && n2.pending > o2 && (t3.adler = s(t3.adler, n2.pending_buf, n2.pending - o2, o2)), 0 === c2 && (n2.status = u);
          } else n2.status = u;
          if (n2.status === u && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && y(t3), n2.pending + 2 <= n2.pending_buf_size && (_(n2, 255 & t3.adler), _(n2, t3.adler >> 8 & 255), t3.adler = 0, n2.status = h)) : n2.status = h), 0 !== n2.pending) {
            if (y(t3), 0 === t3.avail_out) return n2.last_flush = -1, 0;
          } else if (0 === t3.avail_in && w(e3) <= w(r3) && 4 !== e3) return g(t3, -5);
          if (n2.status === p && 0 !== t3.avail_in) return g(t3, -5);
          if (0 !== t3.avail_in || 0 !== n2.lookahead || 0 !== e3 && n2.status !== p) {
            var x2 = 2 === n2.strategy ? (function(t4, e4) {
              for (var r4; ; ) {
                if (0 === t4.lookahead && (E(t4), 0 === t4.lookahead)) {
                  if (0 === e4) return 1;
                  break;
                }
                if (t4.match_length = 0, r4 = a._tr_tally(t4, 0, t4.window[t4.strstart]), t4.lookahead--, t4.strstart++, r4 && (b(t4, false), 0 === t4.strm.avail_out)) return 1;
              }
              return t4.insert = 0, 4 === e4 ? (b(t4, true), 0 === t4.strm.avail_out ? 3 : 4) : t4.last_lit && (b(t4, false), 0 === t4.strm.avail_out) ? 1 : 2;
            })(n2, e3) : 3 === n2.strategy ? (function(t4, e4) {
              for (var r4, i3, n3, o3, s2 = t4.window; ; ) {
                if (t4.lookahead <= l) {
                  if (E(t4), t4.lookahead <= l && 0 === e4) return 1;
                  if (0 === t4.lookahead) break;
                }
                if (t4.match_length = 0, t4.lookahead >= 3 && t4.strstart > 0 && (i3 = s2[n3 = t4.strstart - 1]) === s2[++n3] && i3 === s2[++n3] && i3 === s2[++n3]) {
                  o3 = t4.strstart + l;
                  do {
                  } while (i3 === s2[++n3] && i3 === s2[++n3] && i3 === s2[++n3] && i3 === s2[++n3] && i3 === s2[++n3] && i3 === s2[++n3] && i3 === s2[++n3] && i3 === s2[++n3] && n3 < o3);
                  t4.match_length = l - (o3 - n3), t4.match_length > t4.lookahead && (t4.match_length = t4.lookahead);
                }
                if (t4.match_length >= 3 ? (r4 = a._tr_tally(t4, 1, t4.match_length - 3), t4.lookahead -= t4.match_length, t4.strstart += t4.match_length, t4.match_length = 0) : (r4 = a._tr_tally(t4, 0, t4.window[t4.strstart]), t4.lookahead--, t4.strstart++), r4 && (b(t4, false), 0 === t4.strm.avail_out)) return 1;
              }
              return t4.insert = 0, 4 === e4 ? (b(t4, true), 0 === t4.strm.avail_out ? 3 : 4) : t4.last_lit && (b(t4, false), 0 === t4.strm.avail_out) ? 1 : 2;
            })(n2, e3) : i2[n2.level].func(n2, e3);
            if (3 !== x2 && 4 !== x2 || (n2.status = p), 1 === x2 || 3 === x2) return 0 === t3.avail_out && (n2.last_flush = -1), 0;
            if (2 === x2 && (1 === e3 ? a._tr_align(n2) : 5 !== e3 && (a._tr_stored_block(n2, 0, 0, false), 3 === e3 && (m(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), y(t3), 0 === t3.avail_out)) return n2.last_flush = -1, 0;
          }
          return 4 !== e3 ? 0 : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (_(n2, 255 & t3.adler), _(n2, t3.adler >> 8 & 255), _(n2, t3.adler >> 16 & 255), _(n2, t3.adler >> 24 & 255), _(n2, 255 & t3.total_in), _(n2, t3.total_in >> 8 & 255), _(n2, t3.total_in >> 16 & 255), _(n2, t3.total_in >> 24 & 255)) : (v(n2, t3.adler >>> 16), v(n2, 65535 & t3.adler)), y(t3), n2.wrap > 0 && (n2.wrap = -n2.wrap), 0 !== n2.pending ? 0 : 1);
        }, e2.deflateEnd = function(t3) {
          var e3;
          return t3 && t3.state ? 42 !== (e3 = t3.state.status) && 69 !== e3 && 73 !== e3 && 91 !== e3 && e3 !== u && e3 !== h && e3 !== p ? g(t3, f) : (t3.state = null, e3 === h ? g(t3, -3) : 0) : f;
        }, e2.deflateSetDictionary = function(t3, e3) {
          var r3, i3, a2, s2, c2, l2, d2, u2, h2 = e3.length;
          if (!t3 || !t3.state) return f;
          if (2 === (s2 = (r3 = t3.state).wrap) || 1 === s2 && 42 !== r3.status || r3.lookahead) return f;
          for (1 === s2 && (t3.adler = o(t3.adler, e3, h2, 0)), r3.wrap = 0, h2 >= r3.w_size && (0 === s2 && (m(r3.head), r3.strstart = 0, r3.block_start = 0, r3.insert = 0), u2 = new n.Buf8(r3.w_size), n.arraySet(u2, e3, h2 - r3.w_size, r3.w_size, 0), e3 = u2, h2 = r3.w_size), c2 = t3.avail_in, l2 = t3.next_in, d2 = t3.input, t3.avail_in = h2, t3.next_in = 0, t3.input = e3, E(r3); r3.lookahead >= 3; ) {
            i3 = r3.strstart, a2 = r3.lookahead - 2;
            do {
              r3.ins_h = (r3.ins_h << r3.hash_shift ^ r3.window[i3 + 3 - 1]) & r3.hash_mask, r3.prev[i3 & r3.w_mask] = r3.head[r3.ins_h], r3.head[r3.ins_h] = i3, i3++;
            } while (--a2);
            r3.strstart = i3, r3.lookahead = 2, E(r3);
          }
          return r3.strstart += r3.lookahead, r3.block_start = r3.strstart, r3.insert = r3.lookahead, r3.lookahead = 0, r3.match_length = r3.prev_length = 2, r3.match_available = 0, t3.next_in = l2, t3.input = d2, t3.avail_in = c2, r3.wrap = s2, 0;
        }, e2.deflateInfo = "pako deflate (from Nodeca project)";
      }, 8465: (t2, e2, r2) => {
        "use strict";
        t2.exports = r2(809);
      }, 8648: (t2) => {
        "use strict";
        t2.exports = "undefined" != typeof Reflect && Reflect.getPrototypeOf || null;
      }, 8968: (t2) => {
        "use strict";
        t2.exports = Math.floor;
      }, 9092: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(1333);
        t2.exports = function() {
          return i2() && !!Symbol.toStringTag;
        };
      }, 9209: (t2, e2, r2) => {
        "use strict";
        var i2 = r2(6578), n = "undefined" == typeof globalThis ? r2.g : globalThis;
        t2.exports = function() {
          for (var t3 = [], e3 = 0; e3 < i2.length; e3++) "function" == typeof n[i2[e3]] && (t3[t3.length] = i2[e3]);
          return t3;
        };
      }, 9290: (t2) => {
        "use strict";
        t2.exports = RangeError;
      }, 9353: (t2) => {
        "use strict";
        var e2 = Object.prototype.toString, r2 = Math.max, i2 = function(t3, e3) {
          for (var r3 = [], i3 = 0; i3 < t3.length; i3 += 1) r3[i3] = t3[i3];
          for (var n = 0; n < e3.length; n += 1) r3[n + t3.length] = e3[n];
          return r3;
        };
        t2.exports = function(t3) {
          var n = this;
          if ("function" != typeof n || "[object Function]" !== e2.apply(n)) throw new TypeError("Function.prototype.bind called on incompatible " + n);
          for (var a, o = (function(t4) {
            for (var e3 = [], r3 = 1, i3 = 0; r3 < t4.length; r3 += 1, i3 += 1) e3[i3] = t4[r3];
            return e3;
          })(arguments), s = r2(0, n.length - o.length), c = [], f = 0; f < s; f++) c[f] = "$" + f;
          if (a = Function("binder", "return function (" + (function(t4) {
            for (var e3 = "", r3 = 0; r3 < t4.length; r3 += 1) e3 += t4[r3], r3 + 1 < t4.length && (e3 += ",");
            return e3;
          })(c) + "){ return binder.apply(this,arguments); }")(function() {
            if (this instanceof a) {
              var e3 = n.apply(this, i2(o, arguments));
              return Object(e3) === e3 ? e3 : this;
            }
            return n.apply(t3, i2(o, arguments));
          }), n.prototype) {
            var l = function() {
            };
            l.prototype = n.prototype, a.prototype = new l(), l.prototype = null;
          }
          return a;
        };
      }, 9383: (t2) => {
        "use strict";
        t2.exports = Error;
      }, 9538: (t2) => {
        "use strict";
        t2.exports = ReferenceError;
      }, 9600: (t2) => {
        "use strict";
        var e2, r2, i2 = Function.prototype.toString, n = "object" == typeof Reflect && null !== Reflect && Reflect.apply;
        if ("function" == typeof n && "function" == typeof Object.defineProperty) try {
          e2 = Object.defineProperty({}, "length", { get: function() {
            throw r2;
          } }), r2 = {}, n(function() {
            throw 42;
          }, null, e2);
        } catch (t3) {
          t3 !== r2 && (n = null);
        }
        else n = null;
        var a = /^\s*class\b/, o = function(t3) {
          try {
            var e3 = i2.call(t3);
            return a.test(e3);
          } catch (t4) {
            return false;
          }
        }, s = function(t3) {
          try {
            return !o(t3) && (i2.call(t3), true);
          } catch (t4) {
            return false;
          }
        }, c = Object.prototype.toString, f = "function" == typeof Symbol && !!Symbol.toStringTag, l = !(0 in [,]), d = function() {
          return false;
        };
        if ("object" == typeof document) {
          var u = document.all;
          c.call(u) === c.call(document.all) && (d = function(t3) {
            if ((l || !t3) && (void 0 === t3 || "object" == typeof t3)) try {
              var e3 = c.call(t3);
              return ("[object HTMLAllCollection]" === e3 || "[object HTML document.all class]" === e3 || "[object HTMLCollection]" === e3 || "[object Object]" === e3) && null == t3("");
            } catch (t4) {
            }
            return false;
          });
        }
        t2.exports = n ? function(t3) {
          if (d(t3)) return true;
          if (!t3) return false;
          if ("function" != typeof t3 && "object" != typeof t3) return false;
          try {
            n(t3, null, e2);
          } catch (t4) {
            if (t4 !== r2) return false;
          }
          return !o(t3) && s(t3);
        } : function(t3) {
          if (d(t3)) return true;
          if (!t3) return false;
          if ("function" != typeof t3 && "object" != typeof t3) return false;
          if (f) return s(t3);
          if (o(t3)) return false;
          var e3 = c.call(t3);
          return !("[object Function]" !== e3 && "[object GeneratorFunction]" !== e3 && !/^\[object HTML/.test(e3)) && s(t3);
        };
      }, 9612: (t2) => {
        "use strict";
        t2.exports = Object;
      }, 9675: (t2) => {
        "use strict";
        t2.exports = TypeError;
      }, 9681: (t2) => {
        "use strict";
        t2.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, 9805: (t2, e2) => {
        "use strict";
        var r2 = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
        function i2(t3, e3) {
          return Object.prototype.hasOwnProperty.call(t3, e3);
        }
        e2.assign = function(t3) {
          for (var e3 = Array.prototype.slice.call(arguments, 1); e3.length; ) {
            var r3 = e3.shift();
            if (r3) {
              if ("object" != typeof r3) throw new TypeError(r3 + "must be non-object");
              for (var n2 in r3) i2(r3, n2) && (t3[n2] = r3[n2]);
            }
          }
          return t3;
        }, e2.shrinkBuf = function(t3, e3) {
          return t3.length === e3 ? t3 : t3.subarray ? t3.subarray(0, e3) : (t3.length = e3, t3);
        };
        var n = { arraySet: function(t3, e3, r3, i3, n2) {
          if (e3.subarray && t3.subarray) t3.set(e3.subarray(r3, r3 + i3), n2);
          else for (var a2 = 0; a2 < i3; a2++) t3[n2 + a2] = e3[r3 + a2];
        }, flattenChunks: function(t3) {
          var e3, r3, i3, n2, a2, o;
          for (i3 = 0, e3 = 0, r3 = t3.length; e3 < r3; e3++) i3 += t3[e3].length;
          for (o = new Uint8Array(i3), n2 = 0, e3 = 0, r3 = t3.length; e3 < r3; e3++) a2 = t3[e3], o.set(a2, n2), n2 += a2.length;
          return o;
        } }, a = { arraySet: function(t3, e3, r3, i3, n2) {
          for (var a2 = 0; a2 < i3; a2++) t3[n2 + a2] = e3[r3 + a2];
        }, flattenChunks: function(t3) {
          return [].concat.apply([], t3);
        } };
        e2.setTyped = function(t3) {
          t3 ? (e2.Buf8 = Uint8Array, e2.Buf16 = Uint16Array, e2.Buf32 = Int32Array, e2.assign(e2, n)) : (e2.Buf8 = Array, e2.Buf16 = Array, e2.Buf32 = Array, e2.assign(e2, a));
        }, e2.setTyped(r2);
      }, 9957: (t2, e2, r2) => {
        "use strict";
        var i2 = Function.prototype.call, n = Object.prototype.hasOwnProperty, a = r2(6743);
        t2.exports = a.call(i2, n);
      } }, e = {};
      function r(i2) {
        var n = e[i2];
        if (void 0 !== n) return n.exports;
        var a = e[i2] = { exports: {} };
        return t[i2](a, a.exports, r), a.exports;
      }
      r.d = (t2, e2) => {
        for (var i2 in e2) r.o(e2, i2) && !r.o(t2, i2) && Object.defineProperty(t2, i2, { enumerable: true, get: e2[i2] });
      }, r.g = (function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || new Function("return this")();
        } catch (t2) {
          if ("object" == typeof window) return window;
        }
      })(), r.o = (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2), r.r = (t2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
      };
      var i = {};
      return (() => {
        "use strict";
        r.r(i), r.d(i, { Errors: () => t2, STAGE: () => P, TREE: () => Mt, WORKDIR: () => Nt, abortMerge: () => re, add: () => le, addNote: () => $e, addRemote: () => Ue, annotatedTag: () => Te, branch: () => Ce, checkout: () => Le, cherryPick: () => ir, clone: () => Fr, commit: () => Lr, currentBranch: () => Hr, default: () => $n, deleteBranch: () => Gr, deleteRef: () => Wr, deleteRemote: () => qr, deleteTag: () => Zr, expandOid: () => Vr, expandRef: () => Yr, fastForward: () => ei, fetch: () => ri, findMergeBase: () => ii, findRoot: () => ai, getConfig: () => oi, getConfigAll: () => si, getRemoteInfo: () => ci, getRemoteInfo2: () => li, hashBlob: () => di, indexPack: () => ui, init: () => hi, isDescendent: () => wi, isIgnored: () => mi, listBranches: () => yi, listFiles: () => vi, listNotes: () => xi, listRefs: () => ki, listRemotes: () => Ei, listServerRefs: () => Ai, listTags: () => Si, log: () => Ii, merge: () => Oi, packObjects: () => Ti, pull: () => Ci, push: () => zi, readBlob: () => Hi, readCommit: () => Gi, readNote: () => Wi, readObject: () => qi, readTag: () => Zi, readTree: () => Ki, remove: () => Vi, removeNote: () => Yi, renameBranch: () => Xi, resetIndex: () => Qi, resolveRef: () => tn, setConfig: () => en, stash: () => pn, status: () => gn, statusMatrix: () => mn, tag: () => yn, updateIndex: () => bn, version: () => _n, walk: () => vn, writeBlob: () => xn, writeCommit: () => kn, writeObject: () => En, writeRef: () => An, writeTag: () => Sn, writeTree: () => Bn });
        var t2 = {};
        r.r(t2), r.d(t2, { AlreadyExistsError: () => Be, AmbiguousError: () => Kr, CheckoutConflictError: () => Me, CherryPickMergeCommitError: () => He, CherryPickRootCommitError: () => Ge, CommitNotFetchedError: () => De, EmptyServerResponseError: () => mr, FastForwardError: () => Jr, GitPushError: () => Di, HttpError: () => lr, IndexResetError: () => Gt, InternalError: () => o, InvalidFilepathError: () => xe, InvalidOidError: () => j, InvalidRefNameError: () => Pe, MaxDepthError: () => pi, MergeConflictError: () => We, MergeNotSupportedError: () => qe, MissingNameError: () => ue, MissingParameterError: () => Jt, MultipleGitError: () => ie, NoCommitError: () => he, NoRefspecError: () => U, NotFoundError: () => I, ObjectTypeError: () => O, ParseError: () => yr, PushRejectedError: () => Ni, RemoteCapabilityError: () => sr, SmartHttpError: () => dr, UnknownTransportError: () => cr, UnmergedPathsError: () => a, UnsafeFilepathError: () => s, UrlParseError: () => fr, UserCanceledError: () => ur });
        var e2 = r(8465);
        class n extends Error {
          constructor(t3) {
            super(t3), this.caller = "";
          }
          toJSON() {
            return { code: this.code, data: this.data, caller: this.caller, message: this.message, stack: this.stack };
          }
          fromJSON(t3) {
            const e3 = new n(t3.message);
            return e3.code = t3.code, e3.data = t3.data, e3.caller = t3.caller, e3.stack = t3.stack, e3;
          }
          get isIsomorphicGitError() {
            return true;
          }
        }
        class a extends n {
          constructor(t3) {
            super(`Modifying the index is not possible because you have unmerged files: ${t3.toString}. Fix them up in the work tree, and then use 'git add/rm as appropriate to mark resolution and make a commit.`), this.code = this.name = a.code, this.data = { filepaths: t3 };
          }
        }
        a.code = "UnmergedPathsError";
        class o extends n {
          constructor(t3) {
            super(`An internal error caused this command to fail.

If you're using an application that depends on isomorphic-git, please report this error to that application's developers.

If you're a developer and you believe this is a bug in isomorphic-git, please file an issue at https://github.com/isomorphic-git/isomorphic-git/issues with a minimal reproduction, version and environment details, and this error message: ${t3}`), this.code = this.name = o.code, this.data = { message: t3 };
          }
        }
        o.code = "InternalError";
        class s extends n {
          constructor(t3) {
            super(`The filepath "${t3}" contains unsafe character sequences`), this.code = this.name = s.code, this.data = { filepath: t3 };
          }
        }
        s.code = "UnsafeFilepathError";
        class c {
          constructor(t3) {
            this.buffer = t3, this._start = 0;
          }
          eof() {
            return this._start >= this.buffer.length;
          }
          tell() {
            return this._start;
          }
          seek(t3) {
            this._start = t3;
          }
          slice(t3) {
            const e3 = this.buffer.slice(this._start, this._start + t3);
            return this._start += t3, e3;
          }
          toString(t3, e3) {
            const r2 = this.buffer.toString(t3, this._start, this._start + e3);
            return this._start += e3, r2;
          }
          write(t3, e3, r2) {
            const i2 = this.buffer.write(t3, this._start, e3, r2);
            return this._start += e3, i2;
          }
          copy(t3, e3, r2) {
            const i2 = t3.copy(this.buffer, this._start, e3, r2);
            return this._start += i2, i2;
          }
          readUInt8() {
            const t3 = this.buffer.readUInt8(this._start);
            return this._start += 1, t3;
          }
          writeUInt8(t3) {
            const e3 = this.buffer.writeUInt8(t3, this._start);
            return this._start += 1, e3;
          }
          readUInt16BE() {
            const t3 = this.buffer.readUInt16BE(this._start);
            return this._start += 2, t3;
          }
          writeUInt16BE(t3) {
            const e3 = this.buffer.writeUInt16BE(t3, this._start);
            return this._start += 2, e3;
          }
          readUInt32BE() {
            const t3 = this.buffer.readUInt32BE(this._start);
            return this._start += 4, t3;
          }
          writeUInt32BE(t3) {
            const e3 = this.buffer.writeUInt32BE(t3, this._start);
            return this._start += 4, e3;
          }
        }
        function f(t3, e3) {
          return -(t3 < e3) || +(t3 > e3);
        }
        function l(t3, e3) {
          return f(t3.path, e3.path);
        }
        function d(t3) {
          let e3 = t3 > 0 ? t3 >> 12 : 0;
          4 !== e3 && 8 !== e3 && 10 !== e3 && 14 !== e3 && (e3 = 8);
          let r2 = 511 & t3;
          return r2 = 73 & r2 ? 493 : 420, 8 !== e3 && (r2 = 0), (e3 << 12) + r2;
        }
        const u = 2 ** 32;
        function h(t3, e3, r2, i2) {
          if (void 0 !== t3 && void 0 !== e3) return [t3, e3];
          void 0 === r2 && (r2 = i2.valueOf());
          const n2 = Math.floor(r2 / 1e3);
          return [n2, 1e6 * (r2 - 1e3 * n2)];
        }
        function p(t3) {
          const [e3, r2] = h(t3.ctimeSeconds, t3.ctimeNanoseconds, t3.ctimeMs, t3.ctime), [i2, n2] = h(t3.mtimeSeconds, t3.mtimeNanoseconds, t3.mtimeMs, t3.mtime);
          return { ctimeSeconds: e3 % u, ctimeNanoseconds: r2 % u, mtimeSeconds: i2 % u, mtimeNanoseconds: n2 % u, dev: t3.dev % u, ino: t3.ino % u, mode: d(t3.mode % u), uid: t3.uid % u, gid: t3.gid % u, size: t3.size > -1 ? t3.size % u : 0 };
        }
        var g = r(3737);
        let w = null;
        async function m(t3) {
          return null === w && (w = await (async function() {
            try {
              return "da39a3ee5e6b4b0d3255bfef95601890afd80709" === await y(new Uint8Array([]));
            } catch (t4) {
            }
            return false;
          })()), w ? y(t3) : (function(t4) {
            return new g().update(t4).digest("hex");
          })(t3);
        }
        async function y(t3) {
          return (function(t4) {
            let e3 = "";
            for (const r2 of new Uint8Array(t4)) r2 < 16 && (e3 += "0"), e3 += r2.toString(16);
            return e3;
          })(await crypto.subtle.digest("SHA-1", t3));
        }
        function b(t3) {
          return { assumeValid: Boolean(32768 & t3), extended: Boolean(16384 & t3), stage: (12288 & t3) >> 12, nameLength: 4095 & t3 };
        }
        class _ {
          constructor(t3, e3) {
            this._dirty = false, this._unmergedPaths = e3 || /* @__PURE__ */ new Set(), this._entries = t3 || /* @__PURE__ */ new Map();
          }
          _addEntry(t3) {
            if (0 === t3.flags.stage) t3.stages = [t3], this._entries.set(t3.path, t3), this._unmergedPaths.delete(t3.path);
            else {
              let e3 = this._entries.get(t3.path);
              e3 || (this._entries.set(t3.path, t3), e3 = t3), e3.stages[t3.flags.stage] = t3, this._unmergedPaths.add(t3.path);
            }
          }
          static async from(t3) {
            if (Buffer.isBuffer(t3)) return _.fromBuffer(t3);
            if (null === t3) return new _(null);
            throw new o("invalid type passed to GitIndex.from");
          }
          static async fromBuffer(t3) {
            if (0 === t3.length) throw new o("Index file is empty (.git/index)");
            const e3 = new _(), r2 = new c(t3), i2 = r2.toString("utf8", 4);
            if ("DIRC" !== i2) throw new o(`Invalid dircache magic file number: ${i2}`);
            const n2 = await m(t3.slice(0, -20)), a2 = t3.slice(-20).toString("hex");
            if (a2 !== n2) throw new o(`Invalid checksum in GitIndex buffer: expected ${a2} but saw ${n2}`);
            const f2 = r2.readUInt32BE();
            if (2 !== f2) throw new o(`Unsupported dircache version: ${f2}`);
            const l2 = r2.readUInt32BE();
            let d2 = 0;
            for (; !r2.eof() && d2 < l2; ) {
              const i3 = {};
              i3.ctimeSeconds = r2.readUInt32BE(), i3.ctimeNanoseconds = r2.readUInt32BE(), i3.mtimeSeconds = r2.readUInt32BE(), i3.mtimeNanoseconds = r2.readUInt32BE(), i3.dev = r2.readUInt32BE(), i3.ino = r2.readUInt32BE(), i3.mode = r2.readUInt32BE(), i3.uid = r2.readUInt32BE(), i3.gid = r2.readUInt32BE(), i3.size = r2.readUInt32BE(), i3.oid = r2.slice(20).toString("hex");
              const n3 = r2.readUInt16BE();
              i3.flags = b(n3);
              const a3 = t3.indexOf(0, r2.tell() + 1) - r2.tell();
              if (a3 < 1) throw new o(`Got a path length of: ${a3}`);
              if (i3.path = r2.toString("utf8", a3), i3.path.includes("..\\") || i3.path.includes("../")) throw new s(i3.path);
              let c2 = 8 - (r2.tell() - 12) % 8;
              for (0 === c2 && (c2 = 8); c2--; ) {
                const t4 = r2.readUInt8();
                if (0 !== t4) throw new o(`Expected 1-8 null characters but got '${t4}' after ${i3.path}`);
                if (r2.eof()) throw new o("Unexpected end of file");
              }
              i3.stages = [], e3._addEntry(i3), d2++;
            }
            return e3;
          }
          get unmergedPaths() {
            return [...this._unmergedPaths];
          }
          get entries() {
            return [...this._entries.values()].sort(l);
          }
          get entriesMap() {
            return this._entries;
          }
          get entriesFlat() {
            return [...this.entries].flatMap((t3) => t3.stages.length > 1 ? t3.stages.filter((t4) => t4) : t3);
          }
          *[Symbol.iterator]() {
            for (const t3 of this.entries) yield t3;
          }
          insert({ filepath: t3, stats: e3, oid: r2, stage: i2 = 0 }) {
            e3 || (e3 = { ctimeSeconds: 0, ctimeNanoseconds: 0, mtimeSeconds: 0, mtimeNanoseconds: 0, dev: 0, ino: 0, mode: 0, uid: 0, gid: 0, size: 0 }), e3 = p(e3);
            const n2 = Buffer.from(t3), a2 = { ctimeSeconds: e3.ctimeSeconds, ctimeNanoseconds: e3.ctimeNanoseconds, mtimeSeconds: e3.mtimeSeconds, mtimeNanoseconds: e3.mtimeNanoseconds, dev: e3.dev, ino: e3.ino, mode: e3.mode || 33188, uid: e3.uid, gid: e3.gid, size: e3.size, path: t3, oid: r2, flags: { assumeValid: false, extended: false, stage: i2, nameLength: n2.length < 4095 ? n2.length : 4095 }, stages: [] };
            this._addEntry(a2), this._dirty = true;
          }
          delete({ filepath: t3 }) {
            if (this._entries.has(t3)) this._entries.delete(t3);
            else for (const e3 of this._entries.keys()) e3.startsWith(t3 + "/") && this._entries.delete(e3);
            this._unmergedPaths.has(t3) && this._unmergedPaths.delete(t3), this._dirty = true;
          }
          clear() {
            this._entries.clear(), this._dirty = true;
          }
          has({ filepath: t3 }) {
            return this._entries.has(t3);
          }
          render() {
            return this.entries.map((t3) => `${t3.mode.toString(8)} ${t3.oid}    ${t3.path}`).join("\n");
          }
          static async _entryToBuffer(t3) {
            const e3 = Buffer.from(t3.path), r2 = 8 * Math.ceil((62 + e3.length + 1) / 8), i2 = Buffer.alloc(r2), n2 = new c(i2), a2 = p(t3);
            return n2.writeUInt32BE(a2.ctimeSeconds), n2.writeUInt32BE(a2.ctimeNanoseconds), n2.writeUInt32BE(a2.mtimeSeconds), n2.writeUInt32BE(a2.mtimeNanoseconds), n2.writeUInt32BE(a2.dev), n2.writeUInt32BE(a2.ino), n2.writeUInt32BE(a2.mode), n2.writeUInt32BE(a2.uid), n2.writeUInt32BE(a2.gid), n2.writeUInt32BE(a2.size), n2.write(t3.oid, 20, "hex"), n2.writeUInt16BE((function(t4) {
              const e4 = t4.flags;
              return e4.extended = false, e4.nameLength = Math.min(Buffer.from(t4.path).length, 4095), (e4.assumeValid ? 32768 : 0) + (e4.extended ? 16384 : 0) + ((3 & e4.stage) << 12) + (4095 & e4.nameLength);
            })(t3)), n2.write(t3.path, e3.length, "utf8"), i2;
          }
          async toObject() {
            const t3 = Buffer.alloc(12), e3 = new c(t3);
            e3.write("DIRC", 4, "utf8"), e3.writeUInt32BE(2), e3.writeUInt32BE(this.entriesFlat.length);
            let r2 = [];
            for (const t4 of this.entries) if (r2.push(_._entryToBuffer(t4)), t4.stages.length > 1) for (const e4 of t4.stages) e4 && e4 !== t4 && r2.push(_._entryToBuffer(e4));
            r2 = await Promise.all(r2);
            const i2 = Buffer.concat(r2), n2 = Buffer.concat([t3, i2]), a2 = await m(n2);
            return Buffer.concat([n2, Buffer.from(a2, "hex")]);
          }
        }
        function v(t3, e3, r2 = true, i2 = true) {
          const n2 = p(t3), a2 = p(e3);
          return r2 && n2.mode !== a2.mode || n2.mtimeSeconds !== a2.mtimeSeconds || n2.ctimeSeconds !== a2.ctimeSeconds || n2.uid !== a2.uid || n2.gid !== a2.gid || i2 && n2.ino !== a2.ino || n2.size !== a2.size;
        }
        let x = null;
        const k = Symbol("IndexCache");
        class E {
          static async acquire({ fs: t3, gitdir: r2, cache: i2, allowUnmerged: n2 = true }, o2) {
            i2[k] || (i2[k] = { map: /* @__PURE__ */ new Map(), stats: /* @__PURE__ */ new Map() });
            const s2 = `${r2}/index`;
            let c2;
            null === x && (x = new e2({ maxPending: 1 / 0 }));
            let f2 = [];
            return await x.acquire(s2, async () => {
              const e3 = i2[k];
              await (async function(t4, e4, r4) {
                const i3 = r4.stats.get(e4);
                if (void 0 === i3) return true;
                if (null === i3) return false;
                const n3 = await t4.lstat(e4);
                return null !== n3 && v(i3, n3);
              })(t3, s2, e3) && await (async function(t4, e4, r4) {
                const [i3, n3] = await Promise.all([t4.lstat(e4), t4.read(e4)]), a2 = await _.from(n3);
                r4.map.set(e4, a2), r4.stats.set(e4, i3);
              })(t3, s2, e3);
              const r3 = e3.map.get(s2);
              if (f2 = r3.unmergedPaths, f2.length && !n2) throw new a(f2);
              if (c2 = await o2(r3), r3._dirty) {
                const i3 = await r3.toObject();
                await t3.write(s2, i3), e3.stats.set(s2, await t3.lstat(s2)), r3._dirty = false;
              }
            }), c2;
          }
        }
        function A(t3) {
          const e3 = Math.max(t3.lastIndexOf("/"), t3.lastIndexOf("\\"));
          return e3 > -1 && (t3 = t3.slice(e3 + 1)), t3;
        }
        function S(t3) {
          const e3 = Math.max(t3.lastIndexOf("/"), t3.lastIndexOf("\\"));
          return -1 === e3 ? "." : 0 === e3 ? "/" : t3.slice(0, e3);
        }
        function B(t3) {
          const e3 = /* @__PURE__ */ new Map(), r2 = function(t4) {
            if (!e3.has(t4)) {
              const i3 = { type: "tree", fullpath: t4, basename: A(t4), metadata: {}, children: [] };
              e3.set(t4, i3), i3.parent = r2(S(t4)), i3.parent && i3.parent !== i3 && i3.parent.children.push(i3);
            }
            return e3.get(t4);
          }, i2 = function(t4, i3) {
            if (!e3.has(t4)) {
              const n2 = { type: "blob", fullpath: t4, basename: A(t4), metadata: i3, parent: r2(S(t4)), children: [] };
              n2.parent && n2.parent.children.push(n2), e3.set(t4, n2);
            }
            return e3.get(t4);
          };
          r2(".");
          for (const e4 of t3) i2(e4.path, e4);
          return e3;
        }
        class $ {
          constructor({ fs: t3, gitdir: e3, cache: r2 }) {
            this.treePromise = E.acquire({ fs: t3, gitdir: e3, cache: r2 }, async function(t4) {
              return B(t4.entries);
            });
            const i2 = this;
            this.ConstructEntry = class {
              constructor(t4) {
                this._fullpath = t4, this._type = false, this._mode = false, this._stat = false, this._oid = false;
              }
              async type() {
                return i2.type(this);
              }
              async mode() {
                return i2.mode(this);
              }
              async stat() {
                return i2.stat(this);
              }
              async content() {
                return i2.content(this);
              }
              async oid() {
                return i2.oid(this);
              }
            };
          }
          async readdir(t3) {
            const e3 = t3._fullpath, r2 = (await this.treePromise).get(e3);
            if (!r2) return null;
            if ("blob" === r2.type) return null;
            if ("tree" !== r2.type) throw new Error(`ENOTDIR: not a directory, scandir '${e3}'`);
            const i2 = r2.children.map((t4) => t4.fullpath);
            return i2.sort(f), i2;
          }
          async type(t3) {
            return false === t3._type && await t3.stat(), t3._type;
          }
          async mode(t3) {
            return false === t3._mode && await t3.stat(), t3._mode;
          }
          async stat(t3) {
            if (false === t3._stat) {
              const e3 = (await this.treePromise).get(t3._fullpath);
              if (!e3) throw new Error(`ENOENT: no such file or directory, lstat '${t3._fullpath}'`);
              const r2 = "tree" === e3.type ? {} : p(e3.metadata);
              t3._type = "tree" === e3.type ? "tree" : (function(t4) {
                switch (t4) {
                  case 16384:
                    return "tree";
                  case 33188:
                  case 33261:
                  case 40960:
                    return "blob";
                  case 57344:
                    return "commit";
                }
                throw new o(`Unexpected GitTree entry mode: ${t4.toString(8)}`);
              })(r2.mode), t3._mode = r2.mode, "tree" === e3.type ? t3._stat = void 0 : t3._stat = r2;
            }
            return t3._stat;
          }
          async content(t3) {
          }
          async oid(t3) {
            if (false === t3._oid) {
              const e3 = (await this.treePromise).get(t3._fullpath);
              t3._oid = e3.metadata.oid;
            }
            return t3._oid;
          }
        }
        const R = Symbol("GitWalkSymbol");
        function P() {
          const t3 = /* @__PURE__ */ Object.create(null);
          return Object.defineProperty(t3, R, { value: function({ fs: t4, gitdir: e3, cache: r2 }) {
            return new $({ fs: t4, gitdir: e3, cache: r2 });
          } }), Object.freeze(t3), t3;
        }
        class I extends n {
          constructor(t3) {
            super(`Could not find ${t3}.`), this.code = this.name = I.code, this.data = { what: t3 };
          }
        }
        I.code = "NotFoundError";
        class O extends n {
          constructor(t3, e3, r2, i2) {
            super(`Object ${t3} ${i2 ? `at ${i2}` : ""}was anticipated to be a ${r2} but it is a ${e3}.`), this.code = this.name = O.code, this.data = { oid: t3, actual: e3, expected: r2, filepath: i2 };
          }
        }
        O.code = "ObjectTypeError";
        class j extends n {
          constructor(t3) {
            super(`Expected a 40-char hex object id but saw "${t3}".`), this.code = this.name = j.code, this.data = { value: t3 };
          }
        }
        j.code = "InvalidOidError";
        class U extends n {
          constructor(t3) {
            super(`Could not find a fetch refspec for remote "${t3}". Make sure the config file has an entry like the following:
[remote "${t3}"]
	fetch = +refs/heads/*:refs/remotes/origin/*
`), this.code = this.name = U.code, this.data = { remote: t3 };
          }
        }
        U.code = "NoRefspecError";
        class T {
          constructor(t3) {
            if (this.refs = /* @__PURE__ */ new Map(), this.parsedConfig = [], t3) {
              let e3 = null;
              this.parsedConfig = t3.trim().split("\n").map((t4) => {
                if (/^\s*#/.test(t4)) return { line: t4, comment: true };
                const r2 = t4.indexOf(" ");
                if (t4.startsWith("^")) {
                  const r3 = t4.slice(1);
                  return this.refs.set(e3 + "^{}", r3), { line: t4, ref: e3, peeled: r3 };
                }
                {
                  const i2 = t4.slice(0, r2);
                  return e3 = t4.slice(r2 + 1), this.refs.set(e3, i2), { line: t4, ref: e3, oid: i2 };
                }
              });
            }
            return this;
          }
          static from(t3) {
            return new T(t3);
          }
          delete(t3) {
            this.parsedConfig = this.parsedConfig.filter((e3) => e3.ref !== t3), this.refs.delete(t3);
          }
          toString() {
            return this.parsedConfig.map(({ line: t3 }) => t3).join("\n") + "\n";
          }
        }
        class C {
          constructor({ remotePath: t3, localPath: e3, force: r2, matchPrefix: i2 }) {
            Object.assign(this, { remotePath: t3, localPath: e3, force: r2, matchPrefix: i2 });
          }
          static from(t3) {
            const [e3, r2, i2, n2, a2] = t3.match(/^(\+?)(.*?)(\*?):(.*?)(\*?)$/).slice(1), s2 = "+" === e3, c2 = "*" === i2;
            if (c2 !== ("*" === a2)) throw new o("Invalid refspec");
            return new C({ remotePath: r2, localPath: n2, force: s2, matchPrefix: c2 });
          }
          translate(t3) {
            if (this.matchPrefix) {
              if (t3.startsWith(this.remotePath)) return this.localPath + t3.replace(this.remotePath, "");
            } else if (t3 === this.remotePath) return this.localPath;
            return null;
          }
          reverseTranslate(t3) {
            if (this.matchPrefix) {
              if (t3.startsWith(this.localPath)) return this.remotePath + t3.replace(this.localPath, "");
            } else if (t3 === this.localPath) return this.remotePath;
            return null;
          }
        }
        class M {
          constructor(t3 = []) {
            this.rules = t3;
          }
          static from(t3) {
            const e3 = [];
            for (const r2 of t3) e3.push(C.from(r2));
            return new M(e3);
          }
          add(t3) {
            const e3 = C.from(t3);
            this.rules.push(e3);
          }
          translate(t3) {
            const e3 = [];
            for (const r2 of this.rules) for (const i2 of t3) {
              const t4 = r2.translate(i2);
              t4 && e3.push([i2, t4]);
            }
            return e3;
          }
          translateOne(t3) {
            let e3 = null;
            for (const r2 of this.rules) {
              const i2 = r2.translate(t3);
              i2 && (e3 = i2);
            }
            return e3;
          }
          localNamespaces() {
            return this.rules.filter((t3) => t3.matchPrefix).map((t3) => t3.localPath.replace(/\/$/, ""));
          }
        }
        function D(t3, e3) {
          const r2 = t3.replace(/\^\{\}$/, ""), i2 = e3.replace(/\^\{\}$/, ""), n2 = -(r2 < i2) || +(r2 > i2);
          return 0 === n2 ? t3.endsWith("^{}") ? 1 : -1 : n2;
        }
        function N(...t3) {
          if (0 === t3.length) return ".";
          let e3;
          for (let r2 = 0; r2 < t3.length; ++r2) {
            const i2 = t3[r2].replace(/\\/g, "/");
            0 !== i2.length && (/^[a-zA-Z]:\//.test(i2) || void 0 === e3 ? e3 = i2 : e3 += "/" + i2);
          }
          return void 0 === e3 ? "." : (function(t4) {
            if (!t4.length) return ".";
            const e4 = (function(t5) {
              return t5.length >= 2 && /^[a-zA-Z]:/.test(t5) ? t5.slice(0, 2) : null;
            })(t4 = t4.replace(/\\/g, "/")), r2 = "/" === t4[0] || null !== e4 && "/" === t4[2], i2 = "/" === t4.at(-1);
            let n2 = (function(t5, e5) {
              let r3 = "", i3 = 0, n3 = -1, a2 = 0, o2 = "\0";
              for (let s2 = 0; s2 <= t5.length; ++s2) {
                if (s2 < t5.length) o2 = t5[s2];
                else {
                  if ("/" === o2) break;
                  o2 = "/";
                }
                if ("/" === o2) {
                  if (n3 === s2 - 1 || 1 === a2) ;
                  else if (2 === a2) {
                    if (r3.length < 2 || 2 !== i3 || "." !== r3.at(-1) || "." !== r3.at(-2)) {
                      if (r3.length > 2) {
                        const t6 = r3.lastIndexOf("/");
                        -1 === t6 ? (r3 = "", i3 = 0) : (r3 = r3.slice(0, t6), i3 = r3.length - 1 - r3.lastIndexOf("/")), n3 = s2, a2 = 0;
                        continue;
                      }
                      if (0 !== r3.length) {
                        r3 = "", i3 = 0, n3 = s2, a2 = 0;
                        continue;
                      }
                    }
                    e5 && (r3 += r3.length > 0 ? "/.." : "..", i3 = 2);
                  } else r3.length > 0 ? r3 += "/" + t5.slice(n3 + 1, s2) : r3 = t5.slice(n3 + 1, s2), i3 = s2 - n3 - 1;
                  n3 = s2, a2 = 0;
                } else "." === o2 && -1 !== a2 ? ++a2 : a2 = -1;
              }
              return r3;
            })(e4 ? t4.slice(2) : t4, !r2);
            if (!n2.length) {
              const t5 = e4 ? r2 ? e4 + "/" : e4 : r2 ? "/" : ".";
              return i2 && !r2 ? t5 + "/" : t5;
            }
            return i2 && (n2 += "/"), e4 ? r2 ? `${e4}/${n2}` : `${e4}${n2}` : r2 ? `/${n2}` : n2;
          })(e3);
        }
        const z = (t3) => {
          if ("boolean" == typeof t3) return t3;
          if ("true" === (t3 = t3.trim().toLowerCase()) || "yes" === t3 || "on" === t3) return true;
          if ("false" === t3 || "no" === t3 || "off" === t3) return false;
          throw Error(`Expected 'true', 'false', 'yes', 'no', 'on', or 'off', but got ${t3}`);
        }, F = { core: { filemode: z, bare: z, logallrefupdates: z, symlinks: z, ignorecase: z, bigFileThreshold: (t3) => {
          if ("number" == typeof t3) return t3;
          t3 = t3.toLowerCase();
          let e3 = parseInt(t3);
          return t3.endsWith("k") && (e3 *= 1024), t3.endsWith("m") && (e3 *= 1048576), t3.endsWith("g") && (e3 *= 1073741824), e3;
        } } }, L = /^\[([A-Za-z0-9-.]+)(?: "(.*)")?\]$/, H = /^[A-Za-z0-9-.]+$/, G = /^([A-Za-z][A-Za-z-]*)(?: *= *(.*))?$/, W = /^[A-Za-z][A-Za-z-]*$/, q = /^(.*?)( *[#;].*)$/, Z = (t3) => (t3.match(/(?:^|[^\\])"/g) || []).length % 2 != 0, K = (t3) => t3.split("").reduce((t4, e3, r2, i2) => {
          const n2 = '"' === e3 && "\\" !== i2[r2 - 1], a2 = "\\" === e3 && '"' === i2[r2 + 1];
          return n2 || a2 ? t4 : t4 + e3;
        }, ""), V = (t3) => null != t3 ? t3.toLowerCase() : null, Y = (t3, e3, r2) => [V(t3), e3, V(r2)].filter((t4) => null != t4).join("."), X = (t3) => {
          const e3 = t3.split("."), r2 = e3.shift(), i2 = e3.pop(), n2 = e3.length ? e3.join(".") : void 0;
          return { section: r2, subsection: n2, name: i2, path: Y(r2, n2, i2), sectionPath: Y(r2, n2, null), isSection: !!r2 };
        };
        class J {
          constructor(t3) {
            let e3 = null, r2 = null;
            this.parsedConfig = t3 ? t3.split("\n").map((t4) => {
              let i2 = null, n2 = null;
              const a2 = t4.trim(), o2 = ((t5) => {
                const e4 = L.exec(t5);
                if (null != e4) {
                  const [t6, r3] = e4.slice(1);
                  return [t6, r3];
                }
                return null;
              })(a2), s2 = null != o2;
              if (s2) [e3, r2] = o2;
              else {
                const t5 = ((t6) => {
                  const e4 = G.exec(t6);
                  if (null != e4) {
                    const [t7, r3 = "true"] = e4.slice(1), i3 = ((t8) => {
                      const e5 = q.exec(t8);
                      if (null == e5) return t8;
                      const [r4, i4] = e5.slice(1);
                      return Z(r4) && Z(i4) ? `${r4}${i4}` : r4;
                    })(r3);
                    return [t7, K(i3)];
                  }
                  return null;
                })(a2);
                null != t5 && ([i2, n2] = t5);
              }
              const c2 = Y(e3, r2, i2);
              return { line: t4, isSection: s2, section: e3, subsection: r2, name: i2, value: n2, path: c2 };
            }) : [];
          }
          static from(t3) {
            return new J(t3);
          }
          async get(t3, e3 = false) {
            const r2 = X(t3).path, i2 = this.parsedConfig.filter((t4) => t4.path === r2).map(({ section: t4, name: e4, value: r3 }) => {
              const i3 = F[t4] && F[t4][e4];
              return i3 ? i3(r3) : r3;
            });
            return e3 ? i2 : i2.pop();
          }
          async getall(t3) {
            return this.get(t3, true);
          }
          async getSubsections(t3) {
            return this.parsedConfig.filter((e3) => e3.isSection && e3.section === t3).map((t4) => t4.subsection);
          }
          async deleteSection(t3, e3) {
            this.parsedConfig = this.parsedConfig.filter((r2) => !(r2.section === t3 && r2.subsection === e3));
          }
          async append(t3, e3) {
            return this.set(t3, e3, true);
          }
          async set(t3, e3, r2 = false) {
            const { section: i2, subsection: n2, name: a2, path: o2, sectionPath: s2, isSection: c2 } = X(t3), f2 = (l2 = this.parsedConfig, d2 = (t4) => t4.path === o2, l2.reduce((t4, e4, r3) => d2(e4) ? r3 : t4, -1));
            var l2, d2;
            if (null == e3) -1 !== f2 && this.parsedConfig.splice(f2, 1);
            else if (-1 !== f2) {
              const t4 = this.parsedConfig[f2], i3 = Object.assign({}, t4, { name: a2, value: e3, modified: true });
              r2 ? this.parsedConfig.splice(f2 + 1, 0, i3) : this.parsedConfig[f2] = i3;
            } else {
              const t4 = this.parsedConfig.findIndex((t5) => t5.path === s2), r3 = { section: i2, subsection: n2, name: a2, value: e3, modified: true, path: o2 };
              if (H.test(i2) && W.test(a2)) if (t4 >= 0) this.parsedConfig.splice(t4 + 1, 0, r3);
              else {
                const t5 = { isSection: c2, section: i2, subsection: n2, modified: true, path: s2 };
                this.parsedConfig.push(t5, r3);
              }
            }
          }
          toString() {
            return this.parsedConfig.map(({ line: t3, section: e3, subsection: r2, name: i2, value: n2, modified: a2 = false }) => a2 ? null != i2 && null != n2 ? "string" == typeof n2 && /[#;]/.test(n2) ? `	${i2} = "${n2}"` : `	${i2} = ${n2}` : null != r2 ? `[${e3} "${r2}"]` : `[${e3}]` : t3).join("\n");
          }
        }
        class Q {
          static async get({ fs: t3, gitdir: e3 }) {
            const r2 = await t3.read(`${e3}/config`, { encoding: "utf8" });
            return J.from(r2);
          }
          static async save({ fs: t3, gitdir: e3, config: r2 }) {
            await t3.write(`${e3}/config`, r2.toString(), { encoding: "utf8" });
          }
        }
        const tt = (t3) => [`${t3}`, `refs/${t3}`, `refs/tags/${t3}`, `refs/heads/${t3}`, `refs/remotes/${t3}`, `refs/remotes/${t3}/HEAD`], et = ["config", "description", "index", "shallow", "commondir"];
        let rt;
        async function it(t3, r2) {
          return void 0 === rt && (rt = new e2()), rt.acquire(t3, r2);
        }
        class nt {
          static async updateRemoteRefs({ fs: t3, gitdir: e3, remote: r2, refs: i2, symrefs: n2, tags: a2, refspecs: o2, prune: s2 = false, pruneTags: c2 = false }) {
            for (const t4 of i2.values()) if (!t4.match(/[0-9a-f]{40}/)) throw new j(t4);
            const f2 = await Q.get({ fs: t3, gitdir: e3 });
            if (!o2) {
              if (0 === (o2 = await f2.getall(`remote.${r2}.fetch`)).length) throw new U(r2);
              o2.unshift(`+HEAD:refs/remotes/${r2}/HEAD`);
            }
            const l2 = M.from(o2), d2 = /* @__PURE__ */ new Map();
            if (c2) {
              const r3 = await nt.listRefs({ fs: t3, gitdir: e3, filepath: "refs/tags" });
              await nt.deleteRefs({ fs: t3, gitdir: e3, refs: r3.map((t4) => `refs/tags/${t4}`) });
            }
            if (a2) {
              for (const r3 of i2.keys()) if (r3.startsWith("refs/tags") && !r3.endsWith("^{}") && !await nt.exists({ fs: t3, gitdir: e3, ref: r3 })) {
                const t4 = i2.get(r3);
                d2.set(r3, t4);
              }
            }
            const u2 = l2.translate([...i2.keys()]);
            for (const [t4, e4] of u2) {
              const r3 = i2.get(t4);
              d2.set(e4, r3);
            }
            const h2 = l2.translate([...n2.keys()]);
            for (const [t4, e4] of h2) {
              const r3 = n2.get(t4), i3 = l2.translateOne(r3);
              i3 && d2.set(e4, `ref: ${i3}`);
            }
            const p2 = [];
            if (s2) {
              for (const r3 of l2.localNamespaces()) {
                const i3 = (await nt.listRefs({ fs: t3, gitdir: e3, filepath: r3 })).map((t4) => `${r3}/${t4}`);
                for (const t4 of i3) d2.has(t4) || p2.push(t4);
              }
              p2.length > 0 && await nt.deleteRefs({ fs: t3, gitdir: e3, refs: p2 });
            }
            for (const [r3, i3] of d2) await it(r3, async () => t3.write(N(e3, r3), `${i3.trim()}
`, "utf8"));
            return { pruned: p2 };
          }
          static async writeRef({ fs: t3, gitdir: e3, ref: r2, value: i2 }) {
            if (!i2.match(/[0-9a-f]{40}/)) throw new j(i2);
            await it(r2, async () => t3.write(N(e3, r2), `${i2.trim()}
`, "utf8"));
          }
          static async writeSymbolicRef({ fs: t3, gitdir: e3, ref: r2, value: i2 }) {
            await it(r2, async () => t3.write(N(e3, r2), `ref: ${i2.trim()}
`, "utf8"));
          }
          static async deleteRef({ fs: t3, gitdir: e3, ref: r2 }) {
            return nt.deleteRefs({ fs: t3, gitdir: e3, refs: [r2] });
          }
          static async deleteRefs({ fs: t3, gitdir: e3, refs: r2 }) {
            await Promise.all(r2.map((r3) => t3.rm(N(e3, r3))));
            let i2 = await it("packed-refs", async () => t3.read(`${e3}/packed-refs`, { encoding: "utf8" }));
            const n2 = T.from(i2), a2 = n2.refs.size;
            for (const t4 of r2) n2.refs.has(t4) && n2.delete(t4);
            n2.refs.size < a2 && (i2 = n2.toString(), await it("packed-refs", async () => t3.write(`${e3}/packed-refs`, i2, { encoding: "utf8" })));
          }
          static async resolve({ fs: t3, gitdir: e3, ref: r2, depth: i2 }) {
            if (void 0 !== i2 && -1 === --i2) return r2;
            if (r2.startsWith("ref: ")) return r2 = r2.slice(5), nt.resolve({ fs: t3, gitdir: e3, ref: r2, depth: i2 });
            if (40 === r2.length && /[0-9a-f]{40}/.test(r2)) return r2;
            const n2 = await nt.packedRefs({ fs: t3, gitdir: e3 }), a2 = tt(r2).filter((t4) => !et.includes(t4));
            for (const r3 of a2) {
              const a3 = await it(r3, async () => await t3.read(`${e3}/${r3}`, { encoding: "utf8" }) || n2.get(r3));
              if (a3) return nt.resolve({ fs: t3, gitdir: e3, ref: a3.trim(), depth: i2 });
            }
            throw new I(r2);
          }
          static async exists({ fs: t3, gitdir: e3, ref: r2 }) {
            try {
              return await nt.expand({ fs: t3, gitdir: e3, ref: r2 }), true;
            } catch (t4) {
              return false;
            }
          }
          static async expand({ fs: t3, gitdir: e3, ref: r2 }) {
            if (40 === r2.length && /[0-9a-f]{40}/.test(r2)) return r2;
            const i2 = await nt.packedRefs({ fs: t3, gitdir: e3 }), n2 = tt(r2);
            for (const r3 of n2) {
              if (await it(r3, async () => t3.exists(`${e3}/${r3}`))) return r3;
              if (i2.has(r3)) return r3;
            }
            throw new I(r2);
          }
          static async expandAgainstMap({ ref: t3, map: e3 }) {
            const r2 = tt(t3);
            for (const t4 of r2) if (await e3.has(t4)) return t4;
            throw new I(t3);
          }
          static resolveAgainstMap({ ref: t3, fullref: e3 = t3, depth: r2, map: i2 }) {
            if (void 0 !== r2 && -1 === --r2) return { fullref: e3, oid: t3 };
            if (t3.startsWith("ref: ")) return t3 = t3.slice(5), nt.resolveAgainstMap({ ref: t3, fullref: e3, depth: r2, map: i2 });
            if (40 === t3.length && /[0-9a-f]{40}/.test(t3)) return { fullref: e3, oid: t3 };
            const n2 = tt(t3);
            for (const t4 of n2) {
              const e4 = i2.get(t4);
              if (e4) return nt.resolveAgainstMap({ ref: e4.trim(), fullref: t4, depth: r2, map: i2 });
            }
            throw new I(t3);
          }
          static async packedRefs({ fs: t3, gitdir: e3 }) {
            const r2 = await it("packed-refs", async () => t3.read(`${e3}/packed-refs`, { encoding: "utf8" }));
            return T.from(r2).refs;
          }
          static async listRefs({ fs: t3, gitdir: e3, filepath: r2 }) {
            const i2 = nt.packedRefs({ fs: t3, gitdir: e3 });
            let n2 = null;
            try {
              n2 = await t3.readdirDeep(`${e3}/${r2}`), n2 = n2.map((t4) => t4.replace(`${e3}/${r2}/`, ""));
            } catch (t4) {
              n2 = [];
            }
            for (let t4 of (await i2).keys()) t4.startsWith(r2) && (t4 = t4.replace(r2 + "/", ""), n2.includes(t4) || n2.push(t4));
            return n2.sort(D), n2;
          }
          static async listBranches({ fs: t3, gitdir: e3, remote: r2 }) {
            return r2 ? nt.listRefs({ fs: t3, gitdir: e3, filepath: `refs/remotes/${r2}` }) : nt.listRefs({ fs: t3, gitdir: e3, filepath: "refs/heads" });
          }
          static async listTags({ fs: t3, gitdir: e3 }) {
            return (await nt.listRefs({ fs: t3, gitdir: e3, filepath: "refs/tags" })).filter((t4) => !t4.endsWith("^{}"));
          }
        }
        function at(t3, e3) {
          return f(ot(t3), ot(e3));
        }
        function ot(t3) {
          return "040000" === t3.mode ? t3.path + "/" : t3.path;
        }
        function st(t3) {
          switch (t3) {
            case "040000":
              return "tree";
            case "100644":
            case "100755":
            case "120000":
              return "blob";
            case "160000":
              return "commit";
          }
          throw new o(`Unexpected GitTree entry mode: ${t3}`);
        }
        function ct(t3) {
          return !t3.oid && t3.sha && (t3.oid = t3.sha), t3.mode = (function(t4) {
            if ("number" == typeof t4 && (t4 = t4.toString(8)), t4.match(/^0?4.*/)) return "040000";
            if (t4.match(/^1006.*/)) return "100644";
            if (t4.match(/^1007.*/)) return "100755";
            if (t4.match(/^120.*/)) return "120000";
            if (t4.match(/^160.*/)) return "160000";
            throw new o(`Could not understand file mode: ${t4}`);
          })(t3.mode), t3.type || (t3.type = st(t3.mode)), t3;
        }
        class ft {
          constructor(t3) {
            if (Buffer.isBuffer(t3)) this._entries = (function(t4) {
              const e3 = [];
              let r2 = 0;
              for (; r2 < t4.length; ) {
                const i2 = t4.indexOf(32, r2);
                if (-1 === i2) throw new o(`GitTree: Error parsing buffer at byte location ${r2}: Could not find the next space character.`);
                const n2 = t4.indexOf(0, r2);
                if (-1 === n2) throw new o(`GitTree: Error parsing buffer at byte location ${r2}: Could not find the next null character.`);
                let a2 = t4.slice(r2, i2).toString("utf8");
                "40000" === a2 && (a2 = "040000");
                const c2 = st(a2), f2 = t4.slice(i2 + 1, n2).toString("utf8");
                if (f2.includes("\\") || f2.includes("/")) throw new s(f2);
                const l2 = t4.slice(n2 + 1, n2 + 21).toString("hex");
                r2 = n2 + 21, e3.push({ mode: a2, path: f2, oid: l2, type: c2 });
              }
              return e3;
            })(t3);
            else {
              if (!Array.isArray(t3)) throw new o("invalid type passed to GitTree constructor");
              this._entries = t3.map(ct);
            }
            this._entries.sort(l);
          }
          static from(t3) {
            return new ft(t3);
          }
          render() {
            return this._entries.map((t3) => `${t3.mode} ${t3.type} ${t3.oid}    ${t3.path}`).join("\n");
          }
          toObject() {
            const t3 = [...this._entries];
            return t3.sort(at), Buffer.concat(t3.map((t4) => {
              const e3 = Buffer.from(t4.mode.replace(/^0/, "")), r2 = Buffer.from(" "), i2 = Buffer.from(t4.path, "utf8"), n2 = Buffer.from([0]), a2 = Buffer.from(t4.oid, "hex");
              return Buffer.concat([e3, r2, i2, n2, a2]);
            }));
          }
          entries() {
            return this._entries;
          }
          *[Symbol.iterator]() {
            for (const t3 of this._entries) yield t3;
          }
        }
        class lt {
          static wrap({ type: t3, object: e3 }) {
            const r2 = `${t3} ${e3.length}\0`, i2 = r2.length, n2 = i2 + e3.length, a2 = new Uint8Array(n2);
            for (let t4 = 0; t4 < i2; t4++) a2[t4] = r2.charCodeAt(t4);
            return a2.set(e3, i2), a2;
          }
          static unwrap(t3) {
            const e3 = t3.indexOf(32), r2 = t3.indexOf(0), i2 = t3.slice(0, e3).toString("utf8"), n2 = t3.slice(e3 + 1, r2).toString("utf8"), a2 = t3.length - (r2 + 1);
            if (parseInt(n2) !== a2) throw new o(`Length mismatch: expected ${n2} bytes but got ${a2} instead.`);
            return { type: i2, object: Buffer.from(t3.slice(r2 + 1)) };
          }
        }
        async function dt({ fs: t3, gitdir: e3, oid: r2 }) {
          const i2 = `objects/${r2.slice(0, 2)}/${r2.slice(2)}`, n2 = await t3.read(`${e3}/${i2}`);
          return n2 ? { object: n2, format: "deflated", source: i2 } : null;
        }
        var ut = r(2566);
        function ht(t3) {
          let e3 = 0, r2 = 0, i2 = null;
          do {
            i2 = t3.readUInt8(), e3 |= (127 & i2) << r2, r2 += 7;
          } while (128 & i2);
          return e3;
        }
        function pt(t3, e3, r2) {
          let i2 = 0, n2 = 0;
          for (; r2--; ) 1 & e3 && (i2 |= t3.readUInt8() << n2), e3 >>= 1, n2 += 8;
          return i2;
        }
        function gt(t3, e3) {
          const r2 = t3.readUInt8();
          if (128 & r2) {
            const i2 = pt(t3, 15 & r2, 4);
            let n2 = pt(t3, (112 & r2) >> 4, 3);
            return 0 === n2 && (n2 = 65536), e3.slice(i2, i2 + n2);
          }
          return t3.slice(r2);
        }
        var wt = r(1668);
        function mt(t3) {
          return t3[Symbol.asyncIterator] ? t3[Symbol.asyncIterator]() : t3[Symbol.iterator] ? t3[Symbol.iterator]() : t3.next ? t3 : /* @__PURE__ */ (function(t4) {
            let e3 = [t4];
            return { next: () => Promise.resolve({ done: 0 === e3.length, value: e3.pop() }), return: () => (e3 = [], {}), [Symbol.asyncIterator]() {
              return this;
            } };
          })(t3);
        }
        class yt {
          constructor(t3) {
            if ("undefined" == typeof Buffer) throw new Error("Missing Buffer dependency");
            this.stream = mt(t3), this.buffer = null, this.cursor = 0, this.undoCursor = 0, this.started = false, this._ended = false, this._discardedBytes = 0;
          }
          eof() {
            return this._ended && this.cursor === this.buffer.length;
          }
          tell() {
            return this._discardedBytes + this.cursor;
          }
          async byte() {
            if (!this.eof() && (this.started || await this._init(), this.cursor !== this.buffer.length || (await this._loadnext(), !this._ended))) return this._moveCursor(1), this.buffer[this.undoCursor];
          }
          async chunk() {
            if (!this.eof() && (this.started || await this._init(), this.cursor !== this.buffer.length || (await this._loadnext(), !this._ended))) return this._moveCursor(this.buffer.length), this.buffer.slice(this.undoCursor, this.cursor);
          }
          async read(t3) {
            if (!this.eof()) return this.started || await this._init(), this.cursor + t3 > this.buffer.length && (this._trim(), await this._accumulate(t3)), this._moveCursor(t3), this.buffer.slice(this.undoCursor, this.cursor);
          }
          async skip(t3) {
            this.eof() || (this.started || await this._init(), this.cursor + t3 > this.buffer.length && (this._trim(), await this._accumulate(t3)), this._moveCursor(t3));
          }
          async undo() {
            this.cursor = this.undoCursor;
          }
          async _next() {
            this.started = true;
            let { done: t3, value: e3 } = await this.stream.next();
            return t3 && (this._ended = true, !e3) ? Buffer.alloc(0) : (e3 && (e3 = Buffer.from(e3)), e3);
          }
          _trim() {
            this.buffer = this.buffer.slice(this.undoCursor), this.cursor -= this.undoCursor, this._discardedBytes += this.undoCursor, this.undoCursor = 0;
          }
          _moveCursor(t3) {
            this.undoCursor = this.cursor, this.cursor += t3, this.cursor > this.buffer.length && (this.cursor = this.buffer.length);
          }
          async _accumulate(t3) {
            if (this._ended) return;
            const e3 = [this.buffer];
            for (; this.cursor + t3 > bt(e3); ) {
              const t4 = await this._next();
              if (this._ended) break;
              e3.push(t4);
            }
            this.buffer = Buffer.concat(e3);
          }
          async _loadnext() {
            this._discardedBytes += this.buffer.length, this.undoCursor = 0, this.cursor = 0, this.buffer = await this._next();
          }
          async _init() {
            this.buffer = await this._next();
          }
        }
        function bt(t3) {
          return t3.reduce((t4, e3) => t4 + e3.length, 0);
        }
        async function _t(t3) {
          let e3 = await t3.byte();
          const r2 = e3 >> 4 & 7;
          let i2, n2, a2 = 15 & e3;
          if (128 & e3) {
            let r3 = 4;
            do {
              e3 = await t3.byte(), a2 |= (127 & e3) << r3, r3 += 7;
            } while (128 & e3);
          }
          if (6 === r2) {
            let r3 = 0;
            i2 = 0;
            const a3 = [];
            do {
              e3 = await t3.byte(), i2 |= (127 & e3) << r3, r3 += 7, a3.push(e3);
            } while (128 & e3);
            n2 = Buffer.from(a3);
          }
          return 7 === r2 && (n2 = await t3.read(20)), { type: r2, length: a2, ofs: i2, reference: n2 };
        }
        let vt = false;
        async function xt(t3) {
          return null === vt && (vt = (function() {
            try {
              if (new DecompressionStream("deflate")) return true;
            } catch (t4) {
            }
            return false;
          })()), vt ? (async function(t4) {
            const e3 = new DecompressionStream("deflate"), r2 = new Blob([t4]).stream().pipeThrough(e3);
            return new Uint8Array(await new Response(r2).arrayBuffer());
          })(t3) : wt.inflate(t3);
        }
        class kt {
          constructor(t3) {
            Object.assign(this, t3), this.offsetCache = {};
          }
          static async fromIdx({ idx: t3, getExternalRefDelta: e3 }) {
            const r2 = new c(t3);
            if ("ff744f63" !== r2.slice(4).toString("hex")) return;
            const i2 = r2.readUInt32BE();
            if (2 !== i2) throw new o(`Unable to read version ${i2} packfile IDX. (Only version 2 supported)`);
            if (t3.byteLength > 2147483648) throw new o("To keep implementation simple, I haven't implemented the layer 5 feature needed to support packfiles > 2GB in size.");
            r2.seek(r2.tell() + 1020);
            const n2 = r2.readUInt32BE(), a2 = [];
            for (let t4 = 0; t4 < n2; t4++) {
              const e4 = r2.slice(20).toString("hex");
              a2[t4] = e4;
            }
            r2.seek(r2.tell() + 4 * n2);
            const s2 = /* @__PURE__ */ new Map();
            for (let t4 = 0; t4 < n2; t4++) s2.set(a2[t4], r2.readUInt32BE());
            const f2 = r2.slice(20).toString("hex");
            return new kt({ hashes: a2, crcs: {}, offsets: s2, packfileSha: f2, getExternalRefDelta: e3 });
          }
          static async fromPack({ pack: t3, getExternalRefDelta: e3, onProgress: r2 }) {
            const i2 = { 1: "commit", 2: "tree", 3: "blob", 4: "tag", 6: "ofs-delta", 7: "ref-delta" }, n2 = {}, a2 = t3.slice(-20).toString("hex"), s2 = [], c2 = {}, f2 = /* @__PURE__ */ new Map();
            let l2 = null, d2 = null;
            await (async function(t4, e4) {
              const r3 = new yt(t4);
              let i3 = await r3.read(4);
              if (i3 = i3.toString("utf8"), "PACK" !== i3) throw new o(`Invalid PACK header '${i3}'`);
              let n3 = await r3.read(4);
              if (n3 = n3.readUInt32BE(0), 2 !== n3) throw new o(`Invalid packfile version: ${n3}`);
              let a3 = await r3.read(4);
              if (a3 = a3.readUInt32BE(0), !(a3 < 1)) for (; !r3.eof() && a3--; ) {
                const t5 = r3.tell(), { type: i4, length: n4, ofs: s3, reference: c3 } = await _t(r3), f3 = new wt.Inflate();
                for (; !f3.result; ) {
                  const l3 = await r3.chunk();
                  if (!l3) break;
                  if (f3.push(l3, false), f3.err) throw new o(`Pako error: ${f3.msg}`);
                  if (f3.result) {
                    if (f3.result.length !== n4) throw new o("Inflated object size is different from that stated in packfile.");
                    await r3.undo(), await r3.read(l3.length - f3.strm.avail_in);
                    const d3 = r3.tell();
                    await e4({ data: f3.result, type: i4, num: a3, offset: t5, end: d3, reference: c3, ofs: s3 });
                  }
                }
              }
            })([t3], async ({ data: t4, type: e4, reference: a3, offset: o2, num: s3 }) => {
              null === l2 && (l2 = s3);
              const c3 = Math.floor(100 * (l2 - s3) / l2);
              c3 !== d2 && r2 && await r2({ phase: "Receiving objects", loaded: l2 - s3, total: l2 }), d2 = c3, (["commit", "tree", "blob", "tag"].includes(e4 = i2[e4]) || "ofs-delta" === e4 || "ref-delta" === e4) && (n2[o2] = { type: e4, offset: o2 });
            });
            const u2 = Object.keys(n2).map(Number);
            for (const [e4, r3] of u2.entries()) {
              const i3 = e4 + 1 === u2.length ? t3.byteLength - 20 : u2[e4 + 1], a3 = n2[r3], o2 = ut.buf(t3.slice(r3, i3)) >>> 0;
              a3.end = i3, a3.crc = o2;
            }
            const h2 = new kt({ pack: Promise.resolve(t3), packfileSha: a2, crcs: c2, hashes: s2, offsets: f2, getExternalRefDelta: e3 });
            d2 = null;
            let p2 = 0;
            const g2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (let t4 in n2) {
              t4 = Number(t4);
              const e4 = Math.floor(100 * p2 / l2);
              e4 !== d2 && r2 && await r2({ phase: "Resolving deltas", loaded: p2, total: l2 }), p2++, d2 = e4;
              const i3 = n2[t4];
              if (!i3.oid) try {
                h2.readDepth = 0, h2.externalReadDepth = 0;
                const { type: e5, object: r3 } = await h2.readSlice({ start: t4 });
                g2[h2.readDepth] += 1;
                const n3 = await m(lt.wrap({ type: e5, object: r3 }));
                i3.oid = n3, s2.push(n3), f2.set(n3, t4), c2[n3] = i3.crc;
              } catch (t5) {
                continue;
              }
            }
            return s2.sort(), h2;
          }
          async toBuffer() {
            const t3 = [], e3 = (e4, r3) => {
              t3.push(Buffer.from(e4, r3));
            };
            e3("ff744f63", "hex"), e3("00000002", "hex");
            const r2 = new c(Buffer.alloc(1024));
            for (let t4 = 0; t4 < 256; t4++) {
              let e4 = 0;
              for (const r3 of this.hashes) parseInt(r3.slice(0, 2), 16) <= t4 && e4++;
              r2.writeUInt32BE(e4);
            }
            t3.push(r2.buffer);
            for (const t4 of this.hashes) e3(t4, "hex");
            const i2 = new c(Buffer.alloc(4 * this.hashes.length));
            for (const t4 of this.hashes) i2.writeUInt32BE(this.crcs[t4]);
            t3.push(i2.buffer);
            const n2 = new c(Buffer.alloc(4 * this.hashes.length));
            for (const t4 of this.hashes) n2.writeUInt32BE(this.offsets.get(t4));
            t3.push(n2.buffer), e3(this.packfileSha, "hex");
            const a2 = Buffer.concat(t3), o2 = await m(a2), s2 = Buffer.alloc(20);
            return s2.write(o2, "hex"), Buffer.concat([a2, s2]);
          }
          async load({ pack: t3 }) {
            this.pack = t3;
          }
          async unload() {
            this.pack = null;
          }
          async read({ oid: t3 }) {
            if (!this.offsets.get(t3)) {
              if (this.getExternalRefDelta) return this.externalReadDepth++, this.getExternalRefDelta(t3);
              throw new o(`Could not read object ${t3} from packfile`);
            }
            const e3 = this.offsets.get(t3);
            return this.readSlice({ start: e3 });
          }
          async readSlice({ start: t3 }) {
            if (this.offsetCache[t3]) return Object.assign({}, this.offsetCache[t3]);
            this.readDepth++;
            const e3 = await this.pack;
            if (!e3) throw new o("Could not read packfile data. The packfile may be missing, corrupted, or too large to read into memory.");
            const r2 = e3.slice(t3), i2 = new c(r2), n2 = i2.readUInt8(), a2 = 112 & n2;
            let s2 = { 16: "commit", 32: "tree", 48: "blob", 64: "tag", 96: "ofs_delta", 112: "ref_delta" }[a2];
            if (void 0 === s2) throw new o("Unrecognized type: 0b" + a2.toString(2));
            const f2 = 15 & n2;
            let l2 = f2;
            128 & n2 && (l2 = (function(t4, e4) {
              let r3 = e4, i3 = 4, n3 = null;
              do {
                n3 = t4.readUInt8(), r3 |= (127 & n3) << i3, i3 += 7;
              } while (128 & n3);
              return r3;
            })(i2, f2));
            let d2 = null, u2 = null;
            if ("ofs_delta" === s2) {
              const e4 = (function(t4) {
                const e5 = [];
                let r4 = 0, i3 = 0;
                do {
                  r4 = t4.readUInt8();
                  const n3 = 127 & r4;
                  e5.push(n3), i3 = 128 & r4;
                } while (i3);
                return e5.reduce((t5, e6) => t5 + 1 << 7 | e6, -1);
              })(i2), r3 = t3 - e4;
              ({ object: d2, type: s2 } = await this.readSlice({ start: r3 }));
            }
            if ("ref_delta" === s2) {
              const t4 = i2.slice(20).toString("hex");
              ({ object: d2, type: s2 } = await this.read({ oid: t4 }));
            }
            const h2 = r2.slice(i2.tell());
            if (u2 = Buffer.from(await xt(h2)), u2.byteLength !== l2) throw new o(`Packfile told us object would have length ${l2} but it had length ${u2.byteLength}`);
            return d2 && (u2 = Buffer.from((function(t4, e4) {
              const r3 = new c(t4), i3 = ht(r3);
              if (i3 !== e4.byteLength) throw new o(`applyDelta expected source buffer to be ${i3} bytes but the provided buffer was ${e4.length} bytes`);
              const n3 = ht(r3);
              let a3;
              const s3 = gt(r3, e4);
              if (s3.byteLength === n3) a3 = s3;
              else {
                a3 = Buffer.alloc(n3);
                const t5 = new c(a3);
                for (t5.copy(s3); !r3.eof(); ) t5.copy(gt(r3, e4));
                const i4 = t5.tell();
                if (n3 !== i4) throw new o(`applyDelta expected target buffer to be ${n3} bytes but the resulting buffer was ${i4} bytes`);
              }
              return a3;
            })(u2, d2))), this.readDepth > 3 && (this.offsetCache[t3] = { type: s2, object: u2 }), { type: s2, format: "content", object: u2 };
          }
        }
        const Et = Symbol("PackfileCache");
        function At({ fs: t3, cache: e3, filename: r2, getExternalRefDelta: i2, emitter: n2, emitterPrefix: a2 }) {
          e3[Et] || (e3[Et] = /* @__PURE__ */ new Map());
          let o2 = e3[Et].get(r2);
          return o2 || (o2 = (async function({ fs: t4, filename: e4, getExternalRefDelta: r3, emitter: i3, emitterPrefix: n3 }) {
            const a3 = await t4.read(e4);
            return kt.fromIdx({ idx: a3, getExternalRefDelta: r3 });
          })({ fs: t3, filename: r2, getExternalRefDelta: i2, emitter: n2, emitterPrefix: a2 }), e3[Et].set(r2, o2)), o2;
        }
        async function St(t3, { start: e3 = 0, end: r2 = t3.length } = {}) {
          return m(t3.subarray(e3, r2));
        }
        async function Bt({ fs: t3, cache: e3, gitdir: r2, oid: i2, format: n2 = "content" }) {
          const a2 = (i3) => Bt({ fs: t3, cache: e3, gitdir: r2, oid: i3 });
          let s2;
          if ("4b825dc642cb6eb9a060e54bf8d69288fbee4904" === i2 && (s2 = { format: "wrapped", object: Buffer.from("tree 0\0") }), s2 || (s2 = await dt({ fs: t3, gitdir: r2, oid: i2 })), !s2) {
            if (s2 = await (async function({ fs: t4, cache: e4, gitdir: r3, oid: i3, format: n3 = "content", getExternalRefDelta: a3 }) {
              let s3 = await t4.readdir(N(r3, "objects/pack"));
              s3 = s3.filter((t5) => t5.endsWith(".idx"));
              for (const n4 of s3) {
                const s4 = `${r3}/objects/pack/${n4}`, c3 = await At({ fs: t4, cache: e4, filename: s4, getExternalRefDelta: a3 });
                if (c3.error) throw new o(c3.error);
                if (c3.offsets.has(i3)) {
                  const e5 = s4.replace(/idx$/, "pack");
                  c3.pack || (c3.pack = t4.read(e5));
                  const r4 = await c3.pack;
                  if (!r4) throw c3.pack = null, new o(`Could not read packfile at ${e5}. The file may be missing, corrupted, or too large to read into memory.`);
                  if (!c3._checksumVerified) {
                    const t5 = c3.packfileSha, e6 = r4.subarray(-20), i4 = Array.from(e6).map((t6) => t6.toString(16).padStart(2, "0")).join("");
                    if (i4 !== t5) throw new o(`Packfile trailer mismatch: expected ${t5}, got ${i4}. The packfile may be corrupted.`);
                    const n5 = await St(r4, { start: 0, end: r4.length - 20 });
                    if (n5 !== t5) throw new o(`Packfile payload corrupted: calculated ${n5} but expected ${t5}. The packfile may have been tampered with.`);
                    c3._checksumVerified = true;
                  }
                  const f3 = await c3.read({ oid: i3, getExternalRefDelta: a3 });
                  return f3.format = "content", f3.source = `objects/pack/${n4.replace(/idx$/, "pack")}`, f3;
                }
              }
              return null;
            })({ fs: t3, cache: e3, gitdir: r2, oid: i2, getExternalRefDelta: a2 }), !s2) throw new I(i2);
            return s2;
          }
          if ("deflated" === n2) return s2;
          if ("deflated" === s2.format && (s2.object = Buffer.from(await xt(s2.object)), s2.format = "wrapped"), "wrapped" === n2) return s2;
          const c2 = await m(s2.object);
          if (c2 !== i2) throw new o(`SHA check failed! Expected ${i2}, computed ${c2}`);
          const { object: f2, type: l2 } = lt.unwrap(s2.object);
          if (s2.type = l2, s2.object = f2, s2.format = "content", "content" === n2) return s2;
          throw new o(`invalid requested format "${n2}"`);
        }
        function $t({ name: t3, email: e3, timestamp: r2, timezoneOffset: i2 }) {
          return `${t3} <${e3}> ${r2} ${i2 = (function(t4) {
            const e4 = (function(t5) {
              return Math.sign(t5) || (Object.is(t5, -0) ? -1 : 1);
            })(0 === (r3 = t4) ? r3 : -r3);
            var r3;
            t4 = Math.abs(t4);
            const i3 = Math.floor(t4 / 60);
            t4 -= 60 * i3;
            let n2 = String(i3), a2 = String(t4);
            return n2.length < 2 && (n2 = "0" + n2), a2.length < 2 && (a2 = "0" + a2), (-1 === e4 ? "-" : "+") + n2 + a2;
          })(i2)}`;
        }
        function Rt(t3) {
          return (t3 = (t3 = t3.replace(/\r/g, "")).replace(/^\n+/, "")).replace(/\n+$/, "") + "\n";
        }
        function Pt(t3) {
          const [, e3, r2, i2, n2] = t3.match(/^(.*) <(.*)> (.*) (.*)$/);
          return { name: e3, email: r2, timestamp: Number(i2), timezoneOffset: It(n2) };
        }
        function It(t3) {
          let [, e3, r2, i2] = t3.match(/(\+|-)(\d\d)(\d\d)/);
          return i2 = ("+" === e3 ? 1 : -1) * (60 * Number(r2) + Number(i2)), 0 === (n2 = i2) ? n2 : -n2;
          var n2;
        }
        class Ot {
          constructor(t3) {
            if ("string" == typeof t3) this._tag = t3;
            else if (Buffer.isBuffer(t3)) this._tag = t3.toString("utf8");
            else {
              if ("object" != typeof t3) throw new o("invalid type passed to GitAnnotatedTag constructor");
              this._tag = Ot.render(t3);
            }
          }
          static from(t3) {
            return new Ot(t3);
          }
          static render(t3) {
            return `object ${t3.object}
type ${t3.type}
tag ${t3.tag}
tagger ${$t(t3.tagger)}

${t3.message}
${t3.gpgsig ? t3.gpgsig : ""}`;
          }
          justHeaders() {
            return this._tag.slice(0, this._tag.indexOf("\n\n"));
          }
          message() {
            const t3 = this.withoutSignature();
            return t3.slice(t3.indexOf("\n\n") + 2);
          }
          parse() {
            return Object.assign(this.headers(), { message: this.message(), gpgsig: this.gpgsig() });
          }
          render() {
            return this._tag;
          }
          headers() {
            const t3 = this.justHeaders().split("\n"), e3 = [];
            for (const r3 of t3) " " === r3[0] ? e3[e3.length - 1] += "\n" + r3.slice(1) : e3.push(r3);
            const r2 = {};
            for (const t4 of e3) {
              const e4 = t4.slice(0, t4.indexOf(" ")), i2 = t4.slice(t4.indexOf(" ") + 1);
              Array.isArray(r2[e4]) ? r2[e4].push(i2) : r2[e4] = i2;
            }
            return r2.tagger && (r2.tagger = Pt(r2.tagger)), r2.committer && (r2.committer = Pt(r2.committer)), r2;
          }
          withoutSignature() {
            const t3 = Rt(this._tag);
            return -1 === t3.indexOf("\n-----BEGIN PGP SIGNATURE-----") ? t3 : t3.slice(0, t3.lastIndexOf("\n-----BEGIN PGP SIGNATURE-----"));
          }
          gpgsig() {
            if (-1 !== this._tag.indexOf("\n-----BEGIN PGP SIGNATURE-----")) return Rt(this._tag.slice(this._tag.indexOf("-----BEGIN PGP SIGNATURE-----"), this._tag.indexOf("-----END PGP SIGNATURE-----") + 27));
          }
          payload() {
            return this.withoutSignature() + "\n";
          }
          toObject() {
            return Buffer.from(this._tag, "utf8");
          }
          static async sign(t3, e3, r2) {
            const i2 = t3.payload();
            let { signature: n2 } = await e3({ payload: i2, secretKey: r2 });
            n2 = Rt(n2);
            const a2 = i2 + n2;
            return Ot.from(a2);
          }
        }
        function jt(t3) {
          return t3.trim().split("\n").map((t4) => " " + t4).join("\n") + "\n";
        }
        class Ut {
          constructor(t3) {
            if ("string" == typeof t3) this._commit = t3;
            else if (Buffer.isBuffer(t3)) this._commit = t3.toString("utf8");
            else {
              if ("object" != typeof t3) throw new o("invalid type passed to GitCommit constructor");
              this._commit = Ut.render(t3);
            }
          }
          static fromPayloadSignature({ payload: t3, signature: e3 }) {
            const r2 = Ut.justHeaders(t3), i2 = Ut.justMessage(t3), n2 = Rt(r2 + "\ngpgsig" + jt(e3) + "\n" + i2);
            return new Ut(n2);
          }
          static from(t3) {
            return new Ut(t3);
          }
          toObject() {
            return Buffer.from(this._commit, "utf8");
          }
          headers() {
            return this.parseHeaders();
          }
          message() {
            return Ut.justMessage(this._commit);
          }
          parse() {
            return Object.assign({ message: this.message() }, this.headers());
          }
          static justMessage(t3) {
            return Rt(t3.slice(t3.indexOf("\n\n") + 2));
          }
          static justHeaders(t3) {
            return t3.slice(0, t3.indexOf("\n\n"));
          }
          parseHeaders() {
            const t3 = Ut.justHeaders(this._commit).split("\n"), e3 = [];
            for (const r3 of t3) " " === r3[0] ? e3[e3.length - 1] += "\n" + r3.slice(1) : e3.push(r3);
            const r2 = { parent: [] };
            for (const t4 of e3) {
              const e4 = t4.slice(0, t4.indexOf(" ")), i2 = t4.slice(t4.indexOf(" ") + 1);
              Array.isArray(r2[e4]) ? r2[e4].push(i2) : r2[e4] = i2;
            }
            return r2.author && (r2.author = Pt(r2.author)), r2.committer && (r2.committer = Pt(r2.committer)), r2;
          }
          static renderHeaders(t3) {
            let e3 = "";
            if (t3.tree ? e3 += `tree ${t3.tree}
` : e3 += "tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\n", t3.parent) {
              if (void 0 === t3.parent.length) throw new o("commit 'parent' property should be an array");
              for (const r2 of t3.parent) e3 += `parent ${r2}
`;
            }
            return e3 += `author ${$t(t3.author)}
`, e3 += `committer ${$t(t3.committer || t3.author)}
`, t3.gpgsig && (e3 += "gpgsig" + jt(t3.gpgsig)), e3;
          }
          static render(t3) {
            return Ut.renderHeaders(t3) + "\n" + Rt(t3.message);
          }
          render() {
            return this._commit;
          }
          withoutSignature() {
            const t3 = Rt(this._commit);
            return -1 === t3.indexOf("\ngpgsig") ? t3 : Rt(t3.slice(0, t3.indexOf("\ngpgsig")) + "\n" + t3.slice(t3.indexOf("-----END PGP SIGNATURE-----\n") + 28));
          }
          isolateSignature() {
            return this._commit.slice(this._commit.indexOf("-----BEGIN PGP SIGNATURE-----"), this._commit.indexOf("-----END PGP SIGNATURE-----") + 27).split("\n").map((t3) => t3.replace(/^ /, "")).join("\n");
          }
          static async sign(t3, e3, r2) {
            const i2 = t3.withoutSignature(), n2 = Ut.justMessage(t3._commit);
            let { signature: a2 } = await e3({ payload: i2, secretKey: r2 });
            a2 = Rt(a2);
            const o2 = Ut.justHeaders(t3._commit) + "\ngpgsig" + jt(a2) + "\n" + n2;
            return Ut.from(o2);
          }
        }
        async function Tt({ fs: t3, cache: e3, gitdir: r2, oid: i2 }) {
          if ("4b825dc642cb6eb9a060e54bf8d69288fbee4904" === i2) return { tree: ft.from([]), oid: i2 };
          const { type: n2, object: a2 } = await Bt({ fs: t3, cache: e3, gitdir: r2, oid: i2 });
          if ("tag" === n2) return Tt({ fs: t3, cache: e3, gitdir: r2, oid: i2 = Ot.from(a2).parse().object });
          if ("commit" === n2) return Tt({ fs: t3, cache: e3, gitdir: r2, oid: i2 = Ut.from(a2).parse().tree });
          if ("tree" !== n2) throw new O(i2, n2, "tree");
          return { tree: ft.from(a2), oid: i2 };
        }
        class Ct {
          constructor({ fs: t3, gitdir: e3, ref: r2, cache: i2 }) {
            this.fs = t3, this.cache = i2, this.gitdir = e3, this.mapPromise = (async () => {
              const i3 = /* @__PURE__ */ new Map();
              let n3;
              try {
                n3 = await nt.resolve({ fs: t3, gitdir: e3, ref: r2 });
              } catch (t4) {
                t4 instanceof I && (n3 = "4b825dc642cb6eb9a060e54bf8d69288fbee4904");
              }
              const a2 = await Tt({ fs: t3, cache: this.cache, gitdir: e3, oid: n3 });
              return a2.type = "tree", a2.mode = "40000", i3.set(".", a2), i3;
            })();
            const n2 = this;
            this.ConstructEntry = class {
              constructor(t4) {
                this._fullpath = t4, this._type = false, this._mode = false, this._stat = false, this._content = false, this._oid = false;
              }
              async type() {
                return n2.type(this);
              }
              async mode() {
                return n2.mode(this);
              }
              async stat() {
                return n2.stat(this);
              }
              async content() {
                return n2.content(this);
              }
              async oid() {
                return n2.oid(this);
              }
            };
          }
          async readdir(t3) {
            const e3 = t3._fullpath, { fs: r2, cache: i2, gitdir: n2 } = this, a2 = await this.mapPromise, o2 = a2.get(e3);
            if (!o2) throw new Error(`No obj for ${e3}`);
            const s2 = o2.oid;
            if (!s2) throw new Error(`No oid for obj ${JSON.stringify(o2)}`);
            if ("tree" !== o2.type) return null;
            const { type: c2, object: f2 } = await Bt({ fs: r2, cache: i2, gitdir: n2, oid: s2 });
            if (c2 !== o2.type) throw new O(s2, c2, o2.type);
            const l2 = ft.from(f2);
            for (const t4 of l2) a2.set(N(e3, t4.path), t4);
            return l2.entries().map((t4) => N(e3, t4.path));
          }
          async type(t3) {
            if (false === t3._type) {
              const e3 = await this.mapPromise, { type: r2 } = e3.get(t3._fullpath);
              t3._type = r2;
            }
            return t3._type;
          }
          async mode(t3) {
            if (false === t3._mode) {
              const e3 = await this.mapPromise, { mode: r2 } = e3.get(t3._fullpath);
              t3._mode = d(parseInt(r2, 8));
            }
            return t3._mode;
          }
          async stat(t3) {
          }
          async content(t3) {
            if (false === t3._content) {
              const e3 = await this.mapPromise, { fs: r2, cache: i2, gitdir: n2 } = this, a2 = e3.get(t3._fullpath).oid, { type: o2, object: s2 } = await Bt({ fs: r2, cache: i2, gitdir: n2, oid: a2 });
              t3._content = "blob" !== o2 ? void 0 : new Uint8Array(s2);
            }
            return t3._content;
          }
          async oid(t3) {
            if (false === t3._oid) {
              const e3 = (await this.mapPromise).get(t3._fullpath);
              t3._oid = e3.oid;
            }
            return t3._oid;
          }
        }
        function Mt({ ref: t3 = "HEAD" } = {}) {
          const e3 = /* @__PURE__ */ Object.create(null);
          return Object.defineProperty(e3, R, { value: function({ fs: e4, gitdir: r2, cache: i2 }) {
            return new Ct({ fs: e4, gitdir: r2, ref: t3, cache: i2 });
          } }), Object.freeze(e3), e3;
        }
        class Dt {
          constructor({ fs: t3, dir: e3, gitdir: r2, cache: i2, refresh: n2 = true }) {
            this.fs = t3, this.cache = i2, this.dir = e3, this.gitdir = r2, this.refresh = n2, this.config = null;
            const a2 = this;
            this.ConstructEntry = class {
              constructor(t4) {
                this._fullpath = t4, this._type = false, this._mode = false, this._stat = false, this._content = false, this._oid = false;
              }
              async type() {
                return a2.type(this);
              }
              async mode() {
                return a2.mode(this);
              }
              async stat() {
                return a2.stat(this);
              }
              async content() {
                return a2.content(this);
              }
              async oid() {
                return a2.oid(this);
              }
            };
          }
          async readdir(t3) {
            const e3 = t3._fullpath, { fs: r2, dir: i2 } = this, n2 = await r2.readdir(N(i2, e3));
            return null === n2 ? null : n2.map((t4) => N(e3, t4));
          }
          async type(t3) {
            return false === t3._type && await t3.stat(), t3._type;
          }
          async mode(t3) {
            return false === t3._mode && await t3.stat(), t3._mode;
          }
          async stat(t3) {
            if (false === t3._stat) {
              const { fs: e3, dir: r2 } = this;
              let i2 = await e3.lstat(`${r2}/${t3._fullpath}`);
              if (!i2) throw new Error(`ENOENT: no such file or directory, lstat '${t3._fullpath}'`);
              let n2 = i2.isDirectory() ? "tree" : "blob";
              "blob" !== n2 || i2.isFile() || i2.isSymbolicLink() || (n2 = "special"), t3._type = n2, i2 = p(i2), t3._mode = i2.mode, -1 === i2.size && t3._actualSize && (i2.size = t3._actualSize), t3._stat = i2;
            }
            return t3._stat;
          }
          async content(t3) {
            if (false === t3._content) {
              const { fs: e3, dir: r2, gitdir: i2 } = this;
              if ("tree" === await t3.type()) t3._content = void 0;
              else {
                let n2;
                if (await t3.mode() >> 12 == 10) n2 = await e3.readlink(`${r2}/${t3._fullpath}`);
                else {
                  const a2 = await this._getGitConfig(e3, i2), o2 = await a2.get("core.autocrlf");
                  n2 = await e3.read(`${r2}/${t3._fullpath}`, { autocrlf: o2 });
                }
                t3._actualSize = n2.length, t3._stat && -1 === t3._stat.size && (t3._stat.size = t3._actualSize), t3._content = new Uint8Array(n2);
              }
            }
            return t3._content;
          }
          async oid(t3) {
            if (false === t3._oid) {
              const e3 = this, { fs: r2, gitdir: i2, cache: n2 } = this;
              let a2;
              await E.acquire({ fs: r2, gitdir: i2, cache: n2 }, async function(n3) {
                const o2 = n3.entriesMap.get(t3._fullpath), s2 = await t3.stat(), c2 = await e3._getGitConfig(r2, i2), f2 = await c2.get("core.filemode"), l2 = "undefined" == typeof process || !("win32" === process.platform);
                if (!o2 || v(s2, o2, f2, l2)) {
                  const r3 = await t3.content();
                  void 0 === r3 ? a2 = void 0 : (a2 = await m(lt.wrap({ type: "blob", object: r3 })), e3.refresh && o2 && a2 === o2.oid && (!f2 || s2.mode === o2.mode) && v(s2, o2, f2, l2) && n3.insert({ filepath: t3._fullpath, stats: s2, oid: a2 }));
                } else a2 = o2.oid;
              }), t3._oid = a2;
            }
            return t3._oid;
          }
          async _getGitConfig(t3, e3) {
            return this.config || (this.config = await Q.get({ fs: t3, gitdir: e3 })), this.config;
          }
        }
        function Nt({ refresh: t3 = true } = {}) {
          const e3 = /* @__PURE__ */ Object.create(null);
          return Object.defineProperty(e3, R, { value: function({ fs: e4, dir: r2, gitdir: i2, cache: n2 }) {
            return new Dt({ fs: e4, dir: r2, gitdir: i2, cache: n2, refresh: t3 });
          } }), Object.freeze(e3), e3;
        }
        const zt = void 0 === Array.prototype.flat ? (t3) => t3.reduce((t4, e3) => t4.concat(e3), []) : (t3) => t3.flat();
        class Ft {
          constructor() {
            this.value = null;
          }
          consider(t3) {
            null != t3 && (null === this.value || t3 < this.value) && (this.value = t3);
          }
          reset() {
            this.value = null;
          }
        }
        function* Lt(t3) {
          const e3 = new Ft();
          let r2;
          const i2 = [], n2 = t3.length;
          for (let r3 = 0; r3 < n2; r3++) i2[r3] = t3[r3].next().value, void 0 !== i2[r3] && e3.consider(i2[r3]);
          if (null !== e3.value) for (; ; ) {
            const a2 = [];
            r2 = e3.value, e3.reset();
            for (let o2 = 0; o2 < n2; o2++) void 0 !== i2[o2] && i2[o2] === r2 ? (a2[o2] = i2[o2], i2[o2] = t3[o2].next().value) : a2[o2] = null, void 0 !== i2[o2] && e3.consider(i2[o2]);
            if (yield a2, null === e3.value) return;
          }
        }
        async function Ht({ fs: t3, cache: e3, dir: r2, gitdir: i2, trees: n2, map: a2 = async (t4, e4) => e4, reduce: o2 = async (t4, e4) => {
          const r3 = zt(e4);
          return void 0 !== t4 && r3.unshift(t4), r3;
        }, iterate: s2 = (t4, e4) => Promise.all([...e4].map(t4)) }) {
          const c2 = n2.map((n3) => n3[R]({ fs: t3, dir: r2, gitdir: i2, cache: e3 })), f2 = new Array(c2.length).fill("."), l2 = (function(t4, e4) {
            const r3 = e4 - 0;
            return Array.from({ length: r3 }, (t5, e5) => 0 + e5);
          })(0, c2.length), d2 = async (t4) => {
            const { entries: e4, children: r3 } = await (async (t5) => {
              l2.forEach((e6) => {
                const r4 = t5[e6];
                t5[e6] = r4 && new c2[e6].ConstructEntry(r4);
              });
              const e5 = (await Promise.all(l2.map((e6) => {
                const r4 = t5[e6];
                return r4 ? c2[e6].readdir(r4) : [];
              }))).map((t6) => (null === t6 ? [] : t6)[Symbol.iterator]());
              return { entries: t5, children: Lt(e5) };
            })(t4), i3 = e4.find((t5) => t5 && t5._fullpath)._fullpath, n3 = await a2(i3, e4);
            if (null !== n3) {
              let t5 = await s2(d2, r3);
              return t5 = t5.filter((t6) => void 0 !== t6), o2(n3, t5);
            }
          };
          return d2(f2);
        }
        class Gt extends n {
          constructor(t3) {
            super(`Could not merge index: Entry for '${t3}' is not up to date. Either reset the index entry to HEAD, or stage your unstaged changes.`), this.code = this.name = Gt.code, this.data = { filepath: t3 };
          }
        }
        Gt.code = "IndexResetError";
        var Wt = r(6867);
        async function qt(t3, e3) {
          const r2 = await t3.readdir(e3);
          null == r2 ? await t3.rm(e3) : r2.length ? await Promise.all(r2.map((r3) => {
            const i2 = N(e3, r3);
            return t3.lstat(i2).then((e4) => {
              if (e4) return e4.isDirectory() ? qt(t3, i2) : t3.rm(i2);
            });
          })).then(() => t3.rmdir(e3)) : await t3.rmdir(e3);
        }
        function Zt(t3) {
          return "function" == typeof t3;
        }
        function Kt(t3) {
          return /* @__PURE__ */ (function(t4) {
            return t4 && "object" == typeof t4;
          })(e3 = ((t4) => {
            try {
              return t4.readFile().catch((t5) => t5);
            } catch (t5) {
              return t5;
            }
          })(t3)) && Zt(e3.then) && Zt(e3.catch);
          var e3;
        }
        const Vt = ["readFile", "writeFile", "mkdir", "rmdir", "unlink", "stat", "lstat", "readdir", "readlink", "symlink"];
        function Yt(t3, e3) {
          if (Kt(e3)) for (const r2 of Vt) t3[`_${r2}`] = e3[r2].bind(e3);
          else for (const r2 of Vt) t3[`_${r2}`] = Wt(e3[r2].bind(e3));
          Kt(e3) ? (e3.cp && (t3._cp = e3.cp.bind(e3)), e3.rm ? t3._rm = e3.rm.bind(e3) : e3.rmdir.length > 1 ? t3._rm = e3.rmdir.bind(e3) : t3._rm = qt.bind(null, t3)) : (e3.cp && (t3._cp = Wt(e3.cp.bind(e3))), e3.rm ? t3._rm = Wt(e3.rm.bind(e3)) : e3.rmdir.length > 2 ? t3._rm = Wt(e3.rmdir.bind(e3)) : t3._rm = qt.bind(null, t3));
        }
        class Xt {
          constructor(t3) {
            if (void 0 !== t3._original_unwrapped_fs) return t3;
            const e3 = Object.getOwnPropertyDescriptor(t3, "promises");
            e3 && e3.enumerable ? Yt(this, t3.promises) : Yt(this, t3), this._original_unwrapped_fs = t3;
          }
          async exists(t3, e3 = {}) {
            try {
              return await this._stat(t3), true;
            } catch (t4) {
              if ("ENOENT" === t4.code || "ENOTDIR" === t4.code || (t4.code || "").includes("ENS")) return false;
              throw console.log('Unhandled error in "FileSystem.exists()" function', t4), t4;
            }
          }
          async read(t3, e3 = {}) {
            try {
              let r2 = await this._readFile(t3, e3);
              if ("true" === e3.autocrlf) try {
                r2 = new TextDecoder("utf8", { fatal: true }).decode(r2), r2 = r2.replace(/\r\n/g, "\n"), r2 = new TextEncoder().encode(r2);
              } catch (t4) {
              }
              return "string" != typeof r2 && (r2 = Buffer.from(r2)), r2;
            } catch (t4) {
              return null;
            }
          }
          async write(t3, e3, r2 = {}) {
            try {
              await this._writeFile(t3, e3, r2);
            } catch (i2) {
              await this.mkdir(S(t3)), await this._writeFile(t3, e3, r2);
            }
          }
          async mkdir(t3, e3 = false) {
            try {
              await this._mkdir(t3);
            } catch (r2) {
              if (null === r2) return;
              if ("EEXIST" === r2.code) return;
              if (e3) throw r2;
              if ("ENOENT" === r2.code) {
                const e4 = S(t3);
                if ("." === e4 || "/" === e4 || e4 === t3) throw r2;
                await this.mkdir(e4), await this.mkdir(t3, true);
              }
            }
          }
          async rm(t3) {
            try {
              await this._unlink(t3);
            } catch (t4) {
              if ("ENOENT" !== t4.code) throw t4;
            }
          }
          async rmdir(t3, e3) {
            try {
              e3 && e3.recursive ? await this._rm(t3, e3) : await this._rmdir(t3);
            } catch (t4) {
              if ("ENOENT" !== t4.code) throw t4;
            }
          }
          async readdir(t3) {
            try {
              const e3 = await this._readdir(t3);
              return e3.sort(f), e3;
            } catch (t4) {
              return "ENOTDIR" === t4.code ? null : [];
            }
          }
          async readdirDeep(t3) {
            const e3 = await this._readdir(t3);
            return (await Promise.all(e3.map(async (e4) => {
              const r2 = t3 + "/" + e4;
              return (await this._stat(r2)).isDirectory() ? this.readdirDeep(r2) : r2;
            }))).reduce((t4, e4) => t4.concat(e4), []);
          }
          async lstat(t3) {
            try {
              return await this._lstat(t3);
            } catch (t4) {
              if ("ENOENT" === t4.code || (t4.code || "").includes("ENS")) return null;
              throw t4;
            }
          }
          async readlink(t3, e3 = { encoding: "buffer" }) {
            try {
              const r2 = await this._readlink(t3, e3);
              return Buffer.isBuffer(r2) ? r2 : Buffer.from(r2);
            } catch (t4) {
              if ("ENOENT" === t4.code || (t4.code || "").includes("ENS")) return null;
              throw t4;
            }
          }
          async writelink(t3, e3) {
            return this._symlink(e3.toString("utf8"), t3);
          }
        }
        class Jt extends n {
          constructor(t3) {
            super(`The function requires a "${t3}" parameter but none was provided.`), this.code = this.name = Jt.code, this.data = { parameter: t3 };
          }
        }
        function Qt(t3, e3) {
          if (void 0 === e3) throw new Jt(t3);
        }
        async function te({ fsp: t3, dotgit: e3 }) {
          Qt("fsp", t3), Qt("dotgit", e3);
          const r2 = await t3._stat(e3).catch(() => ({ isFile: () => false, isDirectory: () => false }));
          return r2.isDirectory() ? e3 : r2.isFile() ? t3._readFile(e3, "utf8").then((t4) => t4.trimRight().substr(8)).then((t4) => {
            return (r3 = t4).startsWith("/") || /^[a-zA-Z]:[\\/]/.test(r3) ? t4 : N(S(e3), t4);
            var r3;
          }) : e3;
        }
        async function ee(t3, e3) {
          return !(!t3 && !e3 || (!t3 || e3) && (t3 || !e3) && ("tree" === await t3.type() && "tree" === await e3.type() || await t3.type() === await e3.type() && await t3.mode() === await e3.mode() && await t3.oid() === await e3.oid()));
        }
        async function re({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), commit: i2 = "HEAD", cache: n2 = {} }) {
          try {
            Qt("fs", t3), Qt("dir", e3), Qt("gitdir", r2);
            const a2 = new Xt(t3), o2 = [Mt({ ref: i2 }), Nt(), P()];
            let s2 = [];
            const c2 = await te({ fsp: a2, dotgit: r2 });
            await E.acquire({ fs: a2, gitdir: c2, cache: n2 }, async function(t4) {
              s2 = t4.unmergedPaths;
            });
            const f2 = await Ht({ fs: a2, cache: n2, dir: e3, gitdir: c2, trees: o2, map: async function(t4, [e4, r3, i3]) {
              const n3 = !await ee(r3, i3), a3 = s2.includes(t4), o3 = !await ee(i3, e4);
              if (n3 || a3) return e4 ? { path: t4, mode: await e4.mode(), oid: await e4.oid(), type: await e4.type(), content: await e4.content() } : void 0;
              if (o3) return false;
              throw new Gt(t4);
            } });
            await E.acquire({ fs: a2, gitdir: c2, cache: n2 }, async function(t4) {
              for (const r3 of f2) if (false !== r3) if (r3) {
                if ("blob" === r3.type) {
                  const i3 = new TextDecoder().decode(r3.content);
                  await a2.write(`${e3}/${r3.path}`, i3, { mode: r3.mode }), t4.insert({ filepath: r3.path, oid: r3.oid, stage: 0 });
                }
              } else await a2.rmdir(`${e3}/${r3.path}`, { recursive: true }), t4.delete({ filepath: r3.path });
            });
          } catch (t4) {
            throw t4.caller = "git.abortMerge", t4;
          }
        }
        Jt.code = "MissingParameterError";
        class ie extends n {
          constructor(t3) {
            super('There are multiple errors that were thrown by the method. Please refer to the "errors" property to see more'), this.code = this.name = ie.code, this.data = { errors: t3 }, this.errors = t3;
          }
        }
        ie.code = "MultipleGitError";
        var ne = r(2535);
        class ae {
          static async isIgnored({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), filepath: i2 }) {
            if (".git" === A(i2)) return true;
            if ("." === i2) return false;
            let n2 = "";
            const a2 = N(r2, "info", "exclude");
            await t3.exists(a2) && (n2 = await t3.read(a2, "utf8"));
            const o2 = [{ gitignore: N(e3, ".gitignore"), filepath: i2 }], s2 = i2.split("/").filter(Boolean);
            for (let t4 = 1; t4 < s2.length; t4++) {
              const r3 = s2.slice(0, t4).join("/"), i3 = s2.slice(t4).join("/");
              o2.push({ gitignore: N(e3, r3, ".gitignore"), filepath: i3 });
            }
            let c2 = false;
            for (const e4 of o2) {
              let r3;
              try {
                r3 = await t3.read(e4.gitignore, "utf8");
              } catch (t4) {
                if ("NOENT" === t4.code) continue;
              }
              const i3 = ne().add(n2);
              i3.add(r3);
              const a3 = S(e4.filepath);
              if ("." !== a3 && i3.ignores(a3)) return true;
              c2 = c2 ? !i3.test(e4.filepath).unignored : i3.test(e4.filepath).ignored;
            }
            return c2;
          }
        }
        let oe = null;
        async function se(t3) {
          return null === oe && (oe = (function() {
            try {
              return new CompressionStream("deflate").writable.close(), new Blob([]).stream().cancel(), true;
            } catch (t4) {
              return false;
            }
          })()), oe ? (async function(t4) {
            const e3 = new CompressionStream("deflate"), r2 = new Blob([t4]).stream().pipeThrough(e3);
            return new Uint8Array(await new Response(r2).arrayBuffer());
          })(t3) : wt.deflate(t3);
        }
        async function ce({ fs: t3, gitdir: e3, type: r2, object: i2, format: n2 = "content", oid: a2, dryRun: s2 = false }) {
          return "deflated" !== n2 && ("wrapped" !== n2 && (i2 = lt.wrap({ type: r2, object: i2 })), a2 = await m(i2), i2 = Buffer.from(await se(i2))), s2 || await (async function({ fs: t4, gitdir: e4, object: r3, format: i3, oid: n3 }) {
            if ("deflated" !== i3) throw new o("GitObjectStoreLoose expects objects to write to be in deflated format");
            const a3 = `${e4}/objects/${n3.slice(0, 2)}/${n3.slice(2)}`;
            await t4.exists(a3) || await t4.write(a3, r3);
          })({ fs: t3, gitdir: e3, object: i2, format: "deflated", oid: a2 }), a2;
        }
        function fe(t3) {
          let e3;
          for (; ~(e3 = t3.indexOf(92)); ) t3[e3] = 47;
          return t3;
        }
        async function le({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), filepath: i2, cache: n2 = {}, force: a2 = false, parallel: o2 = true }) {
          try {
            Qt("fs", t3), Qt("dir", e3), Qt("gitdir", r2), Qt("filepath", i2);
            const s2 = new Xt(t3), c2 = await te({ fsp: s2, dotgit: r2 });
            await E.acquire({ fs: s2, gitdir: c2, cache: n2 }, async (t4) => {
              const r3 = await Q.get({ fs: s2, gitdir: c2 }), n3 = await r3.get("core.autocrlf");
              return de({ dir: e3, gitdir: c2, fs: s2, filepath: i2, index: t4, force: a2, parallel: o2, autocrlf: n3 });
            });
          } catch (t4) {
            throw t4.caller = "git.add", t4;
          }
        }
        async function de({ dir: t3, gitdir: e3, fs: r2, filepath: i2, index: n2, force: a2, parallel: o2, autocrlf: s2 }) {
          const c2 = (i2 = Array.isArray(i2) ? i2 : [i2]).map(async (i3) => {
            if (!a2 && await ae.isIgnored({ fs: r2, dir: t3, gitdir: e3, filepath: i3 })) return;
            const c3 = await r2.lstat(N(t3, i3));
            if (!c3) throw new I(i3);
            if (c3.isDirectory()) {
              const c4 = await r2.readdir(N(t3, i3));
              if (o2) {
                const f3 = c4.map((c5) => de({ dir: t3, gitdir: e3, fs: r2, filepath: [N(i3, c5)], index: n2, force: a2, parallel: o2, autocrlf: s2 }));
                await Promise.all(f3);
              } else for (const f3 of c4) await de({ dir: t3, gitdir: e3, fs: r2, filepath: [N(i3, f3)], index: n2, force: a2, parallel: o2, autocrlf: s2 });
            } else {
              const a3 = c3.isSymbolicLink() ? await r2.readlink(N(t3, i3)).then(fe) : await r2.read(N(t3, i3), { autocrlf: s2 });
              if (null === a3) throw new I(i3);
              const o3 = await ce({ fs: r2, gitdir: e3, type: "blob", object: a3 });
              n2.insert({ filepath: i3, stats: c3, oid: o3 });
            }
          }), f2 = await Promise.allSettled(c2), l2 = f2.filter((t4) => "rejected" === t4.status).map((t4) => t4.reason);
          if (l2.length > 1) throw new ie(l2);
          if (1 === l2.length) throw l2[0];
          return f2.filter((t4) => "fulfilled" === t4.status && t4.value).map((t4) => t4.value);
        }
        class ue extends n {
          constructor(t3) {
            super(`No name was provided for ${t3} in the argument or in the .git/config file.`), this.code = this.name = ue.code, this.data = { role: t3 };
          }
        }
        ue.code = "MissingNameError";
        class he extends n {
          constructor(t3) {
            super(`"${t3}" does not point to any commit. You're maybe working on a repository with no commits yet. `), this.code = this.name = he.code, this.data = { ref: t3 };
          }
        }
        async function pe({ fs: t3, gitdir: e3, path: r2 }) {
          return (await Q.get({ fs: t3, gitdir: e3 })).get(r2);
        }
        function ge(t3, ...e3) {
          for (const r2 of e3) if (r2) for (const e4 of Object.keys(r2)) {
            const i2 = r2[e4];
            void 0 !== i2 && (t3[e4] = i2);
          }
          return t3;
        }
        async function we({ fs: t3, gitdir: e3, author: r2, commit: i2 }) {
          const n2 = Math.floor(Date.now() / 1e3), a2 = ge({}, { name: await pe({ fs: t3, gitdir: e3, path: "user.name" }), email: await pe({ fs: t3, gitdir: e3, path: "user.email" }) || "", timestamp: n2, timezoneOffset: new Date(1e3 * n2).getTimezoneOffset() }, i2 ? i2.author : void 0, r2);
          if (void 0 !== a2.name) return a2;
        }
        async function me({ fs: t3, gitdir: e3, author: r2, committer: i2, commit: n2 }) {
          const a2 = Math.floor(Date.now() / 1e3), o2 = ge({}, { name: await pe({ fs: t3, gitdir: e3, path: "user.name" }), email: await pe({ fs: t3, gitdir: e3, path: "user.email" }) || "", timestamp: a2, timezoneOffset: new Date(1e3 * a2).getTimezoneOffset() }, n2 ? n2.committer : void 0, r2, i2);
          if (void 0 !== o2.name) return o2;
        }
        async function ye({ fs: t3, cache: e3, gitdir: r2, oid: i2 }) {
          const { type: n2, object: a2 } = await Bt({ fs: t3, cache: e3, gitdir: r2, oid: i2 });
          if ("tag" === n2) return ye({ fs: t3, cache: e3, gitdir: r2, oid: i2 = Ot.from(a2).parse().object });
          if ("commit" !== n2) throw new O(i2, n2, "commit");
          return { commit: Ut.from(a2), oid: i2 };
        }
        async function be({ fs: t3, cache: e3, gitdir: r2, oid: i2 }) {
          const { commit: n2, oid: a2 } = await ye({ fs: t3, cache: e3, gitdir: r2, oid: i2 });
          return { oid: a2, commit: n2.parse(), payload: n2.withoutSignature() };
        }
        async function _e({ fs: t3, cache: e3, onSign: r2, gitdir: i2, message: n2, author: a2, committer: o2, signingKey: s2, amend: c2 = false, dryRun: f2 = false, noUpdateBranch: l2 = false, ref: d2, parent: u2, tree: h2 }) {
          let p2, g2, w2 = false, m2 = false;
          if (!d2) {
            const e4 = await t3.read(`${i2}/HEAD`, { encoding: "utf8" });
            m2 = !e4.startsWith("ref:"), d2 = await nt.resolve({ fs: t3, gitdir: i2, ref: "HEAD", depth: 2 });
          }
          try {
            p2 = await nt.resolve({ fs: t3, gitdir: i2, ref: d2 }), g2 = await be({ fs: t3, gitdir: i2, oid: p2, cache: {} });
          } catch (e4) {
            w2 = true;
          }
          if (c2 && w2) throw new he(d2);
          const y2 = c2 ? await we({ fs: t3, gitdir: i2, author: a2, commit: g2.commit }) : await we({ fs: t3, gitdir: i2, author: a2 });
          if (!y2) throw new ue("author");
          const b2 = c2 ? await me({ fs: t3, gitdir: i2, author: y2, committer: o2, commit: g2.commit }) : await me({ fs: t3, gitdir: i2, author: y2, committer: o2 });
          if (!b2) throw new ue("committer");
          return E.acquire({ fs: t3, gitdir: i2, cache: e3, allowUnmerged: false }, async function(e4) {
            const a3 = B(e4.entries).get(".");
            if (h2 || (h2 = await ve({ fs: t3, gitdir: i2, inode: a3, dryRun: f2 })), u2 = u2 ? await Promise.all(u2.map((e5) => nt.resolve({ fs: t3, gitdir: i2, ref: e5 }))) : c2 ? g2.commit.parent : p2 ? [p2] : [], !n2) {
              if (!c2) throw new Jt("message");
              n2 = g2.commit.message;
            }
            let o3 = Ut.from({ tree: h2, parent: u2, author: y2, committer: b2, message: n2 });
            s2 && (o3 = await Ut.sign(o3, r2, s2));
            const w3 = await ce({ fs: t3, gitdir: i2, type: "commit", object: o3.toObject(), dryRun: f2 });
            return l2 || f2 || await nt.writeRef({ fs: t3, gitdir: i2, ref: m2 ? "HEAD" : d2, value: w3 }), w3;
          });
        }
        async function ve({ fs: t3, gitdir: e3, inode: r2, dryRun: i2 }) {
          const n2 = r2.children;
          for (const r3 of n2) "tree" === r3.type && (r3.metadata.mode = "040000", r3.metadata.oid = await ve({ fs: t3, gitdir: e3, inode: r3, dryRun: i2 }));
          const a2 = n2.map((t4) => ({ mode: t4.metadata.mode, path: t4.basename, oid: t4.metadata.oid, type: t4.type })), o2 = ft.from(a2);
          return await ce({ fs: t3, gitdir: e3, type: "tree", object: o2.toObject(), dryRun: i2 });
        }
        he.code = "NoCommitError";
        class xe extends n {
          constructor(t3) {
            let e3 = "invalid filepath";
            "leading-slash" === t3 || "trailing-slash" === t3 ? e3 = '"filepath" parameter should not include leading or trailing directory separators because these can cause problems on some platforms.' : "directory" === t3 && (e3 = '"filepath" should not be a directory.'), super(e3), this.code = this.name = xe.code, this.data = { reason: t3 };
          }
        }
        async function ke({ fs: t3, cache: e3, gitdir: r2, oid: i2, filepath: n2 }) {
          if (n2.startsWith("/")) throw new xe("leading-slash");
          if (n2.endsWith("/")) throw new xe("trailing-slash");
          const a2 = i2, o2 = await Tt({ fs: t3, cache: e3, gitdir: r2, oid: i2 }), s2 = o2.tree;
          if ("" === n2) i2 = o2.oid;
          else {
            const o3 = n2.split("/");
            i2 = await Ee({ fs: t3, cache: e3, gitdir: r2, tree: s2, pathArray: o3, oid: a2, filepath: n2 });
          }
          return i2;
        }
        async function Ee({ fs: t3, cache: e3, gitdir: r2, tree: i2, pathArray: n2, oid: a2, filepath: o2 }) {
          const s2 = n2.shift();
          for (const c2 of i2) if (c2.path === s2) {
            if (0 === n2.length) return c2.oid;
            {
              const { type: s3, object: f2 } = await Bt({ fs: t3, cache: e3, gitdir: r2, oid: c2.oid });
              if ("tree" !== s3) throw new O(a2, s3, "tree", o2);
              return Ee({ fs: t3, cache: e3, gitdir: r2, tree: i2 = ft.from(f2), pathArray: n2, oid: a2, filepath: o2 });
            }
          }
          throw new I(`file or directory found at "${a2}:${o2}"`);
        }
        async function Ae({ fs: t3, cache: e3, gitdir: r2, oid: i2, filepath: n2 }) {
          void 0 !== n2 && (i2 = await ke({ fs: t3, cache: e3, gitdir: r2, oid: i2, filepath: n2 }));
          const { tree: a2, oid: o2 } = await Tt({ fs: t3, cache: e3, gitdir: r2, oid: i2 });
          return { oid: o2, tree: a2.entries() };
        }
        async function Se({ fs: t3, gitdir: e3, tree: r2 }) {
          const i2 = ft.from(r2).toObject();
          return await ce({ fs: t3, gitdir: e3, type: "tree", object: i2, format: "content" });
        }
        xe.code = "InvalidFilepathError";
        class Be extends n {
          constructor(t3, e3, r2 = true) {
            super(`Failed to create ${t3} at ${e3} because it already exists.${r2 ? ` (Hint: use 'force: true' parameter to overwrite existing ${t3}.)` : ""}`), this.code = this.name = Be.code, this.data = { noun: t3, where: e3, canForce: r2 };
          }
        }
        async function $e({ fs: t3, onSign: e3, dir: r2, gitdir: i2 = N(r2, ".git"), ref: n2 = "refs/notes/commits", oid: a2, note: o2, force: s2, author: c2, committer: f2, signingKey: l2, cache: d2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", i2), Qt("oid", a2), Qt("note", o2), l2 && Qt("onSign", e3);
            const r3 = new Xt(t3), u2 = await we({ fs: r3, gitdir: i2, author: c2 });
            if (!u2) throw new ue("author");
            const h2 = await me({ fs: r3, gitdir: i2, author: u2, committer: f2 });
            if (!h2) throw new ue("committer");
            const p2 = await te({ fsp: r3, dotgit: i2 });
            return await (async function({ fs: t4, cache: e4, onSign: r4, gitdir: i3, ref: n3, oid: a3, note: o3, force: s3, author: c3, committer: f3, signingKey: l3 }) {
              let d3;
              try {
                d3 = await nt.resolve({ gitdir: i3, fs: t4, ref: n3 });
              } catch (t5) {
                if (!(t5 instanceof I)) throw t5;
              }
              let u3 = (await Ae({ fs: t4, cache: e4, gitdir: i3, oid: d3 || "4b825dc642cb6eb9a060e54bf8d69288fbee4904" })).tree;
              if (s3) u3 = u3.filter((t5) => t5.path !== a3);
              else for (const t5 of u3) if (t5.path === a3) throw new Be("note", a3);
              "string" == typeof o3 && (o3 = Buffer.from(o3, "utf8"));
              const h3 = await ce({ fs: t4, gitdir: i3, type: "blob", object: o3, format: "content" });
              u3.push({ mode: "100644", path: a3, oid: h3, type: "blob" });
              const p3 = await Se({ fs: t4, gitdir: i3, tree: u3 });
              return await _e({ fs: t4, cache: e4, onSign: r4, gitdir: i3, ref: n3, tree: p3, parent: d3 && [d3], message: "Note added by 'isomorphic-git addNote'\n", author: c3, committer: f3, signingKey: l3 });
            })({ fs: r3, cache: d2, onSign: e3, gitdir: p2, ref: n2, oid: a2, note: o2, force: s2, author: u2, committer: h2, signingKey: l2 });
          } catch (t4) {
            throw t4.caller = "git.addNote", t4;
          }
        }
        Be.code = "AlreadyExistsError";
        var Re = r(6219);
        class Pe extends n {
          constructor(t3, e3) {
            super(`"${t3}" would be an invalid git reference. (Hint: a valid alternative would be "${e3}".)`), this.code = this.name = Pe.code, this.data = { ref: t3, suggestion: e3 };
          }
        }
        Pe.code = "InvalidRefNameError";
        const Ie = /(^|[/.])([/.]|$)|^@$|@{|[\x00-\x20\x7f~^:?*[\\]|\.lock(\/|$)/;
        function Oe(t3, e3) {
          if ("string" != typeof t3) throw new TypeError("Reference name must be a string");
          return !Ie.test(t3) && (!!e3 || t3.includes("/"));
        }
        async function je({ fs: t3, gitdir: e3, remote: r2, url: i2, force: n2 }) {
          if (!Oe(r2, true)) throw new Pe(r2, Re.clean(r2));
          const a2 = await Q.get({ fs: t3, gitdir: e3 });
          if (!n2 && (await a2.getSubsections("remote")).includes(r2) && i2 !== await a2.get(`remote.${r2}.url`)) throw new Be("remote", r2);
          await a2.set(`remote.${r2}.url`, i2), await a2.set(`remote.${r2}.fetch`, `+refs/heads/*:refs/remotes/${r2}/*`), await Q.save({ fs: t3, gitdir: e3, config: a2 });
        }
        async function Ue({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), remote: i2, url: n2, force: a2 = false }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("remote", i2), Qt("url", n2);
            const e4 = new Xt(t3), o2 = await te({ fsp: e4, dotgit: r2 });
            return await je({ fs: e4, gitdir: o2, remote: i2, url: n2, force: a2 });
          } catch (t4) {
            throw t4.caller = "git.addRemote", t4;
          }
        }
        async function Te({ fs: t3, onSign: e3, dir: r2, gitdir: i2 = N(r2, ".git"), ref: n2, tagger: a2, message: o2 = n2, gpgsig: s2, object: c2, signingKey: f2, force: l2 = false, cache: d2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", i2), Qt("ref", n2), f2 && Qt("onSign", e3);
            const r3 = new Xt(t3), u2 = await te({ fsp: r3, dotgit: i2 }), h2 = await we({ fs: r3, gitdir: u2, author: a2 });
            if (!h2) throw new ue("tagger");
            return await (async function({ fs: t4, cache: e4, onSign: r4, gitdir: i3, ref: n3, tagger: a3, message: o3 = n3, gpgsig: s3, object: c3, signingKey: f3, force: l3 = false }) {
              if (n3 = n3.startsWith("refs/tags/") ? n3 : `refs/tags/${n3}`, !l3 && await nt.exists({ fs: t4, gitdir: i3, ref: n3 })) throw new Be("tag", n3);
              const d3 = await nt.resolve({ fs: t4, gitdir: i3, ref: c3 || "HEAD" }), { type: u3 } = await Bt({ fs: t4, cache: e4, gitdir: i3, oid: d3 });
              let h3 = Ot.from({ object: d3, type: u3, tag: n3.replace("refs/tags/", ""), tagger: a3, message: o3, gpgsig: s3 });
              f3 && (h3 = await Ot.sign(h3, r4, f3));
              const p2 = await ce({ fs: t4, gitdir: i3, type: "tag", object: h3.toObject() });
              await nt.writeRef({ fs: t4, gitdir: i3, ref: n3, value: p2 });
            })({ fs: r3, cache: d2, onSign: e3, gitdir: u2, ref: n2, tagger: h2, message: o2, gpgsig: s2, object: c2, signingKey: f2, force: l2 });
          } catch (t4) {
            throw t4.caller = "git.annotatedTag", t4;
          }
        }
        async function Ce({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2, object: n2, checkout: a2 = false, force: o2 = false }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", i2);
            const e4 = new Xt(t3), s2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, gitdir: e5, ref: r3, object: i3, checkout: n3 = false, force: a3 = false }) {
              if (!Oe(r3, true)) throw new Pe(r3, Re.clean(r3));
              const o3 = `refs/heads/${r3}`;
              if (!a3 && await nt.exists({ fs: t4, gitdir: e5, ref: o3 })) throw new Be("branch", r3, false);
              let s3;
              try {
                s3 = await nt.resolve({ fs: t4, gitdir: e5, ref: i3 || "HEAD" });
              } catch (t5) {
              }
              s3 && await nt.writeRef({ fs: t4, gitdir: e5, ref: o3, value: s3 }), n3 && await nt.writeSymbolicRef({ fs: t4, gitdir: e5, ref: "HEAD", value: o3 });
            })({ fs: e4, gitdir: s2, ref: i2, object: n2, checkout: a2, force: o2 });
          } catch (t4) {
            throw t4.caller = "git.branch", t4;
          }
        }
        class Me extends n {
          constructor(t3) {
            super(`Your local changes to the following files would be overwritten by checkout: ${t3.join(", ")}`), this.code = this.name = Me.code, this.data = { filepaths: t3 };
          }
        }
        Me.code = "CheckoutConflictError";
        class De extends n {
          constructor(t3, e3) {
            super(`Failed to checkout "${t3}" because commit ${e3} is not available locally. Do a git fetch to make the branch available locally.`), this.code = this.name = De.code, this.data = { ref: t3, oid: e3 };
          }
        }
        De.code = "CommitNotFetchedError";
        const Ne = (t3, e3) => "." === t3 || null == e3 || 0 === e3.length || "." === e3 || (e3.length >= t3.length ? e3.startsWith(t3) : t3.startsWith(e3));
        async function ze({ fs: t3, cache: e3, onProgress: r2, onPostCheckout: i2, dir: n2, gitdir: a2, remote: s2, ref: c2, filepaths: f2, noCheckout: l2, noUpdateHead: d2, dryRun: u2, force: h2, track: p2 = true, nonBlocking: g2 = false, batchSize: w2 = 100 }) {
          let m2, y2;
          if (i2) try {
            m2 = await nt.resolve({ fs: t3, gitdir: a2, ref: "HEAD" });
          } catch (t4) {
            m2 = "0000000000000000000000000000000000000000";
          }
          try {
            y2 = await nt.resolve({ fs: t3, gitdir: a2, ref: c2 });
          } catch (e4) {
            if ("HEAD" === c2) throw e4;
            const r3 = `${s2}/${c2}`;
            if (y2 = await nt.resolve({ fs: t3, gitdir: a2, ref: r3 }), p2) {
              const e5 = await Q.get({ fs: t3, gitdir: a2 });
              await e5.set(`branch.${c2}.remote`, s2), await e5.set(`branch.${c2}.merge`, `refs/heads/${c2}`), await Q.save({ fs: t3, gitdir: a2, config: e5 });
            }
            await nt.writeRef({ fs: t3, gitdir: a2, ref: `refs/heads/${c2}`, value: y2 });
          }
          if (!l2) {
            let s3;
            try {
              s3 = await (async function({ fs: t4, cache: e4, onProgress: r3, dir: i3, gitdir: n3, ref: a3, force: o2, filepaths: s4 }) {
                let c3 = 0;
                return Ht({ fs: t4, cache: e4, dir: i3, gitdir: n3, trees: [Mt({ ref: a3 }), Nt(), P()], map: async function(t5, [e5, i4, n4]) {
                  if ("." !== t5) {
                    if (s4 && !s4.some((e6) => Ne(t5, e6))) return null;
                    switch (r3 && await r3({ phase: "Analyzing workdir", loaded: ++c3 }), [!!n4, !!e5, !!i4].map(Number).join("")) {
                      case "000":
                        return;
                      case "001":
                        return o2 && s4 && s4.includes(t5) ? ["delete", t5] : void 0;
                      case "010":
                        switch (await e5.type()) {
                          case "tree":
                            return ["mkdir", t5];
                          case "blob":
                            return ["create", t5, await e5.oid(), await e5.mode()];
                          case "commit":
                            return ["mkdir-index", t5, await e5.oid(), await e5.mode()];
                          default:
                            return ["error", `new entry Unhandled type ${await e5.type()}`];
                        }
                      case "011":
                        switch (`${await e5.type()}-${await i4.type()}`) {
                          case "tree-tree":
                          case "commit-tree":
                            return;
                          case "tree-blob":
                          case "blob-tree":
                          case "commit-blob":
                            return ["conflict", t5];
                          case "blob-blob":
                            return await e5.oid() !== await i4.oid() ? o2 ? ["update", t5, await e5.oid(), await e5.mode(), await e5.mode() !== await i4.mode()] : ["conflict", t5] : await e5.mode() !== await i4.mode() ? o2 ? ["update", t5, await e5.oid(), await e5.mode(), true] : ["conflict", t5] : ["create-index", t5, await e5.oid(), await e5.mode()];
                          default:
                            return ["error", `new entry Unhandled type ${e5.type}`];
                        }
                      case "100":
                        return ["delete-index", t5];
                      case "101":
                        switch (await n4.type()) {
                          case "tree":
                          case "commit":
                            return ["rmdir-index", t5];
                          case "blob":
                            return await n4.oid() !== await i4.oid() ? o2 ? ["delete", t5] : ["conflict", t5] : ["delete", t5];
                          default:
                            return ["error", `delete entry Unhandled type ${await n4.type()}`];
                        }
                      case "110":
                      case "111":
                        switch (`${await n4.type()}-${await e5.type()}`) {
                          case "tree-tree":
                            return;
                          case "blob-blob":
                            if (await n4.oid() === await e5.oid() && await n4.mode() === await e5.mode() && !o2) return;
                            if (i4) {
                              if (await i4.oid() !== await n4.oid() && await i4.oid() !== await e5.oid()) return o2 ? ["update", t5, await e5.oid(), await e5.mode(), await e5.mode() !== await i4.mode()] : ["conflict", t5];
                            } else if (o2) return ["update", t5, await e5.oid(), await e5.mode(), await e5.mode() !== await n4.mode()];
                            return await e5.mode() !== await n4.mode() ? ["update", t5, await e5.oid(), await e5.mode(), true] : await e5.oid() !== await n4.oid() ? ["update", t5, await e5.oid(), await e5.mode(), false] : void 0;
                          case "tree-blob":
                            return ["update-dir-to-blob", t5, await e5.oid()];
                          case "blob-tree":
                            return ["update-blob-to-tree", t5];
                          case "commit-commit":
                            return ["mkdir-index", t5, await e5.oid(), await e5.mode()];
                          default:
                            return ["error", `update entry Unhandled type ${await n4.type()}-${await e5.type()}`];
                        }
                    }
                  }
                }, reduce: async function(t5, e5) {
                  return e5 = zt(e5), t5 ? t5 && "rmdir" === t5[0] ? (e5.push(t5), e5) : (e5.unshift(t5), e5) : e5;
                } });
              })({ fs: t3, cache: e3, onProgress: r2, dir: n2, gitdir: a2, ref: c2, force: h2, filepaths: f2 });
            } catch (t4) {
              throw t4 instanceof I && t4.data.what === y2 ? new De(c2, y2) : t4;
            }
            const l3 = s3.filter(([t4]) => "conflict" === t4).map(([t4, e4]) => e4);
            if (l3.length > 0) throw new Me(l3);
            const d3 = s3.filter(([t4]) => "error" === t4).map(([t4, e4]) => e4);
            if (d3.length > 0) throw new o(d3.join(", "));
            if (u2) return void (i2 && await i2({ previousHead: m2, newHead: y2, type: null != f2 && f2.length > 0 ? "file" : "branch" }));
            let p3 = 0;
            const b2 = s3.length;
            if (await E.acquire({ fs: t3, gitdir: a2, cache: e3 }, async function(e4) {
              await Promise.all(s3.filter(([t4]) => "delete" === t4 || "delete-index" === t4).map(async function([i3, a3]) {
                const o2 = `${n2}/${a3}`;
                "delete" === i3 && await t3.rm(o2), e4.delete({ filepath: a3 }), r2 && await r2({ phase: "Updating workdir", loaded: ++p3, total: b2 });
              }));
            }), await E.acquire({ fs: t3, gitdir: a2, cache: e3 }, async function(e4) {
              for (const [i3, a3] of s3) if ("rmdir" === i3 || "rmdir-index" === i3) {
                const o2 = `${n2}/${a3}`;
                try {
                  "rmdir" === i3 && await t3.rmdir(o2), e4.delete({ filepath: a3 }), r2 && await r2({ phase: "Updating workdir", loaded: ++p3, total: b2 });
                } catch (t4) {
                  if ("ENOTEMPTY" !== t4.code) throw t4;
                  console.log(`Did not delete ${a3} because directory is not empty`);
                }
              }
            }), await Promise.all(s3.filter(([t4]) => "mkdir" === t4 || "mkdir-index" === t4).map(async function([e4, i3]) {
              const a3 = `${n2}/${i3}`;
              await t3.mkdir(a3), r2 && await r2({ phase: "Updating workdir", loaded: ++p3, total: b2 });
            })), g2) {
              const i3 = s3.filter(([t4]) => "create" === t4 || "create-index" === t4 || "update" === t4 || "mkdir-index" === t4), c3 = await Fe("Update Working Dir", i3.map(([r3, i4, s4, c4, f3]) => () => (async function({ fs: t4, cache: e4, gitdir: r4, dir: i5 }, [n3, a3, s5, c5, f4]) {
                const l4 = `${i5}/${a3}`;
                if ("create-index" !== n3 && "mkdir-index" !== n3) {
                  const { object: i6 } = await Bt({ fs: t4, cache: e4, gitdir: r4, oid: s5 });
                  if (f4 && await t4.rm(l4), 33188 === c5) await t4.write(l4, i6);
                  else if (33261 === c5) await t4.write(l4, i6, { mode: 511 });
                  else {
                    if (40960 !== c5) throw new o(`Invalid mode 0o${c5.toString(8)} detected in blob ${s5}`);
                    await t4.writelink(l4, i6);
                  }
                }
                const d4 = await t4.lstat(l4);
                return 33261 === c5 && (d4.mode = 493), "mkdir-index" === n3 && (d4.mode = 57344), [a3, s5, d4];
              })({ fs: t3, cache: e3, gitdir: a2, dir: n2 }, [r3, i4, s4, c4, f3])), r2, w2);
              await E.acquire({ fs: t3, gitdir: a2, cache: e3, allowUnmerged: true }, async function(t4) {
                await Fe("Update Index", c3.map(([e4, r3, i4]) => () => (async function({ index: t5, fullpath: e5, stats: r4, oid: i5 }) {
                  try {
                    t5.insert({ filepath: e5, stats: r4, oid: i5 });
                  } catch (t6) {
                    console.warn(`Error inserting ${e5} into index:`, t6);
                  }
                })({ index: t4, fullpath: e4, oid: r3, stats: i4 })), r2, w2);
              });
            } else await E.acquire({ fs: t3, gitdir: a2, cache: e3, allowUnmerged: true }, async function(i3) {
              var _a, _b;
              const c3 = await Promise.allSettled(s3.filter(([t4]) => "create" === t4 || "create-index" === t4 || "update" === t4 || "mkdir-index" === t4).map(async function([s4, c4, f4, l4, d4]) {
                const u3 = `${n2}/${c4}`;
                if ("create-index" !== s4 && "mkdir-index" !== s4) {
                  const { object: r3 } = await Bt({ fs: t3, cache: e3, gitdir: a2, oid: f4 });
                  if (d4 && await t3.rm(u3), 33188 === l4) await t3.write(u3, r3);
                  else if (33261 === l4) await t3.write(u3, r3, { mode: 511 });
                  else {
                    if (40960 !== l4) throw new o(`Invalid mode 0o${l4.toString(8)} detected in blob ${f4}`);
                    await t3.writelink(u3, r3);
                  }
                }
                const h3 = await t3.lstat(u3);
                33261 === l4 && (h3.mode = 493), "mkdir-index" === s4 && (h3.mode = 57344), i3.insert({ filepath: c4, stats: h3, oid: f4 }), r2 && await r2({ phase: "Updating workdir", loaded: ++p3, total: b2 });
              })), f3 = [];
              for (const t4 of c3) "rejected" === t4.status && (f3.push(t4.reason), console.error("[isomorphic-git checkout] task rejected:", (_b = (_a = t4.reason) == null ? void 0 : _a.stack) != null ? _b : t4.reason));
              if (f3.length > 0) throw new ie(f3);
            });
            i2 && await i2({ previousHead: m2, newHead: y2, type: null != f2 && f2.length > 0 ? "file" : "branch" });
          }
          if (!d2) {
            const e4 = await nt.expand({ fs: t3, gitdir: a2, ref: c2 });
            e4.startsWith("refs/heads") ? await nt.writeSymbolicRef({ fs: t3, gitdir: a2, ref: "HEAD", value: e4 }) : await nt.writeRef({ fs: t3, gitdir: a2, ref: "HEAD", value: y2 });
          }
        }
        async function Fe(t3, e3, r2, i2) {
          const n2 = [], a2 = [];
          for (let o2 = 0; o2 < e3.length; o2 += i2) {
            const s2 = e3.slice(o2, o2 + i2).map((t4) => t4());
            (await Promise.allSettled(s2)).forEach((e4) => {
              var _a, _b;
              "fulfilled" === e4.status ? n2.push(e4.value) : (a2.push(e4.reason), console.error(`[isomorphic-git ${t3}] task rejected:`, (_b = (_a = e4.reason) == null ? void 0 : _a.stack) != null ? _b : e4.reason));
            }), r2 && await r2({ phase: "Updating workdir", loaded: o2 + s2.length, total: e3.length });
          }
          if (a2.length > 0) throw new ie(a2);
          return n2;
        }
        async function Le({ fs: t3, onProgress: e3, onPostCheckout: r2, dir: i2, gitdir: n2 = N(i2, ".git"), remote: a2 = "origin", ref: o2, filepaths: s2, noCheckout: c2 = false, noUpdateHead: f2 = void 0 === o2, dryRun: l2 = false, force: d2 = false, track: u2 = true, cache: h2 = {}, nonBlocking: p2 = false, batchSize: g2 = 100 }) {
          try {
            Qt("fs", t3), Qt("dir", i2), Qt("gitdir", n2);
            const w2 = o2 || "HEAD", m2 = new Xt(t3), y2 = await te({ fsp: m2, dotgit: n2 });
            return await ze({ fs: m2, cache: h2, onProgress: e3, onPostCheckout: r2, dir: i2, gitdir: y2, remote: a2, ref: w2, filepaths: s2, noCheckout: c2, noUpdateHead: f2, dryRun: l2, force: d2, track: u2, nonBlocking: p2, batchSize: g2 });
          } catch (t4) {
            throw t4.caller = "git.checkout", t4;
          }
        }
        class He extends n {
          constructor(t3, e3) {
            super(`Cannot cherry-pick merge commit ${t3}. Merge commits have ${e3} parents and require specifying which parent to use as the base.`), this.code = this.name = He.code, this.data = { oid: t3, parentCount: e3 };
          }
        }
        He.code = "CherryPickMergeCommitError";
        class Ge extends n {
          constructor(t3) {
            super(`Cannot cherry-pick root commit ${t3}. Root commits have no parents.`), this.code = this.name = Ge.code, this.data = { oid: t3 };
          }
        }
        Ge.code = "CherryPickRootCommitError";
        class We extends n {
          constructor(t3, e3, r2, i2) {
            super(`Automatic merge failed with one or more merge conflicts in the following files: ${t3.toString()}. Fix conflicts then commit the result.`), this.code = this.name = We.code, this.data = { filepaths: t3, bothModified: e3, deleteByUs: r2, deleteByTheirs: i2 };
          }
        }
        We.code = "MergeConflictError";
        class qe extends n {
          constructor() {
            super("Merges with conflicts are not supported yet."), this.code = this.name = qe.code, this.data = {};
          }
        }
        qe.code = "MergeNotSupportedError";
        var Ze = r(6895);
        const Ke = /^.*(\r?\n|$)/gm;
        function Ve({ branches: t3, contents: e3 }) {
          const r2 = t3[1], i2 = t3[2], n2 = e3[0], a2 = e3[1], o2 = e3[2], s2 = a2.match(Ke), c2 = n2.match(Ke), f2 = o2.match(Ke), l2 = Ze(s2, c2, f2);
          let d2 = "", u2 = true;
          for (const t4 of l2) t4.ok && (d2 += t4.ok.join("")), t4.conflict && (u2 = false, d2 += `${"<".repeat(7)} ${r2}
`, d2 += t4.conflict.a.join(""), d2 += `${"=".repeat(7)}
`, d2 += t4.conflict.b.join(""), d2 += `${">".repeat(7)} ${i2}
`);
          return { cleanMerge: u2, mergedText: d2 };
        }
        async function Ye({ fs: t3, cache: e3, dir: r2, gitdir: i2 = N(r2, ".git"), index: n2, ourOid: a2, baseOid: o2, theirOid: s2, ourName: c2 = "ours", baseName: f2 = "base", theirName: l2 = "theirs", dryRun: d2 = false, abortOnConflict: u2 = true, mergeDriver: h2 }) {
          const p2 = Mt({ ref: a2 }), g2 = Mt({ ref: o2 }), w2 = Mt({ ref: s2 }), m2 = [], y2 = [], b2 = [], _2 = [], v2 = await Ht({ fs: t3, cache: e3, dir: r2, gitdir: i2, trees: [p2, g2, w2], map: async function(e4, [r3, a3, o3]) {
            const s3 = A(e4);
            switch (`${await ee(r3, a3)}-${await ee(o3, a3)}`) {
              case "false-false":
                return { mode: await a3.mode(), path: s3, oid: await a3.oid(), type: await a3.type() };
              case "false-true":
                return o3 || "tree" !== await r3.type() ? o3 ? { mode: await o3.mode(), path: s3, oid: await o3.oid(), type: await o3.type() } : void 0 : { mode: await r3.mode(), path: s3, oid: await r3.oid(), type: await r3.type() };
              case "true-false":
                return r3 || "tree" !== await o3.type() ? r3 ? { mode: await r3.mode(), path: s3, oid: await r3.oid(), type: await r3.type() } : void 0 : { mode: await o3.mode(), path: s3, oid: await o3.oid(), type: await o3.type() };
              case "true-true":
                if (r3 && o3 && "tree" === await r3.type() && "tree" === await o3.type()) return { mode: await r3.mode(), path: s3, oid: await r3.oid(), type: "tree" };
                if (r3 && o3 && "blob" === await r3.type() && "blob" === await o3.type()) return (async function({ fs: t4, gitdir: e5, path: r4, ours: i3, base: n3, theirs: a4, ourName: o4, theirName: s4, baseName: c3, dryRun: f3, mergeDriver: l3 = Ve }) {
                  const d3 = "blob";
                  let u3 = "100755", h3 = "", p3 = "";
                  n3 && "blob" === await n3.type() && (u3 = await n3.mode(), h3 = await n3.oid(), p3 = Buffer.from(await n3.content()).toString("utf8"));
                  const g3 = u3 === await i3.mode() ? await a4.mode() : await i3.mode();
                  if (await i3.oid() === await a4.oid()) return { cleanMerge: true, mergeResult: { mode: g3, path: r4, oid: await i3.oid(), type: d3 } };
                  if (await i3.oid() === h3) return { cleanMerge: true, mergeResult: { mode: g3, path: r4, oid: await a4.oid(), type: d3 } };
                  if (await a4.oid() === h3) return { cleanMerge: true, mergeResult: { mode: g3, path: r4, oid: await i3.oid(), type: d3 } };
                  const w3 = Buffer.from(await i3.content()).toString("utf8"), m3 = Buffer.from(await a4.content()).toString("utf8"), { mergedText: y3, cleanMerge: b3 } = await l3({ branches: [c3, o4, s4], contents: [p3, w3, m3], path: r4 });
                  return { cleanMerge: b3, mergeResult: { mode: g3, path: r4, oid: await ce({ fs: t4, gitdir: e5, type: "blob", object: Buffer.from(y3, "utf8"), dryRun: f3 }), type: d3 } };
                })({ fs: t3, gitdir: i2, path: s3, ours: r3, base: a3, theirs: o3, ourName: c2, baseName: f2, theirName: l2, mergeDriver: h2 }).then(async (t4) => {
                  if (t4.cleanMerge) u2 || n2.insert({ filepath: e4, oid: t4.mergeResult.oid, stage: 0 });
                  else if (m2.push(e4), y2.push(e4), !u2) {
                    let t5 = "";
                    a3 && "blob" === await a3.type() && (t5 = await a3.oid());
                    const i3 = await r3.oid(), s4 = await o3.oid();
                    n2.delete({ filepath: e4 }), t5 && n2.insert({ filepath: e4, oid: t5, stage: 1 }), n2.insert({ filepath: e4, oid: i3, stage: 2 }), n2.insert({ filepath: e4, oid: s4, stage: 3 });
                  }
                  return t4.mergeResult;
                });
                if (a3 && !r3 && o3 && "blob" === await a3.type() && "blob" === await o3.type()) {
                  if (m2.push(e4), b2.push(e4), !u2) {
                    const t4 = await a3.oid(), r4 = await o3.oid();
                    n2.delete({ filepath: e4 }), n2.insert({ filepath: e4, oid: t4, stage: 1 }), n2.insert({ filepath: e4, oid: r4, stage: 3 });
                  }
                  return { mode: await o3.mode(), oid: await o3.oid(), type: "blob", path: s3 };
                }
                if (a3 && r3 && !o3 && "blob" === await a3.type() && "blob" === await r3.type()) {
                  if (m2.push(e4), _2.push(e4), !u2) {
                    const t4 = await a3.oid(), i3 = await r3.oid();
                    n2.delete({ filepath: e4 }), n2.insert({ filepath: e4, oid: t4, stage: 1 }), n2.insert({ filepath: e4, oid: i3, stage: 2 });
                  }
                  return { mode: await r3.mode(), oid: await r3.oid(), type: "blob", path: s3 };
                }
                if (a3 && !r3 && !o3 && ("blob" === await a3.type() || "tree" === await a3.type())) return;
                throw new qe();
            }
          }, reduce: 0 === m2.length || r2 && !u2 ? async (e4, r3) => {
            const n3 = r3.filter(Boolean);
            if (e4 && (!e4 || "tree" !== e4.type || 0 !== n3.length || "." === e4.path)) {
              if (n3.length > 0 || "." === e4.path && 0 === n3.length) {
                const r4 = new ft(n3).toObject(), a3 = await ce({ fs: t3, gitdir: i2, type: "tree", object: r4, dryRun: d2 });
                e4.oid = a3;
              }
              return e4;
            }
          } : void 0 });
          return 0 !== m2.length ? (r2 && !u2 && await Ht({ fs: t3, cache: e3, dir: r2, gitdir: i2, trees: [Mt({ ref: v2.oid })], map: async function(e4, [i3]) {
            const n3 = `${r2}/${e4}`;
            if ("blob" === await i3.type()) {
              const e5 = await i3.mode(), r3 = new TextDecoder().decode(await i3.content());
              await t3.write(n3, r3, { mode: e5 });
            }
            return true;
          } }), new We(m2, y2, b2, _2)) : v2.oid;
        }
        const Xe = { stage: P, workdir: Nt };
        let Je;
        async function Qe(t3, r2) {
          return void 0 === Je && (Je = new e2()), Je.acquire(t3, r2);
        }
        async function tr({ fs: t3, dir: e3, gitdir: r2, treePair: i2 }) {
          const n2 = "stage" === i2[1], a2 = i2.map((t4) => "string" == typeof t4 ? Xe[t4]() : t4), s2 = [], c2 = await Ht({ fs: t3, cache: {}, dir: e3, gitdir: r2, trees: a2, map: async (i3, [n3, a3]) => {
            if ("." !== i3 && !await ae.isIgnored({ fs: t3, dir: e3, gitdir: r2, filepath: i3 })) return a3 ? ((!n3 || await n3.oid() !== await a3.oid() && void 0 !== await a3.oid()) && s2.push([n3, a3]), { mode: await a3.mode(), path: i3, oid: await a3.oid(), type: await a3.type() }) : void 0;
          }, reduce: async (t4, e4) => (e4 = e4.filter(Boolean), t4 ? (t4.children = e4, t4) : e4.length > 0 ? e4 : void 0), iterate: async (r3, i3) => {
            const a3 = [];
            for (const r4 of i3) {
              const [i4, o2] = r4;
              n2 ? o2 && (await t3.exists(`${e3}/${o2.toString()}`) ? a3.push(r4) : s2.push([null, o2])) : i4 && (o2 ? a3.push(r4) : s2.push([i4, null]));
            }
            return a3.length ? Promise.all(a3.map(r3)) : [];
          } });
          if (0 === s2.length || 0 === c2.length) return null;
          const f2 = (await (async function({ fs: t4, dir: e4, gitdir: r3, entries: i3 }) {
            return Promise.all(i3.map(async function i4(n3) {
              if ("tree" === n3.type) {
                if (!n3.oid) {
                  const e5 = await Promise.all(n3.children.map(i4));
                  n3.oid = await Se({ fs: t4, gitdir: r3, tree: e5 }), n3.mode = 16384;
                }
              } else "blob" === n3.type && (n3.oid = await (async function(t5, e5, r4, i5, n4 = null) {
                const a3 = N(r4, i5), s3 = await t5.lstat(a3);
                if (!s3) throw new I(a3);
                if (s3.isDirectory()) throw new o(`${a3}: file expected, but found directory`);
                const c3 = n4 ? await dt({ fs: t5, gitdir: e5, oid: n4 }) : void 0;
                let f3 = c3 ? n4 : void 0;
                return c3 || await Qe({ fs: t5, gitdir: e5, currentFilepath: a3 }, async () => {
                  const r5 = s3.isSymbolicLink() ? await t5.readlink(a3).then(fe) : await t5.read(a3);
                  if (null === r5) throw new I(a3);
                  f3 = await ce({ fs: t5, gitdir: e5, type: "blob", object: r5 });
                }), f3;
              })(t4, r3, e4, n3.path, n3.oid), n3.mode = 33188);
              return n3.path = n3.path.split("/").pop(), n3;
            }));
          })({ fs: t3, dir: e3, gitdir: r2, entries: c2 })).filter(Boolean).map((t4) => ({ mode: t4.mode, path: t4.path, oid: t4.oid, type: t4.type }));
          return Se({ fs: t3, gitdir: r2, tree: f2 });
        }
        async function er({ fs: t3, dir: e3, gitdir: r2, stashCommit: i2, parentCommit: n2, wasStaged: a2 }) {
          const o2 = [], s2 = [], c2 = await Ht({ fs: t3, cache: {}, dir: e3, gitdir: r2, trees: [Mt({ ref: n2 }), Mt({ ref: i2 })], map: async (i3, [n3, c3]) => {
            if ("." === i3 || await ae.isIgnored({ fs: t3, dir: e3, gitdir: r2, filepath: i3 })) return;
            const f2 = c3 ? await c3.type() : await n3.type();
            if ("tree" !== f2 && "blob" !== f2) return;
            if (!c3 && n3) {
              const t4 = "tree" === f2 ? "rmdir" : "rm";
              return "tree" === f2 && o2.push(i3), "blob" === f2 && a2 && s2.push({ filepath: i3, oid: await n3.oid() }), { method: t4, filepath: i3 };
            }
            const l2 = await c3.oid();
            return n3 && await n3.oid() === l2 ? void 0 : "tree" === f2 ? { method: "mkdir", filepath: i3 } : (a2 && s2.push({ filepath: i3, oid: l2, stats: await t3.lstat(N(e3, i3)) }), { method: "write", filepath: i3, oid: l2 });
          } });
          await Qe({ fs: t3, gitdir: r2, dirRemoved: o2, ops: c2 }, async () => {
            for (const i3 of c2) {
              const n3 = N(e3, i3.filepath);
              switch (i3.method) {
                case "rmdir":
                  await t3.rmdir(n3);
                  break;
                case "mkdir":
                  await t3.mkdir(n3);
                  break;
                case "rm":
                  await t3.rm(n3);
                  break;
                case "write":
                  if (!o2.some((t4) => n3.startsWith(t4))) {
                    const { object: e4 } = await Bt({ fs: t3, cache: {}, gitdir: r2, oid: i3.oid });
                    await t3.exists(n3) && await t3.rm(n3), await t3.write(n3, e4);
                  }
              }
            }
          }), await E.acquire({ fs: t3, gitdir: r2, cache: {} }, async (t4) => {
            s2.forEach(({ filepath: e4, stats: r3, oid: i3 }) => {
              t4.insert({ filepath: e4, stats: r3, oid: i3 });
            });
          });
        }
        async function rr({ fs: t3, cache: e3, dir: r2, gitdir: i2, oid: n2, dryRun: a2 = false, noUpdateBranch: o2 = false, abortOnConflict: s2 = true, committer: c2, mergeDriver: f2 }) {
          const { commit: l2, oid: d2 } = await be({ fs: t3, cache: e3, gitdir: i2, oid: n2 });
          if (l2.parent.length > 1) throw new He(d2, l2.parent.length);
          if (0 === l2.parent.length) throw new Ge(d2);
          const u2 = await nt.resolve({ fs: t3, gitdir: i2, ref: "HEAD" }), { commit: h2 } = await be({ fs: t3, cache: e3, gitdir: i2, oid: u2 }), p2 = l2.parent[0], { commit: g2 } = await be({ fs: t3, cache: e3, gitdir: i2, oid: p2 }), w2 = await E.acquire({ fs: t3, gitdir: i2, cache: e3, allowUnmerged: false }, async (n3) => Ye({ fs: t3, cache: e3, dir: r2, gitdir: i2, index: n3, ourOid: h2.tree, baseOid: g2.tree, theirOid: l2.tree, ourName: "HEAD", baseName: `parent of ${d2.slice(0, 7)}`, theirName: d2.slice(0, 7), dryRun: a2, abortOnConflict: s2, mergeDriver: f2 }));
          if (w2 instanceof We) throw w2;
          const m2 = await _e({ fs: t3, cache: e3, gitdir: i2, message: l2.message, tree: w2, parent: [u2], author: l2.author, committer: c2, dryRun: a2, noUpdateBranch: o2 });
          return !r2 || a2 || o2 || await er({ fs: t3, dir: r2, gitdir: i2, stashCommit: m2, parentCommit: u2, wasStaged: true }), m2;
        }
        async function ir({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oid: i2, cache: n2 = {}, committer: a2, dryRun: o2 = false, noUpdateBranch: s2 = false, abortOnConflict: c2 = true, mergeDriver: f2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oid", i2);
            const l2 = new Xt(t3), d2 = await te({ fsp: l2, dotgit: r2 }), { commit: u2 } = await be({ fs: l2, cache: n2, gitdir: d2, oid: i2 });
            if (u2.parent && u2.parent.length > 1) return await rr({ fs: l2, cache: n2, dir: e3, gitdir: d2, oid: i2, dryRun: o2, noUpdateBranch: s2, abortOnConflict: c2, committer: void 0, mergeDriver: f2 });
            const h2 = await me({ fs: l2, gitdir: d2, committer: a2 });
            if (!h2) throw new ue("committer");
            return await rr({ fs: l2, cache: n2, dir: e3, gitdir: d2, oid: i2, dryRun: o2, noUpdateBranch: s2, abortOnConflict: c2, committer: h2, mergeDriver: f2 });
          } catch (t4) {
            throw t4.caller = "git.cherryPick", t4;
          }
        }
        const nr = /^refs\/(heads\/|tags\/|remotes\/)?(.*)/;
        function ar(t3) {
          const e3 = nr.exec(t3);
          return e3 ? "remotes/" === e3[1] && t3.endsWith("/HEAD") ? e3[2].slice(0, -5) : e3[2] : t3;
        }
        async function or({ fs: t3, gitdir: e3, fullname: r2 = false, test: i2 = false }) {
          const n2 = await nt.resolve({ fs: t3, gitdir: e3, ref: "HEAD", depth: 2 });
          if (i2) try {
            await nt.resolve({ fs: t3, gitdir: e3, ref: n2 });
          } catch (t4) {
            return;
          }
          if (n2.startsWith("refs/")) return r2 ? n2 : ar(n2);
        }
        class sr extends n {
          constructor(t3, e3) {
            super(`Remote does not support the "${t3}" so the "${e3}" parameter cannot be used.`), this.code = this.name = sr.code, this.data = { capability: t3, parameter: e3 };
          }
        }
        sr.code = "RemoteCapabilityError";
        class cr extends n {
          constructor(t3, e3, r2) {
            super(`Git remote "${t3}" uses an unrecognized transport protocol: "${e3}"`), this.code = this.name = cr.code, this.data = { url: t3, transport: e3, suggestion: r2 };
          }
        }
        cr.code = "UnknownTransportError";
        class fr extends n {
          constructor(t3) {
            super(`Cannot parse remote URL: "${t3}"`), this.code = this.name = fr.code, this.data = { url: t3 };
          }
        }
        fr.code = "UrlParseError";
        class lr extends n {
          constructor(t3, e3, r2) {
            super(`HTTP Error: ${t3} ${e3}`), this.code = this.name = lr.code, this.data = { statusCode: t3, statusMessage: e3, response: r2 };
          }
        }
        lr.code = "HttpError";
        class dr extends n {
          constructor(t3, e3) {
            super(`Remote did not reply using the "smart" HTTP protocol. Expected "001e# service=git-upload-pack" but received: ${t3}`), this.code = this.name = dr.code, this.data = { preview: t3, response: e3 };
          }
        }
        dr.code = "SmartHttpError";
        class ur extends n {
          constructor() {
            super("The operation was canceled."), this.code = this.name = ur.code, this.data = {};
          }
        }
        function hr({ username: t3 = "", password: e3 = "" }) {
          return `Basic ${Buffer.from(`${t3}:${e3}`).toString("base64")}`;
        }
        async function pr(t3, e3) {
          const r2 = mt(t3);
          for (; ; ) {
            const { value: t4, done: i2 } = await r2.next();
            if (t4 && await e3(t4), i2) break;
          }
          r2.return && r2.return();
        }
        async function gr(t3) {
          let e3 = 0;
          const r2 = [];
          await pr(t3, (t4) => {
            r2.push(t4), e3 += t4.byteLength;
          });
          const i2 = new Uint8Array(e3);
          let n2 = 0;
          for (const t4 of r2) i2.set(t4, n2), n2 += t4.byteLength;
          return i2;
        }
        function wr(t3) {
          let e3 = t3.match(/^https?:\/\/([^/]+)@/);
          if (null == e3) return { url: t3, auth: {} };
          e3 = e3[1];
          const [r2, i2] = e3.split(":");
          return { url: t3 = t3.replace(`${e3}@`, ""), auth: { username: r2, password: i2 } };
        }
        ur.code = "UserCanceledError";
        class mr extends n {
          constructor() {
            super("Empty response from git server."), this.code = this.name = mr.code, this.data = {};
          }
        }
        mr.code = "EmptyServerResponseError";
        class yr extends n {
          constructor(t3, e3) {
            super(`Expected "${t3}" but received "${e3}".`), this.code = this.name = yr.code, this.data = { expected: t3, actual: e3 };
          }
        }
        function br(t3, e3) {
          const r2 = e3.toString(16);
          return "0".repeat(t3 - r2.length) + r2;
        }
        yr.code = "ParseError";
        class _r {
          static flush() {
            return Buffer.from("0000", "utf8");
          }
          static delim() {
            return Buffer.from("0001", "utf8");
          }
          static encode(t3) {
            "string" == typeof t3 && (t3 = Buffer.from(t3));
            const e3 = br(4, t3.length + 4);
            return Buffer.concat([Buffer.from(e3, "utf8"), t3]);
          }
          static streamReader(t3) {
            const e3 = new yt(t3);
            return async function() {
              try {
                let t4 = await e3.read(4);
                if (null == t4) return true;
                if (t4 = parseInt(t4.toString("utf8"), 16), 0 === t4) return null;
                if (1 === t4) return null;
                const r2 = await e3.read(t4 - 4);
                return null == r2 || r2;
              } catch (e4) {
                return t3.error = e4, true;
              }
            };
          }
        }
        async function vr(t3) {
          const e3 = {};
          let r2;
          for (; r2 = await t3(), true !== r2; ) {
            if (null === r2) continue;
            r2 = r2.toString("utf8").replace(/\n$/, "");
            const t4 = r2.indexOf("=");
            if (t4 > -1) {
              const i2 = r2.slice(0, t4), n2 = r2.slice(t4 + 1);
              e3[i2] = n2;
            } else e3[r2] = true;
          }
          return { protocolVersion: 2, capabilities2: e3 };
        }
        async function xr(t3, { service: e3 }) {
          const r2 = /* @__PURE__ */ new Set(), i2 = /* @__PURE__ */ new Map(), n2 = /* @__PURE__ */ new Map(), a2 = _r.streamReader(t3);
          let o2 = await a2();
          for (; null === o2; ) o2 = await a2();
          if (true === o2) throw new mr();
          if (o2.includes("version 2")) return vr(a2);
          if (o2.toString("utf8").replace(/\n$/, "") !== `# service=${e3}`) throw new yr(`# service=${e3}\\n`, o2.toString("utf8"));
          let s2 = await a2();
          for (; null === s2; ) s2 = await a2();
          if (true === s2) return { capabilities: r2, refs: i2, symrefs: n2 };
          if (s2 = s2.toString("utf8"), s2.includes("version 2")) return vr(a2);
          const [c2, f2] = kr(s2, "\0", "\\x00");
          if (f2.split(" ").map((t4) => r2.add(t4)), "0000000000000000000000000000000000000000 capabilities^{}" !== c2) {
            const [t4, e4] = kr(c2, " ", " ");
            for (i2.set(e4, t4); ; ) {
              const t5 = await a2();
              if (true === t5) break;
              if (null !== t5) {
                const [e5, r3] = kr(t5.toString("utf8"), " ", " ");
                i2.set(r3, e5);
              }
            }
          }
          for (const t4 of r2) if (t4.startsWith("symref=")) {
            const e4 = t4.match(/symref=([^:]+):(.*)/);
            3 === e4.length && n2.set(e4[1], e4[2]);
          }
          return { protocolVersion: 1, capabilities: r2, refs: i2, symrefs: n2 };
        }
        function kr(t3, e3, r2) {
          const i2 = t3.trim().split(e3);
          if (2 !== i2.length) throw new yr(`Two strings separated by '${r2}'`, t3.toString("utf8"));
          return i2;
        }
        const Er = (t3, e3) => t3.endsWith("?") ? `${t3}${e3}` : `${t3}/${e3.replace(/^https?:\/\//, "")}`, Ar = (t3, e3) => {
          (e3.username || e3.password) && (t3.Authorization = hr(e3)), e3.headers && Object.assign(t3, e3.headers);
        }, Sr = async (t3) => {
          try {
            const e3 = Buffer.from(await gr(t3.body)), r2 = e3.toString("utf8");
            return { preview: r2.length < 256 ? r2 : r2.slice(0, 256) + "...", response: r2, data: e3 };
          } catch (t4) {
            return {};
          }
        };
        class Br {
          static async capabilities() {
            return ["discover", "connect"];
          }
          static async discover({ http: t3, onProgress: e3, onAuth: r2, onAuthSuccess: i2, onAuthFailure: n2, corsProxy: a2, service: o2, url: s2, headers: c2, protocolVersion: f2 }) {
            let { url: l2, auth: d2 } = wr(s2);
            const u2 = a2 ? Er(a2, l2) : l2;
            let h2, p2;
            (d2.username || d2.password) && (c2.Authorization = hr(d2)), 2 === f2 && (c2["Git-Protocol"] = "version=2");
            let g2 = false;
            do {
              if (h2 = await t3.request({ onProgress: e3, method: "GET", url: `${u2}/info/refs?service=${o2}`, headers: c2 }), p2 = false, 401 === h2.statusCode || 203 === h2.statusCode) {
                const t4 = g2 ? n2 : r2;
                if (t4) {
                  if (d2 = await t4(l2, { ...d2, headers: { ...c2 } }), d2 && d2.cancel) throw new ur();
                  d2 && (Ar(c2, d2), g2 = true, p2 = true);
                }
              } else 200 === h2.statusCode && g2 && i2 && await i2(l2, d2);
            } while (p2);
            if (200 !== h2.statusCode) {
              const { response: t4 } = await Sr(h2);
              throw new lr(h2.statusCode, h2.statusMessage, t4);
            }
            if (h2.headers["content-type"] === `application/x-${o2}-advertisement`) {
              const t4 = await xr(h2.body, { service: o2 });
              return t4.auth = d2, t4;
            }
            {
              const { preview: t4, response: e4, data: r3 } = await Sr(h2);
              try {
                const t5 = await xr([r3], { service: o2 });
                return t5.auth = d2, t5;
              } catch (r4) {
                throw new dr(t4, e4);
              }
            }
          }
          static async connect({ http: t3, onProgress: e3, corsProxy: r2, service: i2, url: n2, auth: a2, body: o2, headers: s2 }) {
            const c2 = wr(n2);
            c2 && (n2 = c2.url), r2 && (n2 = Er(r2, n2)), s2["content-type"] = `application/x-${i2}-request`, s2.accept = `application/x-${i2}-result`, Ar(s2, a2);
            const f2 = await t3.request({ onProgress: e3, method: "POST", url: `${n2}/${i2}`, body: o2, headers: s2 });
            if (200 !== f2.statusCode) {
              const { response: t4 } = Sr(f2);
              throw new lr(f2.statusCode, f2.statusMessage, t4);
            }
            return f2;
          }
        }
        class $r {
          static getRemoteHelperFor({ url: t3 }) {
            const e3 = /* @__PURE__ */ new Map();
            e3.set("http", Br), e3.set("https", Br);
            const r2 = (function({ url: t4 }) {
              if (t4.startsWith("git@")) return { transport: "ssh", address: t4 };
              const e4 = t4.match(/(\w+)(:\/\/|::)(.*)/);
              return null !== e4 ? "://" === e4[2] ? { transport: e4[1], address: e4[0] } : "::" === e4[2] ? { transport: e4[1], address: e4[3] } : void 0 : void 0;
            })({ url: t3 });
            if (!r2) throw new fr(t3);
            if (e3.has(r2.transport)) return e3.get(r2.transport);
            throw new cr(t3, r2.transport, "ssh" === r2.transport ? (function(t4) {
              return (t4 = t4.replace(/^git@([^:]+):/, "https://$1/")).replace(/^ssh:\/\//, "https://");
            })(t3) : void 0);
          }
        }
        let Rr = null;
        class Pr {
          static async read({ fs: t3, gitdir: r2 }) {
            null === Rr && (Rr = new e2());
            const i2 = N(r2, "shallow"), n2 = /* @__PURE__ */ new Set();
            return await Rr.acquire(i2, async function() {
              const e3 = await t3.read(i2, { encoding: "utf8" });
              return null === e3 || "" === e3.trim() ? n2 : void e3.trim().split("\n").map((t4) => n2.add(t4));
            }), n2;
          }
          static async write({ fs: t3, gitdir: r2, oids: i2 }) {
            null === Rr && (Rr = new e2());
            const n2 = N(r2, "shallow");
            if (i2.size > 0) {
              const e3 = [...i2].join("\n") + "\n";
              await Rr.acquire(n2, async function() {
                await t3.write(n2, e3, { encoding: "utf8" });
              });
            } else await Rr.acquire(n2, async function() {
              await t3.rm(n2);
            });
          }
        }
        async function Ir({ fs: t3, cache: e3, gitdir: r2, oid: i2, format: n2 = "content" }) {
          let a2 = await (async function({ fs: t4, gitdir: e4, oid: r3 }) {
            const i3 = `objects/${r3.slice(0, 2)}/${r3.slice(2)}`;
            return t4.exists(`${e4}/${i3}`);
          })({ fs: t3, gitdir: r2, oid: i2 });
          return a2 || (a2 = await (async function({ fs: t4, cache: e4, gitdir: r3, oid: i3, getExternalRefDelta: n3 }) {
            let a3 = await t4.readdir(N(r3, "objects/pack"));
            a3 = a3.filter((t5) => t5.endsWith(".idx"));
            for (const s2 of a3) {
              const a4 = `${r3}/objects/pack/${s2}`, c2 = await At({ fs: t4, cache: e4, filename: a4, getExternalRefDelta: n3 });
              if (c2.error) throw new o(c2.error);
              if (c2.offsets.has(i3)) return true;
            }
            return false;
          })({ fs: t3, cache: e3, gitdir: r2, oid: i2, getExternalRefDelta: (i3) => Bt({ fs: t3, cache: e3, gitdir: r2, oid: i3 }) })), a2;
        }
        function Or({ config: t3, onAuth: e3 }) {
          return e3 ? async (r2, i2) => {
            const n2 = i2.username || await t3.get(`credential.${r2}.username`);
            return e3(r2, n2 ? { ...i2, username: n2 } : i2);
          } : e3;
        }
        function jr(t3, e3) {
          const r2 = t3.map((t4) => t4.split("=", 1)[0]);
          return e3.filter((t4) => {
            const e4 = t4.split("=", 1)[0];
            return r2.includes(e4);
          });
        }
        const Ur = { name: "isomorphic-git", version: "1.38.5", agent: "git/isomorphic-git@1.38.5" };
        class Tr {
          constructor() {
            this._queue = [];
          }
          write(t3) {
            if (this._ended) throw Error("You cannot write to a FIFO that has already been ended!");
            if (this._waiting) {
              const e3 = this._waiting;
              this._waiting = null, e3({ value: t3 });
            } else this._queue.push(t3);
          }
          end() {
            if (this._ended = true, this._waiting) {
              const t3 = this._waiting;
              this._waiting = null, t3({ done: true });
            }
          }
          destroy(t3) {
            this.error = t3, this.end();
          }
          async next() {
            if (this._queue.length > 0) return { value: this._queue.shift() };
            if (this._ended) return { done: true };
            if (this._waiting) throw Error("You cannot call read until the previous call to read has returned!");
            return new Promise((t3) => {
              this._waiting = t3;
            });
          }
        }
        function Cr(t3) {
          const e3 = t3.indexOf("\r"), r2 = t3.indexOf("\n");
          return -1 === e3 && -1 === r2 ? -1 : -1 === e3 ? r2 + 1 : -1 === r2 ? e3 + 1 : r2 === e3 + 1 ? r2 + 1 : Math.min(e3, r2) + 1;
        }
        function Mr(t3) {
          const e3 = new Tr();
          let r2 = "";
          return (async () => {
            await pr(t3, (t4) => {
              for (t4 = t4.toString("utf8"), r2 += t4; ; ) {
                const t5 = Cr(r2);
                if (-1 === t5) break;
                e3.write(r2.slice(0, t5)), r2 = r2.slice(t5);
              }
            }), r2.length > 0 && e3.write(r2), e3.end();
          })(), e3;
        }
        class Dr {
          static demux(t3) {
            const e3 = _r.streamReader(t3), r2 = new Tr(), i2 = new Tr(), n2 = new Tr(), a2 = async function() {
              const o2 = await e3();
              if (null === o2) return a2();
              if (true === o2) return r2.end(), n2.end(), void (t3.error ? i2.destroy(t3.error) : i2.end());
              switch (o2[0]) {
                case 1:
                  i2.write(o2.slice(1));
                  break;
                case 2:
                  n2.write(o2.slice(1));
                  break;
                case 3: {
                  const t4 = o2.slice(1);
                  return n2.write(t4), r2.end(), n2.end(), void i2.destroy(new Error(t4.toString("utf8")));
                }
                default:
                  r2.write(o2);
              }
              a2();
            };
            return a2(), { packetlines: r2, packfile: i2, progress: n2 };
          }
        }
        async function Nr({ fs: t3, cache: e3, http: r2, onProgress: i2, onMessage: n2, onAuth: a2, onAuthSuccess: o2, onAuthFailure: s2, gitdir: c2, ref: f2, remoteRef: l2, remote: d2, url: u2, corsProxy: h2, depth: p2 = null, since: g2 = null, exclude: w2 = [], relative: m2 = false, tags: y2 = false, singleBranch: b2 = false, headers: _2 = {}, prune: v2 = false, pruneTags: x2 = false }) {
          const k2 = f2 || await or({ fs: t3, gitdir: c2, test: true }), E2 = await Q.get({ fs: t3, gitdir: c2 }), A2 = d2 || k2 && await E2.get(`branch.${k2}.remote`) || "origin", S2 = u2 || await E2.get(`remote.${A2}.url`);
          if (void 0 === S2) throw new Jt("remote OR url");
          const B2 = l2 || k2 && await E2.get(`branch.${k2}.merge`) || f2 || "HEAD";
          void 0 === h2 && (h2 = await E2.get("http.corsProxy"));
          const $2 = $r.getRemoteHelperFor({ url: S2 }), R2 = await $2.discover({ http: r2, onAuth: Or({ config: E2, onAuth: a2 }), onAuthSuccess: o2, onAuthFailure: Or({ config: E2, onAuth: s2 }), corsProxy: h2, service: "git-upload-pack", url: S2, headers: _2, protocolVersion: 1 }), P2 = R2.auth, I2 = R2.refs;
          if (0 === I2.size) return { defaultBranch: null, fetchHead: null, fetchHeadDescription: null };
          if (null !== p2 && !R2.capabilities.has("shallow")) throw new sr("shallow", "depth");
          if (null !== g2 && !R2.capabilities.has("deepen-since")) throw new sr("deepen-since", "since");
          if (w2.length > 0 && !R2.capabilities.has("deepen-not")) throw new sr("deepen-not", "exclude");
          if (true === m2 && !R2.capabilities.has("deepen-relative")) throw new sr("deepen-relative", "relative");
          const { oid: O2, fullref: U2 } = nt.resolveAgainstMap({ ref: B2, map: I2 });
          for (const t4 of I2.keys()) t4 === U2 || "HEAD" === t4 || t4.startsWith("refs/heads/") || y2 && t4.startsWith("refs/tags/") || I2.delete(t4);
          const T2 = jr([...R2.capabilities], ["multi_ack_detailed", "no-done", "side-band-64k", "ofs-delta", `agent=${Ur.agent}`]);
          m2 && T2.push("deepen-relative");
          const C2 = b2 ? [O2] : I2.values(), M2 = b2 ? [k2] : await nt.listRefs({ fs: t3, gitdir: c2, filepath: "refs" });
          let D2 = [];
          for (let r3 of M2) try {
            r3 = await nt.expand({ fs: t3, gitdir: c2, ref: r3 });
            const i3 = await nt.resolve({ fs: t3, gitdir: c2, ref: r3 });
            await Ir({ fs: t3, cache: e3, gitdir: c2, oid: i3 }) && D2.push(i3);
          } catch (t4) {
          }
          D2 = [...new Set(D2)];
          const z2 = await Pr.read({ fs: t3, gitdir: c2 }), F2 = (function({ capabilities: t4 = [], wants: e4 = [], haves: r3 = [], shallows: i3 = [], depth: n3 = null, since: a3 = null, exclude: o3 = [] }) {
            const s3 = [];
            e4 = [...new Set(e4)];
            let c3 = ` ${t4.join(" ")}`;
            for (const t5 of e4) s3.push(_r.encode(`want ${t5}${c3}
`)), c3 = "";
            for (const t5 of i3) s3.push(_r.encode(`shallow ${t5}
`));
            null !== n3 && s3.push(_r.encode(`deepen ${n3}
`)), null !== a3 && s3.push(_r.encode(`deepen-since ${Math.floor(a3.valueOf() / 1e3)}
`));
            for (const t5 of o3) s3.push(_r.encode(`deepen-not ${t5}
`));
            s3.push(_r.flush());
            for (const t5 of r3) s3.push(_r.encode(`have ${t5}
`));
            return s3.push(_r.encode("done\n")), s3;
          })({ capabilities: T2, wants: C2, haves: D2, shallows: R2.capabilities.has("shallow") ? [...z2] : [], depth: p2, since: g2, exclude: w2 }), L2 = Buffer.from(await gr(F2)), H2 = await $2.connect({ http: r2, onProgress: i2, corsProxy: h2, service: "git-upload-pack", url: S2, auth: P2, body: [L2], headers: _2 }), G2 = await (async function(t4) {
            const { packetlines: e4, packfile: r3, progress: i3 } = Dr.demux(t4), n3 = [], a3 = [], o3 = [];
            let s3 = false, c3 = false;
            return new Promise((f3, l3) => {
              pr(e4, (e5) => {
                const d3 = e5.toString("utf8").trim();
                if (d3.startsWith("shallow")) {
                  const t5 = d3.slice(-41).trim();
                  40 !== t5.length && l3(new j(t5)), n3.push(t5);
                } else if (d3.startsWith("unshallow")) {
                  const t5 = d3.slice(-41).trim();
                  40 !== t5.length && l3(new j(t5)), a3.push(t5);
                } else if (d3.startsWith("ACK")) {
                  const [, t5, e6] = d3.split(" ");
                  o3.push({ oid: t5, status: e6 }), e6 || (c3 = true);
                } else d3.startsWith("NAK") ? (s3 = true, c3 = true) : (c3 = true, s3 = true);
                c3 && (t4.error ? l3(t4.error) : f3({ shallows: n3, unshallows: a3, acks: o3, nak: s3, packfile: r3, progress: i3 }));
              }).finally(() => {
                c3 || (t4.error ? l3(t4.error) : f3({ shallows: n3, unshallows: a3, acks: o3, nak: s3, packfile: r3, progress: i3 }));
              });
            });
          })(H2.body);
          H2.headers && (G2.headers = H2.headers);
          for (const r3 of G2.shallows) if (!z2.has(r3)) try {
            const { object: i3 } = await Bt({ fs: t3, cache: e3, gitdir: c2, oid: r3 }), n3 = new Ut(i3), a3 = await Promise.all(n3.headers().parent.map((r4) => Ir({ fs: t3, cache: e3, gitdir: c2, oid: r4 })));
            0 === a3.length || a3.every((t4) => t4) || z2.add(r3);
          } catch (t4) {
            z2.add(r3);
          }
          for (const t4 of G2.unshallows) z2.delete(t4);
          if (await Pr.write({ fs: t3, gitdir: c2, oids: z2 }), b2) {
            const e4 = /* @__PURE__ */ new Map([[U2, O2]]), r3 = /* @__PURE__ */ new Map();
            let i3 = 10, n3 = U2;
            for (; i3--; ) {
              const t4 = R2.symrefs.get(n3);
              if (void 0 === t4) break;
              r3.set(n3, t4), n3 = t4;
            }
            const a3 = I2.get(n3);
            a3 && e4.set(n3, a3);
            const { pruned: o3 } = await nt.updateRemoteRefs({ fs: t3, gitdir: c2, remote: A2, refs: e4, symrefs: r3, tags: y2, prune: v2 });
            v2 && (G2.pruned = o3);
          } else {
            const { pruned: e4 } = await nt.updateRemoteRefs({ fs: t3, gitdir: c2, remote: A2, refs: I2, symrefs: R2.symrefs, tags: y2, prune: v2, pruneTags: x2 });
            v2 && (G2.pruned = e4);
          }
          if (G2.HEAD = R2.symrefs.get("HEAD"), void 0 === G2.HEAD) {
            const { oid: t4 } = nt.resolveAgainstMap({ ref: "HEAD", map: I2 });
            for (const [e4, r3] of I2.entries()) if ("HEAD" !== e4 && r3 === t4) {
              G2.HEAD = e4;
              break;
            }
          }
          const W2 = U2.startsWith("refs/tags") ? "tag" : "branch";
          G2.FETCH_HEAD = { oid: O2, description: `${W2} '${ar(U2)}' of ${S2}` }, (i2 || n2) && pr(Mr(G2.progress), async (t4) => {
            if (n2 && await n2(t4), i2) {
              const e4 = t4.match(/([^:]*).*\((\d+?)\/(\d+?)\)/);
              e4 && await i2({ phase: e4[1].trim(), loaded: parseInt(e4[2], 10), total: parseInt(e4[3], 10) });
            }
          });
          const q2 = Buffer.from(await gr(G2.packfile));
          if (H2.body.error) throw H2.body.error;
          const Z2 = q2.slice(-20).toString("hex"), K2 = { defaultBranch: G2.HEAD, fetchHead: G2.FETCH_HEAD.oid, fetchHeadDescription: G2.FETCH_HEAD.description };
          if (G2.headers && (K2.headers = G2.headers), v2 && (K2.pruned = G2.pruned), "" !== Z2 && "5041434b0000000200000000" !== q2.slice(0, 12).toString("hex")) {
            K2.packfile = `objects/pack/pack-${Z2}.pack`;
            const r3 = N(c2, K2.packfile);
            await t3.write(r3, q2);
            const n3 = (r4) => Bt({ fs: t3, cache: e3, gitdir: c2, oid: r4 }), a3 = await kt.fromPack({ pack: q2, getExternalRefDelta: n3, onProgress: i2 });
            await t3.write(r3.replace(/\.pack$/, ".idx"), await a3.toBuffer());
          }
          return K2;
        }
        async function zr({ fs: t3, bare: e3 = false, dir: r2, gitdir: i2 = e3 ? r2 : N(r2, ".git"), defaultBranch: n2 = "master" }) {
          if (await t3.exists(i2 + "/config")) return;
          let a2 = ["hooks", "info", "objects/info", "objects/pack", "refs/heads", "refs/tags"];
          a2 = a2.map((t4) => i2 + "/" + t4);
          for (const e4 of a2) await t3.mkdir(e4);
          await t3.write(i2 + "/config", `[core]
	repositoryformatversion = 0
	filemode = false
	bare = ${e3}
` + (e3 ? "" : "	logallrefupdates = true\n") + "	symlinks = false\n	ignorecase = true\n"), await t3.write(i2 + "/HEAD", `ref: refs/heads/${n2}
`);
        }
        async function Fr({ fs: t3, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, onPostCheckout: s2, dir: c2, gitdir: f2 = N(c2, ".git"), url: l2, corsProxy: d2, ref: u2, remote: h2 = "origin", depth: p2, since: g2, exclude: w2 = [], relative: m2 = false, singleBranch: y2 = false, noCheckout: b2 = false, noTags: _2 = false, headers: v2 = {}, cache: x2 = {}, nonBlocking: k2 = false, batchSize: E2 = 100 }) {
          try {
            Qt("fs", t3), Qt("http", e3), Qt("gitdir", f2), b2 || Qt("dir", c2), Qt("url", l2);
            const A2 = new Xt(t3), S2 = await te({ fsp: A2, dotgit: f2 });
            return await (async function({ fs: t4, cache: e4, http: r3, onProgress: i3, onMessage: n3, onAuth: a3, onAuthSuccess: o3, onAuthFailure: s3, onPostCheckout: c3, dir: f3, gitdir: l3, url: d3, corsProxy: u3, ref: h3, remote: p3, depth: g3, since: w3, exclude: m3, relative: y3, singleBranch: b3, noCheckout: _3, noTags: v3, headers: x3, nonBlocking: k3, batchSize: E3 = 100 }) {
              try {
                if (await zr({ fs: t4, gitdir: l3 }), await je({ fs: t4, gitdir: l3, remote: p3, url: d3, force: false }), u3) {
                  const e5 = await Q.get({ fs: t4, gitdir: l3 });
                  await e5.set("http.corsProxy", u3), await Q.save({ fs: t4, gitdir: l3, config: e5 });
                }
                const { defaultBranch: A3, fetchHead: S3 } = await Nr({ fs: t4, cache: e4, http: r3, onProgress: i3, onMessage: n3, onAuth: a3, onAuthSuccess: o3, onAuthFailure: s3, gitdir: l3, ref: h3, remote: p3, corsProxy: u3, depth: g3, since: w3, exclude: m3, relative: y3, singleBranch: b3, headers: x3, tags: !v3 });
                if (null === S3) return;
                h3 = (h3 = h3 || A3).replace("refs/heads/", ""), await ze({ fs: t4, cache: e4, onProgress: i3, onPostCheckout: c3, dir: f3, gitdir: l3, ref: h3, remote: p3, noCheckout: _3, nonBlocking: k3, batchSize: E3 });
              } catch (e5) {
                throw await t4.rmdir(l3, { recursive: true, maxRetries: 10 }).catch(() => {
                }), e5;
              }
            })({ fs: A2, cache: x2, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, onPostCheckout: s2, dir: c2, gitdir: S2, url: l2, corsProxy: d2, ref: u2, remote: h2, depth: p2, since: g2, exclude: w2, relative: m2, singleBranch: y2, noCheckout: b2, noTags: _2, headers: v2, nonBlocking: k2, batchSize: E2 });
          } catch (t4) {
            throw t4.caller = "git.clone", t4;
          }
        }
        async function Lr({ fs: t3, onSign: e3, dir: r2, gitdir: i2 = N(r2, ".git"), message: n2, author: a2, committer: o2, signingKey: s2, amend: c2 = false, dryRun: f2 = false, noUpdateBranch: l2 = false, ref: d2, parent: u2, tree: h2, cache: p2 = {} }) {
          try {
            Qt("fs", t3), c2 || Qt("message", n2), s2 && Qt("onSign", e3);
            const r3 = new Xt(t3), g2 = await te({ fsp: r3, dotgit: i2 });
            return await _e({ fs: r3, cache: p2, onSign: e3, gitdir: g2, message: n2, author: a2, committer: o2, signingKey: s2, amend: c2, dryRun: f2, noUpdateBranch: l2, ref: d2, parent: u2, tree: h2 });
          } catch (t4) {
            throw t4.caller = "git.commit", t4;
          }
        }
        async function Hr({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), fullname: i2 = false, test: n2 = false }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2);
            const e4 = new Xt(t3), a2 = await te({ fsp: e4, dotgit: r2 });
            return await or({ fs: e4, gitdir: a2, fullname: i2, test: n2 });
          } catch (t4) {
            throw t4.caller = "git.currentBranch", t4;
          }
        }
        async function Gr({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2 }) {
          try {
            Qt("fs", t3), Qt("ref", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, gitdir: e5, ref: r3 }) {
              if (r3 = r3.startsWith("refs/heads/") ? r3 : `refs/heads/${r3}`, !await nt.exists({ fs: t4, gitdir: e5, ref: r3 })) throw new I(r3);
              const i3 = await nt.expand({ fs: t4, gitdir: e5, ref: r3 });
              if (i3 === await or({ fs: t4, gitdir: e5, fullname: true })) {
                const r4 = await nt.resolve({ fs: t4, gitdir: e5, ref: i3 });
                await nt.writeRef({ fs: t4, gitdir: e5, ref: "HEAD", value: r4 });
              }
              await nt.deleteRef({ fs: t4, gitdir: e5, ref: i3 });
              const n3 = ar(r3), a2 = await Q.get({ fs: t4, gitdir: e5 });
              await a2.deleteSection("branch", n3), await Q.save({ fs: t4, gitdir: e5, config: a2 });
            })({ fs: e4, gitdir: n2, ref: i2 });
          } catch (t4) {
            throw t4.caller = "git.deleteBranch", t4;
          }
        }
        async function Wr({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2 }) {
          try {
            Qt("fs", t3), Qt("ref", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            await nt.deleteRef({ fs: e4, gitdir: n2, ref: i2 });
          } catch (t4) {
            throw t4.caller = "git.deleteRef", t4;
          }
        }
        async function qr({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), remote: i2 }) {
          try {
            Qt("fs", t3), Qt("remote", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, gitdir: e5, remote: r3 }) {
              const i3 = await Q.get({ fs: t4, gitdir: e5 });
              await i3.deleteSection("remote", r3), await Q.save({ fs: t4, gitdir: e5, config: i3 });
            })({ fs: e4, gitdir: n2, remote: i2 });
          } catch (t4) {
            throw t4.caller = "git.deleteRemote", t4;
          }
        }
        async function Zr({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2 }) {
          try {
            Qt("fs", t3), Qt("ref", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, gitdir: e5, ref: r3 }) {
              r3 = r3.startsWith("refs/tags/") ? r3 : `refs/tags/${r3}`, await nt.deleteRef({ fs: t4, gitdir: e5, ref: r3 });
            })({ fs: e4, gitdir: n2, ref: i2 });
          } catch (t4) {
            throw t4.caller = "git.deleteTag", t4;
          }
        }
        class Kr extends n {
          constructor(t3, e3, r2) {
            super(`Found multiple ${t3} matching "${e3}" (${r2.join(", ")}). Use a longer abbreviation length to disambiguate them.`), this.code = this.name = Kr.code, this.data = { nouns: t3, short: e3, matches: r2 };
          }
        }
        async function Vr({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oid: i2, cache: n2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oid", i2);
            const e4 = new Xt(t3), a2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, cache: e5, gitdir: r3, oid: i3 }) {
              const n3 = await (async function({ fs: t5, gitdir: e6, oid: r4 }) {
                const i4 = r4.slice(0, 2);
                return (await t5.readdir(`${e6}/objects/${i4}`)).map((t6) => `${i4}${t6}`).filter((t6) => t6.startsWith(r4));
              })({ fs: t4, gitdir: r3, oid: i3 }), a3 = await (async function({ fs: t5, cache: e6, gitdir: r4, oid: i4, getExternalRefDelta: n4 }) {
                const a4 = [];
                let s2 = await t5.readdir(N(r4, "objects/pack"));
                s2 = s2.filter((t6) => t6.endsWith(".idx"));
                for (const c2 of s2) {
                  const s3 = `${r4}/objects/pack/${c2}`, f2 = await At({ fs: t5, cache: e6, filename: s3, getExternalRefDelta: n4 });
                  if (f2.error) throw new o(f2.error);
                  for (const t6 of f2.offsets.keys()) t6.startsWith(i4) && a4.push(t6);
                }
                return a4;
              })({ fs: t4, cache: e5, gitdir: r3, oid: i3, getExternalRefDelta: (i4) => Bt({ fs: t4, cache: e5, gitdir: r3, oid: i4 }) });
              for (const t5 of a3) -1 === n3.indexOf(t5) && n3.push(t5);
              if (1 === n3.length) return n3[0];
              if (n3.length > 1) throw new Kr("oids", i3, n3);
              throw new I(`an object matching "${i3}"`);
            })({ fs: e4, cache: n2, gitdir: a2, oid: i2 });
          } catch (t4) {
            throw t4.caller = "git.expandOid", t4;
          }
        }
        async function Yr({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await nt.expand({ fs: e4, gitdir: n2, ref: i2 });
          } catch (t4) {
            throw t4.caller = "git.expandRef", t4;
          }
        }
        async function Xr({ fs: t3, cache: e3, gitdir: r2, oids: i2 }) {
          const n2 = {}, a2 = i2.length;
          let o2 = i2.map((t4, e4) => ({ index: e4, oid: t4 }));
          for (; o2.length; ) {
            const i3 = /* @__PURE__ */ new Set();
            for (const { oid: t4, index: e4 } of o2) n2[t4] || (n2[t4] = /* @__PURE__ */ new Set()), n2[t4].add(e4), n2[t4].size === a2 && i3.add(t4);
            if (i3.size > 0) return [...i3];
            const s2 = /* @__PURE__ */ new Map();
            for (const { oid: i4, index: a3 } of o2) try {
              const { object: o3 } = await Bt({ fs: t3, cache: e3, gitdir: r2, oid: i4 }), c2 = Ut.from(o3), { parent: f2 } = c2.parseHeaders();
              for (const t4 of f2) n2[t4] && n2[t4].has(a3) || s2.set(t4 + ":" + a3, { oid: t4, index: a3 });
            } catch (t4) {
            }
            o2 = Array.from(s2.values());
          }
          return [];
        }
        Kr.code = "AmbiguousError";
        class Jr extends n {
          constructor() {
            super("A simple fast-forward merge was not possible."), this.code = this.name = Jr.code, this.data = {};
          }
        }
        async function Qr({ fs: t3, cache: e3, dir: r2, gitdir: i2, ours: n2, theirs: a2, fastForward: o2 = true, fastForwardOnly: s2 = false, dryRun: c2 = false, noUpdateBranch: f2 = false, abortOnConflict: l2 = true, message: d2, author: u2, committer: h2, signingKey: p2, onSign: g2, mergeDriver: w2, allowUnrelatedHistories: m2 = false }) {
          void 0 === n2 && (n2 = await or({ fs: t3, gitdir: i2, fullname: true })), n2 = await nt.expand({ fs: t3, gitdir: i2, ref: n2 }), a2 = await nt.expand({ fs: t3, gitdir: i2, ref: a2 });
          const y2 = await nt.resolve({ fs: t3, gitdir: i2, ref: n2 }), b2 = await nt.resolve({ fs: t3, gitdir: i2, ref: a2 }), _2 = await Xr({ fs: t3, cache: e3, gitdir: i2, oids: [y2, b2] });
          if (1 !== _2.length) {
            if (0 !== _2.length || !m2) throw new qe();
            _2.push("4b825dc642cb6eb9a060e54bf8d69288fbee4904");
          }
          const v2 = _2[0];
          if (v2 === b2) return { oid: y2, alreadyMerged: true };
          if (o2 && v2 === y2) return c2 || f2 || await nt.writeRef({ fs: t3, gitdir: i2, ref: n2, value: b2 }), { oid: b2, fastForward: true };
          {
            if (s2) throw new Jr();
            const o3 = await E.acquire({ fs: t3, gitdir: i2, cache: e3, allowUnmerged: false }, async (o4) => Ye({ fs: t3, cache: e3, dir: r2, gitdir: i2, index: o4, ourOid: y2, theirOid: b2, baseOid: v2, ourName: ar(n2), baseName: "base", theirName: ar(a2), dryRun: c2, abortOnConflict: l2, mergeDriver: w2 }));
            if (o3 instanceof We) throw o3;
            return d2 || (d2 = `Merge branch '${ar(a2)}' into ${ar(n2)}`), { oid: await _e({ fs: t3, cache: e3, gitdir: i2, message: d2, ref: n2, tree: o3, parent: [y2, b2], author: u2, committer: h2, signingKey: p2, onSign: g2, dryRun: c2, noUpdateBranch: f2 }), tree: o3, mergeCommit: true };
          }
        }
        async function ti({ fs: t3, cache: e3, http: r2, onProgress: i2, onMessage: n2, onAuth: a2, onAuthSuccess: o2, onAuthFailure: s2, dir: c2, gitdir: f2, ref: l2, url: d2, remote: u2, remoteRef: h2, prune: p2, pruneTags: g2, fastForward: w2, fastForwardOnly: m2, corsProxy: y2, singleBranch: b2, headers: _2, author: v2, committer: x2, signingKey: k2 }) {
          try {
            if (!l2) {
              const e4 = await or({ fs: t3, gitdir: f2 });
              if (!e4) throw new Jt("ref");
              l2 = e4;
            }
            const { fetchHead: E2, fetchHeadDescription: A2 } = await Nr({ fs: t3, cache: e3, http: r2, onProgress: i2, onMessage: n2, onAuth: a2, onAuthSuccess: o2, onAuthFailure: s2, gitdir: f2, corsProxy: y2, ref: l2, url: d2, remote: u2, remoteRef: h2, singleBranch: b2, headers: _2, prune: p2, pruneTags: g2 });
            await Qr({ fs: t3, cache: e3, gitdir: f2, ours: l2, theirs: E2, fastForward: w2, fastForwardOnly: m2, message: `Merge ${A2}`, author: v2, committer: x2, signingKey: k2, dryRun: false, noUpdateBranch: false }), await ze({ fs: t3, cache: e3, onProgress: i2, dir: c2, gitdir: f2, ref: l2, remote: u2, noCheckout: false });
          } catch (t4) {
            throw t4.caller = "git.pull", t4;
          }
        }
        async function ei({ fs: t3, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, dir: s2, gitdir: c2 = N(s2, ".git"), ref: f2, url: l2, remote: d2, remoteRef: u2, corsProxy: h2, singleBranch: p2, headers: g2 = {}, cache: w2 = {} }) {
          try {
            Qt("fs", t3), Qt("http", e3), Qt("gitdir", c2);
            const m2 = { name: "", email: "", timestamp: Date.now(), timezoneOffset: 0 }, y2 = new Xt(t3), b2 = await te({ fsp: y2, dotgit: c2 });
            return await ti({ fs: y2, cache: w2, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, dir: s2, gitdir: b2, ref: f2, url: l2, remote: d2, remoteRef: u2, fastForwardOnly: true, corsProxy: h2, singleBranch: p2, headers: g2, author: m2, committer: m2 });
          } catch (t4) {
            throw t4.caller = "git.fastForward", t4;
          }
        }
        async function ri({ fs: t3, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, dir: s2, gitdir: c2 = N(s2, ".git"), ref: f2, remote: l2, remoteRef: d2, url: u2, corsProxy: h2, depth: p2 = null, since: g2 = null, exclude: w2 = [], relative: m2 = false, tags: y2 = false, singleBranch: b2 = false, headers: _2 = {}, prune: v2 = false, pruneTags: x2 = false, cache: k2 = {} }) {
          try {
            Qt("fs", t3), Qt("http", e3), Qt("gitdir", c2);
            const s3 = new Xt(t3), E2 = await te({ fsp: s3, dotgit: c2 });
            return await Nr({ fs: s3, cache: k2, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, gitdir: E2, ref: f2, remote: l2, remoteRef: d2, url: u2, corsProxy: h2, depth: p2, since: g2, exclude: w2, relative: m2, tags: y2, singleBranch: b2, headers: _2, prune: v2, pruneTags: x2 });
          } catch (t4) {
            throw t4.caller = "git.fetch", t4;
          }
        }
        async function ii({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oids: i2, cache: n2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oids", i2);
            const e4 = new Xt(t3), a2 = await te({ fsp: e4, dotgit: r2 });
            return await Xr({ fs: e4, cache: n2, gitdir: a2, oids: i2 });
          } catch (t4) {
            throw t4.caller = "git.findMergeBase", t4;
          }
        }
        async function ni({ fs: t3, filepath: e3 }) {
          if (await t3.exists(N(e3, ".git"))) return e3;
          {
            const r2 = S(e3);
            if (r2 === e3) throw new I(`git root for ${e3}`);
            return ni({ fs: t3, filepath: r2 });
          }
        }
        async function ai({ fs: t3, filepath: e3 }) {
          try {
            return Qt("fs", t3), Qt("filepath", e3), await ni({ fs: new Xt(t3), filepath: e3 });
          } catch (t4) {
            throw t4.caller = "git.findRoot", t4;
          }
        }
        async function oi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), path: i2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("path", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await pe({ fs: e4, gitdir: n2, path: i2 });
          } catch (t4) {
            throw t4.caller = "git.getConfig", t4;
          }
        }
        async function si({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), path: i2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("path", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, gitdir: e5, path: r3 }) {
              return (await Q.get({ fs: t4, gitdir: e5 })).getall(r3);
            })({ fs: e4, gitdir: n2, path: i2 });
          } catch (t4) {
            throw t4.caller = "git.getConfigAll", t4;
          }
        }
        async function ci({ http: t3, onAuth: e3, onAuthSuccess: r2, onAuthFailure: i2, corsProxy: n2, url: a2, headers: o2 = {}, forPush: s2 = false }) {
          try {
            Qt("http", t3), Qt("url", a2);
            const c2 = $r.getRemoteHelperFor({ url: a2 }), f2 = await c2.discover({ http: t3, onAuth: e3, onAuthSuccess: r2, onAuthFailure: i2, corsProxy: n2, service: s2 ? "git-receive-pack" : "git-upload-pack", url: a2, headers: o2, protocolVersion: 1 }), l2 = { capabilities: [...f2.capabilities] };
            for (const [t4, e4] of f2.refs) {
              const r3 = t4.split("/"), i3 = r3.pop();
              let n3 = l2;
              for (const t5 of r3) n3[t5] = n3[t5] || {}, n3 = n3[t5];
              n3[i3] = e4;
            }
            for (const [t4, e4] of f2.symrefs) {
              const r3 = t4.split("/"), i3 = r3.pop();
              let n3 = l2;
              for (const t5 of r3) n3[t5] = n3[t5] || {}, n3 = n3[t5];
              n3[i3] = e4;
            }
            return l2;
          } catch (t4) {
            throw t4.caller = "git.getRemoteInfo", t4;
          }
        }
        function fi(t3, e3, r2, i2) {
          const n2 = [];
          for (const [a2, o2] of t3.refs) {
            if (e3 && !a2.startsWith(e3)) continue;
            if (a2.endsWith("^{}")) {
              if (i2) {
                const t4 = a2.replace("^{}", ""), e4 = n2[n2.length - 1], r3 = e4.ref === t4 ? e4 : n2.find((e5) => e5.ref === t4);
                if (void 0 === r3) throw new Error("I did not expect this to happen");
                r3.peeled = o2;
              }
              continue;
            }
            const s2 = { ref: a2, oid: o2 };
            r2 && t3.symrefs.has(a2) && (s2.target = t3.symrefs.get(a2)), n2.push(s2);
          }
          return n2;
        }
        async function li({ http: t3, onAuth: e3, onAuthSuccess: r2, onAuthFailure: i2, corsProxy: n2, url: a2, headers: o2 = {}, forPush: s2 = false, protocolVersion: c2 = 2 }) {
          try {
            Qt("http", t3), Qt("url", a2);
            const f2 = $r.getRemoteHelperFor({ url: a2 }), l2 = await f2.discover({ http: t3, onAuth: e3, onAuthSuccess: r2, onAuthFailure: i2, corsProxy: n2, service: s2 ? "git-receive-pack" : "git-upload-pack", url: a2, headers: o2, protocolVersion: c2 });
            if (2 === l2.protocolVersion) return { protocolVersion: l2.protocolVersion, capabilities: l2.capabilities2 };
            const d2 = {};
            for (const t4 of l2.capabilities) {
              const [e4, r3] = t4.split("=");
              d2[e4] = r3 || true;
            }
            return { protocolVersion: 1, capabilities: d2, refs: fi(l2, void 0, true, true) };
          } catch (t4) {
            throw t4.caller = "git.getRemoteInfo2", t4;
          }
        }
        async function di({ object: t3 }) {
          try {
            Qt("object", t3), "string" == typeof t3 ? t3 = Buffer.from(t3, "utf8") : t3 instanceof Uint8Array || (t3 = new Uint8Array(t3));
            const e3 = "blob", { oid: r2, object: i2 } = await (async function({ type: t4, object: e4, format: r3 = "content", oid: i3 }) {
              return "deflated" !== r3 && ("wrapped" !== r3 && (e4 = lt.wrap({ type: t4, object: e4 })), i3 = await m(e4)), { oid: i3, object: e4 };
            })({ type: e3, format: "content", object: t3 });
            return { oid: r2, type: e3, object: i2, format: "wrapped" };
          } catch (t4) {
            throw t4.caller = "git.hashBlob", t4;
          }
        }
        async function ui({ fs: t3, onProgress: e3, dir: r2, gitdir: i2 = N(r2, ".git"), filepath: n2, cache: a2 = {} }) {
          try {
            Qt("fs", t3), Qt("dir", r2), Qt("gitdir", r2), Qt("filepath", n2);
            const o2 = new Xt(t3), s2 = await te({ fsp: o2, dotgit: i2 });
            return await (async function({ fs: t4, cache: e4, onProgress: r3, dir: i3, gitdir: n3, filepath: a3 }) {
              try {
                a3 = N(i3, a3);
                const o3 = await t4.read(a3), s3 = (r4) => Bt({ fs: t4, cache: e4, gitdir: n3, oid: r4 }), c2 = await kt.fromPack({ pack: o3, getExternalRefDelta: s3, onProgress: r3 });
                return await t4.write(a3.replace(/\.pack$/, ".idx"), await c2.toBuffer()), { oids: [...c2.hashes] };
              } catch (t5) {
                throw t5.caller = "git.indexPack", t5;
              }
            })({ fs: o2, cache: a2, onProgress: e3, dir: r2, gitdir: s2, filepath: n2 });
          } catch (t4) {
            throw t4.caller = "git.indexPack", t4;
          }
        }
        async function hi({ fs: t3, bare: e3 = false, dir: r2, gitdir: i2 = e3 ? r2 : N(r2, ".git"), defaultBranch: n2 = "master" }) {
          try {
            Qt("fs", t3), Qt("gitdir", i2), e3 || Qt("dir", r2);
            const a2 = new Xt(t3), o2 = await te({ fsp: a2, dotgit: i2 });
            return await zr({ fs: a2, bare: e3, dir: r2, gitdir: o2, defaultBranch: n2 });
          } catch (t4) {
            throw t4.caller = "git.init", t4;
          }
        }
        Jr.code = "FastForwardError";
        class pi extends n {
          constructor(t3) {
            super(`Maximum search depth of ${t3} exceeded.`), this.code = this.name = pi.code, this.data = { depth: t3 };
          }
        }
        async function gi({ fs: t3, cache: e3, gitdir: r2, oid: i2, ancestor: n2, depth: a2 }) {
          const o2 = await Pr.read({ fs: t3, gitdir: r2 });
          if (!i2) throw new Jt("oid");
          if (!n2) throw new Jt("ancestor");
          if (i2 === n2) return false;
          const s2 = [i2], c2 = /* @__PURE__ */ new Set();
          let f2 = 0;
          for (; s2.length; ) {
            if (f2++ === a2) throw new pi(a2);
            const i3 = s2.shift(), { type: l2, object: d2 } = await Bt({ fs: t3, cache: e3, gitdir: r2, oid: i3 });
            if ("commit" !== l2) throw new O(i3, l2, "commit");
            const u2 = Ut.from(d2).parse();
            for (const t4 of u2.parent) if (t4 === n2) return true;
            if (!o2.has(i3)) for (const t4 of u2.parent) c2.has(t4) || (s2.push(t4), c2.add(t4));
          }
          return false;
        }
        async function wi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oid: i2, ancestor: n2, depth: a2 = -1, cache: o2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oid", i2), Qt("ancestor", n2);
            const e4 = new Xt(t3), s2 = await te({ fsp: e4, dotgit: r2 });
            return await gi({ fs: e4, cache: o2, gitdir: s2, oid: i2, ancestor: n2, depth: a2 });
          } catch (t4) {
            throw t4.caller = "git.isDescendent", t4;
          }
        }
        async function mi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), filepath: i2 }) {
          try {
            Qt("fs", t3), Qt("dir", e3), Qt("gitdir", r2), Qt("filepath", i2);
            const n2 = new Xt(t3), a2 = await te({ fsp: n2, dotgit: r2 });
            return ae.isIgnored({ fs: n2, dir: e3, gitdir: a2, filepath: i2 });
          } catch (t4) {
            throw t4.caller = "git.isIgnored", t4;
          }
        }
        async function yi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), remote: i2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return nt.listBranches({ fs: e4, gitdir: n2, remote: i2 });
          } catch (t4) {
            throw t4.caller = "git.listBranches", t4;
          }
        }
        async function bi({ fs: t3, gitdir: e3, ref: r2, cache: i2 }) {
          if (r2) {
            const n2 = await nt.resolve({ gitdir: e3, fs: t3, ref: r2 }), a2 = [];
            return await _i({ fs: t3, cache: i2, gitdir: e3, oid: n2, filenames: a2, prefix: "" }), a2;
          }
          return E.acquire({ fs: t3, gitdir: e3, cache: i2 }, async function(t4) {
            return t4.entries.map((t5) => t5.path);
          });
        }
        async function _i({ fs: t3, cache: e3, gitdir: r2, oid: i2, filenames: n2, prefix: a2 }) {
          const { tree: o2 } = await Ae({ fs: t3, cache: e3, gitdir: r2, oid: i2 });
          for (const i3 of o2) "tree" === i3.type ? await _i({ fs: t3, cache: e3, gitdir: r2, oid: i3.oid, filenames: n2, prefix: N(a2, i3.path) }) : n2.push(N(a2, i3.path));
        }
        async function vi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2, cache: n2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2);
            const e4 = new Xt(t3), a2 = await te({ fsp: e4, dotgit: r2 });
            return await bi({ fs: e4, cache: n2, gitdir: a2, ref: i2 });
          } catch (t4) {
            throw t4.caller = "git.listFiles", t4;
          }
        }
        async function xi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2 = "refs/notes/commits", cache: n2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", i2);
            const e4 = new Xt(t3), a2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, cache: e5, gitdir: r3, ref: i3 }) {
              let n3;
              try {
                n3 = await nt.resolve({ gitdir: r3, fs: t4, ref: i3 });
              } catch (t5) {
                if (t5 instanceof I) return [];
              }
              return (await Ae({ fs: t4, cache: e5, gitdir: r3, oid: n3 })).tree.map((t5) => ({ target: t5.path, note: t5.oid }));
            })({ fs: e4, cache: n2, gitdir: a2, ref: i2 });
          } catch (t4) {
            throw t4.caller = "git.listNotes", t4;
          }
        }
        async function ki({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), filepath: i2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return nt.listRefs({ fs: e4, gitdir: n2, filepath: i2 });
          } catch (t4) {
            throw t4.caller = "git.listRefs", t4;
          }
        }
        async function Ei({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git") }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2);
            const e4 = new Xt(t3), i2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, gitdir: e5 }) {
              const r3 = await Q.get({ fs: t4, gitdir: e5 }), i3 = await r3.getSubsections("remote");
              return Promise.all(i3.map(async (t5) => ({ remote: t5, url: await r3.get(`remote.${t5}.url`) })));
            })({ fs: e4, gitdir: i2 });
          } catch (t4) {
            throw t4.caller = "git.listRemotes", t4;
          }
        }
        async function Ai({ http: t3, onAuth: e3, onAuthSuccess: r2, onAuthFailure: i2, corsProxy: n2, url: a2, headers: o2 = {}, forPush: s2 = false, protocolVersion: c2 = 2, prefix: f2, symrefs: l2, peelTags: d2 }) {
          try {
            Qt("http", t3), Qt("url", a2);
            const u2 = await Br.discover({ http: t3, onAuth: e3, onAuthSuccess: r2, onAuthFailure: i2, corsProxy: n2, service: s2 ? "git-receive-pack" : "git-upload-pack", url: a2, headers: o2, protocolVersion: c2 });
            if (1 === u2.protocolVersion) return fi(u2, f2, l2, d2);
            const h2 = await (async function({ prefix: t4, symrefs: e4, peelTags: r3 }) {
              const i3 = [];
              return i3.push(_r.encode("command=ls-refs\n")), i3.push(_r.encode(`agent=${Ur.agent}
`)), (r3 || e4 || t4) && i3.push(_r.delim()), r3 && i3.push(_r.encode("peel")), e4 && i3.push(_r.encode("symrefs")), t4 && i3.push(_r.encode(`ref-prefix ${t4}`)), i3.push(_r.flush()), i3;
            })({ prefix: f2, symrefs: l2, peelTags: d2 });
            return (async function(t4) {
              const e4 = _r.streamReader(t4), r3 = [];
              let i3;
              for (; i3 = await e4(), true !== i3; ) {
                if (null === i3) continue;
                i3 = i3.toString("utf8").replace(/\n$/, "");
                const [t5, e5, ...n3] = i3.split(" "), a3 = { ref: e5, oid: t5 };
                for (const t6 of n3) {
                  const [e6, r4] = t6.split(":");
                  "symref-target" === e6 ? a3.target = r4 : "peeled" === e6 && (a3.peeled = r4);
                }
                r3.push(a3);
              }
              return r3;
            })((await Br.connect({ http: t3, auth: u2.auth, headers: o2, corsProxy: n2, service: s2 ? "git-receive-pack" : "git-upload-pack", url: a2, body: h2 })).body);
          } catch (t4) {
            throw t4.caller = "git.listServerRefs", t4;
          }
        }
        async function Si({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git") }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2);
            const e4 = new Xt(t3), i2 = await te({ fsp: e4, dotgit: r2 });
            return nt.listTags({ fs: e4, gitdir: i2 });
          } catch (t4) {
            throw t4.caller = "git.listTags", t4;
          }
        }
        function Bi(t3, e3) {
          return t3.committer.timestamp - e3.committer.timestamp;
        }
        pi.code = "MaxDepthError";
        const $i = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391";
        async function Ri({ fs: t3, cache: e3, gitdir: r2, oid: i2, fileId: n2 }) {
          if (n2 === $i) return;
          const a2 = i2;
          let o2;
          const s2 = await Tt({ fs: t3, cache: e3, gitdir: r2, oid: i2 }), c2 = s2.tree;
          return n2 === s2.oid ? o2 = s2.path : (o2 = await Pi({ fs: t3, cache: e3, gitdir: r2, tree: c2, fileId: n2, oid: a2 }), Array.isArray(o2) && (0 === o2.length ? o2 = void 0 : 1 === o2.length && (o2 = o2[0]))), o2;
        }
        async function Pi({ fs: t3, cache: e3, gitdir: r2, tree: i2, fileId: n2, oid: a2, filepaths: o2 = [], parentPath: s2 = "" }) {
          const c2 = i2.entries().map(function(i3) {
            let c3;
            return i3.oid === n2 ? (c3 = N(s2, i3.path), o2.push(c3)) : "tree" === i3.type && (c3 = Bt({ fs: t3, cache: e3, gitdir: r2, oid: i3.oid }).then(function({ object: c4 }) {
              return Pi({ fs: t3, cache: e3, gitdir: r2, tree: ft.from(c4), fileId: n2, oid: a2, filepaths: o2, parentPath: N(s2, i3.path) });
            })), c3;
          });
          return await Promise.all(c2), o2;
        }
        async function Ii({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), filepath: i2, ref: n2 = "HEAD", depth: a2, since: o2, force: s2, follow: c2, cache: f2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", n2);
            const e4 = new Xt(t3), l2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, cache: e5, gitdir: r3, filepath: i3, ref: n3, depth: a3, since: o3, force: s3, follow: c3 }) {
              const f3 = void 0 === o3 ? void 0 : Math.floor(o3.valueOf() / 1e3), l3 = [], d2 = await Pr.read({ fs: t4, gitdir: r3 }), u2 = await nt.resolve({ fs: t4, gitdir: r3, ref: n3 }), h2 = [await be({ fs: t4, cache: e5, gitdir: r3, oid: u2 })];
              let p2, g2, w2;
              function m2(t5) {
                w2 && i3 && l3.push(t5);
              }
              for (; h2.length > 0; ) {
                const n4 = h2.pop();
                if (void 0 !== f3 && n4.commit.committer.timestamp <= f3) break;
                if (i3) {
                  let a4;
                  try {
                    a4 = await ke({ fs: t4, cache: e5, gitdir: r3, oid: n4.commit.tree, filepath: i3 }), g2 && p2 !== a4 && l3.push(g2), p2 = a4, g2 = n4, w2 = true;
                  } catch (a5) {
                    if (!(a5 instanceof I)) throw a5;
                    {
                      let o4 = c3 && p2;
                      if (o4 && (o4 = await Ri({ fs: t4, cache: e5, gitdir: r3, oid: n4.commit.tree, fileId: p2 }), o4)) if (Array.isArray(o4)) {
                        if (g2) {
                          const n5 = await Ri({ fs: t4, cache: e5, gitdir: r3, oid: g2.commit.tree, fileId: p2 });
                          if (Array.isArray(n5)) {
                            if (o4 = o4.filter((t5) => -1 === n5.indexOf(t5)), 1 !== o4.length) {
                              o4 = false, g2 && l3.push(g2);
                              break;
                            }
                            o4 = o4[0], i3 = o4, g2 && l3.push(g2);
                          }
                        }
                      } else i3 = o4, g2 && l3.push(g2);
                      if (!o4) {
                        if (w2 && p2 && (l3.push(g2), !s3)) break;
                        if (!s3 && !c3) throw a5;
                      }
                      g2 = n4, w2 = false;
                    }
                  }
                } else l3.push(n4);
                if (void 0 !== a3 && l3.length === a3) {
                  m2(n4);
                  break;
                }
                if (!d2.has(n4.oid)) for (const i4 of n4.commit.parent) {
                  const n5 = await be({ fs: t4, cache: e5, gitdir: r3, oid: i4 });
                  h2.map((t5) => t5.oid).includes(n5.oid) || h2.push(n5);
                }
                0 === h2.length && m2(n4), h2.sort((t5, e6) => Bi(t5.commit, e6.commit));
              }
              return l3;
            })({ fs: e4, cache: f2, gitdir: l2, filepath: i2, ref: n2, depth: a2, since: o2, force: s2, follow: c2 });
          } catch (t4) {
            throw t4.caller = "git.log", t4;
          }
        }
        async function Oi({ fs: t3, onSign: e3, dir: r2, gitdir: i2 = N(r2, ".git"), ours: n2, theirs: a2, fastForward: o2 = true, fastForwardOnly: s2 = false, dryRun: c2 = false, noUpdateBranch: f2 = false, abortOnConflict: l2 = true, message: d2, author: u2, committer: h2, signingKey: p2, cache: g2 = {}, mergeDriver: w2, allowUnrelatedHistories: m2 = false }) {
          try {
            Qt("fs", t3), p2 && Qt("onSign", e3);
            const y2 = new Xt(t3), b2 = await te({ fsp: y2, dotgit: i2 }), _2 = await we({ fs: y2, gitdir: b2, author: u2 });
            if (!(_2 || s2 && o2)) throw new ue("author");
            const v2 = await me({ fs: y2, gitdir: b2, author: _2, committer: h2 });
            if (!(v2 || s2 && o2)) throw new ue("committer");
            return await Qr({ fs: y2, cache: g2, dir: r2, gitdir: b2, ours: n2, theirs: a2, fastForward: o2, fastForwardOnly: s2, dryRun: c2, noUpdateBranch: f2, abortOnConflict: l2, message: d2, author: _2, committer: v2, signingKey: p2, onSign: e3, mergeDriver: w2, allowUnrelatedHistories: m2 });
          } catch (t4) {
            throw t4.caller = "git.merge", t4;
          }
        }
        const ji = { commit: 16, tree: 32, blob: 48, tag: 64, ofs_delta: 96, ref_delta: 112 };
        async function Ui({ fs: t3, cache: e3, dir: r2, gitdir: i2 = N(r2, ".git"), oids: n2 }) {
          const a2 = new g(), o2 = [];
          function s2(t4, e4) {
            const r3 = Buffer.from(t4, e4);
            o2.push(r3), a2.update(r3);
          }
          async function c2({ stype: t4, object: e4 }) {
            const r3 = ji[t4];
            let i3 = e4.length, n3 = i3 > 15 ? 128 : 0;
            const a3 = 15 & i3;
            i3 >>>= 4;
            let o3 = (n3 | r3 | a3).toString(16);
            for (s2(o3, "hex"); n3; ) n3 = i3 > 127 ? 128 : 0, o3 = n3 | 127 & i3, s2(br(2, o3), "hex"), i3 >>>= 7;
            s2(Buffer.from(await se(e4)));
          }
          s2("PACK"), s2("00000002", "hex"), s2(br(8, n2.length), "hex");
          for (const r3 of n2) {
            const { type: n3, object: a3 } = await Bt({ fs: t3, cache: e3, gitdir: i2, oid: r3 });
            await c2({ write: s2, object: a3, stype: n3 });
          }
          const f2 = a2.digest();
          return o2.push(f2), o2;
        }
        async function Ti({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oids: i2, write: n2 = false, cache: a2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oids", i2);
            const e4 = new Xt(t3), o2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, cache: e5, gitdir: r3, oids: i3, write: n3 }) {
              const a3 = await Ui({ fs: t4, cache: e5, gitdir: r3, oids: i3 }), o3 = Buffer.from(await gr(a3)), s2 = `pack-${o3.slice(-20).toString("hex")}.pack`;
              return n3 ? (await t4.write(N(r3, `objects/pack/${s2}`), o3), { filename: s2 }) : { filename: s2, packfile: new Uint8Array(o3) };
            })({ fs: e4, cache: a2, gitdir: o2, oids: i2, write: n2 });
          } catch (t4) {
            throw t4.caller = "git.packObjects", t4;
          }
        }
        async function Ci({ fs: t3, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, dir: s2, gitdir: c2 = N(s2, ".git"), ref: f2, url: l2, remote: d2, remoteRef: u2, prune: h2 = false, pruneTags: p2 = false, fastForward: g2 = true, fastForwardOnly: w2 = false, corsProxy: m2, singleBranch: y2, headers: b2 = {}, author: _2, committer: v2, signingKey: x2, cache: k2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", c2);
            const E2 = new Xt(t3), A2 = await te({ fsp: E2, dotgit: c2 }), S2 = await we({ fs: E2, gitdir: A2, author: _2 });
            if (!S2) throw new ue("author");
            const B2 = await me({ fs: E2, gitdir: A2, author: S2, committer: v2 });
            if (!B2) throw new ue("committer");
            return await ti({ fs: E2, cache: k2, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, dir: s2, gitdir: A2, ref: f2, url: l2, remote: d2, remoteRef: u2, fastForward: g2, fastForwardOnly: w2, corsProxy: m2, singleBranch: y2, headers: b2, author: S2, committer: B2, signingKey: x2, prune: h2, pruneTags: p2 });
          } catch (t4) {
            throw t4.caller = "git.pull", t4;
          }
        }
        async function Mi({ fs: t3, cache: e3, dir: r2, gitdir: i2 = N(r2, ".git"), oids: n2 }) {
          const a2 = /* @__PURE__ */ new Set();
          async function o2(r3) {
            if (a2.has(r3)) return;
            a2.add(r3);
            const { type: n3, object: s2 } = await Bt({ fs: t3, cache: e3, gitdir: i2, oid: r3 });
            if ("tag" === n3) {
              const t4 = Ot.from(s2).headers().object;
              await o2(t4);
            } else if ("commit" === n3) {
              const t4 = Ut.from(s2).headers().tree;
              await o2(t4);
            } else if ("tree" === n3) {
              const t4 = ft.from(s2);
              for (const e4 of t4) "blob" === e4.type && a2.add(e4.oid), "tree" === e4.type && await o2(e4.oid);
            }
          }
          for (const t4 of n2) await o2(t4);
          return a2;
        }
        class Di extends n {
          constructor(t3, e3) {
            super(`One or more branches were not updated: ${t3}`), this.code = this.name = Di.code, this.data = { prettyDetails: t3, result: e3 };
          }
        }
        Di.code = "GitPushError";
        class Ni extends n {
          constructor(t3) {
            let e3 = "";
            "not-fast-forward" === t3 ? e3 = " because it was not a simple fast-forward" : "tag-exists" === t3 && (e3 = " because tag already exists"), super(`Push rejected${e3}. Use "force: true" to override.`), this.code = this.name = Ni.code, this.data = { reason: t3 };
          }
        }
        async function zi({ fs: t3, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, onPrePush: s2, dir: c2, gitdir: f2 = N(c2, ".git"), ref: l2, remoteRef: d2, remote: u2 = "origin", url: h2, force: p2 = false, delete: g2 = false, corsProxy: w2, headers: m2 = {}, cache: y2 = {} }) {
          try {
            Qt("fs", t3), Qt("http", e3), Qt("gitdir", f2);
            const c3 = new Xt(t3), b2 = await te({ fsp: c3, dotgit: f2 });
            return await (async function({ fs: t4, cache: e4, http: r3, onProgress: i3, onMessage: n3, onAuth: a3, onAuthSuccess: o3, onAuthFailure: s3, onPrePush: c4, gitdir: f3, ref: l3, remoteRef: d3, remote: u3, url: h3, force: p3 = false, delete: g3 = false, corsProxy: w3, headers: m3 = {} }) {
              const y3 = l3 || await or({ fs: t4, gitdir: f3 });
              if (void 0 === y3) throw new Jt("ref");
              const b3 = await Q.get({ fs: t4, gitdir: f3 });
              u3 = u3 || await b3.get(`branch.${y3}.pushRemote`) || await b3.get("remote.pushDefault") || await b3.get(`branch.${y3}.remote`) || "origin";
              const _2 = h3 || await b3.get(`remote.${u3}.pushurl`) || await b3.get(`remote.${u3}.url`);
              if (void 0 === _2) throw new Jt("remote OR url");
              const v2 = d3 || await b3.get(`branch.${y3}.merge`);
              if (void 0 === _2) throw new Jt("remoteRef");
              void 0 === w3 && (w3 = await b3.get("http.corsProxy"));
              const x2 = await nt.expand({ fs: t4, gitdir: f3, ref: y3 }), k2 = g3 ? "0000000000000000000000000000000000000000" : await nt.resolve({ fs: t4, gitdir: f3, ref: x2 }), E2 = $r.getRemoteHelperFor({ url: _2 }), A2 = await E2.discover({ http: r3, onAuth: Or({ config: b3, onAuth: a3 }), onAuthSuccess: o3, onAuthFailure: Or({ config: b3, onAuth: s3 }), corsProxy: w3, service: "git-receive-pack", url: _2, headers: m3, protocolVersion: 1 }), S2 = A2.auth;
              let B2;
              if (v2) try {
                B2 = await nt.expandAgainstMap({ ref: v2, map: A2.refs });
              } catch (t5) {
                if (!(t5 instanceof I)) throw t5;
                B2 = v2.startsWith("refs/") ? v2 : `refs/heads/${v2}`;
              }
              else B2 = x2;
              const $2 = A2.refs.get(B2) || "0000000000000000000000000000000000000000";
              if (c4 && !await c4({ remote: u3, url: _2, localRef: { ref: g3 ? "(delete)" : x2, oid: k2 }, remoteRef: { ref: B2, oid: $2 } })) throw new ur();
              const R2 = !A2.capabilities.has("no-thin");
              let P2 = /* @__PURE__ */ new Set();
              if (!g3) {
                const r4 = [...A2.refs.values()];
                let i4 = /* @__PURE__ */ new Set();
                if ("0000000000000000000000000000000000000000" !== $2) {
                  const n4 = await Xr({ fs: t4, cache: e4, gitdir: f3, oids: [k2, $2] });
                  for (const t5 of n4) r4.push(t5);
                  R2 && (i4 = await Mi({ fs: t4, cache: e4, gitdir: f3, oids: n4 }));
                }
                if (!r4.includes(k2)) {
                  const i5 = await (async function({ fs: t5, cache: e5, dir: r5, gitdir: i6 = N(r5, ".git"), start: n4, finish: a4 }) {
                    const o4 = await Pr.read({ fs: t5, gitdir: i6 }), s4 = /* @__PURE__ */ new Set(), c5 = /* @__PURE__ */ new Set();
                    for (const e6 of n4) s4.add(await nt.resolve({ fs: t5, gitdir: i6, ref: e6 }));
                    for (const e6 of a4) try {
                      const r6 = await nt.resolve({ fs: t5, gitdir: i6, ref: e6 });
                      c5.add(r6);
                    } catch (t6) {
                    }
                    const f4 = /* @__PURE__ */ new Set();
                    async function l4(r6) {
                      f4.add(r6);
                      const { type: n5, object: a5 } = await Bt({ fs: t5, cache: e5, gitdir: i6, oid: r6 });
                      if ("tag" === n5) return l4(Ot.from(a5).headers().object);
                      if ("commit" !== n5) throw new O(r6, n5, "commit");
                      if (!o4.has(r6)) {
                        const t6 = Ut.from(a5).headers().parent;
                        for (r6 of t6) c5.has(r6) || f4.has(r6) || await l4(r6);
                      }
                    }
                    for (const t6 of s4) await l4(t6);
                    return f4;
                  })({ fs: t4, cache: e4, gitdir: f3, start: [k2], finish: r4 });
                  P2 = await Mi({ fs: t4, cache: e4, gitdir: f3, oids: i5 });
                }
                if (R2) {
                  try {
                    const r5 = await nt.resolve({ fs: t4, gitdir: f3, ref: `refs/remotes/${u3}/HEAD`, depth: 2 }), { oid: n4 } = await nt.resolveAgainstMap({ ref: r5.replace(`refs/remotes/${u3}/`, ""), fullref: r5, map: A2.refs }), a4 = [n4];
                    for (const r6 of await Mi({ fs: t4, cache: e4, gitdir: f3, oids: a4 })) i4.add(r6);
                  } catch (t5) {
                  }
                  for (const t5 of i4) P2.delete(t5);
                }
                if (k2 === $2 && (p3 = true), !p3) {
                  if (x2.startsWith("refs/tags") && "0000000000000000000000000000000000000000" !== $2) throw new Ni("tag-exists");
                  if ("0000000000000000000000000000000000000000" !== k2 && "0000000000000000000000000000000000000000" !== $2 && !await gi({ fs: t4, cache: e4, gitdir: f3, oid: k2, ancestor: $2, depth: -1 })) throw new Ni("not-fast-forward");
                }
              }
              const j2 = jr([...A2.capabilities], ["report-status", "side-band-64k", `agent=${Ur.agent}`]), U2 = await (async function({ capabilities: t5 = [], triplets: e5 = [] }) {
                const r4 = [];
                let i4 = `\0 ${t5.join(" ")}`;
                for (const t6 of e5) r4.push(_r.encode(`${t6.oldoid} ${t6.oid} ${t6.fullRef}${i4}
`)), i4 = "";
                return r4.push(_r.flush()), r4;
              })({ capabilities: j2, triplets: [{ oldoid: $2, oid: k2, fullRef: B2 }] }), T2 = g3 ? [] : await Ui({ fs: t4, cache: e4, gitdir: f3, oids: [...P2] }), C2 = await E2.connect({ http: r3, onProgress: i3, corsProxy: w3, service: "git-receive-pack", url: _2, auth: S2, headers: m3, body: [...U2, ...T2] }), { packfile: M2, progress: D2 } = await Dr.demux(C2.body);
              n3 && pr(Mr(D2), async (t5) => {
                await n3(t5);
              });
              const z2 = await (async function(t5) {
                const e5 = {};
                let r4 = "";
                const i4 = _r.streamReader(t5);
                let n4 = await i4();
                for (; true !== n4; ) null !== n4 && (r4 += n4.toString("utf8") + "\n"), n4 = await i4();
                const a4 = r4.toString("utf8").split("\n");
                if (n4 = a4.shift(), !n4.startsWith("unpack ")) throw new yr('unpack ok" or "unpack [error message]', n4);
                e5.ok = "unpack ok" === n4, e5.ok || (e5.error = n4.slice(7)), e5.refs = {};
                for (const t6 of a4) {
                  if ("" === t6.trim()) continue;
                  const r5 = t6.slice(0, 2), i5 = t6.slice(3);
                  let n5 = i5.indexOf(" ");
                  -1 === n5 && (n5 = i5.length);
                  const a5 = i5.slice(0, n5), o4 = i5.slice(n5 + 1);
                  e5.refs[a5] = { ok: "ok" === r5, error: o4 };
                }
                return e5;
              })(M2);
              if (C2.headers && (z2.headers = C2.headers), u3 && z2.ok && z2.refs[B2].ok && !x2.startsWith("refs/tags")) {
                const e5 = `refs/remotes/${u3}/${B2.replace("refs/heads", "")}`;
                g3 ? await nt.deleteRef({ fs: t4, gitdir: f3, ref: e5 }) : await nt.writeRef({ fs: t4, gitdir: f3, ref: e5, value: k2 });
              }
              if (z2.ok && Object.values(z2.refs).every((t5) => t5.ok)) return z2;
              {
                const t5 = Object.entries(z2.refs).filter(([t6, e5]) => !e5.ok).map(([t6, e5]) => `
  - ${t6}: ${e5.error}`).join("");
                throw new Di(t5, z2);
              }
            })({ fs: c3, cache: y2, http: e3, onProgress: r2, onMessage: i2, onAuth: n2, onAuthSuccess: a2, onAuthFailure: o2, onPrePush: s2, gitdir: b2, ref: l2, remoteRef: d2, remote: u2, url: h2, force: p2, delete: g2, corsProxy: w2, headers: m2 });
          } catch (t4) {
            throw t4.caller = "git.push", t4;
          }
        }
        async function Fi({ fs: t3, cache: e3, gitdir: r2, oid: i2 }) {
          const { type: n2, object: a2 } = await Bt({ fs: t3, cache: e3, gitdir: r2, oid: i2 });
          if ("tag" === n2) return Fi({ fs: t3, cache: e3, gitdir: r2, oid: i2 = Ot.from(a2).parse().object });
          if ("blob" !== n2) throw new O(i2, n2, "blob");
          return { oid: i2, blob: new Uint8Array(a2) };
        }
        async function Li({ fs: t3, cache: e3, gitdir: r2, oid: i2, filepath: n2 }) {
          return void 0 !== n2 && (i2 = await ke({ fs: t3, cache: e3, gitdir: r2, oid: i2, filepath: n2 })), await Fi({ fs: t3, cache: e3, gitdir: r2, oid: i2 });
        }
        async function Hi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oid: i2, filepath: n2, cache: a2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oid", i2);
            const e4 = new Xt(t3), o2 = await te({ fsp: e4, dotgit: r2 });
            return await Li({ fs: e4, cache: a2, gitdir: o2, oid: i2, filepath: n2 });
          } catch (t4) {
            throw t4.caller = "git.readBlob", t4;
          }
        }
        async function Gi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oid: i2, cache: n2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oid", i2);
            const e4 = new Xt(t3), a2 = await te({ fsp: e4, dotgit: r2 });
            return await be({ fs: e4, cache: n2, gitdir: a2, oid: i2 });
          } catch (t4) {
            throw t4.caller = "git.readCommit", t4;
          }
        }
        async function Wi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2 = "refs/notes/commits", oid: n2, cache: a2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", i2), Qt("oid", n2);
            const e4 = new Xt(t3), o2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, cache: e5, gitdir: r3, ref: i3 = "refs/notes/commits", oid: n3 }) {
              const a3 = await nt.resolve({ gitdir: r3, fs: t4, ref: i3 }), { blob: o3 } = await Li({ fs: t4, cache: e5, gitdir: r3, oid: a3, filepath: n3 });
              return o3;
            })({ fs: e4, cache: a2, gitdir: o2, ref: i2, oid: n2 });
          } catch (t4) {
            throw t4.caller = "git.readNote", t4;
          }
        }
        async function qi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oid: i2, format: n2 = "parsed", filepath: a2, encoding: o2, cache: s2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oid", i2);
            const e4 = new Xt(t3), c2 = await te({ fsp: e4, dotgit: r2 });
            void 0 !== a2 && (i2 = await ke({ fs: e4, cache: s2, gitdir: c2, oid: i2, filepath: a2 }));
            const f2 = "parsed" === n2 ? "content" : n2, l2 = await Bt({ fs: e4, cache: s2, gitdir: c2, oid: i2, format: f2 });
            if (l2.oid = i2, "parsed" === n2) switch (l2.format = "parsed", l2.type) {
              case "commit":
                l2.object = Ut.from(l2.object).parse();
                break;
              case "tree":
                l2.object = ft.from(l2.object).entries();
                break;
              case "blob":
                o2 ? l2.object = l2.object.toString(o2) : (l2.object = new Uint8Array(l2.object), l2.format = "content");
                break;
              case "tag":
                l2.object = Ot.from(l2.object).parse();
                break;
              default:
                throw new O(l2.oid, l2.type, "blob|commit|tag|tree");
            }
            else "deflated" !== l2.format && "wrapped" !== l2.format || (l2.type = l2.format);
            return l2;
          } catch (t4) {
            throw t4.caller = "git.readObject", t4;
          }
        }
        async function Zi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oid: i2, cache: n2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oid", i2);
            const e4 = new Xt(t3), a2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, cache: e5, gitdir: r3, oid: i3 }) {
              const { type: n3, object: a3 } = await Bt({ fs: t4, cache: e5, gitdir: r3, oid: i3, format: "content" });
              if ("tag" !== n3) throw new O(i3, n3, "tag");
              const o2 = Ot.from(a3);
              return { oid: i3, tag: o2.parse(), payload: o2.payload() };
            })({ fs: e4, cache: n2, gitdir: a2, oid: i2 });
          } catch (t4) {
            throw t4.caller = "git.readTag", t4;
          }
        }
        async function Ki({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), oid: i2, filepath: n2, cache: a2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("oid", i2);
            const e4 = new Xt(t3), o2 = await te({ fsp: e4, dotgit: r2 });
            return await Ae({ fs: e4, cache: a2, gitdir: o2, oid: i2, filepath: n2 });
          } catch (t4) {
            throw t4.caller = "git.readTree", t4;
          }
        }
        async function Vi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), filepath: i2, cache: n2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("filepath", i2);
            const e4 = new Xt(t3), a2 = await te({ fsp: e4, dotgit: r2 });
            await E.acquire({ fs: e4, gitdir: a2, cache: n2 }, async function(t4) {
              t4.delete({ filepath: i2 });
            });
          } catch (t4) {
            throw t4.caller = "git.remove", t4;
          }
        }
        async function Yi({ fs: t3, onSign: e3, dir: r2, gitdir: i2 = N(r2, ".git"), ref: n2 = "refs/notes/commits", oid: a2, author: o2, committer: s2, signingKey: c2, cache: f2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", i2), Qt("oid", a2);
            const r3 = new Xt(t3), l2 = await te({ fsp: r3, dotgit: i2 }), d2 = await we({ fs: r3, gitdir: l2, author: o2 });
            if (!d2) throw new ue("author");
            const u2 = await me({ fs: r3, gitdir: l2, author: d2, committer: s2 });
            if (!u2) throw new ue("committer");
            return await (async function({ fs: t4, cache: e4, onSign: r4, gitdir: i3, ref: n3 = "refs/notes/commits", oid: a3, author: o3, committer: s3, signingKey: c3 }) {
              let f3;
              try {
                f3 = await nt.resolve({ gitdir: i3, fs: t4, ref: n3 });
              } catch (t5) {
                if (!(t5 instanceof I)) throw t5;
              }
              let l3 = (await Ae({ fs: t4, cache: e4, gitdir: i3, oid: f3 || "4b825dc642cb6eb9a060e54bf8d69288fbee4904" })).tree;
              l3 = l3.filter((t5) => t5.path !== a3);
              const d3 = await Se({ fs: t4, gitdir: i3, tree: l3 });
              return await _e({ fs: t4, cache: e4, onSign: r4, gitdir: i3, ref: n3, tree: d3, parent: f3 && [f3], message: "Note removed by 'isomorphic-git removeNote'\n", author: o3, committer: s3, signingKey: c3 });
            })({ fs: r3, cache: f2, onSign: e3, gitdir: l2, ref: n2, oid: a2, author: d2, committer: u2, signingKey: c2 });
          } catch (t4) {
            throw t4.caller = "git.removeNote", t4;
          }
        }
        async function Xi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2, oldref: n2, checkout: a2 = false }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", i2), Qt("oldref", n2);
            const e4 = new Xt(t3), o2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, gitdir: e5, oldref: r3, ref: i3, checkout: n3 = false }) {
              if (!Oe(i3, true)) throw new Pe(i3, Re.clean(i3));
              if (!Oe(r3, true)) throw new Pe(r3, Re.clean(r3));
              const a3 = `refs/heads/${r3}`, o3 = `refs/heads/${i3}`;
              if (await nt.exists({ fs: t4, gitdir: e5, ref: o3 })) throw new Be("branch", i3, false);
              const s2 = await nt.resolve({ fs: t4, gitdir: e5, ref: a3, depth: 1 });
              await nt.writeRef({ fs: t4, gitdir: e5, ref: o3, value: s2 }), await nt.deleteRef({ fs: t4, gitdir: e5, ref: a3 });
              const c2 = await or({ fs: t4, gitdir: e5, fullname: true });
              (n3 || c2 === a3) && await nt.writeSymbolicRef({ fs: t4, gitdir: e5, ref: "HEAD", value: o3 });
            })({ fs: e4, gitdir: o2, ref: i2, oldref: n2, checkout: a2 });
          } catch (t4) {
            throw t4.caller = "git.renameBranch", t4;
          }
        }
        async function Ji({ gitdir: t3, type: e3, object: r2 }) {
          return m(lt.wrap({ type: e3, object: r2 }));
        }
        async function Qi({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), filepath: i2, ref: n2, cache: a2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("filepath", i2);
            const o2 = new Xt(t3), s2 = await te({ fsp: o2, dotgit: r2 });
            let c2, f2;
            try {
              c2 = await nt.resolve({ fs: o2, gitdir: s2, ref: n2 || "HEAD" });
            } catch (t4) {
              if (n2) throw t4;
            }
            if (c2) try {
              c2 = await ke({ fs: o2, cache: a2, gitdir: s2, oid: c2, filepath: i2 });
            } catch (t4) {
              c2 = null;
            }
            let l2 = { ctime: /* @__PURE__ */ new Date(0), mtime: /* @__PURE__ */ new Date(0), dev: 0, ino: 0, mode: 0, uid: 0, gid: 0, size: 0 };
            const d2 = e3 && await o2.read(N(e3, i2));
            d2 && (f2 = await Ji({ gitdir: s2, type: "blob", object: d2 }), c2 === f2 && (l2 = await o2.lstat(N(e3, i2)))), await E.acquire({ fs: o2, gitdir: s2, cache: a2 }, async function(t4) {
              t4.delete({ filepath: i2 }), c2 && t4.insert({ filepath: i2, stats: l2, oid: c2 });
            });
          } catch (t4) {
            throw t4.caller = "git.reset", t4;
          }
        }
        async function tn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2, depth: n2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", i2);
            const e4 = new Xt(t3), a2 = await te({ fsp: e4, dotgit: r2 });
            return await nt.resolve({ fs: e4, gitdir: a2, ref: i2, depth: n2 });
          } catch (t4) {
            throw t4.caller = "git.resolveRef", t4;
          }
        }
        async function en({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), path: i2, value: n2, append: a2 = false }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("path", i2);
            const e4 = new Xt(t3), o2 = await te({ fsp: e4, dotgit: r2 }), s2 = await Q.get({ fs: e4, gitdir: o2 });
            a2 ? await s2.append(i2, n2) : await s2.set(i2, n2), await Q.save({ fs: e4, gitdir: o2, config: s2 });
          } catch (t4) {
            throw t4.caller = "git.setConfig", t4;
          }
        }
        async function rn({ fs: t3, gitdir: e3, commit: r2 }) {
          const i2 = Ut.from(r2).toObject();
          return await ce({ fs: t3, gitdir: e3, type: "commit", object: i2, format: "content" });
        }
        Ni.code = "PushRejectedError";
        class nn {
          static get timezoneOffsetForRefLogEntry() {
            const t3 = (/* @__PURE__ */ new Date()).getTimezoneOffset(), e3 = Math.abs(Math.floor(t3 / 60)), r2 = Math.abs(t3 % 60).toString().padStart(2, "0");
            return `${t3 > 0 ? "-" : "+"}${e3.toString().padStart(2, "0")}${r2}`;
          }
          static createStashReflogEntry(t3, e3, r2) {
            const i2 = t3.name.replace(/\s/g, ""), n2 = Math.floor(Date.now() / 1e3), a2 = nn.timezoneOffsetForRefLogEntry;
            return `0000000000000000000000000000000000000000 ${e3} ${i2} ${t3.email} ${n2} ${a2}	${r2}
`;
          }
          static getStashReflogEntry(t3, e3 = false) {
            return t3.split("\n").filter((t4) => t4).reverse().map((t4, r2) => e3 ? `stash@{${r2}}: ${t4.split("	")[1]}` : t4);
          }
        }
        class an {
          constructor({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git") }) {
            Object.assign(this, { fs: t3, dir: e3, gitdir: r2, _author: null });
          }
          static get refStash() {
            return "refs/stash";
          }
          static get refLogsStash() {
            return "logs/refs/stash";
          }
          get refStashPath() {
            return N(this.gitdir, an.refStash);
          }
          get refLogsStashPath() {
            return N(this.gitdir, an.refLogsStash);
          }
          async getAuthor() {
            if (!this._author && (this._author = await we({ fs: this.fs, gitdir: this.gitdir, author: {} }), !this._author)) throw new ue("author");
            return this._author;
          }
          async getStashSHA(t3, e3) {
            return await this.fs.exists(this.refStashPath) ? (e3 || await this.readStashReflogs({ parsed: false }))[t3].split(" ")[1] : null;
          }
          async writeStashCommit({ message: t3, tree: e3, parent: r2 }) {
            return rn({ fs: this.fs, gitdir: this.gitdir, commit: { message: t3, tree: e3, parent: r2, author: await this.getAuthor(), committer: await this.getAuthor() } });
          }
          async readStashCommit(t3) {
            const e3 = await this.readStashReflogs({ parsed: false });
            if (0 !== t3 && (t3 < 0 || t3 > e3.length - 1)) throw new Pe(`stash@${t3}`, "number that is in range of [0, num of stash pushed]");
            const r2 = await this.getStashSHA(t3, e3);
            return r2 ? be({ fs: this.fs, cache: {}, gitdir: this.gitdir, oid: r2 }) : {};
          }
          async writeStashRef(t3) {
            return nt.writeRef({ fs: this.fs, gitdir: this.gitdir, ref: an.refStash, value: t3 });
          }
          async writeStashReflogEntry({ stashCommit: t3, message: e3 }) {
            const r2 = await this.getAuthor(), i2 = nn.createStashReflogEntry(r2, t3, e3), n2 = this.refLogsStashPath;
            await Qe({ filepath: n2, entry: i2 }, async () => {
              const t4 = await this.fs.exists(n2) ? await this.fs.read(n2, "utf8") : "";
              await this.fs.write(n2, t4 + i2, "utf8");
            });
          }
          async readStashReflogs({ parsed: t3 = false }) {
            if (!await this.fs.exists(this.refLogsStashPath)) return [];
            const e3 = await this.fs.read(this.refLogsStashPath, "utf8");
            return nn.getStashReflogEntry(e3, t3);
          }
        }
        async function on({ fs: t3, dir: e3, gitdir: r2, message: i2 = "" }) {
          const n2 = new an({ fs: t3, dir: e3, gitdir: r2 });
          await n2.getAuthor();
          const a2 = await or({ fs: t3, gitdir: r2, fullname: false }), o2 = await nt.resolve({ fs: t3, gitdir: r2, ref: "HEAD" }), s2 = (await Gi({ fs: t3, dir: e3, gitdir: r2, oid: o2 })).commit.message, c2 = [o2];
          let f2 = null, l2 = Mt({ ref: "HEAD" });
          const d2 = await tr({ fs: t3, dir: e3, gitdir: r2, treePair: [Mt({ ref: "HEAD" }), "stage"] });
          if (d2) {
            const t4 = await n2.writeStashCommit({ message: `stash-Index: WIP on ${a2} - ${(/* @__PURE__ */ new Date()).toISOString()}`, tree: d2, parent: c2 });
            c2.push(t4), f2 = d2, l2 = P();
          }
          const u2 = await tr({ fs: t3, dir: e3, gitdir: r2, treePair: [l2, "workdir"] });
          if (u2) {
            const t4 = await n2.writeStashCommit({ message: `stash-WorkDir: WIP on ${a2} - ${(/* @__PURE__ */ new Date()).toISOString()}`, tree: u2, parent: [c2[c2.length - 1]] });
            c2.push(t4), f2 = u2;
          }
          if (!f2 || !d2 && !u2) throw new I("changes, nothing to stash");
          const h2 = (i2.trim() || `WIP on ${a2}`) + `: ${o2.substring(0, 7)} ${s2}`;
          return { stashCommit: await n2.writeStashCommit({ message: h2, tree: f2, parent: c2 }), stashMsg: h2, branch: a2, stashMgr: n2 };
        }
        async function sn({ fs: t3, dir: e3, gitdir: r2, message: i2 = "" }) {
          const { stashCommit: n2, stashMsg: a2, branch: o2, stashMgr: s2 } = await on({ fs: t3, dir: e3, gitdir: r2, message: i2 });
          return await s2.writeStashRef(n2), await s2.writeStashReflogEntry({ stashCommit: n2, message: a2 }), await Le({ fs: t3, dir: e3, gitdir: r2, ref: o2, track: false, force: true }), n2;
        }
        async function cn({ fs: t3, dir: e3, gitdir: r2, message: i2 = "" }) {
          const { stashCommit: n2 } = await on({ fs: t3, dir: e3, gitdir: r2, message: i2 });
          return n2;
        }
        async function fn({ fs: t3, dir: e3, gitdir: r2, refIdx: i2 = 0 }) {
          const n2 = new an({ fs: t3, dir: e3, gitdir: r2 }), a2 = await n2.readStashCommit(i2), { parent: o2 = null } = a2.commit ? a2.commit : {};
          if (o2 && Array.isArray(o2)) for (let i3 = 0; i3 < o2.length - 1; i3++) {
            const n3 = (await be({ fs: t3, cache: {}, gitdir: r2, oid: o2[i3 + 1] })).commit.message.startsWith("stash-Index");
            await er({ fs: t3, dir: e3, gitdir: r2, stashCommit: o2[i3 + 1], parentCommit: o2[i3], wasStaged: n3 });
          }
        }
        async function ln({ fs: t3, dir: e3, gitdir: r2, refIdx: i2 = 0 }) {
          const n2 = new an({ fs: t3, dir: e3, gitdir: r2 });
          if (!(await n2.readStashCommit(i2)).commit) return;
          const a2 = n2.refStashPath;
          await Qe(a2, async () => {
            await t3.exists(a2) && await t3.rm(a2);
          });
          const o2 = await n2.readStashReflogs({ parsed: false });
          if (!o2.length) return;
          o2.splice(i2, 1);
          const s2 = n2.refLogsStashPath;
          await Qe({ reflogEntries: o2, stashReflogPath: s2, stashMgr: n2 }, async () => {
            if (o2.length) {
              await t3.write(s2, o2.reverse().join("\n") + "\n", "utf8");
              const e4 = o2[o2.length - 1].split(" ")[1];
              await n2.writeStashRef(e4);
            } else await t3.rm(s2);
          });
        }
        async function dn({ fs: t3, dir: e3, gitdir: r2 }) {
          return new an({ fs: t3, dir: e3, gitdir: r2 }).readStashReflogs({ parsed: true });
        }
        async function un({ fs: t3, dir: e3, gitdir: r2 }) {
          const i2 = new an({ fs: t3, dir: e3, gitdir: r2 }), n2 = [i2.refStashPath, i2.refLogsStashPath];
          await Qe(n2, async () => {
            await Promise.all(n2.map(async (e4) => {
              if (await t3.exists(e4)) return t3.rm(e4);
            }));
          });
        }
        async function hn({ fs: t3, dir: e3, gitdir: r2, refIdx: i2 = 0 }) {
          await fn({ fs: t3, dir: e3, gitdir: r2, refIdx: i2 }), await ln({ fs: t3, dir: e3, gitdir: r2, refIdx: i2 });
        }
        async function pn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), op: i2 = "push", message: n2 = "", refIdx: a2 = 0 }) {
          Qt("fs", t3), Qt("dir", e3), Qt("gitdir", r2), Qt("op", i2);
          const o2 = { push: sn, apply: fn, drop: ln, list: dn, clear: un, pop: hn, create: cn }, s2 = ["apply", "drop", "pop"];
          try {
            const c2 = new Xt(t3), f2 = await te({ fsp: c2, dotgit: r2 });
            ["refs", "logs", "logs/refs"].map((t4) => N(f2, t4)).forEach(async (t4) => {
              await c2.exists(t4) || await c2.mkdir(t4);
            });
            const l2 = o2[i2];
            if (l2) {
              if (s2.includes(i2) && a2 < 0) throw new Pe(`stash@${a2}`, "number that is in range of [0, num of stash pushed]");
              return await l2({ fs: c2, dir: e3, gitdir: f2, message: n2, refIdx: a2 });
            }
            throw new Error(`To be implemented: ${i2}`);
          } catch (t4) {
            throw t4.caller = "git.stash", t4;
          }
        }
        async function gn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), filepath: i2, cache: n2 = {}, refresh: a2 = true }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("filepath", i2);
            const o2 = new Xt(t3), s2 = await te({ fsp: o2, dotgit: r2 });
            if (await ae.isIgnored({ fs: o2, gitdir: s2, dir: e3, filepath: i2 })) return "ignored";
            const c2 = await (async function({ fs: t4, cache: e4, gitdir: r3 }) {
              let i3;
              try {
                i3 = await nt.resolve({ fs: t4, gitdir: r3, ref: "HEAD" });
              } catch (t5) {
                if (t5 instanceof I) return [];
              }
              const { tree: n3 } = await Ae({ fs: t4, cache: e4, gitdir: r3, oid: i3 });
              return n3;
            })({ fs: o2, cache: n2, gitdir: s2 }), f2 = await wn({ fs: o2, cache: n2, gitdir: s2, tree: c2, path: i2 }), l2 = await E.acquire({ fs: o2, gitdir: s2, cache: n2 }, async function(t4) {
              for (const e4 of t4) if (e4.path === i2) return e4;
              return null;
            }), d2 = await o2.lstat(N(e3, i2)), u2 = null !== f2, h2 = null !== l2, p2 = null !== d2, g2 = async () => {
              if (h2 && !v(l2, d2)) return l2.oid;
              {
                const t4 = await o2.read(N(e3, i2)), r3 = await Ji({ gitdir: s2, type: "blob", object: t4 });
                return a2 && h2 && l2.oid === r3 && -1 !== d2.size && E.acquire({ fs: o2, gitdir: s2, cache: n2 }, async function(t5) {
                  t5.insert({ filepath: i2, stats: d2, oid: r3 });
                }), r3;
              }
            };
            if (!u2 && !p2 && !h2) return "absent";
            if (!u2 && !p2 && h2) return "*absent";
            if (!u2 && p2 && !h2) return "*added";
            if (!u2 && p2 && h2) return await g2() === l2.oid ? "added" : "*added";
            if (u2 && !p2 && !h2) return "deleted";
            if (u2 && !p2 && h2) return l2.oid, "*deleted";
            if (u2 && p2 && !h2) return await g2() === f2 ? "*undeleted" : "*undeletemodified";
            if (u2 && p2 && h2) {
              const t4 = await g2();
              return t4 === f2 ? t4 === l2.oid ? "unmodified" : "*unmodified" : t4 === l2.oid ? "modified" : "*modified";
            }
          } catch (t4) {
            throw t4.caller = "git.status", t4;
          }
        }
        async function wn({ fs: t3, cache: e3, gitdir: r2, tree: i2, path: n2 }) {
          "string" == typeof n2 && (n2 = n2.split("/"));
          const a2 = n2.shift();
          for (const o2 of i2) if (o2.path === a2) {
            if (0 === n2.length) return o2.oid;
            const { type: i3, object: a3 } = await Bt({ fs: t3, cache: e3, gitdir: r2, oid: o2.oid });
            if ("tree" === i3) return wn({ fs: t3, cache: e3, gitdir: r2, tree: ft.from(a3), path: n2 });
            if ("blob" === i3) throw new O(o2.oid, i3, "blob", n2.join("/"));
          }
          return null;
        }
        async function mn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2 = "HEAD", filepaths: n2 = ["."], filter: a2, cache: o2 = {}, ignored: s2 = false, refresh: c2 = true }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", i2);
            const f2 = new Xt(t3), l2 = await te({ fsp: f2, dotgit: r2 });
            return await Ht({ fs: f2, cache: o2, dir: e3, gitdir: l2, trees: [Mt({ ref: i2 }), Nt({ refresh: c2 }), P()], map: async function(t4, [r3, i3, o3]) {
              if (!r3 && !o3 && i3 && !s2 && await ae.isIgnored({ fs: f2, dir: e3, filepath: t4 })) return null;
              if (!n2.some((e4) => Ne(t4, e4))) return null;
              if (a2 && !a2(t4)) return;
              const [c3, l3, d2] = await Promise.all([r3 && r3.type(), i3 && i3.type(), o3 && o3.type()]), u2 = [c3, l3, d2].includes("blob");
              if (("tree" === c3 || "special" === c3) && !u2) return;
              if ("commit" === c3) return null;
              if (("tree" === l3 || "special" === l3) && !u2) return;
              if ("commit" === d2) return null;
              if (("tree" === d2 || "special" === d2) && !u2) return;
              const h2 = "blob" === c3 ? await r3.oid() : void 0, p2 = "blob" === d2 ? await o3.oid() : void 0;
              let g2;
              "blob" !== c3 && "blob" === l3 && "blob" !== d2 ? g2 = "42" : "blob" === l3 && (g2 = await i3.oid());
              const w2 = [void 0, h2, g2, p2], m2 = w2.map((t5) => w2.indexOf(t5));
              return m2.shift(), [t4, ...m2];
            } });
          } catch (t4) {
            throw t4.caller = "git.statusMatrix", t4;
          }
        }
        async function yn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2, object: n2, force: a2 = false }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", i2);
            const e4 = new Xt(t3);
            if (void 0 === i2) throw new Jt("ref");
            i2 = i2.startsWith("refs/tags/") ? i2 : `refs/tags/${i2}`;
            const o2 = await te({ fsp: e4, dotgit: r2 }), s2 = await nt.resolve({ fs: e4, gitdir: o2, ref: n2 || "HEAD" });
            if (!a2 && await nt.exists({ fs: e4, gitdir: o2, ref: i2 })) throw new Be("tag", i2);
            await nt.writeRef({ fs: e4, gitdir: o2, ref: i2, value: s2 });
          } catch (t4) {
            throw t4.caller = "git.tag", t4;
          }
        }
        async function bn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), cache: i2 = {}, filepath: n2, oid: a2, mode: o2, add: s2, remove: c2, force: f2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("filepath", n2);
            const l2 = new Xt(t3), d2 = await te({ fsp: l2, dotgit: r2 });
            if (c2) return await E.acquire({ fs: l2, gitdir: d2, cache: i2 }, async function(t4) {
              if (!f2) {
                const t5 = await l2.lstat(N(e3, n2));
                if (t5) {
                  if (t5.isDirectory()) throw new xe("directory");
                  return;
                }
              }
              t4.has({ filepath: n2 }) && t4.delete({ filepath: n2 });
            });
            let u2;
            if (!a2) {
              if (u2 = await l2.lstat(N(e3, n2)), !u2) throw new I(`file at "${n2}" on disk and "remove" not set`);
              if (u2.isDirectory()) throw new xe("directory");
            }
            return await E.acquire({ fs: l2, gitdir: d2, cache: i2 }, async function(t4) {
              if (!s2 && !t4.has({ filepath: n2 })) throw new I(`file at "${n2}" in index and "add" not set`);
              let r3;
              if (a2) r3 = { ctime: /* @__PURE__ */ new Date(0), mtime: /* @__PURE__ */ new Date(0), dev: 0, ino: 0, mode: o2, uid: 0, gid: 0, size: 0 };
              else {
                r3 = u2;
                const t5 = r3.isSymbolicLink() ? await l2.readlink(N(e3, n2)) : await l2.read(N(e3, n2));
                a2 = await ce({ fs: l2, gitdir: d2, type: "blob", format: "content", object: t5 });
              }
              return t4.insert({ filepath: n2, oid: a2, stats: r3 }), a2;
            });
          } catch (t4) {
            throw t4.caller = "git.updateIndex", t4;
          }
        }
        function _n() {
          try {
            return Ur.version;
          } catch (t3) {
            throw t3.caller = "git.version", t3;
          }
        }
        async function vn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), trees: i2, map: n2, reduce: a2, iterate: o2, cache: s2 = {} }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("trees", i2);
            const c2 = new Xt(t3), f2 = await te({ fsp: c2, dotgit: r2 });
            return await Ht({ fs: c2, cache: s2, dir: e3, gitdir: f2, trees: i2, map: n2, reduce: a2, iterate: o2 });
          } catch (t4) {
            throw t4.caller = "git.walk", t4;
          }
        }
        async function xn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), blob: i2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("blob", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await ce({ fs: e4, gitdir: n2, type: "blob", object: i2, format: "content" });
          } catch (t4) {
            throw t4.caller = "git.writeBlob", t4;
          }
        }
        async function kn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), commit: i2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("commit", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await rn({ fs: e4, gitdir: n2, commit: i2 });
          } catch (t4) {
            throw t4.caller = "git.writeCommit", t4;
          }
        }
        async function En({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), type: i2, object: n2, format: a2 = "parsed", oid: o2, encoding: s2 }) {
          try {
            const e4 = new Xt(t3), c2 = await te({ fsp: e4, dotgit: r2 });
            if ("parsed" === a2) {
              switch (i2) {
                case "commit":
                  n2 = Ut.from(n2).toObject();
                  break;
                case "tree":
                  n2 = ft.from(n2).toObject();
                  break;
                case "blob":
                  n2 = Buffer.from(n2, s2);
                  break;
                case "tag":
                  n2 = Ot.from(n2).toObject();
                  break;
                default:
                  throw new O(o2 || "", i2, "blob|commit|tag|tree");
              }
              a2 = "content";
            }
            return await ce({ fs: e4, gitdir: c2, type: i2, object: n2, oid: o2, format: a2 });
          } catch (t4) {
            throw t4.caller = "git.writeObject", t4;
          }
        }
        async function An({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), ref: i2, value: n2, force: a2 = false, symbolic: o2 = false }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("ref", i2), Qt("value", n2);
            const e4 = new Xt(t3);
            if (!Oe(i2, true)) throw new Pe(i2, Re.clean(i2));
            const s2 = await te({ fsp: e4, dotgit: r2 });
            if (!a2 && await nt.exists({ fs: e4, gitdir: s2, ref: i2 })) throw new Be("ref", i2);
            o2 ? await nt.writeSymbolicRef({ fs: e4, gitdir: s2, ref: i2, value: n2 }) : (n2 = await nt.resolve({ fs: e4, gitdir: s2, ref: n2 }), await nt.writeRef({ fs: e4, gitdir: s2, ref: i2, value: n2 }));
          } catch (t4) {
            throw t4.caller = "git.writeRef", t4;
          }
        }
        async function Sn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), tag: i2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("tag", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await (async function({ fs: t4, gitdir: e5, tag: r3 }) {
              const i3 = Ot.from(r3).toObject();
              return await ce({ fs: t4, gitdir: e5, type: "tag", object: i3, format: "content" });
            })({ fs: e4, gitdir: n2, tag: i2 });
          } catch (t4) {
            throw t4.caller = "git.writeTag", t4;
          }
        }
        async function Bn({ fs: t3, dir: e3, gitdir: r2 = N(e3, ".git"), tree: i2 }) {
          try {
            Qt("fs", t3), Qt("gitdir", r2), Qt("tree", i2);
            const e4 = new Xt(t3), n2 = await te({ fsp: e4, dotgit: r2 });
            return await Se({ fs: e4, gitdir: n2, tree: i2 });
          } catch (t4) {
            throw t4.caller = "git.writeTree", t4;
          }
        }
        const $n = { Errors: t2, STAGE: P, TREE: Mt, WORKDIR: Nt, add: le, abortMerge: re, addNote: $e, addRemote: Ue, annotatedTag: Te, branch: Ce, cherryPick: ir, checkout: Le, clone: Fr, commit: Lr, getConfig: oi, getConfigAll: si, setConfig: en, currentBranch: Hr, deleteBranch: Gr, deleteRef: Wr, deleteRemote: qr, deleteTag: Zr, expandOid: Vr, expandRef: Yr, fastForward: ei, fetch: ri, findMergeBase: ii, findRoot: ai, getRemoteInfo: ci, getRemoteInfo2: li, hashBlob: di, indexPack: ui, init: hi, isDescendent: wi, isIgnored: mi, listBranches: yi, listFiles: vi, listNotes: xi, listRefs: ki, listRemotes: Ei, listServerRefs: Ai, listTags: Si, log: Ii, merge: Oi, packObjects: Ti, pull: Ci, push: zi, readBlob: Hi, readCommit: Gi, readNote: Wi, readObject: qi, readTag: Zi, readTree: Ki, remove: Vi, removeNote: Yi, renameBranch: Xi, resetIndex: Qi, updateIndex: bn, resolveRef: tn, status: gn, statusMatrix: mn, tag: yn, version: _n, walk: vn, writeBlob: xn, writeCommit: kn, writeObject: En, writeRef: An, writeTag: Sn, writeTree: Bn, stash: pn };
      })(), i;
    })());
  }
});

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SimpleGitSyncPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_BRANCH = "master";
var DEFAULT_GIT_NAME = "1";
var DEFAULT_GIT_EMAIL = "1";
var LOG_CLEAR_INTERVAL_MS = 2 * 60 * 1e3;
var LICENSE_CACHE_MS = 12 * 60 * 60 * 1e3;
var LICENSE_OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1e3;
var MOBILE_GIT_RECOMMENDED_MAX_RESPONSE_BYTES = 24 * 1024 * 1024;
var DEFAULT_LICENSE_SERVER_URL = "https://simple-git-sync-license.goodsync.workers.dev";
var GOODSYNC_GITIGNORE_HEADER = "# GoodSync generated ignore rules";
var GOODSYNC_GITIGNORE_RULES = [
  ".obsidian/",
  ".claudian/",
  ".claude/",
  ".uploads/",
  ".DS_Store",
  ".trash/",
  ".codex/"
];
var INITIAL_COMMIT_MESSAGE = "1";
var DEFAULT_SETTINGS = {
  licenseServerUrl: DEFAULT_LICENSE_SERVER_URL,
  phone: "",
  licenseCode: "",
  deviceId: "",
  licenseOk: false,
  licenseCheckedAt: 0,
  licenseExpiresAt: null,
  licenseMessage: "\u7B49\u5F85\u6388\u6743",
  remoteUrl: "",
  gitAuthMode: "none",
  gitUsername: "",
  gitToken: "",
  commandText: "git status",
  showAdvanced: false,
  lastStatus: "",
  autoSyncEnabled: false,
  autoSyncIntervalUnits: 6,
  showAutoSyncNotice: false,
  syncOnStartup: true
};
var cachedGit = null;
async function loadGit() {
  if (!cachedGit) {
    await Promise.resolve().then(() => (init_buffer_shim(), buffer_shim_exports));
    cachedGit = await Promise.resolve().then(() => __toESM(require_index_umd_min()));
  }
  return cachedGit;
}
var SimpleGitSyncPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings");
    __publicField(this, "details", []);
    __publicField(this, "statusBarEl");
    __publicField(this, "gitAvailable", false);
    __publicField(this, "operationInProgress", false);
    __publicField(this, "autoSyncTimer", null);
    __publicField(this, "logClearTimer", null);
  }
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    await this.ensureDeviceId();
    this.statusBarEl = this.addStatusBarItem();
    this.setStatus("\u6B63\u5728\u68C0\u6D4B Git...");
    this.addRibbonIcon("git-branch", "\u4E00\u952E\u540C\u6B65", () => {
      void this.syncRepository();
    });
    this.addCommand({
      id: "sync-repository",
      name: "\u4E00\u952E\u540C\u6B65",
      callback: () => void this.syncRepository()
    });
    this.addCommand({
      id: "init-repository",
      name: "\u521D\u59CB\u5316\u4ED3\u5E93",
      callback: () => void this.initRepository()
    });
    this.addCommand({
      id: "pull-changes",
      name: "Pull \u62C9\u53D6",
      callback: () => void this.pullChanges()
    });
    this.addCommand({
      id: "commit-and-push",
      name: "Commit + Push \u63A8\u9001",
      callback: () => void this.commitAndPush()
    });
    this.addCommand({
      id: "show-details",
      name: "\u67E5\u770B\u8BE6\u7EC6\u65E5\u5FD7",
      callback: () => this.showDetails()
    });
    this.addSettingTab(new SimpleGitSyncSettingTab(this.app, this));
    await this.checkGitOnStartup();
    this.scheduleStartupSync();
    this.rescheduleAutoSync();
    this.startLogAutoClear();
  }
  onunload() {
    this.stopAutoSync();
    this.stopLogAutoClear();
  }
  async checkGitOnStartup() {
    if (!import_obsidian.Platform.isDesktopApp) {
      this.gitAvailable = false;
      this.setStatus("\u79FB\u52A8\u7AEF\uFF1A\u4F7F\u7528\u5185\u7F6E isomorphic-git");
      this.appendDetail("\u79FB\u52A8\u7AEF\u6CA1\u6709\u7CFB\u7EDF Git\uFF0C\u5C06\u4F7F\u7528\u5185\u7F6E isomorphic-git \u5F15\u64CE\u3002\n");
      return;
    }
    try {
      const result = await this.runCommand(["git", "--version"], this.getVaultPath(), {
        echoStatus: false
      });
      this.gitAvailable = true;
      const version = result.stdout.trim() || "git \u5DF2\u5B89\u88C5";
      this.setStatus(`Git \u73AF\u5883\u6B63\u5E38\uFF1A${version}`);
      this.appendDetail(`\u542F\u52A8\u68C0\u6D4B\uFF1A${version}
`);
    } catch (error) {
      this.gitAvailable = false;
      this.setStatus("\u672A\u68C0\u6D4B\u5230 Git");
      this.appendDetail(`\u542F\u52A8\u68C0\u6D4B\u5931\u8D25\uFF1A${this.errorMessage(error)}
`);
      new import_obsidian.Notice("\u672A\u68C0\u6D4B\u5230 Git\uFF0C\u8BF7\u5148\u5B89\u88C5 Git for Windows \u6216 macOS Git\u3002");
    }
  }
  async initRepository() {
    await this.runOperation("\u521D\u59CB\u5316\u4ED3\u5E93", async () => {
      if (this.useNativeGit()) {
        const cwd = this.getVaultPath();
        await this.applyGlobalGitConfig(cwd);
        try {
          await this.runGit(["init", "-b", DEFAULT_BRANCH], cwd);
        } catch (e) {
          await this.runGit(["init"], cwd);
        }
        await this.ensureMasterBranch(cwd);
        await this.configureRemote(cwd, false);
        await this.createInitialNativeIgnoreCommit(cwd);
        return;
      }
      await this.initIsomorphicRepository(false);
      await this.createInitialIsomorphicIgnoreCommit();
    });
  }
  async pullChanges() {
    await this.runOperation("Pull \u62C9\u53D6", async () => {
      if (this.useNativeGit()) {
        const cwd = this.requireGitVault();
        await this.applyGlobalGitConfig(cwd);
        await this.ensureMasterBranch(cwd);
        await this.configureRemote(cwd, true);
        await this.runGit(["pull", "--rebase", "--autostash", "origin", DEFAULT_BRANCH], cwd);
        return;
      }
      await this.pullIsomorphicChanges();
    });
  }
  async commitAndPush() {
    await this.runOperation("Commit + Push \u63A8\u9001", async () => {
      if (this.useNativeGit()) {
        const cwd = this.requireGitVault();
        await this.applyGlobalGitConfig(cwd);
        await this.ensureMasterBranch(cwd);
        await this.configureRemote(cwd, true);
        await this.runGit(["add", "-A"], cwd);
        const status = await this.runGit(["status", "--porcelain"], cwd);
        if (status.stdout.trim()) {
          await this.runGit(["commit", "-m", this.getCommitMessage()], cwd);
        } else {
          this.appendDetail("\u6CA1\u6709\u68C0\u6D4B\u5230\u6587\u4EF6\u6539\u52A8\uFF0C\u8DF3\u8FC7 commit\u3002\n");
        }
        await this.runGit(["push", "-u", "origin", DEFAULT_BRANCH], cwd);
        return;
      }
      await this.commitAndPushIsomorphic(false);
    });
  }
  async syncRepository(showNotice = true) {
    await this.runOperation("\u4E00\u952E\u540C\u6B65", async () => {
      if (this.useNativeGit()) {
        const cwd = this.requireGitVault();
        await this.applyGlobalGitConfig(cwd);
        await this.ensureMasterBranch(cwd);
        await this.configureRemote(cwd, true);
        await this.runGit(["pull", "--rebase", "--autostash", "origin", DEFAULT_BRANCH], cwd);
        await this.runGit(["add", "-A"], cwd);
        const status = await this.runGit(["status", "--porcelain"], cwd);
        if (status.stdout.trim()) {
          await this.runGit(["commit", "-m", this.getCommitMessage()], cwd);
        } else {
          this.appendDetail("\u6CA1\u6709\u68C0\u6D4B\u5230\u6587\u4EF6\u6539\u52A8\uFF0C\u8DF3\u8FC7 commit\u3002\n");
        }
        await this.runGit(["push", "-u", "origin", DEFAULT_BRANCH], cwd);
        return;
      }
      await this.pullIsomorphicChanges();
      await this.commitAndPushIsomorphic(false);
    }, true, showNotice);
  }
  async forcePushRemote() {
    const confirmed = await ConfirmModal.open(
      this.app,
      "\u5F3A\u5236\u8986\u76D6\u8FDC\u7A0B\u4ED3\u5E93",
      "\u8FD9\u4E2A\u64CD\u4F5C\u4F1A\u4EE5\u5F53\u524D\u8BBE\u5907\u4E0A\u7684\u6587\u4EF6\u4E3A\u51C6\uFF0C\u5F3A\u5236\u8986\u76D6\u8FDC\u7A0B master \u5206\u652F\u3002\u8FDC\u7A0B\u4ED3\u5E93\u4E2D\u672C\u673A\u6CA1\u6709\u7684\u5185\u5BB9\u53EF\u80FD\u4F1A\u4E22\u5931\u3002\u786E\u5B9A\u7EE7\u7EED\u5417\uFF1F"
    );
    if (!confirmed) {
      return;
    }
    await this.runOperation("\u5F3A\u5236\u8986\u76D6\u8FDC\u7A0B\u4ED3\u5E93", async () => {
      if (!this.useNativeGit()) {
        await this.commitAndPushIsomorphic(true);
        return;
      }
      const cwd = this.requireGitVault();
      await this.applyGlobalGitConfig(cwd);
      await this.ensureMasterBranch(cwd);
      await this.configureRemote(cwd, true);
      await this.runGit(["add", "-A"], cwd);
      const status = await this.runGit(["status", "--porcelain"], cwd);
      if (status.stdout.trim()) {
        await this.runGit(["commit", "-m", this.getCommitMessage()], cwd);
      } else {
        this.appendDetail("\u6CA1\u6709\u68C0\u6D4B\u5230\u6587\u4EF6\u6539\u52A8\uFF0C\u8DF3\u8FC7 commit\u3002\n");
      }
      await this.runGit(["push", "--force", "origin", DEFAULT_BRANCH], cwd);
    });
  }
  async forcePullOverwriteLocal() {
    const confirmed = await ConfirmModal.open(
      this.app,
      "\u5F3A\u5236\u62C9\u53D6\u8986\u76D6\u672C\u5730",
      "\u8FD9\u4E2A\u64CD\u4F5C\u4F1A\u4EE5\u8FDC\u7A0B\u4ED3\u5E93\u4E3A\u51C6\uFF0C\u4E22\u5F03\u5F53\u524D\u8BBE\u5907\u4E0A\u7684\u672A\u63D0\u4EA4\u6539\u52A8\uFF0C\u5E76\u5220\u9664\u672A\u8DDF\u8E2A\u6587\u4EF6\u3002\u786E\u5B9A\u7EE7\u7EED\u5417\uFF1F"
    );
    if (!confirmed) {
      return;
    }
    await this.runOperation("\u5F3A\u5236\u62C9\u53D6\u8986\u76D6\u672C\u5730", async () => {
      if (!this.useNativeGit()) {
        await this.forcePullIsomorphicOverwriteLocal();
        return;
      }
      const cwd = this.requireGitVault();
      await this.applyGlobalGitConfig(cwd);
      await this.ensureMasterBranch(cwd);
      await this.configureRemote(cwd, true);
      await this.runGit(["fetch", "origin", DEFAULT_BRANCH], cwd);
      await this.runGit(["reset", "--hard", `origin/${DEFAULT_BRANCH}`], cwd);
      await this.runGit(["clean", "-fd"], cwd);
    });
  }
  async runManualCommand(commandText) {
    if (!this.useNativeGit()) {
      this.appendDetail("\u79FB\u52A8\u7AEF\u4E0D\u652F\u6301\u6267\u884C\u7CFB\u7EDF\u547D\u4EE4\uFF0C\u8BF7\u4F7F\u7528\u4E0A\u65B9\u540C\u6B65\u6309\u94AE\u3002\n");
      this.setStatus("\u79FB\u52A8\u7AEF\u4E0D\u652F\u6301\u624B\u52A8\u7CFB\u7EDF\u547D\u4EE4");
      new import_obsidian.Notice("\u79FB\u52A8\u7AEF\u4E0D\u652F\u6301\u624B\u52A8\u7CFB\u7EDF\u547D\u4EE4\uFF0C\u8BF7\u4F7F\u7528\u540C\u6B65\u6309\u94AE\u3002");
      return;
    }
    const command = this.parseManualCommand(commandText);
    await this.runOperation("\u624B\u52A8\u547D\u4EE4", async () => {
      const cwd = this.getVaultPath();
      const result = await this.runCommand(command, cwd, { echoStatus: true });
      if (!result.stdout.trim() && !result.stderr.trim()) {
        this.setStatus("\u547D\u4EE4\u6267\u884C\u5B8C\u6210\uFF0C\u6CA1\u6709\u8F93\u51FA\u5185\u5BB9\u3002");
      }
    }, false);
  }
  async runIsomorphicGitProbe() {
    if (this.operationInProgress) {
      new import_obsidian.Notice("\u5DF2\u6709\u540C\u6B65\u64CD\u4F5C\u6B63\u5728\u6267\u884C\uFF0C\u8BF7\u7A0D\u540E\u3002");
      return;
    }
    this.operationInProgress = true;
    this.setStatus("\u6B63\u5728\u6267\u884C isomorphic-git \u6280\u672F\u9A8C\u8BC1...");
    this.appendDetail("\n=== isomorphic-git \u6280\u672F\u9A8C\u8BC1\u5F00\u59CB ===\n");
    try {
      const git = await loadGit();
      const fs = createObsidianFs(this.app.vault.adapter);
      await git.init({
        fs,
        dir: "/",
        defaultBranch: DEFAULT_BRANCH
      });
      await git.setConfig({
        fs,
        dir: "/",
        path: "user.name",
        value: DEFAULT_GIT_NAME
      });
      await git.setConfig({
        fs,
        dir: "/",
        path: "user.email",
        value: DEFAULT_GIT_EMAIL
      });
      await this.ensureIsomorphicMasterBranch(fs);
      const currentBranch = await git.currentBranch({
        fs,
        dir: "/",
        fullname: false,
        test: true
      });
      this.appendDetail(`isomorphic-git init/config \u6210\u529F\u3002\u5F53\u524D\u5206\u652F\uFF1A${currentBranch || DEFAULT_BRANCH}\u3002
`);
      this.appendDetail("=== isomorphic-git \u6280\u672F\u9A8C\u8BC1\u7ED3\u675F ===\n");
      this.setStatus("\u79FB\u52A8\u7AEF Git \u9A8C\u8BC1\u6210\u529F \u221A");
      new import_obsidian.Notice("isomorphic-git \u6280\u672F\u9A8C\u8BC1\u6210\u529F");
    } catch (error) {
      const message = this.errorMessage(error);
      this.appendDetail(`isomorphic-git \u6280\u672F\u9A8C\u8BC1\u5931\u8D25\uFF1A${message}
`);
      this.setStatus("\u79FB\u52A8\u7AEF Git \u9A8C\u8BC1\u5931\u8D25");
      new import_obsidian.Notice(`\u79FB\u52A8\u7AEF Git \u9A8C\u8BC1\u5931\u8D25\uFF1A${message}`, 1e4);
    } finally {
      this.operationInProgress = false;
    }
  }
  async runPublicRemoteFetchProbe() {
    const remote = this.settings.remoteUrl.trim();
    if (!remote) {
      new import_obsidian.Notice("\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u91CC\u586B\u5199\u516C\u5F00\u4ED3\u5E93\u7684 HTTPS URL\u3002");
      this.setStatus("\u7B49\u5F85\u586B\u5199\u8FDC\u7A0B\u4ED3\u5E93 URL");
      return;
    }
    if (!/^https?:\/\//i.test(remote)) {
      new import_obsidian.Notice("\u79FB\u52A8\u7AEF\u516C\u5F00\u4ED3\u5E93\u9A8C\u8BC1\u53EA\u652F\u6301 HTTPS URL\u3002");
      this.setStatus("\u8FDC\u7A0B\u4ED3\u5E93 URL \u4E0D\u662F HTTPS");
      return;
    }
    if (this.operationInProgress) {
      new import_obsidian.Notice("\u5DF2\u6709\u540C\u6B65\u64CD\u4F5C\u6B63\u5728\u6267\u884C\uFF0C\u8BF7\u7A0D\u540E\u3002");
      return;
    }
    this.operationInProgress = true;
    this.setStatus("\u6B63\u5728\u9A8C\u8BC1\u516C\u5F00\u4ED3\u5E93 Fetch...");
    this.appendDetail("\n=== \u516C\u5F00\u4ED3\u5E93 Fetch \u9A8C\u8BC1\u5F00\u59CB ===\n");
    this.appendDetail("\u672C\u9A8C\u8BC1\u4F7F\u7528\u5185\u7F6E isomorphic-git\uFF0C\u4E0D\u8C03\u7528\u7CFB\u7EDF Git\uFF0C\u4E0D\u4F7F\u7528\u7528\u6237\u540D\u3001\u5BC6\u7801\u6216 Token\u3002\n");
    this.appendDetail(`\u79FB\u52A8\u7AEF\u5EFA\u8BAE\u4ED3\u5E93\u54CD\u5E94\u4E0D\u8D85\u8FC7 ${formatBytes(MOBILE_GIT_RECOMMENDED_MAX_RESPONSE_BYTES)}\uFF1B\u66F4\u5927\u7684\u4ED3\u5E93\u53EF\u80FD\u5BFC\u81F4 Obsidian \u95EA\u9000\u3002
`);
    try {
      const git = await loadGit();
      const fs = createObsidianFs(this.app.vault.adapter);
      await git.init({
        fs,
        dir: "/",
        defaultBranch: DEFAULT_BRANCH
      });
      await this.ensureIsomorphicMasterBranch(fs);
      await this.configureIsomorphicRemote(fs, true);
      const result = await git.fetch({
        fs,
        http: createObsidianHttp(),
        dir: "/",
        url: remote,
        ref: DEFAULT_BRANCH,
        singleBranch: true,
        depth: 1,
        tags: false
      });
      this.appendDetail(`\u516C\u5F00\u4ED3\u5E93 Fetch \u6210\u529F\u3002fetchHead\uFF1A${result.fetchHead || "\u65E0"}\u3002
`);
      this.appendDetail("=== \u516C\u5F00\u4ED3\u5E93 Fetch \u9A8C\u8BC1\u7ED3\u675F ===\n");
      this.setStatus("\u516C\u5F00\u4ED3\u5E93 Fetch \u9A8C\u8BC1\u6210\u529F \u221A");
      new import_obsidian.Notice("\u516C\u5F00\u4ED3\u5E93 Fetch \u9A8C\u8BC1\u6210\u529F");
    } catch (error) {
      const message = this.errorMessage(error);
      this.appendDetail(`\u516C\u5F00\u4ED3\u5E93 Fetch \u9A8C\u8BC1\u5931\u8D25\uFF1A${message}
`);
      this.setStatus("\u516C\u5F00\u4ED3\u5E93 Fetch \u9A8C\u8BC1\u5931\u8D25");
      new import_obsidian.Notice(`\u516C\u5F00\u4ED3\u5E93 Fetch \u9A8C\u8BC1\u5931\u8D25\uFF1A${message}`, 1e4);
    } finally {
      this.operationInProgress = false;
    }
  }
  async runRemoteAccessProbe(forPush) {
    const remote = this.settings.remoteUrl.trim();
    if (!remote) {
      new import_obsidian.Notice("\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u91CC\u586B\u5199\u8FDC\u7A0B\u4ED3\u5E93 URL\u3002");
      this.setStatus("\u7B49\u5F85\u586B\u5199\u8FDC\u7A0B\u4ED3\u5E93 URL");
      return;
    }
    if (!/^https?:\/\//i.test(remote)) {
      new import_obsidian.Notice("\u4ED3\u5E93\u8BBF\u95EE\u9A8C\u8BC1\u53EA\u652F\u6301 HTTPS URL\u3002");
      this.setStatus("\u8FDC\u7A0B\u4ED3\u5E93 URL \u4E0D\u662F HTTPS");
      return;
    }
    if (this.operationInProgress) {
      new import_obsidian.Notice("\u5DF2\u6709\u540C\u6B65\u64CD\u4F5C\u6B63\u5728\u6267\u884C\uFF0C\u8BF7\u7A0D\u540E\u3002");
      return;
    }
    const title = forPush ? "\u63A8\u9001\u6743\u9650\u9A8C\u8BC1" : "\u4ED3\u5E93\u8BFB\u53D6\u9A8C\u8BC1";
    this.operationInProgress = true;
    this.setStatus(`\u6B63\u5728\u6267\u884C${title}...`);
    this.appendDetail(`
=== ${title} \u5F00\u59CB ===
`);
    this.appendDetail(`\u8BA4\u8BC1\u65B9\u5F0F\uFF1A${this.getAuthModeLabel()}\u3002
`);
    try {
      const git = await loadGit();
      const info = await git.getRemoteInfo({
        http: createObsidianHttp(),
        url: remote,
        forPush,
        onAuth: this.getIsoAuthCallback(),
        onAuthFailure: this.getIsoAuthFailureCallback()
      });
      const refs = Array.isArray(info.refs) ? info.refs.length : 0;
      this.appendDetail(`${title}\u6210\u529F\u3002\u8FDC\u7A0B refs \u6570\u91CF\uFF1A${refs}\u3002
`);
      this.appendDetail(`=== ${title} \u7ED3\u675F ===
`);
      this.setStatus(`${title}\u6210\u529F \u221A`);
      new import_obsidian.Notice(`${title}\u6210\u529F`);
    } catch (error) {
      const message = this.errorMessage(error);
      this.appendDetail(`${title}\u5931\u8D25\uFF1A${message}
`);
      this.setStatus(`${title}\u5931\u8D25`);
      new import_obsidian.Notice(`${title}\u5931\u8D25\uFF1A${message}`, 1e4);
    } finally {
      this.operationInProgress = false;
    }
  }
  scheduleStartupSync() {
    if (!this.settings.syncOnStartup || !this.canUseGitEngine() || !this.settings.remoteUrl.trim()) {
      return;
    }
    const startupDelayMs = import_obsidian.Platform.isMobileApp ? 4e3 : 1200;
    window.setTimeout(() => {
      void this.syncRepository(this.settings.showAutoSyncNotice);
    }, startupDelayMs);
  }
  rescheduleAutoSync() {
    this.stopAutoSync();
    if (!this.settings.autoSyncEnabled) {
      return;
    }
    const intervalMs = this.getAutoSyncIntervalMs();
    this.autoSyncTimer = window.setInterval(() => {
      if (!this.canUseGitEngine() || !this.settings.remoteUrl.trim()) {
        return;
      }
      void this.syncRepository(this.settings.showAutoSyncNotice);
    }, intervalMs);
    this.registerInterval(this.autoSyncTimer);
    this.appendDetail(`\u81EA\u52A8\u540C\u6B65\u5DF2\u5F00\u542F\uFF0C\u95F4\u9694 ${intervalMs / 1e3} \u79D2\u3002
`);
  }
  stopAutoSync() {
    if (this.autoSyncTimer !== null) {
      window.clearInterval(this.autoSyncTimer);
      this.autoSyncTimer = null;
    }
  }
  startLogAutoClear() {
    this.stopLogAutoClear();
    this.logClearTimer = window.setInterval(() => {
      this.details = [];
    }, LOG_CLEAR_INTERVAL_MS);
    this.registerInterval(this.logClearTimer);
  }
  stopLogAutoClear() {
    if (this.logClearTimer !== null) {
      window.clearInterval(this.logClearTimer);
      this.logClearTimer = null;
    }
  }
  getAutoSyncIntervalMs() {
    const units = Math.max(1, Math.floor(Number(this.settings.autoSyncIntervalUnits) || 1));
    return units * 10 * 1e3;
  }
  useNativeGit() {
    return import_obsidian.Platform.isDesktopApp && this.gitAvailable;
  }
  canUseGitEngine() {
    return this.useNativeGit() || !import_obsidian.Platform.isDesktopApp;
  }
  async initIsomorphicRepository(requireRemote) {
    const git = await loadGit();
    const fs = createObsidianFs(this.app.vault.adapter);
    await git.init({ fs, dir: "/", defaultBranch: DEFAULT_BRANCH });
    await git.setConfig({ fs, dir: "/", path: "user.name", value: DEFAULT_GIT_NAME });
    await git.setConfig({ fs, dir: "/", path: "user.email", value: DEFAULT_GIT_EMAIL });
    await this.ensureIsomorphicMasterBranch(fs);
    await this.ensureVaultGitignore();
    await this.configureIsomorphicRemote(fs, requireRemote);
    this.appendDetail("isomorphic-git \u521D\u59CB\u5316\u5B8C\u6210\u3002\n");
  }
  async ensureIsomorphicMasterBranch(fs) {
    const git = await loadGit();
    try {
      const currentBranch = await git.currentBranch({
        fs,
        dir: "/",
        fullname: false,
        test: true
      });
      if (currentBranch === DEFAULT_BRANCH) {
        return;
      }
      await git.checkout({
        fs,
        dir: "/",
        ref: DEFAULT_BRANCH,
        force: true
      });
    } catch (e) {
      await git.branch({
        fs,
        dir: "/",
        ref: DEFAULT_BRANCH,
        checkout: true,
        force: true
      });
    }
  }
  async configureIsomorphicRemote(fs, required) {
    const git = await loadGit();
    const remote = this.settings.remoteUrl.trim();
    if (!remote) {
      if (required) {
        throw new Error("\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u91CC\u586B\u5199\u8FDC\u7A0B\u4ED3\u5E93 URL\u3002");
      }
      this.appendDetail("\u672A\u586B\u5199\u8FDC\u7A0B\u4ED3\u5E93 URL\uFF0C\u8DF3\u8FC7 isomorphic-git remote \u914D\u7F6E\u3002\n");
      return;
    }
    if (!/^https?:\/\//i.test(remote)) {
      throw new Error("\u79FB\u52A8\u7AEF\u5185\u7F6E Git \u76EE\u524D\u53EA\u652F\u6301 HTTPS \u4ED3\u5E93 URL\uFF0C\u8BF7\u4E0D\u8981\u4F7F\u7528 git@ \u6216 ssh:// \u5730\u5740\u3002");
    }
    await git.addRemote({
      fs,
      dir: "/",
      remote: "origin",
      url: remote,
      force: true
    });
  }
  async pullIsomorphicChanges() {
    const git = await loadGit();
    const fs = createObsidianFs(this.app.vault.adapter);
    await this.initIsomorphicRepository(true);
    if (import_obsidian.Platform.isMobileApp) {
      await git.fetch({
        fs,
        http: createObsidianHttp(),
        dir: "/",
        url: this.settings.remoteUrl.trim(),
        ref: DEFAULT_BRANCH,
        singleBranch: true,
        depth: 1,
        tags: false,
        onAuth: this.getIsoAuthCallback(),
        onAuthFailure: this.getIsoAuthFailureCallback()
      });
      await git.checkout({
        fs,
        dir: "/",
        ref: DEFAULT_BRANCH,
        remote: "origin",
        force: false,
        track: true
      });
      this.appendDetail("isomorphic-git \u79FB\u52A8\u7AEF\u6D45\u62C9\u53D6\u5B8C\u6210\u3002\n");
      return;
    }
    await git.pull({
      fs,
      http: createObsidianHttp(),
      dir: "/",
      url: this.settings.remoteUrl.trim(),
      ref: DEFAULT_BRANCH,
      singleBranch: true,
      fastForwardOnly: false,
      author: this.getIsoAuthor(),
      onAuth: this.getIsoAuthCallback(),
      onAuthFailure: this.getIsoAuthFailureCallback()
    });
    this.appendDetail("isomorphic-git pull \u5B8C\u6210\u3002\n");
  }
  async commitAndPushIsomorphic(force) {
    const git = await loadGit();
    const fs = createObsidianFs(this.app.vault.adapter);
    await this.initIsomorphicRepository(true);
    const changedCount = await this.stageAllIsomorphicChanges(fs);
    if (changedCount > 0) {
      await git.commit({
        fs,
        dir: "/",
        message: this.getCommitMessage(),
        author: this.getIsoAuthor(),
        committer: this.getIsoAuthor()
      });
      this.appendDetail(`isomorphic-git commit \u5B8C\u6210\uFF0C\u53D8\u66F4\u6587\u4EF6\u6570\uFF1A${changedCount}\u3002
`);
    } else {
      this.appendDetail("\u6CA1\u6709\u68C0\u6D4B\u5230\u6587\u4EF6\u6539\u52A8\uFF0C\u8DF3\u8FC7 isomorphic-git commit\u3002\n");
    }
    const result = await git.push({
      fs,
      http: createObsidianHttp(),
      dir: "/",
      url: this.settings.remoteUrl.trim(),
      ref: DEFAULT_BRANCH,
      remoteRef: DEFAULT_BRANCH,
      force,
      onAuth: this.getIsoAuthCallback(),
      onAuthFailure: this.getIsoAuthFailureCallback()
    });
    if (!result.ok) {
      throw new Error(result.error || "isomorphic-git push \u5931\u8D25\u3002");
    }
    this.appendDetail("isomorphic-git push \u5B8C\u6210\u3002\n");
  }
  async forcePullIsomorphicOverwriteLocal() {
    const git = await loadGit();
    const fs = createObsidianFs(this.app.vault.adapter);
    await this.initIsomorphicRepository(true);
    await git.fetch({
      fs,
      http: createObsidianHttp(),
      dir: "/",
      url: this.settings.remoteUrl.trim(),
      ref: DEFAULT_BRANCH,
      singleBranch: true,
      depth: import_obsidian.Platform.isMobileApp ? 1 : void 0,
      tags: false,
      onAuth: this.getIsoAuthCallback(),
      onAuthFailure: this.getIsoAuthFailureCallback()
    });
    await git.checkout({
      fs,
      dir: "/",
      ref: DEFAULT_BRANCH,
      remote: "origin",
      force: true,
      track: true
    });
    this.appendDetail("isomorphic-git \u5F3A\u5236\u62C9\u53D6\u8986\u76D6\u672C\u5730\u5B8C\u6210\u3002\n");
  }
  async stageAllIsomorphicChanges(fs) {
    const git = await loadGit();
    const matrix = await git.statusMatrix({ fs, dir: "/" });
    let changedCount = 0;
    for (const row of matrix) {
      const [filepath, head, workdir, stage] = row;
      if (filepath.startsWith(".git/")) {
        continue;
      }
      if (isGoodSyncIgnoredPath(filepath)) {
        if (head !== 0 || stage !== 0) {
          await git.remove({ fs, dir: "/", filepath });
          changedCount += 1;
        }
        continue;
      }
      if (head === workdir && workdir === stage) {
        continue;
      }
      changedCount += 1;
      if (workdir === 0) {
        await git.remove({ fs, dir: "/", filepath });
      } else {
        await git.add({ fs, dir: "/", filepath });
      }
    }
    return changedCount;
  }
  getIsoAuthor() {
    return {
      name: DEFAULT_GIT_NAME,
      email: DEFAULT_GIT_EMAIL
    };
  }
  getIsoAuthCallback() {
    if (this.settings.gitAuthMode === "none") {
      return () => ({});
    }
    return () => this.getIsoAuth();
  }
  getIsoAuthFailureCallback() {
    return async () => {
      new import_obsidian.Notice("Git \u8BA4\u8BC1\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\u8D26\u53F7\u5BC6\u7801\u6216 Token\u3002", 8e3);
      const result = await GitCredentialsModal.open(
        this.app,
        this.settings.gitUsername,
        this.settings.gitToken
      );
      if (!result) {
        return { cancel: true };
      }
      this.settings.gitUsername = result.username;
      this.settings.gitToken = result.secret;
      this.settings.gitAuthMode = result.username ? "account" : "token";
      await this.savePluginSettings();
      return this.getIsoAuth();
    };
  }
  getAuthModeLabel() {
    const labels = {
      none: "\u516C\u5F00\u4ED3\u5E93\uFF08\u4E0D\u4F7F\u7528\u8D26\u53F7\u5BC6\u7801\uFF09",
      account: "\u8D26\u53F7\u5BC6\u7801",
      token: "Token"
    };
    return labels[this.settings.gitAuthMode] || labels.none;
  }
  getIsoAuth() {
    const secret = this.settings.gitToken.trim();
    const username = this.settings.gitUsername.trim();
    if (this.settings.gitAuthMode === "account") {
      if (!username || !secret) {
        throw new Error("\u8D26\u53F7\u5BC6\u7801\u8BA4\u8BC1\u9700\u8981\u586B\u5199 Git \u7528\u6237\u540D\u548C Git \u5BC6\u7801\u3002");
      }
      return {
        username,
        password: secret
      };
    }
    if (!secret) {
      throw new Error("Token \u8BA4\u8BC1\u9700\u8981\u586B\u5199 Git Token\u3002");
    }
    if (!username) {
      return {
        username: secret
      };
    }
    return {
      username,
      password: secret
    };
  }
  async ensureDeviceId() {
    if (this.settings.deviceId) {
      return;
    }
    const random = Math.random().toString(36).slice(2);
    this.settings.deviceId = `obsidian-${Date.now().toString(36)}-${random}`;
    await this.savePluginSettings();
  }
  isLicenseCacheValid() {
    if (!this.settings.licenseOk || !this.settings.licenseCheckedAt) {
      return false;
    }
    if (Date.now() - this.settings.licenseCheckedAt > LICENSE_CACHE_MS) {
      return false;
    }
    if (this.settings.licenseExpiresAt && Date.now() > Date.parse(this.settings.licenseExpiresAt)) {
      return false;
    }
    return true;
  }
  canUseOfflineLicenseFallback() {
    if (!this.settings.licenseOk || !this.settings.licenseCheckedAt) {
      return false;
    }
    if (Date.now() - this.settings.licenseCheckedAt > LICENSE_OFFLINE_GRACE_MS) {
      return false;
    }
    if (this.settings.licenseExpiresAt && Date.now() > Date.parse(this.settings.licenseExpiresAt)) {
      return false;
    }
    return true;
  }
  async ensureAuthorized(showNotice = true) {
    if (this.isLicenseCacheValid()) {
      return true;
    }
    return this.verifyLicense(showNotice);
  }
  async verifyLicense(showNotice = true) {
    var _a, _b;
    const licenseServerUrl = this.settings.licenseServerUrl.trim().replace(/\/+$/, "");
    const phone = this.settings.phone.trim();
    const licenseCode = this.settings.licenseCode.trim();
    if (!licenseServerUrl || !phone || !licenseCode) {
      this.settings.licenseOk = false;
      this.settings.licenseMessage = "\u8BF7\u5148\u586B\u5199\u624B\u673A\u53F7\u548C\u6388\u6743\u7801";
      await this.savePluginSettings();
      this.setStatus("\u7B49\u5F85\u6388\u6743");
      if (showNotice) {
        new import_obsidian.Notice("\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u91CC\u586B\u5199\u624B\u673A\u53F7\u548C\u6388\u6743\u7801\u3002");
      }
      return false;
    }
    try {
      if (isStaticLicenseSource(licenseServerUrl)) {
        return await this.verifyStaticLicense(licenseServerUrl, phone, licenseCode, showNotice);
      }
      const response = await (0, import_obsidian.requestUrl)({
        url: `${licenseServerUrl}/verify-license`,
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          phone,
          licenseCode,
          deviceId: this.settings.deviceId
        })
      });
      const data = response.json;
      if (!data.ok) {
        this.settings.licenseOk = false;
        this.settings.licenseCheckedAt = Date.now();
        this.settings.licenseExpiresAt = null;
        this.settings.licenseMessage = this.formatLicenseReason(data.reason || "\u6388\u6743\u5931\u8D25");
        await this.savePluginSettings();
        this.setStatus(`\u6388\u6743\u5931\u8D25\uFF1A${this.settings.licenseMessage}`);
        if (showNotice) {
          new import_obsidian.Notice(`\u6388\u6743\u5931\u8D25\uFF1A${this.settings.licenseMessage}`, 8e3);
        }
        return false;
      }
      this.settings.licenseOk = true;
      this.settings.licenseCheckedAt = Date.now();
      this.settings.licenseExpiresAt = data.expiresAt || null;
      this.settings.licenseMessage = `\u6388\u6743\u901A\u8FC7\uFF0C\u8BBE\u5907 ${(_a = data.deviceCount) != null ? _a : 1}/${(_b = data.maxDevices) != null ? _b : 1}`;
      await this.savePluginSettings();
      this.setStatus(this.settings.licenseMessage);
      if (showNotice) {
        new import_obsidian.Notice("\u6388\u6743\u9A8C\u8BC1\u6210\u529F");
      }
      return true;
    } catch (error) {
      if (this.canUseOfflineLicenseFallback()) {
        this.settings.licenseMessage = `\u6388\u6743\u670D\u52A1\u5668\u6682\u65F6\u8FDE\u63A5\u5931\u8D25\uFF0C\u5DF2\u4F7F\u7528\u672C\u5730\u79BB\u7EBF\u6388\u6743\u7F13\u5B58\uFF1A${this.errorMessage(error)}`;
        await this.savePluginSettings();
        this.setStatus("\u5DF2\u4F7F\u7528\u79BB\u7EBF\u6388\u6743\u7F13\u5B58");
        if (showNotice) {
          new import_obsidian.Notice("\u6388\u6743\u670D\u52A1\u5668\u6682\u65F6\u4E0D\u53EF\u7528\uFF0C\u5DF2\u4F7F\u7528\u672C\u5730\u79BB\u7EBF\u6388\u6743\u7F13\u5B58\u3002", 8e3);
        }
        return true;
      }
      this.settings.licenseOk = false;
      this.settings.licenseMessage = `\u6388\u6743\u670D\u52A1\u5668\u8FDE\u63A5\u5931\u8D25\uFF1A${this.errorMessage(error)}\u3002\u8BF7\u6D4B\u8BD5\u670D\u52A1\u5668\u6216\u5728\u6D4F\u89C8\u5668\u6253\u5F00 /health\u3002`;
      await this.savePluginSettings();
      this.setStatus("\u6388\u6743\u670D\u52A1\u5668\u8FDE\u63A5\u5931\u8D25");
      if (showNotice) {
        new import_obsidian.Notice(this.settings.licenseMessage, 8e3);
      }
      return false;
    }
  }
  async verifyStaticLicense(licenseUrl, phone, licenseCode, showNotice) {
    const file = await this.fetchStaticLicenseFile(licenseUrl);
    const phoneHash = await sha256Hex(`${file.salt || ""}|phone|${normalizeLicensePhone(phone)}`);
    const licenseHash = await sha256Hex(
      `${file.salt || ""}|license|${normalizeLicensePhone(phone)}|${normalizeLicenseCode(licenseCode)}`
    );
    const record = file.licenses.find((item) => {
      if (item.phoneHash && normalizeHash(item.phoneHash) !== phoneHash) {
        return false;
      }
      return normalizeHash(item.licenseHash) === licenseHash;
    });
    if (!record) {
      this.settings.licenseOk = false;
      this.settings.licenseCheckedAt = Date.now();
      this.settings.licenseExpiresAt = null;
      this.settings.licenseMessage = this.formatLicenseReason("license_not_found");
      await this.savePluginSettings();
      this.setStatus(`\u6388\u6743\u5931\u8D25\uFF1A${this.settings.licenseMessage}`);
      if (showNotice) {
        new import_obsidian.Notice(`\u6388\u6743\u5931\u8D25\uFF1A${this.settings.licenseMessage}`, 8e3);
      }
      return false;
    }
    if (record.active === false) {
      this.settings.licenseOk = false;
      this.settings.licenseCheckedAt = Date.now();
      this.settings.licenseExpiresAt = null;
      this.settings.licenseMessage = this.formatLicenseReason("license_inactive");
      await this.savePluginSettings();
      this.setStatus(`\u6388\u6743\u5931\u8D25\uFF1A${this.settings.licenseMessage}`);
      if (showNotice) {
        new import_obsidian.Notice(`\u6388\u6743\u5931\u8D25\uFF1A${this.settings.licenseMessage}`, 8e3);
      }
      return false;
    }
    if (record.expiresAt && Date.now() > Date.parse(record.expiresAt)) {
      this.settings.licenseOk = false;
      this.settings.licenseCheckedAt = Date.now();
      this.settings.licenseExpiresAt = record.expiresAt;
      this.settings.licenseMessage = this.formatLicenseReason("license_expired");
      await this.savePluginSettings();
      this.setStatus(`\u6388\u6743\u5931\u8D25\uFF1A${this.settings.licenseMessage}`);
      if (showNotice) {
        new import_obsidian.Notice(`\u6388\u6743\u5931\u8D25\uFF1A${this.settings.licenseMessage}`, 8e3);
      }
      return false;
    }
    const maxDevices = Math.max(1, Number(record.maxDevices || 1));
    this.settings.licenseOk = true;
    this.settings.licenseCheckedAt = Date.now();
    this.settings.licenseExpiresAt = record.expiresAt || null;
    this.settings.licenseMessage = `\u9759\u6001\u6388\u6743\u901A\u8FC7\uFF1A\u6700\u591A\u8BBE\u5907 ${maxDevices}\uFF08\u9759\u6001\u6A21\u5F0F\u4E0D\u81EA\u52A8\u7ED1\u5B9A\u8BBE\u5907\uFF09`;
    await this.savePluginSettings();
    this.setStatus(this.settings.licenseMessage);
    if (showNotice) {
      new import_obsidian.Notice("\u6388\u6743\u9A8C\u8BC1\u6210\u529F");
    }
    return true;
  }
  async testLicenseServer(showNotice = true) {
    const licenseServerUrl = this.settings.licenseServerUrl.trim().replace(/\/+$/, "");
    if (!licenseServerUrl) {
      const message = "\u8BF7\u5148\u586B\u5199\u6388\u6743\u670D\u52A1\u5668 URL\u3002";
      this.settings.licenseMessage = message;
      await this.savePluginSettings();
      if (showNotice) {
        new import_obsidian.Notice(message);
      }
      return false;
    }
    try {
      if (isStaticLicenseSource(licenseServerUrl)) {
        const file = await this.fetchStaticLicenseFile(licenseServerUrl);
        this.settings.licenseMessage = `\u9759\u6001\u6388\u6743\u6587\u4EF6\u8FDE\u63A5\u6B63\u5E38\uFF1A${file.licenses.length} \u6761\u6388\u6743`;
        await this.savePluginSettings();
        if (showNotice) {
          new import_obsidian.Notice("\u9759\u6001\u6388\u6743\u6587\u4EF6\u8FDE\u63A5\u6B63\u5E38");
        }
        return true;
      }
      const response = await (0, import_obsidian.requestUrl)({
        url: `${licenseServerUrl}/health`,
        method: "GET"
      });
      const data = response.json;
      if (!data.ok) {
        this.settings.licenseMessage = "\u6388\u6743\u670D\u52A1\u5668\u54CD\u5E94\u5F02\u5E38";
        await this.savePluginSettings();
        if (showNotice) {
          new import_obsidian.Notice("\u6388\u6743\u670D\u52A1\u5668\u54CD\u5E94\u5F02\u5E38");
        }
        return false;
      }
      this.settings.licenseMessage = `\u6388\u6743\u670D\u52A1\u5668\u8FDE\u63A5\u6B63\u5E38\uFF1A${data.service || "online"}`;
      await this.savePluginSettings();
      if (showNotice) {
        new import_obsidian.Notice("\u6388\u6743\u670D\u52A1\u5668\u8FDE\u63A5\u6B63\u5E38");
      }
      return true;
    } catch (error) {
      this.settings.licenseMessage = `\u6388\u6743\u670D\u52A1\u5668\u4E0D\u53EF\u8FBE\uFF1A${this.errorMessage(error)}`;
      await this.savePluginSettings();
      if (showNotice) {
        new import_obsidian.Notice(this.settings.licenseMessage, 8e3);
      }
      return false;
    }
  }
  async fetchStaticLicenseFile(licenseUrl) {
    const response = await (0, import_obsidian.requestUrl)({
      url: licenseUrl,
      method: "GET"
    });
    const data = response.json;
    if (!data || !Array.isArray(data.licenses)) {
      throw new Error("\u9759\u6001\u6388\u6743\u6587\u4EF6\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u9700\u8981\u5305\u542B licenses \u6570\u7EC4\u3002");
    }
    return {
      version: Number(data.version || 1),
      service: String(data.service || "goodsync-static-license"),
      salt: String(data.salt || ""),
      licenses: data.licenses
    };
  }
  formatLicenseReason(reason) {
    const map = {
      missing_phone_or_license_code: "\u7F3A\u5C11\u624B\u673A\u53F7\u6216\u6388\u6743\u7801",
      license_not_found: "\u6CA1\u6709\u627E\u5230\u8FD9\u4E2A\u624B\u673A\u53F7\u7684\u6388\u6743",
      license_inactive: "\u6388\u6743\u5DF2\u505C\u7528",
      license_code_mismatch: "\u6388\u6743\u7801\u4E0D\u6B63\u786E",
      license_expired: "\u6388\u6743\u5DF2\u8FC7\u671F",
      device_limit_exceeded: "\u5DF2\u8D85\u8FC7\u53EF\u7ED1\u5B9A\u8BBE\u5907\u6570\u91CF"
    };
    return map[reason] || reason;
  }
  async runOperation(title, action, simpleSuccess = true, showNotice = true) {
    if (!this.canUseGitEngine()) {
      if (showNotice) {
        new import_obsidian.Notice("\u672A\u68C0\u6D4B\u5230 Git\uFF0C\u8BF7\u5148\u5B89\u88C5 Git\u3002");
      }
      this.setStatus("\u672A\u68C0\u6D4B\u5230 Git");
      return;
    }
    const authorized = await this.ensureAuthorized(showNotice);
    if (!authorized) {
      this.appendDetail(`${title}\u5DF2\u505C\u6B62\uFF1A\u6388\u6743\u672A\u901A\u8FC7\u3002
`);
      return;
    }
    if (this.operationInProgress) {
      this.appendDetail(`${title}\u5DF2\u8DF3\u8FC7\uFF1A\u5DF2\u6709\u64CD\u4F5C\u6B63\u5728\u6267\u884C\u3002
`);
      this.setStatus("\u5DF2\u6709\u540C\u6B65\u64CD\u4F5C\u6B63\u5728\u6267\u884C");
      if (showNotice) {
        new import_obsidian.Notice("\u5DF2\u6709\u540C\u6B65\u64CD\u4F5C\u6B63\u5728\u6267\u884C\uFF0C\u8BF7\u7A0D\u540E\u3002");
      }
      return;
    }
    this.operationInProgress = true;
    this.setStatus(`\u6B63\u5728\u6267\u884C${title}\uFF0C\u8BF7\u7A0D\u540E...`);
    this.appendDetail(`
=== ${title} \u5F00\u59CB ===
`);
    try {
      await action();
      this.setStatus(simpleSuccess ? `${title}\u6210\u529F \u221A` : `${title}\u6267\u884C\u5B8C\u6210`);
      this.appendDetail(`=== ${title} \u7ED3\u675F ===
`);
      if (showNotice) {
        new import_obsidian.Notice(simpleSuccess ? `${title}\u6210\u529F` : `${title}\u6267\u884C\u5B8C\u6210`);
      }
    } catch (error) {
      const message = this.errorMessage(error);
      this.setStatus(`${title}\u5931\u8D25\uFF0C\u8BF7\u67E5\u770B\u8BE6\u7EC6\u65E5\u5FD7`);
      this.appendDetail(`\u9519\u8BEF\uFF1A${message}
`);
      if (showNotice) {
        new import_obsidian.Notice(`${title}\u5931\u8D25\uFF1A${message}`, 8e3);
      }
    } finally {
      this.operationInProgress = false;
    }
  }
  async applyGlobalGitConfig(cwd) {
    await this.runGit(["config", "--global", "user.name", DEFAULT_GIT_NAME], cwd);
    await this.runGit(["config", "--global", "user.email", DEFAULT_GIT_EMAIL], cwd);
  }
  async ensureVaultGitignore() {
    const path = ".gitignore";
    const adapter = this.app.vault.adapter;
    const exists = await adapter.exists(path);
    const existing = exists ? await adapter.read(path) : "";
    const existingLines = new Set(existing.split(/\r?\n/).map((line) => line.trim()));
    const missingRules = GOODSYNC_GITIGNORE_RULES.filter((rule) => !existingLines.has(rule));
    if (exists && missingRules.length === 0) {
      this.appendDetail(".gitignore \u5DF2\u5B58\u5728\uFF0CGoodSync \u5FFD\u7565\u89C4\u5219\u65E0\u9700\u66F4\u65B0\u3002\n");
      return;
    }
    const nextParts = existing.trim() ? [existing.trimEnd(), "", GOODSYNC_GITIGNORE_HEADER, ...missingRules] : [GOODSYNC_GITIGNORE_HEADER, ...missingRules];
    const nextContent = nextParts.join("\n") + "\n";
    await adapter.write(path, nextContent);
    this.appendDetail(".gitignore \u5DF2\u5199\u5165 Vault \u6839\u76EE\u5F55\u3002\n");
  }
  async createInitialNativeIgnoreCommit(cwd) {
    await this.ensureVaultGitignore();
    await this.runGit(["rm", "-r", "--cached", "."], cwd, true);
    await this.runGit(["add", "."], cwd);
    const status = await this.runGit(["status", "--porcelain"], cwd);
    if (status.stdout.trim()) {
      await this.runGit(["commit", "-m", INITIAL_COMMIT_MESSAGE], cwd);
      this.appendDetail("\u521D\u59CB\u5316\u63D0\u4EA4\u5DF2\u5B8C\u6210\uFF1Agit commit -m 1\u3002\n");
      return;
    }
    this.appendDetail("\u521D\u59CB\u5316\u63D0\u4EA4\u8DF3\u8FC7\uFF1A\u6CA1\u6709\u9700\u8981\u63D0\u4EA4\u7684\u6587\u4EF6\u3002\n");
  }
  async createInitialIsomorphicIgnoreCommit() {
    const git = await loadGit();
    const fs = createObsidianFs(this.app.vault.adapter);
    const changedCount = await this.stageAllIsomorphicChanges(fs);
    if (changedCount > 0) {
      await git.commit({
        fs,
        dir: "/",
        message: INITIAL_COMMIT_MESSAGE,
        author: this.getIsoAuthor(),
        committer: this.getIsoAuthor()
      });
      this.appendDetail("\u79FB\u52A8\u7AEF\u521D\u59CB\u5316\u63D0\u4EA4\u5DF2\u5B8C\u6210\uFF1Acommit message = 1\u3002\n");
      return;
    }
    this.appendDetail("\u79FB\u52A8\u7AEF\u521D\u59CB\u5316\u63D0\u4EA4\u8DF3\u8FC7\uFF1A\u6CA1\u6709\u9700\u8981\u63D0\u4EA4\u7684\u6587\u4EF6\u3002\n");
  }
  async ensureMasterBranch(cwd) {
    const current = await this.runGit(["branch", "--show-current"], cwd, true);
    const currentBranch = current.stdout.trim();
    if (currentBranch && currentBranch !== DEFAULT_BRANCH) {
      await this.runGit(["branch", "-M", DEFAULT_BRANCH], cwd);
      return;
    }
    if (!currentBranch) {
      await this.runGit(["symbolic-ref", "HEAD", `refs/heads/${DEFAULT_BRANCH}`], cwd, true);
    }
  }
  async configureRemote(cwd, required) {
    const remote = this.settings.remoteUrl.trim();
    if (!remote) {
      if (required) {
        throw new Error("\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u91CC\u586B\u5199\u8FDC\u7A0B\u4ED3\u5E93 URL\u3002");
      }
      this.appendDetail("\u672A\u586B\u5199\u8FDC\u7A0B\u4ED3\u5E93 URL\uFF0C\u8DF3\u8FC7 remote origin \u914D\u7F6E\u3002\n");
      return;
    }
    const result = await this.runGit(["remote", "get-url", "origin"], cwd, true);
    if (result.stdout.trim()) {
      await this.runGit(["remote", "set-url", "origin", remote], cwd);
    } else {
      await this.runGit(["remote", "add", "origin", remote], cwd);
    }
  }
  async runGit(args, cwd, allowFailure = false) {
    return this.runCommand(["git", ...args], cwd, { allowFailure });
  }
  async runCommand(command, cwd, options = {}) {
    var _a, _b, _c, _d;
    if (!import_obsidian.Platform.isDesktopApp) {
      throw new Error("\u79FB\u52A8\u7AEF\u6CA1\u6709\u7CFB\u7EDF Git\uFF0C\u8BF7\u4F7F\u7528 isomorphic-git \u79FB\u52A8\u7AEF\u5F15\u64CE\u3002");
    }
    const commandLine = command.map((part) => part.includes(" ") ? `"${part}"` : part).join(" ");
    this.appendDetail(`$ ${commandLine}
`);
    try {
      const { execFile } = require("child_process");
      const result = await new Promise((resolve, reject) => {
        execFile(command[0], command.slice(1), { cwd, windowsHide: true }, (error, stdout2, stderr2) => {
          if (error) {
            reject(Object.assign(error, { stdout: stdout2, stderr: stderr2 }));
            return;
          }
          resolve({ stdout: stdout2, stderr: stderr2 });
        });
      });
      const stdout = (_a = result.stdout) != null ? _a : "";
      const stderr = (_b = result.stderr) != null ? _b : "";
      if (stdout) {
        this.appendDetail(stdout);
        if (options.echoStatus) {
          this.setStatus(stdout.trim() || "\u547D\u4EE4\u6267\u884C\u5B8C\u6210");
        }
      }
      if (stderr) {
        this.appendDetail(stderr);
        if (options.echoStatus) {
          this.setStatus(stderr.trim());
        }
      }
      return { stdout, stderr };
    } catch (error) {
      const execError = error;
      const stdout = (_c = execError.stdout) != null ? _c : "";
      const stderr = (_d = execError.stderr) != null ? _d : "";
      if (stdout) {
        this.appendDetail(stdout);
      }
      if (stderr) {
        this.appendDetail(stderr);
      }
      if (options.allowFailure) {
        return { stdout, stderr };
      }
      throw new Error(stderr.trim() || stdout.trim() || execError.message);
    }
  }
  parseManualCommand(commandText) {
    const command = commandText.trim().split(/\s+/).filter(Boolean);
    if (!command.length) {
      throw new Error("\u8BF7\u8F93\u5165\u8981\u6267\u884C\u7684 git \u547D\u4EE4\u3002");
    }
    if (command[0].toLowerCase() !== "git") {
      throw new Error("\u5F53\u524D\u63D2\u4EF6\u539F\u578B\u53EA\u5141\u8BB8\u624B\u52A8\u6267\u884C git \u547D\u4EE4\u3002");
    }
    return command;
  }
  getVaultPath() {
    var _a;
    const adapter = this.app.vault.adapter;
    const basePath = (_a = adapter.getBasePath) == null ? void 0 : _a.call(adapter);
    if (!basePath) {
      throw new Error("\u65E0\u6CD5\u83B7\u53D6\u5F53\u524D Vault \u8DEF\u5F84\u3002\u79FB\u52A8\u7AEF\u7248\u672C\u9700\u8981\u6539\u7528 isomorphic-git\u3002");
    }
    return basePath;
  }
  requireGitVault() {
    const cwd = this.getVaultPath();
    return cwd;
  }
  getCommitMessage() {
    const now = /* @__PURE__ */ new Date();
    const pad = (value) => String(value).padStart(2, "0");
    const formatted = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate())
    ].join("-") + " " + [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds())
    ].join(":");
    return `sync: ${formatted}`;
  }
  setStatus(message) {
    this.settings.lastStatus = message;
    this.statusBarEl.setText(`Git Sync: ${message}`);
  }
  appendDetail(message) {
    this.details.push(message);
    if (this.details.length > 400) {
      this.details = this.details.slice(-400);
    }
  }
  showDetails() {
    new DetailsModal(this.app, this.details.join("")).open();
  }
  errorMessage(error) {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
  async savePluginSettings() {
    await this.saveData(this.settings);
  }
};
var SimpleGitSyncSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    __publicField(this, "plugin");
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "GoodSync" });
    containerEl.createEl("h3", { text: "\u6388\u6743" });
    new import_obsidian.Setting(containerEl).setName("\u6388\u6743\u670D\u52A1\u5668").setDesc("\u9ED8\u8BA4\u4F7F\u7528\u4F60\u5DF2\u7ECF\u90E8\u7F72\u7684 Cloudflare Workers \u6388\u6743\u670D\u52A1").addText((text) => {
      text.setPlaceholder(DEFAULT_LICENSE_SERVER_URL).setValue(this.plugin.settings.licenseServerUrl).onChange(async (value) => {
        this.plugin.settings.licenseServerUrl = value.trim() || DEFAULT_LICENSE_SERVER_URL;
        this.plugin.settings.licenseOk = false;
        await this.plugin.savePluginSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u624B\u673A\u53F7").setDesc("\u9700\u8981\u5148\u5728\u6388\u6743\u670D\u52A1\u5668\u540E\u53F0\u767B\u8BB0").addText((text) => {
      text.setPlaceholder("\u8BF7\u8F93\u5165\u60A8\u7684\u7535\u8BDD\u53F7\u7801").setValue(this.plugin.settings.phone).onChange(async (value) => {
        this.plugin.settings.phone = value.trim();
        this.plugin.settings.licenseOk = false;
        await this.plugin.savePluginSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u6388\u6743\u7801").addText((text) => {
      text.setPlaceholder("\u8BF7\u8F93\u5165\u6388\u6743\u7801").setValue(this.plugin.settings.licenseCode).onChange(async (value) => {
        this.plugin.settings.licenseCode = value.trim();
        this.plugin.settings.licenseOk = false;
        await this.plugin.savePluginSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u6388\u6743\u72B6\u6001").setDesc(this.plugin.settings.licenseMessage || "\u7B49\u5F85\u6388\u6743").addButton((button) => {
      button.setButtonText("\u6D4B\u8BD5\u670D\u52A1\u5668").onClick(async () => {
        await this.plugin.testLicenseServer(true);
        this.display();
      });
    }).addButton((button) => {
      button.setButtonText("\u9A8C\u8BC1\u6388\u6743").onClick(async () => {
        await this.plugin.verifyLicense(true);
        this.display();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u8BBE\u5907 ID").setDesc("\u7528\u4E8E\u9650\u5236\u540C\u4E00\u4E2A\u6388\u6743\u6700\u591A\u7ED1\u5B9A\u51E0\u53F0\u8BBE\u5907").addText((text) => {
      text.setValue(this.plugin.settings.deviceId);
      text.inputEl.disabled = true;
    });
    containerEl.createEl("h3", { text: "\u4ED3\u5E93\u8BBE\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("\u8FDC\u7A0B\u4ED3\u5E93 URL").setDesc("\u4F8B\u5982 GitHub/Gitee/GitLab \u7684 HTTPS \u4ED3\u5E93\u5730\u5740\uFF1B\u79FB\u52A8\u7AEF\u4E0D\u652F\u6301 SSH \u5730\u5740").addText((text) => {
      text.setPlaceholder("https://github.com/user/repo.git").setValue(this.plugin.settings.remoteUrl).onChange(async (value) => {
        this.plugin.settings.remoteUrl = value.trim();
        await this.plugin.savePluginSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u8BA4\u8BC1\u65B9\u5F0F").setDesc("\u516C\u5F00\u4ED3\u5E93\u53EF\u4E0D\u586B\u8D26\u53F7\uFF1BGitee \u53EF\u4EE5\u5148\u5C1D\u8BD5\u8D26\u53F7\u5BC6\u7801\uFF1BGitHub \u901A\u5E38\u9700\u8981 Token").addDropdown((dropdown) => {
      dropdown.addOption("none", "\u516C\u5F00\u4ED3\u5E93").addOption("account", "\u8D26\u53F7\u5BC6\u7801").addOption("token", "Token").setValue(this.plugin.settings.gitAuthMode).onChange(async (value) => {
        this.plugin.settings.gitAuthMode = value;
        await this.plugin.savePluginSettings();
        this.display();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Git \u7528\u6237\u540D").setDesc("\u8D26\u53F7\u5BC6\u7801\u6A21\u5F0F\u5FC5\u586B\uFF1BToken \u6A21\u5F0F\u53EF\u7559\u7A7A").addText((text) => {
      text.setPlaceholder("GitHub/Gitee \u7528\u6237\u540D\uFF0C\u53EF\u7559\u7A7A").setValue(this.plugin.settings.gitUsername).onChange(async (value) => {
        this.plugin.settings.gitUsername = value.trim();
        await this.plugin.savePluginSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Git \u5BC6\u7801\u6216 Token").setDesc("\u8D26\u53F7\u5BC6\u7801\u6A21\u5F0F\u586B\u5199\u5BC6\u7801\uFF1BToken \u6A21\u5F0F\u586B\u5199 Personal Access Token").addText((text) => {
      text.inputEl.type = "password";
      text.setPlaceholder("\u5BC6\u7801\u6216 Personal Access Token").setValue(this.plugin.settings.gitToken).onChange(async (value) => {
        this.plugin.settings.gitToken = value.trim();
        await this.plugin.savePluginSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u83B7\u53D6 Token").setDesc("\u4E0D\u60F3\u5728\u624B\u673A\u4E0A\u627E\u5165\u53E3\u65F6\uFF0C\u53EF\u4EE5\u4ECE\u8FD9\u91CC\u6253\u5F00\u5E38\u7528\u5E73\u53F0\u7684 Token \u9875\u9762").addButton((button) => {
      button.setButtonText("GitHub").onClick(() => window.open("https://github.com/settings/tokens/new?scopes=repo&description=GoodSync", "_blank"));
    }).addButton((button) => {
      button.setButtonText("Gitee").onClick(() => window.open("https://gitee.com/profile/personal_access_tokens", "_blank"));
    });
    new import_obsidian.Setting(containerEl).setName("\u9A8C\u8BC1\u4ED3\u5E93\u8BBF\u95EE").setDesc("\u53EA\u9A8C\u8BC1\u8D26\u53F7\u5BC6\u7801\u6216 Token \u662F\u5426\u53EF\u7528\uFF0C\u4E0D\u4E0B\u8F7D\u4ED3\u5E93\u5185\u5BB9").addButton((button) => {
      button.setButtonText("\u9A8C\u8BC1\u8BFB\u53D6").onClick(() => void this.plugin.runRemoteAccessProbe(false));
    }).addButton((button) => {
      button.setButtonText("\u9A8C\u8BC1\u63A8\u9001").onClick(() => void this.plugin.runRemoteAccessProbe(true));
    });
    new import_obsidian.Setting(containerEl).setName("\u5F53\u524D\u72B6\u6001").setDesc(this.plugin.settings.lastStatus || "\u7B49\u5F85\u64CD\u4F5C").addButton((button) => {
      button.setButtonText("\u91CD\u65B0\u68C0\u6D4B Git").onClick(() => void this.plugin.checkGitOnStartup());
    });
    containerEl.createEl("h3", { text: "\u81EA\u52A8\u540C\u6B65" });
    new import_obsidian.Setting(containerEl).setName("\u6253\u5F00 Obsidian \u65F6\u81EA\u52A8\u540C\u6B65\u4E00\u6B21").setDesc("\u63D2\u4EF6\u542F\u52A8\u5E76\u68C0\u6D4B\u5230 Git \u540E\uFF0C\u4F1A\u81EA\u52A8\u6267\u884C\u4E00\u6B21\u4E00\u952E\u540C\u6B65").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.syncOnStartup).onChange(async (value) => {
        this.plugin.settings.syncOnStartup = value;
        await this.plugin.savePluginSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u81EA\u52A8\u540C\u6B65").setDesc("\u5F00\u542F\u540E\u4F1A\u6309\u8BBE\u5B9A\u95F4\u9694\u81EA\u52A8\u6267\u884C\u4E00\u952E\u540C\u6B65").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.autoSyncEnabled).onChange(async (value) => {
        this.plugin.settings.autoSyncEnabled = value;
        await this.plugin.savePluginSettings();
        this.plugin.rescheduleAutoSync();
        this.display();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u540C\u6B65\u95F4\u9694").setDesc("\u6700\u5C0F\u5355\u4F4D\u662F 10 \u79D2\u3002\u8F93\u5165 1 \u8868\u793A 10 \u79D2\uFF0C\u8F93\u5165 6 \u8868\u793A 60 \u79D2").addText((text) => {
      text.inputEl.type = "number";
      text.inputEl.min = "1";
      text.setPlaceholder("6").setValue(String(this.plugin.settings.autoSyncIntervalUnits || 6)).onChange(async (value) => {
        const parsed = Math.max(1, Math.floor(Number(value) || 1));
        this.plugin.settings.autoSyncIntervalUnits = parsed;
        await this.plugin.savePluginSettings();
        this.plugin.rescheduleAutoSync();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u81EA\u52A8\u540C\u6B65\u65F6\u663E\u793A\u901A\u77E5").setDesc("\u5173\u95ED\u540E\uFF0C\u81EA\u52A8\u540C\u6B65\u4E0D\u4F1A\u4E00\u76F4\u5F39\u51FA\u6210\u529F/\u5931\u8D25\u63D0\u793A\uFF0C\u4F46\u72B6\u6001\u680F\u548C\u8BE6\u7EC6\u65E5\u5FD7\u4ECD\u4F1A\u66F4\u65B0").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.showAutoSyncNotice).onChange(async (value) => {
        this.plugin.settings.showAutoSyncNotice = value;
        await this.plugin.savePluginSettings();
      });
    });
    containerEl.createEl("h3", { text: "\u5E38\u7528\u64CD\u4F5C" });
    new import_obsidian.Setting(containerEl).setName("\u521D\u59CB\u5316\u4ED3\u5E93").addButton((button) => {
      button.setButtonText("\u521D\u59CB\u5316\u4ED3\u5E93").onClick(() => void this.plugin.initRepository());
    });
    new import_obsidian.Setting(containerEl).setName("Pull \u62C9\u53D6").setDesc("\u4ECE\u8FDC\u7A0B master \u62C9\u53D6\u66F4\u65B0").addButton((button) => {
      button.setButtonText("Pull \u62C9\u53D6").onClick(() => void this.plugin.pullChanges());
    });
    new import_obsidian.Setting(containerEl).setName("Commit + Push \u63A8\u9001").setDesc("\u63D0\u4EA4\u5F53\u524D Vault \u6539\u52A8\u5E76\u63A8\u9001\u5230\u8FDC\u7A0B master").addButton((button) => {
      button.setButtonText("\u63A8\u9001").onClick(() => void this.plugin.commitAndPush());
    });
    new import_obsidian.Setting(containerEl).setName("\u4E00\u952E\u540C\u6B65").addButton((button) => {
      button.setCta().setButtonText("\u4E00\u952E\u540C\u6B65").onClick(() => void this.plugin.syncRepository());
    });
    new import_obsidian.Setting(containerEl).setName("\u66F4\u591A").addButton((button) => {
      button.setButtonText(this.plugin.settings.showAdvanced ? "\u6536\u8D77" : "\u66F4\u591A").onClick(async () => {
        this.plugin.settings.showAdvanced = !this.plugin.settings.showAdvanced;
        await this.plugin.savePluginSettings();
        this.display();
      });
    });
    if (this.plugin.settings.showAdvanced) {
      this.displayAdvanced(containerEl);
    }
  }
  displayAdvanced(containerEl) {
    containerEl.createEl("h3", { text: "\u66F4\u591A\u64CD\u4F5C" });
    new import_obsidian.Setting(containerEl).setName("\u79FB\u52A8\u7AEF Git \u6280\u672F\u9A8C\u8BC1").addButton((button) => {
      button.setButtonText("\u8FD0\u884C\u9A8C\u8BC1").onClick(() => void this.plugin.runIsomorphicGitProbe());
    });
    new import_obsidian.Setting(containerEl).setName("\u516C\u5F00\u4ED3\u5E93 Fetch \u9A8C\u8BC1").setDesc("\u7528\u5F53\u524D\u8FDC\u7A0B\u4ED3\u5E93 URL \u505A\u516C\u5F00\u8BFB\u53D6\u9A8C\u8BC1\uFF0C\u4E0D\u4F7F\u7528\u7528\u6237\u540D\u3001\u5BC6\u7801\u6216 Token").addButton((button) => {
      button.setButtonText("\u9A8C\u8BC1 Fetch").onClick(() => void this.plugin.runPublicRemoteFetchProbe());
    });
    new import_obsidian.Setting(containerEl).setName("\u5F3A\u5236\u8986\u76D6\u8FDC\u7A0B\u4ED3\u5E93").setDesc("\u5F3A\u5236\u8986\u76D6\u8FDC\u7A0B master").addButton((button) => {
      button.setWarning().setButtonText("\u8986\u76D6\u8FDC\u7A0B").onClick(() => void this.plugin.forcePushRemote());
    });
    new import_obsidian.Setting(containerEl).setName("\u5F3A\u5236\u62C9\u53D6\u8986\u76D6\u672C\u5730").setDesc("\u4EE5\u8FDC\u7A0B master \u4E3A\u51C6\uFF0C\u8986\u76D6\u672C\u5730\u6587\u4EF6").addButton((button) => {
      button.setWarning().setButtonText("\u8986\u76D6\u672C\u5730").onClick(() => void this.plugin.forcePullOverwriteLocal());
    });
    new import_obsidian.Setting(containerEl).setName("\u67E5\u770B\u8BE6\u7EC6\u65E5\u5FD7").setDesc("\u67E5\u770B\u63D2\u4EF6\u6267\u884C\u8FC7\u7684\u5B8C\u6574 Git \u547D\u4EE4\u548C\u8F93\u51FA").addButton((button) => {
      button.setButtonText("\u67E5\u770B\u8BE6\u7EC6\u65E5\u5FD7").onClick(() => this.plugin.showDetails());
    });
    new import_obsidian.Setting(containerEl).setName("\u6E05\u7A7A\u65E5\u5FD7").setDesc("\u6E05\u7A7A\u5F53\u524D\u4F1A\u8BDD\u91CC\u7684\u8BE6\u7EC6\u65E5\u5FD7").addButton((button) => {
      button.setButtonText("\u6E05\u7A7A\u65E5\u5FD7").onClick(() => {
        this.plugin.details = [];
        new import_obsidian.Notice("\u8BE6\u7EC6\u65E5\u5FD7\u5DF2\u6E05\u7A7A");
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u624B\u52A8 Git \u547D\u4EE4").setDesc("\u4EC5\u684C\u9762\u7AEF\u53EF\u7528\uFF1B\u79FB\u52A8\u7AEF\u8BF7\u4F7F\u7528\u5185\u7F6E\u540C\u6B65\u6309\u94AE").addText((text) => {
      text.setPlaceholder("git status").setValue(this.plugin.settings.commandText).onChange(async (value) => {
        this.plugin.settings.commandText = value;
        await this.plugin.savePluginSettings();
      });
    }).addButton((button) => {
      button.setButtonText("\u6267\u884C").onClick(() => void this.plugin.runManualCommand(this.plugin.settings.commandText));
    });
  }
};
var ObsidianFsError = class extends Error {
  constructor(code, message) {
    super(message);
    __publicField(this, "code");
    this.name = code;
    this.code = code;
  }
};
function createObsidianFs(adapter) {
  const toVaultPath = (path) => {
    const withoutRoot = path.replace(/\\/g, "/").replace(/^\/+/, "");
    return (0, import_obsidian.normalizePath)(withoutRoot);
  };
  const parentPaths = (path) => {
    const normalized = toVaultPath(path);
    const parts = normalized.split("/").filter(Boolean);
    const parents = [];
    for (let index = 1; index < parts.length; index += 1) {
      parents.push(parts.slice(0, index).join("/"));
    }
    return parents;
  };
  const ensureParentDirs = async (path) => {
    for (const parent of parentPaths(path)) {
      if (!await adapter.exists(parent)) {
        await adapter.mkdir(parent);
      }
    }
  };
  const makeStat = (path, stat2) => {
    const isFile = stat2.type === "file";
    const mode = isFile ? 33188 : 16384;
    return {
      type: stat2.type,
      mode,
      size: stat2.size,
      mtimeMs: stat2.mtime,
      ctimeMs: stat2.ctime,
      mtime: new Date(stat2.mtime),
      ctime: new Date(stat2.ctime),
      isFile: () => isFile,
      isDirectory: () => stat2.type === "folder",
      isSymbolicLink: () => false
    };
  };
  const readFile = async (path, options) => {
    const vaultPath = toVaultPath(path);
    const encoding = typeof options === "string" ? options : options == null ? void 0 : options.encoding;
    if (encoding) {
      return adapter.read(vaultPath);
    }
    return new Uint8Array(await adapter.readBinary(vaultPath));
  };
  const writeFile = async (path, data, options) => {
    const vaultPath = toVaultPath(path);
    await ensureParentDirs(vaultPath);
    const encoding = typeof options === "string" ? options : options == null ? void 0 : options.encoding;
    if (typeof data === "string" || encoding) {
      await adapter.write(vaultPath, typeof data === "string" ? data : new TextDecoder().decode(data));
      return;
    }
    const binary = data instanceof Uint8Array ? data.slice().buffer : data;
    await adapter.writeBinary(vaultPath, binary);
  };
  const stat = async (path) => {
    const vaultPath = toVaultPath(path);
    if (!vaultPath) {
      return makeStat("", { type: "folder", ctime: Date.now(), mtime: Date.now(), size: 0 });
    }
    const result = await adapter.stat(vaultPath);
    if (!result) {
      throw new ObsidianFsError("ENOENT", `No such file or directory: ${path}`);
    }
    return makeStat(vaultPath, result);
  };
  return {
    promises: {
      readFile,
      writeFile,
      unlink: async (path) => {
        await adapter.remove(toVaultPath(path));
      },
      readdir: async (path) => {
        const vaultPath = toVaultPath(path);
        const result = await adapter.list(vaultPath);
        return [...result.folders, ...result.files].map((item) => item.split("/").pop() || item);
      },
      mkdir: async (path) => {
        const vaultPath = toVaultPath(path);
        if (!vaultPath || await adapter.exists(vaultPath)) {
          return;
        }
        await ensureParentDirs(vaultPath);
        await adapter.mkdir(vaultPath);
      },
      rmdir: async (path) => {
        await adapter.rmdir(toVaultPath(path), false);
      },
      stat,
      lstat: stat,
      readlink: async () => {
        throw new ObsidianFsError("EINVAL", "Symbolic links are not supported by ObsidianFs.");
      },
      symlink: async () => {
        throw new ObsidianFsError("EINVAL", "Symbolic links are not supported by ObsidianFs.");
      },
      chmod: async () => {
      }
    }
  };
}
function createObsidianHttp() {
  return {
    request: async ({ url, method = "GET", headers = {}, body }) => {
      const response = await (0, import_obsidian.requestUrl)({
        url,
        method,
        headers,
        body: await collectGitRequestBody(body),
        throw: false
      });
      return {
        url,
        method,
        statusCode: response.status,
        statusMessage: String(response.status),
        headers: response.headers,
        body: arrayBufferToGitBody(response.arrayBuffer)
      };
    }
  };
}
function isGoodSyncIgnoredPath(filepath) {
  const normalizedPath = normalizeGitPath(filepath);
  return GOODSYNC_GITIGNORE_RULES.some((rule) => {
    const normalizedRule = normalizeGitPath(rule);
    if (normalizedRule.endsWith("/")) {
      const directory = normalizedRule.slice(0, -1);
      return normalizedPath === directory || normalizedPath.startsWith(normalizedRule);
    }
    return normalizedPath === normalizedRule;
  });
}
function normalizeGitPath(filepath) {
  return filepath.replace(/\\/g, "/").replace(/^\/+/, "");
}
function isStaticLicenseSource(url) {
  const normalized = url.trim().toLowerCase();
  return /\.json(?:[?#].*)?$/.test(normalized) || normalized.includes("/raw/");
}
function normalizeLicensePhone(value) {
  return String(value || "").replace(/[^\d+]/g, "").trim();
}
function normalizeLicenseCode(value) {
  return String(value || "").trim().toUpperCase();
}
function normalizeHash(value) {
  return String(value || "").trim().toLowerCase();
}
async function sha256Hex(text) {
  var _a;
  if (!((_a = globalThis.crypto) == null ? void 0 : _a.subtle)) {
    throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301 Web Crypto\uFF0C\u65E0\u6CD5\u9A8C\u8BC1\u9759\u6001\u6388\u6743\u6587\u4EF6\u3002");
  }
  const input = new TextEncoder().encode(text);
  const output = await globalThis.crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(output)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function collectGitRequestBody(body) {
  if (!body) {
    return void 0;
  }
  const chunks = [];
  let totalLength = 0;
  for await (const chunk of body) {
    chunks.push(chunk);
    totalLength += chunk.byteLength;
  }
  const buffer = new ArrayBuffer(totalLength);
  const output = new Uint8Array(buffer);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer;
}
async function* arrayBufferToGitBody(buffer) {
  yield new Uint8Array(buffer);
}
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 MB";
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
var GitCredentialsModal = class _GitCredentialsModal extends import_obsidian.Modal {
  constructor(app, initialUsername, initialSecret, resolve) {
    super(app);
    __publicField(this, "initialUsername");
    __publicField(this, "initialSecret");
    __publicField(this, "resolve");
    __publicField(this, "username", "");
    __publicField(this, "secret", "");
    this.initialUsername = initialUsername;
    this.initialSecret = initialSecret;
    this.resolve = resolve;
    this.username = initialUsername;
    this.secret = initialSecret;
  }
  static open(app, initialUsername, initialSecret) {
    return new Promise((resolve) => {
      new _GitCredentialsModal(app, initialUsername, initialSecret, resolve).open();
    });
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Git \u4ED3\u5E93\u8BA4\u8BC1" });
    contentEl.createEl("p", {
      text: "Gitee \u53EF\u586B\u5199\u7528\u6237\u540D\u548C\u5BC6\u7801\uFF1BGitHub \u901A\u5E38\u9700\u8981 Token\u3002Token \u6A21\u5F0F\u53EF\u4EE5\u4E0D\u586B\u7528\u6237\u540D\u3002"
    });
    new import_obsidian.Setting(contentEl).setName("Git \u7528\u6237\u540D").addText((text) => {
      text.setPlaceholder("Gitee/GitHub \u7528\u6237\u540D\uFF0CToken \u6A21\u5F0F\u53EF\u7559\u7A7A").setValue(this.initialUsername).onChange((value) => {
        this.username = value.trim();
      });
    });
    new import_obsidian.Setting(contentEl).setName("\u5BC6\u7801\u6216 Token").addText((text) => {
      text.inputEl.type = "password";
      text.setPlaceholder("\u5BC6\u7801\u6216 Personal Access Token").setValue(this.initialSecret).onChange((value) => {
        this.secret = value.trim();
      });
    });
    new import_obsidian.Setting(contentEl).addButton((button) => {
      button.setButtonText("\u53D6\u6D88").onClick(() => {
        this.resolve(null);
        this.close();
      });
    }).addButton((button) => {
      button.setCta().setButtonText("\u4FDD\u5B58\u5E76\u91CD\u8BD5").onClick(() => {
        if (!this.secret) {
          new import_obsidian.Notice("\u8BF7\u586B\u5199\u5BC6\u7801\u6216 Token\u3002");
          return;
        }
        this.resolve({
          username: this.username,
          secret: this.secret
        });
        this.close();
      });
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};
var DetailsModal = class extends import_obsidian.Modal {
  constructor(app, details) {
    super(app);
    __publicField(this, "details");
    this.details = details;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "\u8BE6\u7EC6\u65E5\u5FD7" });
    contentEl.createEl("pre", {
      cls: "simple-git-sync-log",
      text: this.details || "\u6682\u65E0\u8BE6\u7EC6\u65E5\u5FD7\u3002"
    });
  }
};
var ConfirmModal = class _ConfirmModal extends import_obsidian.Modal {
  constructor(app, title, message, resolve) {
    super(app);
    __publicField(this, "title");
    __publicField(this, "message");
    __publicField(this, "resolve");
    this.title = title;
    this.message = message;
    this.resolve = resolve;
  }
  static open(app, title, message) {
    return new Promise((resolve) => {
      new _ConfirmModal(app, title, message, resolve).open();
    });
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: this.title });
    contentEl.createEl("p", {
      cls: "simple-git-sync-warning",
      text: this.message
    });
    new import_obsidian.Setting(contentEl).addButton((button) => {
      button.setButtonText("\u53D6\u6D88").onClick(() => {
        this.resolve(false);
        this.close();
      });
    }).addButton((button) => {
      button.setWarning().setButtonText("\u786E\u5B9A\u7EE7\u7EED").onClick(() => {
        this.resolve(true);
        this.close();
      });
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

isomorphic-git/index.umd.min.js:
  (*! For license information please see index.umd.min.js.LICENSE.txt *)
*/
