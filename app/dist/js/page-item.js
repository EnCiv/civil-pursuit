(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var _synApp = require('syn/app');

var _synApp2 = _interopRequireDefault(_synApp);

var _synComponentsTopBarController = require('syn/components/TopBar/Controller');

var _synComponentsTopBarController2 = _interopRequireDefault(_synComponentsTopBarController);

var _synComponentsPanelController = require('syn/components/Panel/Controller');

var _synComponentsPanelController2 = _interopRequireDefault(_synComponentsPanelController);

synapp.app = new _synApp2['default'](true);

synapp.app.ready(function () {

  new _synComponentsTopBarController2['default']().render();

  synapp.app.publish('get top-level type').subscribe(function (pubsub, topLevelPanel) {

    pubsub.unsubscribe();

    var panel = new _synComponentsPanelController2['default']({ panel: { type: topLevelPanel } });

    $('.panels').append(panel.load());

    panel.render().then(function (success) {
      return panel.fill();
    }, function (error) {
      return synapp.app.emit('error', error);
    });
  });
});

},{"syn/app":34,"syn/components/Panel/Controller":52,"syn/components/TopBar/Controller":56}],2:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Find the length
  var length
  if (type === 'number')
    length = subject > 0 ? subject >>> 0 : 0
  else if (type === 'string') {
    if (encoding === 'base64')
      subject = base64clean(subject)
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) { // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data))
      subject = subject.data
    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
  } else
    throw new TypeError('must start with number, buffer, array or string')

  if (this.length > kMaxLength)
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
      'size: 0x' + kMaxLength.toString(16) + ' bytes')

  var buf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

Buffer.isBuffer = function (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
    throw new TypeError('Arguments must be Buffers')

  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    case 'hex':
      ret = str.length >>> 1
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    default:
      ret = str.length
  }
  return ret
}

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function (encoding, start, end) {
  var loweredCase = false

  start = start >>> 0
  end = end === undefined || end === Infinity ? this.length : end >>> 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase)
          throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function (b) {
  if(!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max)
      str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length, 2)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new TypeError('Unknown encoding: ' + encoding)
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function binarySlice (buf, start, end) {
  return asciiSlice(buf, start, end)
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0)
      end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start)
    end = start

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0)
    throw new RangeError('offset is not uint')
  if (offset + ext > length)
    throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80))
    return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start) throw new TypeError('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new TypeError('targetStart out of bounds')
  if (start < 0 || start >= source.length) throw new TypeError('sourceStart out of bounds')
  if (end < 0 || end > source.length) throw new TypeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new TypeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new TypeError('start out of bounds')
  if (end < 0 || end > this.length) throw new TypeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F) {
      byteArray.push(b)
    } else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++) {
        byteArray.push(parseInt(h[j], 16))
      }
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length, unitSize) {
  if (unitSize) length -= length % unitSize;
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":3,"ieee754":4,"is-array":5}],3:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],4:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

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

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],5:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],6:[function(require,module,exports){
/*global define:false require:false */
module.exports = (function(){
	// Import Events
	var events = require('events')

	// Export Domain
	var domain = {}
	domain.createDomain = domain.create = function(){
		var d = new events.EventEmitter()

		function emitError(e) {
			d.emit('error', e)
		}

		d.add = function(emitter){
			emitter.on('error', emitError)
		}
		d.remove = function(emitter){
			emitter.removeListener('error', emitError)
		}
		d.bind = function(fn){
			return function(){
				var args = Array.prototype.slice.call(arguments)
				try {
					fn.apply(null, args)
				}
				catch (err){
					emitError(err)
				}
			}
		}
		d.intercept = function(fn){
			return function(err){
				if ( err ) {
					emitError(err)
				}
				else {
					var args = Array.prototype.slice.call(arguments, 1)
					try {
						fn.apply(null, args)
					}
					catch (err){
						emitError(err)
					}
				}
			}
		}
		d.run = function(fn){
			try {
				fn()
			}
			catch (err) {
				emitError(err)
			}
			return this
		};
		d.dispose = function(){
			this.removeAllListeners()
			return this
		};
		d.enter = d.exit = function(){
			return this
		}
		return d
	};
	return domain
}).call(this)
},{"events":7}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],8:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],9:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],10:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],11:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":12}],12:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require('_process'))
},{"./_stream_readable":14,"./_stream_writable":16,"_process":10,"core-util-is":17,"inherits":8}],13:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":15,"core-util-is":17,"inherits":8}],14:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;
  var ret;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    ret = null;

    // In cases where the decoder did not receive enough data
    // to produce a full chunk, then immediately received an
    // EOF, state.buffer will contain [<Buffer >, <Buffer 00 ...>].
    // howMuchToRead will see this and coerce the amount to
    // read to zero (because it's looking at the length of the
    // first <Buffer > in state.buffer), and we'll end up here.
    //
    // This can only happen via state.decoder -- no other venue
    // exists for pushing a zero-length chunk into state.buffer
    // and triggering this behavior. In this case, we return our
    // remaining data and end the stream, if appropriate.
    if (state.length > 0 && state.decoder) {
      ret = fromList(n, state);
      state.length -= ret.length;
    }

    if (state.length === 0)
      endReadable(this);

    return ret;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    process.nextTick(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    process.nextTick(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      process.nextTick(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    //if (state.objectMode && util.isNullOrUndefined(chunk))
    if (state.objectMode && (chunk === null || chunk === undefined))
      return;
    else if (!state.objectMode && (!chunk || !chunk.length))
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"_process":10,"buffer":2,"core-util-is":17,"events":7,"inherits":8,"isarray":9,"stream":22,"string_decoder/":23}],15:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":12,"core-util-is":17,"inherits":8}],16:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      cb(er);
    });
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require('_process'))
},{"./_stream_duplex":12,"_process":10,"buffer":2,"core-util-is":17,"inherits":8,"stream":22}],17:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
}).call(this,require("buffer").Buffer)
},{"buffer":2}],18:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":13}],19:[function(require,module,exports){
var Stream = require('stream'); // hack to fix a circular dependency issue when used with browserify
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":12,"./lib/_stream_passthrough.js":13,"./lib/_stream_readable.js":14,"./lib/_stream_transform.js":15,"./lib/_stream_writable.js":16,"stream":22}],20:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":15}],21:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":16}],22:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":7,"inherits":8,"readable-stream/duplex.js":11,"readable-stream/passthrough.js":18,"readable-stream/readable.js":19,"readable-stream/transform.js":20,"readable-stream/writable.js":21}],23:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":2}],24:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],25:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":24,"_process":10,"inherits":8}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _domain = require('domain');

var Compiler = (function () {
  function Compiler(element) {
    _classCallCheck(this, Compiler);

    this.element = element;
  }

  _createClass(Compiler, [{
    key: 'render',
    value: function render(tab, glue) {
      var _this = this;

      tab = tab || '';

      if (typeof glue !== 'string') {
        glue = '\n';
      }

      var lines = [];

      // Make sure we have an Element

      if (this.element instanceof _Elements2['default']) {
        return this.element.render(tab, glue);
      }

      if (this.element instanceof _Element2['default'] === false) {
        throw new Error('Not an element: ' + this.element.constructor.name);
      }

      // Can we compile this Element?

      if (!this.element.satisfies()) {
        return lines.join(glue);
      }

      // children

      var children = this.element.children;

      // Resolve selector

      var _Element$resolve = _Element2['default'].resolve(this.element.selector);

      var element = _Element$resolve.element;
      var id = _Element$resolve.id;
      var attributes = _Element$resolve.attributes;
      var classes = _Element$resolve.classes;

      // Merge resolve and attributes

      if (!element) {
        element = 'div';
      }

      if (!this.element.attributes.id && id) {
        this.element.attributes.id = id;
      }

      for (var key in attributes) {
        if (!(key in this.element.attributes)) {
          this.element.attributes[key] = attributes[key];
        }
      }

      // Tag

      var openTag = '<' + element;

      // Classes

      classes = this.element.classes.concat(classes.filter(function (cl) {
        return _this.element.classes.every(function (_cl) {
          return _cl !== cl;
        });
      }));

      if (classes.length) {
        openTag += ' class="' + classes.join(' ') + '"';
      }

      // Attributes

      var attributeValue = undefined;

      for (var attribute in this.element.attributes) {

        if (typeof this.element.attributes[attribute] === 'function') {
          this.element.attributes[attribute] = this.element.attributes[attribute]();
        }

        if (attribute === 'className' || this.element.attributes[attribute] === false) {} else if (this.element.attributes[attribute] === true) {
          openTag += ' ' + attribute;
        } else {

          if (typeof this.element.attributes[attribute] === 'function') {
            attributeValue = this.element.attributes[attribute]();
          } else {
            attributeValue = this.element.attributes[attribute];
          }

          if (attributeValue !== null && typeof attributeValue !== 'undefined') {
            openTag += ' ' + attribute + '="' + attributeValue + '"';
          }
        }
      }

      // Self closing

      if (this.element.closed) {
        openTag += '/';
      }

      openTag += '>';

      var line = tab + openTag;

      // Children

      if (!this.element.closed) {

        // Text

        if (this.element.textNode) {

          var text = this.element.textNode;

          if (typeof text === 'function') {
            text = text();
          }

          line += (text || '') + '</' + element + '>';

          lines.push(line);
        } else if (Array.isArray(children) && children.length || typeof children === 'function' || children instanceof _Elements2['default']) {

          lines.push(line);

          if (typeof children === 'function') {
            children = children();
          }

          if (Array.isArray(children)) {
            children = new (_bind.apply(_Elements2['default'], [null].concat(_toConsumableArray(children))))();
          }

          lines.push(children.render(tab + '  '), tab + '</' + element + '>');

          return lines.join(glue);
        } else {
          lines.push(line + '</' + element + '>');
        }
      } else {
        lines.push(line);
      }

      return lines.join(glue);
    }
  }]);

  return Compiler;
})();

// let foo = new Element('div#my-id.my-class-1.my-class-2', {
//   'data-foo': 'barz', className: 'my-class-3'
// })
//   .addClass('my-class-4')
//   .add(new Element('p').text('hello'));

// // new Compiler(foo).render()

// //   .on('error', error => console.log('Compiler error', error))

// //   .then(
// //     lines => console.log('then ok', lines),
// //     error => console.log('then ko', error)
// //   )

// // new Compiler(foo).render().on("data", data=>console.log('data', data.toString()))

// new Compiler(foo).render().pipe(process.stdout)

exports['default'] = Compiler;
module.exports = exports['default'];

},{"./Element":28,"./Elements":29,"domain":6}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Streamable = require('./Streamable');

var _Streamable2 = _interopRequireDefault(_Streamable);

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var Document = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Document() {
    for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
      children[_key] = arguments[_key];
    }

    _classCallCheck(this, Document);

    this.children = children;
  }

  _createClass(Document, [{
    key: 'add',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function add() {
      var _children;

      for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        children[_key2] = arguments[_key2];
      }

      (_children = this.children).push.apply(_children, children);
      return this;
    }
  }, {
    key: 'find',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function find(selector) {
      var found = [];

      this.children.forEach(function (child) {

        if (child instanceof _Element2['default']) {
          if (child.is(selector)) {
            found.push(child);
          }
        }

        child.find(selector).each(function (result) {
          return found.push(result);
        });
      });

      return new (_bind.apply(_Elements2['default'], [null].concat(found)))();
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render(glue) {

      if (typeof glue !== 'string') {
        glue = '\n';
      }

      var lines = [];

      lines.push(Document.doctype, '<meta charset="utf-8" />');

      lines.push(new (_bind.apply(_Elements2['default'], [null].concat(_toConsumableArray(this.children))))().render());

      return lines.join(glue);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Document;
})();

Document.doctype = '<!doctype html>';

exports['default'] = Document;
module.exports = exports['default'];

},{"./Element":28,"./Elements":29,"./Streamable":30}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Streamable = require('./Streamable');

var _Compiler = require('./Compiler');

var _Compiler2 = _interopRequireDefault(_Compiler);

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var Element = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Element(selector, attr, children) {
    var _this = this;

    _classCallCheck(this, Element);

    this.selector = selector;
    this.attributes = attr || {};
    this.children = children || [];
    this.conditions = [];
    this.textNode = '';

    var resolve = Element.resolve(selector);

    for (var i in resolve.attr) {
      if (!(i in this.attr)) {
        this.attr[i] = resolve.attr[i];
      }
    }

    if (resolve.classes.length) {
      this.classes;
      this.attributes.className = this.attributes.className || [];
      this.attributes.className = this.attributes.className.concat(resolve.classes.filter(function (className) {
        return _this.classes.every(function (attrClass) {
          return attrClass !== className;
        });
      }));
    }
  }

  _createClass(Element, [{
    key: 'classes',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    get: function () {
      var classes = [];

      if (this.attributes && this.attributes.className) {

        if (typeof this.attributes.className === 'function') {
          this.attributes.className = [this.attributes.className];
        }

        if (typeof this.attributes.className === 'string') {
          this.attributes.className = this.attributes.className.split(/\s+/);
        }

        if (Array.isArray(this.attributes.className)) {
          classes = this.attributes.className;
        }
      }

      return classes;
    }
  }, {
    key: 'text',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function text(_text) {
      if (_text) {
        this.textNode = _text;
        return this;
      }

      return this.textNode;
    }
  }, {
    key: 'findByText',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function findByText(text) {
      var elements = [];

      function findElements(text, element) {

        if (element instanceof Element) {
          if (text instanceof RegExp) {
            if (text.test(element.textNode)) {
              elements.push(element);
            }
          } else if (typeof text === 'string') {
            if (text === element.textNode) {
              elements.push(element);
            }
          }

          if (Array.isArray(element.children)) {
            element.children.forEach(function (child) {
              findElements(text, child);
            });
          }
        } else if (element instanceof _Elements2['default']) {
          element.each(function (child) {
            findElements(text, child);
          });
        }
      }

      if (Array.isArray(this.children)) {
        this.children.forEach(function (child) {
          return findElements(text, child);
        });
      }

      return new (_bind.apply(_Elements2['default'], [null].concat(elements)))();
    }
  }, {
    key: 'find',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function find(selector) {
      var elements = [];

      function findElements(selector, element) {

        if (element instanceof Element) {
          if (element.is(selector)) {
            elements.push(element);
          }

          if (Array.isArray(element.children)) {
            element.children.forEach(function (child) {
              findElements(selector, child);
            });
          }
        } else if (element instanceof _Elements2['default']) {
          element.each(function (child) {
            findElements(selector, child);
          });
        }
      }

      if (Array.isArray(this.children)) {
        this.children.forEach(function (child) {
          return findElements(selector, child);
        });
      }

      return new (_bind.apply(_Elements2['default'], [null].concat(elements)))();
    }
  }, {
    key: 'add',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function add() {
      var _children;

      for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }

      (_children = this.children).push.apply(_children, children);
      return this;
    }
  }, {
    key: 'is',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function is(selector) {
      return Element.is(this, selector);
    }
  }, {
    key: 'close',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function close() {
      this.closed = true;
      return this;
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render(tab) {
      return new _Compiler2['default'](this).render(tab);
    }
  }, {
    key: 'stream',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function stream() {
      var stream = new _Streamable.Streamable();

      this.children.forEach(function (child) {
        return child.stream().on('data', function (data) {
          return stream.addLine(data);
        });
      });

      return stream;
    }
  }, {
    key: 'empty',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function empty() {
      this.children = [];
      return this;
    }
  }, {
    key: 'remove',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function remove(fn) {
      this.children = this.children.filter(function (child) {
        return fn(child) ? false : true;
      });
      return this;
    }
  }, {
    key: 'hasClass',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function hasClass(className) {
      return this.classes.some(function (attrClass) {
        return attrClass === className;
      });
    }
  }, {
    key: 'addClass',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function addClass() {
      var _classes;

      for (var _len2 = arguments.length, classes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        classes[_key2] = arguments[_key2];
      }

      (_classes = this.classes).push.apply(_classes, classes);
      return this;
    }
  }, {
    key: 'removeClass',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function removeClass(className) {
      var classes = this.classes;

      if (classes.length) {
        this.attributes.className = classes.filter(function (_className) {
          return _className !== className;
        });

        var regexp = new RegExp('.' + className + '(.|#|\\[|$)', 'g');

        if (regexp.test(this.selector)) {
          this.selector = this.selector.replace(regexp, '');
        }
      }

      return this;
    }
  }, {
    key: 'condition',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function condition() {
      var _conditions;

      for (var _len3 = arguments.length, conditions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        conditions[_key3] = arguments[_key3];
      }

      (_conditions = this.conditions).push.apply(_conditions, conditions);
      return this;
    }
  }, {
    key: 'satisfies',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function satisfies(props) {
      return this.conditions.every(function (condition) {
        if (typeof condition === 'function') {
          return condition(props);
        }
        if (typeof condition === 'boolean') {
          return condition;
        }
        return false;
      });
    }
  }, {
    key: 'attr',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function attr(getter, setter) {
      if ('1' in arguments) {
        this.attributes[getter] = setter;
        return this;
      }

      return this.attributes[getter];
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }], [{
    key: 'resolve',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function resolve(selector) {
      var resolved = { classes: [], attributes: {} };

      var trans = selector.replace(/\./g, '|.').replace(/#/g, '|#').replace(/\[/g, '|[');

      var bits = trans.split(/\|/);

      bits.forEach(function (bit) {

        if (/^\./.test(bit)) {
          resolved.classes.push(bit.replace(/^\./, ''));
        } else if (/^#/.test(bit)) {
          resolved.id = bit.replace(/^#/, '');
        } else if (/^\[.+\]$/.test(bit)) {
          var attrBits = bit.replace(/^\[/, '').replace(/\]$/, '').split('=');
          resolved.attributes[attrBits[0]] = typeof attrBits[1] === 'undefined' ? true : attrBits[1];
        } else if (/^[A-Za-z-_\$]/.test(bit)) {
          resolved.element = bit;
        }
      });

      return resolved;
    }
  }, {
    key: 'is',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function is(elem, selector) {

      var dest = Element.resolve(selector);

      var src = Element.resolve(elem.selector);

      var attempts = [];

      if (dest.element) {
        attempts.push('element', src.element === dest.element);
      }

      if (dest.classes.length) {
        attempts.push('classes', src.classes.some(function (cl) {
          return dest.classes.some(function (_cl) {
            return _cl === cl;
          });
        }));
      }

      if (dest.id) {
        attempts.push('id', src.id === dest.id);
      }

      return attempts.every(function (attempt) {
        return attempt;
      });
    }
  }]);

  return Element;
})();

exports['default'] = Element;
module.exports = exports['default'];

},{"./Compiler":26,"./Elements":29,"./Streamable":30}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _Streamable = require('./Streamable');

var _Streamable2 = _interopRequireDefault(_Streamable);

var Elements = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Elements() {
    for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
      elements[_key] = arguments[_key];
    }

    _classCallCheck(this, Elements);

    this.elements = elements;
  }

  _createClass(Elements, [{
    key: 'length',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    get: function () {
      return this.elements.length;
    }
  }, {
    key: 'add',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function add() {
      var _elements;

      for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        elements[_key2] = arguments[_key2];
      }

      (_elements = this.elements).push.apply(_elements, elements);
      return this;
    }
  }, {
    key: 'get',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function get(index) {
      return this.elements[index];
    }
  }, {
    key: 'each',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function each(closure) {
      this.elements.forEach(closure);
      return this;
    }
  }, {
    key: 'forEach',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function forEach(closure) {
      this.elements.forEach(closure);
      return this;
    }
  }, {
    key: 'find',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function find(selector) {
      var found = [];

      this.elements.forEach(function (child) {
        return child.find(selector).each(found.push.bind(found));
      });

      return new (_bind.apply(Elements, [null].concat(found)))();
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render(tab, glue) {

      tab = tab || '';

      if (typeof glue !== 'string') {
        glue = '\n';
      }

      var lines = [];

      this.elements.map(function (element) {
        if (typeof element === 'function') {
          element = element();
        }
        return element;
      }).filter(function (element) {
        return element instanceof _Element2['default'] || element instanceof Elements;
      }).forEach(function (element) {
        return lines.push(element.render(tab, glue));
      });

      return lines.join(glue);
    }
  }, {
    key: 'is',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function is(selector) {
      return this.elements.filter(function (element) {
        return element instanceof _Element2['default'] || element instanceof Elements;
      }).every(function (element) {
        return element.is(selector);
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Elements;
})();

exports['default'] = Elements;
module.exports = exports['default'];

},{"./Element":28,"./Streamable":30}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _stream = require('stream');

var Streamable = (function (_Readable) {
  function Streamable() {
    var _this = this;

    _classCallCheck(this, Streamable);

    _get(Object.getPrototypeOf(Streamable.prototype), 'constructor', this).call(this);

    this.lines = [];

    this.isDone = false;

    // Starting flow mode

    this.buffer = [];

    this.on('data', function (data) {
      return _this.buffer.push(data);
    });

    // this.on('data', data => console.log('got data', data.toString()))

    this.on('end', function () {});
  }

  _inherits(Streamable, _Readable);

  _createClass(Streamable, [{
    key: 'addLine',
    value: function addLine() {
      var _lines;

      for (var _len = arguments.length, lines = Array(_len), _key = 0; _key < _len; _key++) {
        lines[_key] = arguments[_key];
      }

      (_lines = this.lines).push.apply(_lines, lines);
      console.log.apply(console, ['+++'].concat(lines, [this.isDone]));
      return this;
    }
  }, {
    key: 'then',
    value: function then(fulfill, reject) {
      var _this2 = this;

      if (reject) {
        this.on('error', reject);
      }

      this.on('end', function () {
        return fulfill(_this2.buffer.map(function (line) {
          return line.toString();
        }).join('\n'));
      });
    }
  }, {
    key: 'done',
    value: function done() {
      this.isDone = true;
      this.emit('done');
      console.log('done', this.buffer.map(function (line) {
        return line.toString();
      }));
      while (this.lines.length) {

        if (!this.push(this.lines.shift())) {

          break;
        }
      }
      this.push(null);
      return this;
    }
  }, {
    key: '_read',
    value: function _read(sizeIsIgnored) {

      while (this.lines.length) {

        if (!this.push(this.lines.shift())) {

          break;
        }
      }

      if (!this.lines.length) {}
    }
  }]);

  return Streamable;
})(_stream.Readable);

exports['default'] = Streamable;
module.exports = exports['default'];

},{"stream":22}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var _Document = require('./Document');

var _Document2 = _interopRequireDefault(_Document);

var _toHTML = require('./toHTML');

var _toHTML2 = _interopRequireDefault(_toHTML);

function Cinco() {
  this.Element = _Element2['default'];
  this.Elements = _Elements2['default'];
  this.Document = _Document2['default'];
  this.toHTML = _toHTML2['default'];
  this.render = _toHTML2['default'];
}

var cinco = new Cinco();

exports['default'] = cinco;

if (typeof window !== 'undefined') {
  window.cinco = cinco;
}
module.exports = exports['default'];

},{"./Document":27,"./Element":28,"./Elements":29,"./toHTML":32}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

function render(child, props, tab) {

  tab = tab || '';

  var lines = [];

  // Make sure we have an Element

  if (typeof child === 'function') {
    child = child(props);
  }

  if (child instanceof _Elements2['default']) {
    child = child.elements;
  }

  if (Array.isArray(child)) {
    return;
    child.map(function (elem) {
      return render(elem, props);
    }).join('\n');
  }

  if (child instanceof _Element2['default'] === false) {
    throw new Error('Not an element: ' + child.constructor.name);
  }

  // Can we transform this Element?

  var cont = child.satisfies(props);

  if (!cont) {
    return '';
  }

  // Resolve selector

  var resolved = _Element2['default'].resolve(child.selector);

  // Element

  var element = resolved.element || 'div';

  if (!child.attributes.id && resolved.id) {
    child.attributes.id = resolved.id;
  }

  // Open tag

  var open = tab + '<' + element;

  var attributeValue;

  if (typeof child.attributes === 'text') {
    child.attributes = { $text: child.attributes };
  }

  if (resolved.attributes && Object.keys(resolved.attributes).length) {
    for (var key in resolved.attributes) {
      if (!(key in child.attributes)) {
        child.attributes[key] = resolved.attributes[key];
      }
    }
  }

  // Class

  var classes = child.classes.concat(resolved.classes.filter(function (cl) {
    return child.classes.every(function (_cl) {
      return _cl !== cl;
    });
  }));

  if (classes.length) {
    open += ' class="' + classes.join(' ') + '"';
  }

  for (var attributes in child.attributes) {

    if (attributes === 'className') {
      continue;
    } else {

      if (typeof child.attributes[attributes] === 'function') {
        attributeValue = child.attributes[attributes](props);
      } else {
        attributeValue = child.attributes[attributes];
      }

      if (attributeValue !== null && typeof attributeValue !== 'undefined') {
        open += ' ' + attributes + '="' + attributeValue + '"';
      }
    }
  }

  if (child.attributes.$selfClosing) {
    open += '/';
  }

  open += '>';

  // lines.push(open);

  if (!child.attributes.$selfClosing) {

    if (child.textNode) {

      var text = child.textNode;

      if (typeof text === 'function') {
        text = text(props);
      }

      open += text + '</' + element + '>';

      lines.push(open);
    } else if (Array.isArray(child.children) && child.children.length || typeof child.children === 'function' || children instanceof _Elements2['default']) {

      lines.push(open);

      var children = child.children;

      if (typeof children === 'function') {
        children = children(props);
      }

      if (Array.isArray(children)) {
        children = new (_bind.apply(_Elements2['default'], [null].concat(_toConsumableArray(children))))();
      }

      lines.push(children.render(props, tab + '  '));

      lines.push(tab + '</' + element + '>');
    } else {
      lines.push(open + '</' + element + '>');
    }
  } else {
    lines.push(open);
  }

  return lines.join('\n');
}

exports['default'] = render;
module.exports = exports['default'];

},{"./Element":28,"./Elements":29}],33:[function(require,module,exports){
/*
string.js - Copyright (C) 2012-2014, JP Richardson <jprichardson@gmail.com>
*/

!(function() {
  "use strict";

  var VERSION = '2.2.0';

  var ENTITIES = {};

  // from http://semplicewebsites.com/removing-accents-javascript
  var latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","ẞ":"SS","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ß":"ss","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};

//******************************************************************************
// Added an initialize function which is essentially the code from the S
// constructor.  Now, the S constructor calls this and a new method named
// setValue calls it as well.  The setValue function allows constructors for
// modules that extend string.js to set the initial value of an object without
// knowing the internal workings of string.js.
//
// Also, all methods which return a new S object now call:
//
//      return new this.constructor(s);
//
// instead of:
//
//      return new S(s);
//
// This allows extended objects to keep their proper instanceOf and constructor.
//******************************************************************************

  function initialize (object, s) {
    if (s !== null && s !== undefined) {
      if (typeof s === 'string')
        object.s = s;
      else
        object.s = s.toString();
    } else {
      object.s = s; //null or undefined
    }

    object.orig = s; //original object, currently only used by toCSV() and toBoolean()

    if (s !== null && s !== undefined) {
      if (object.__defineGetter__) {
        object.__defineGetter__('length', function() {
          return object.s.length;
        })
      } else {
        object.length = s.length;
      }
    } else {
      object.length = -1;
    }
  }

  function S(s) {
  	initialize(this, s);
  }

  var __nsp = String.prototype;
  var __sp = S.prototype = {

    between: function(left, right) {
      var s = this.s;
      var startPos = s.indexOf(left);
      var endPos = s.indexOf(right, startPos + left.length);
      if (endPos == -1 && right != null) 
        return new this.constructor('')
      else if (endPos == -1 && right == null)
        return new this.constructor(s.substring(startPos + left.length))
      else 
        return new this.constructor(s.slice(startPos + left.length, endPos));
    },

    //# modified slightly from https://github.com/epeli/underscore.string
    camelize: function() {
      var s = this.trim().s.replace(/(\-|_|\s)+(.)?/g, function(mathc, sep, c) {
        return (c ? c.toUpperCase() : '');
      });
      return new this.constructor(s);
    },

    capitalize: function() {
      return new this.constructor(this.s.substr(0, 1).toUpperCase() + this.s.substring(1).toLowerCase());
    },

    charAt: function(index) {
      return this.s.charAt(index);
    },

    chompLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
         s = s.slice(prefix.length);
         return new this.constructor(s);
      } else {
        return this;
      }
    },

    chompRight: function(suffix) {
      if (this.endsWith(suffix)) {
        var s = this.s;
        s = s.slice(0, s.length - suffix.length);
        return new this.constructor(s);
      } else {
        return this;
      }
    },

    //#thanks Google
    collapseWhitespace: function() {
      var s = this.s.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
      return new this.constructor(s);
    },

    contains: function(ss) {
      return this.s.indexOf(ss) >= 0;
    },

    count: function(ss) {
      var count = 0
        , pos = this.s.indexOf(ss)

      while (pos >= 0) {
        count += 1
        pos = this.s.indexOf(ss, pos + 1)
      }

      return count
    },

    //#modified from https://github.com/epeli/underscore.string
    dasherize: function() {
      var s = this.trim().s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
      return new this.constructor(s);
    },

    latinise: function() {
      var s = this.replace(/[^A-Za-z0-9\[\] ]/g, function(x) { return latin_map[x] || x; });
      return new this.constructor(s);
    },

    decodeHtmlEntities: function() { //https://github.com/substack/node-ent/blob/master/index.js
      var s = this.s;
      s = s.replace(/&#(\d+);?/g, function (_, code) {
        return String.fromCharCode(code);
      })
      .replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      })
      .replace(/&([^;\W]+;?)/g, function (m, e) {
        var ee = e.replace(/;$/, '');
        var target = ENTITIES[e] || (e.match(/;$/) && ENTITIES[ee]);
            
        if (typeof target === 'number') {
          return String.fromCharCode(target);
        }
        else if (typeof target === 'string') {
          return target;
        }
        else {
          return m;
        }
      })

      return new this.constructor(s);
    },

    endsWith: function() {
      var suffixes = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < suffixes.length; ++i) {
        var l  = this.s.length - suffixes[i].length;
        if (l >= 0 && this.s.indexOf(suffixes[i], l) === l) return true;
      }
      return false;
    },

    escapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; }));
    },

    ensureLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
        return this;
      } else {
        return new this.constructor(prefix + s);
      }
    },

    ensureRight: function(suffix) {
      var s = this.s;
      if (this.endsWith(suffix))  {
        return this;
      } else {
        return new this.constructor(s + suffix);
      }
    },

    humanize: function() { //modified from underscore.string
      if (this.s === null || this.s === undefined)
        return new this.constructor('')
      var s = this.underscore().replace(/_id$/,'').replace(/_/g, ' ').trim().capitalize()
      return new this.constructor(s)
    },

    isAlpha: function() {
      return !/[^a-z\xDF-\xFF]|^$/.test(this.s.toLowerCase());
    },

    isAlphaNumeric: function() {
      return !/[^0-9a-z\xDF-\xFF]/.test(this.s.toLowerCase());
    },

    isEmpty: function() {
      return this.s === null || this.s === undefined ? true : /^[\s\xa0]*$/.test(this.s);
    },

    isLower: function() {
      return this.isAlpha() && this.s.toLowerCase() === this.s;
    },

    isNumeric: function() {
      return !/[^0-9]/.test(this.s);
    },

    isUpper: function() {
      return this.isAlpha() && this.s.toUpperCase() === this.s;
    },

    left: function(N) {
      if (N >= 0) {
        var s = this.s.substr(0, N);
        return new this.constructor(s);
      } else {
        return this.right(-N);
      }
    },
    
    lines: function() { //convert windows newlines to unix newlines then convert to an Array of lines
      return this.replaceAll('\r\n', '\n').s.split('\n');
    },

    pad: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      len = len - this.s.length;
      var left = Array(Math.ceil(len / 2) + 1).join(ch);
      var right = Array(Math.floor(len / 2) + 1).join(ch);
      return new this.constructor(left + this.s + right);
    },

    padLeft: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(Array(len - this.s.length + 1).join(ch) + this.s);
    },

    padRight: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(this.s + Array(len - this.s.length + 1).join(ch));
    },

    parseCSV: function(delimiter, qualifier, escape, lineDelimiter) { //try to parse no matter what
      delimiter = delimiter || ',';
      escape = escape || '\\'
      if (typeof qualifier == 'undefined')
        qualifier = '"';

      var i = 0, fieldBuffer = [], fields = [], len = this.s.length, inField = false, inUnqualifiedString = false, self = this;
      var ca = function(i){return self.s.charAt(i)};
      if (typeof lineDelimiter !== 'undefined') var rows = [];

      if (!qualifier)
        inField = true;

      while (i < len) {
        var current = ca(i);
        switch (current) {
          case escape:
            //fix for issues #32 and #35
            if (inField && ((escape !== qualifier) || ca(i+1) === qualifier)) {
              i += 1;
              fieldBuffer.push(ca(i));
              break;
            }
            if (escape !== qualifier) break;
          case qualifier:
            inField = !inField;
            break;
          case delimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
            }
            if (inField && qualifier)
              fieldBuffer.push(current);
            else {
              fields.push(fieldBuffer.join(''))
              fieldBuffer.length = 0;
            }
            break;
          case lineDelimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
              fields.push(fieldBuffer.join(''))
              rows.push(fields);
              fields = [];
              fieldBuffer.length = 0;
            }
            else if (inField) {
              fieldBuffer.push(current);
            } else {
              if (rows) {
                fields.push(fieldBuffer.join(''))
                rows.push(fields);
                fields = [];
                fieldBuffer.length = 0;
              }
            }
            break;
          case ' ':
            if (inField)
              fieldBuffer.push(current);
            break;
          default:
            if (inField)
              fieldBuffer.push(current);
            else if(current!==qualifier) {
              fieldBuffer.push(current);
              inField=true;
              inUnqualifiedString=true;
            }
            break;
        }
        i += 1;
      }

      fields.push(fieldBuffer.join(''));
      if (rows) {
        rows.push(fields);
        return rows;
      }
      return fields;
    },

    replaceAll: function(ss, r) {
      //var s = this.s.replace(new RegExp(ss, 'g'), r);
      var s = this.s.split(ss).join(r)
      return new this.constructor(s);
    },

    strip: function() {
      var ss = this.s;
      for(var i= 0, n=arguments.length; i<n; i++) {
        ss = ss.split(arguments[i]).join('');
      }
      return new this.constructor(ss);
    },

    right: function(N) {
      if (N >= 0) {
        var s = this.s.substr(this.s.length - N, N);
        return new this.constructor(s);
      } else {
        return this.left(-N);
      }
    },

    setValue: function (s) {
	  initialize(this, s);
	  return this;
    },

    slugify: function() {
      var sl = (new S(new S(this.s).latinise().s.replace(/[^\w\s-]/g, '').toLowerCase())).dasherize().s;
      if (sl.charAt(0) === '-')
        sl = sl.substr(1);
      return new this.constructor(sl);
    },

    startsWith: function() {
      var prefixes = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < prefixes.length; ++i) {
        if (this.s.lastIndexOf(prefixes[i], 0) === 0) return true;
      }
      return false;
    },

    stripPunctuation: function() {
      //return new this.constructor(this.s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
      return new this.constructor(this.s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
    },

    stripTags: function() { //from sugar.js
      var s = this.s, args = arguments.length > 0 ? arguments : [''];
      multiArgs(args, function(tag) {
        s = s.replace(RegExp('<\/?' + tag + '[^<>]*>', 'gi'), '');
      });
      return new this.constructor(s);
    },

    template: function(values, opening, closing) {
      var s = this.s
      var opening = opening || Export.TMPL_OPEN
      var closing = closing || Export.TMPL_CLOSE

      var open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var r = new RegExp(open + '(.+?)' + close, 'g')
        //, r = /\{\{(.+?)\}\}/g
      var matches = s.match(r) || [];

      matches.forEach(function(match) {
        var key = match.substring(opening.length, match.length - closing.length).trim();//chop {{ and }}
        var value = typeof values[key] == 'undefined' ? '' : values[key];
        s = s.replace(match, value);
      });
      return new this.constructor(s);
    },

    times: function(n) {
      return new this.constructor(new Array(n + 1).join(this.s));
    },

    toBoolean: function() {
      if (typeof this.orig === 'string') {
        var s = this.s.toLowerCase();
        return s === 'true' || s === 'yes' || s === 'on' || s === '1';
      } else
        return this.orig === true || this.orig === 1;
    },

    toFloat: function(precision) {
      var num = parseFloat(this.s)
      if (precision)
        return parseFloat(num.toFixed(precision))
      else
        return num
    },

    toInt: function() { //thanks Google
      // If the string starts with '0x' or '-0x', parse as hex.
      return /^\s*-?0x/i.test(this.s) ? parseInt(this.s, 16) : parseInt(this.s, 10)
    },

    trim: function() {
      var s;
      if (typeof __nsp.trim === 'undefined') 
        s = this.s.replace(/(^\s*|\s*$)/g, '')
      else 
        s = this.s.trim()
      return new this.constructor(s);
    },

    trimLeft: function() {
      var s;
      if (__nsp.trimLeft)
        s = this.s.trimLeft();
      else
        s = this.s.replace(/(^\s*)/g, '');
      return new this.constructor(s);
    },

    trimRight: function() {
      var s;
      if (__nsp.trimRight)
        s = this.s.trimRight();
      else
        s = this.s.replace(/\s+$/, '');
      return new this.constructor(s);
    },

    truncate: function(length, pruneStr) { //from underscore.string, author: github.com/rwz
      var str = this.s;

      length = ~~length;
      pruneStr = pruneStr || '...';

      if (str.length <= length) return new this.constructor(str);

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = new S(template.slice(0, template.length-1)).trimRight().s;

      return (template+pruneStr).length > str.length ? new S(str) : new S(str.slice(0, template.length)+pruneStr);
    },

    toCSV: function() {
      var delim = ',', qualifier = '"', escape = '\\', encloseNumbers = true, keys = false;
      var dataArray = [];

      function hasVal(it) {
        return it !== null && it !== '';
      }

      if (typeof arguments[0] === 'object') {
        delim = arguments[0].delimiter || delim;
        delim = arguments[0].separator || delim;
        qualifier = arguments[0].qualifier || qualifier;
        encloseNumbers = !!arguments[0].encloseNumbers;
        escape = arguments[0].escape || escape;
        keys = !!arguments[0].keys;
      } else if (typeof arguments[0] === 'string') {
        delim = arguments[0];
      }

      if (typeof arguments[1] === 'string')
        qualifier = arguments[1];

      if (arguments[1] === null)
        qualifier = null;

       if (this.orig instanceof Array)
        dataArray  = this.orig;
      else { //object
        for (var key in this.orig)
          if (this.orig.hasOwnProperty(key))
            if (keys)
              dataArray.push(key);
            else
              dataArray.push(this.orig[key]);
      }

      var rep = escape + qualifier;
      var buildString = [];
      for (var i = 0; i < dataArray.length; ++i) {
        var shouldQualify = hasVal(qualifier)
        if (typeof dataArray[i] == 'number')
          shouldQualify &= encloseNumbers;
        
        if (shouldQualify)
          buildString.push(qualifier);
        
        if (dataArray[i] !== null && dataArray[i] !== undefined) {
          var d = new S(dataArray[i]).replaceAll(qualifier, rep).s;
          buildString.push(d);
        } else 
          buildString.push('')

        if (shouldQualify)
          buildString.push(qualifier);
        
        if (delim)
          buildString.push(delim);
      }

      //chop last delim
      //console.log(buildString.length)
      buildString.length = buildString.length - 1;
      return new this.constructor(buildString.join(''));
    },

    toString: function() {
      return this.s;
    },

    //#modified from https://github.com/epeli/underscore.string
    underscore: function() {
      var s = this.trim().s.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
      if ((new S(this.s.charAt(0))).isUpper()) {
        s = '_' + s;
      }
      return new this.constructor(s);
    },

    unescapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      }));
    },

    valueOf: function() {
      return this.s.valueOf();
    },

    //#Added a New Function called wrapHTML.
    wrapHTML: function (tagName, tagAttrs) {
      var s = this.s, el = (tagName == null) ? 'span' : tagName, elAttr = '', wrapped = '';
      if(typeof tagAttrs == 'object') for(var prop in tagAttrs) elAttr += ' ' + prop + '="' +(new this.constructor(tagAttrs[prop])).escapeHTML() + '"';
      s = wrapped.concat('<', el, elAttr, '>', this, '</', el, '>');
      return new this.constructor(s);
    }
  }

  var methodsAdded = [];
  function extendPrototype() {
    for (var name in __sp) {
      (function(name){
        var func = __sp[name];
        if (!__nsp.hasOwnProperty(name)) {
          methodsAdded.push(name);
          __nsp[name] = function() {
            String.prototype.s = this;
            return func.apply(this, arguments);
          }
        }
      })(name);
    }
  }

  function restorePrototype() {
    for (var i = 0; i < methodsAdded.length; ++i)
      delete String.prototype[methodsAdded[i]];
    methodsAdded.length = 0;
  }


/*************************************
/* Attach Native JavaScript String Properties
/*************************************/

  var nativeProperties = getNativeStringProperties();
  for (var name in nativeProperties) {
    (function(name) {
      var stringProp = __nsp[name];
      if (typeof stringProp == 'function') {
        //console.log(stringProp)
        if (!__sp[name]) {
          if (nativeProperties[name] === 'string') {
            __sp[name] = function() {
              //console.log(name)
              return new this.constructor(stringProp.apply(this, arguments));
            }
          } else {
            __sp[name] = stringProp;
          }
        }
      }
    })(name);
  }


/*************************************
/* Function Aliases
/*************************************/

  __sp.repeat = __sp.times;
  __sp.include = __sp.contains;
  __sp.toInteger = __sp.toInt;
  __sp.toBool = __sp.toBoolean;
  __sp.decodeHTMLEntities = __sp.decodeHtmlEntities //ensure consistent casing scheme of 'HTML'


//******************************************************************************
// Set the constructor.  Without this, string.js objects are instances of
// Object instead of S.
//******************************************************************************

  __sp.constructor = S;


/*************************************
/* Private Functions
/*************************************/

  function getNativeStringProperties() {
    var names = getNativeStringPropertyNames();
    var retObj = {};

    for (var i = 0; i < names.length; ++i) {
      var name = names[i];
      var func = __nsp[name];
      try {
        var type = typeof func.apply('teststring', []);
        retObj[name] = type;
      } catch (e) {}
    }
    return retObj;
  }

  function getNativeStringPropertyNames() {
    var results = [];
    if (Object.getOwnPropertyNames) {
      results = Object.getOwnPropertyNames(__nsp);
      results.splice(results.indexOf('valueOf'), 1);
      results.splice(results.indexOf('toString'), 1);
      return results;
    } else { //meant for legacy cruft, this could probably be made more efficient
      var stringNames = {};
      var objectNames = [];
      for (var name in String.prototype)
        stringNames[name] = name;

      for (var name in Object.prototype)
        delete stringNames[name];

      //stringNames['toString'] = 'toString'; //this was deleted with the rest of the object names
      for (var name in stringNames) {
        results.push(name);
      }
      return results;
    }
  }

  function Export(str) {
    return new S(str);
  };

  //attach exports to StringJSWrapper
  Export.extendPrototype = extendPrototype;
  Export.restorePrototype = restorePrototype;
  Export.VERSION = VERSION;
  Export.TMPL_OPEN = '{{';
  Export.TMPL_CLOSE = '}}';
  Export.ENTITIES = ENTITIES;



/*************************************
/* Exports
/*************************************/

  if (typeof module !== 'undefined'  && typeof module.exports !== 'undefined') {
    module.exports = Export;

  } else {

    if(typeof define === "function" && define.amd) {
      define([], function() {
        return Export;
      });
    } else {
      window.S = Export;
    }
  }


/*************************************
/* 3rd Party Private Functions
/*************************************/

  //from sugar.js
  function multiArgs(args, fn) {
    var result = [], i;
    for(i = 0; i < args.length; i++) {
      result.push(args[i]);
      if(fn) fn.call(args, args[i], i);
    }
    return result;
  }

  //from underscore.string
  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    amp: '&'
  };

  //from underscore.string
  var reversedEscapeChars = {};
  for(var key in escapeChars){ reversedEscapeChars[escapeChars[key]] = key; }

  ENTITIES = {
    "amp" : "&",
    "gt" : ">",
    "lt" : "<",
    "quot" : "\"",
    "apos" : "'",
    "AElig" : 198,
    "Aacute" : 193,
    "Acirc" : 194,
    "Agrave" : 192,
    "Aring" : 197,
    "Atilde" : 195,
    "Auml" : 196,
    "Ccedil" : 199,
    "ETH" : 208,
    "Eacute" : 201,
    "Ecirc" : 202,
    "Egrave" : 200,
    "Euml" : 203,
    "Iacute" : 205,
    "Icirc" : 206,
    "Igrave" : 204,
    "Iuml" : 207,
    "Ntilde" : 209,
    "Oacute" : 211,
    "Ocirc" : 212,
    "Ograve" : 210,
    "Oslash" : 216,
    "Otilde" : 213,
    "Ouml" : 214,
    "THORN" : 222,
    "Uacute" : 218,
    "Ucirc" : 219,
    "Ugrave" : 217,
    "Uuml" : 220,
    "Yacute" : 221,
    "aacute" : 225,
    "acirc" : 226,
    "aelig" : 230,
    "agrave" : 224,
    "aring" : 229,
    "atilde" : 227,
    "auml" : 228,
    "ccedil" : 231,
    "eacute" : 233,
    "ecirc" : 234,
    "egrave" : 232,
    "eth" : 240,
    "euml" : 235,
    "iacute" : 237,
    "icirc" : 238,
    "igrave" : 236,
    "iuml" : 239,
    "ntilde" : 241,
    "oacute" : 243,
    "ocirc" : 244,
    "ograve" : 242,
    "oslash" : 248,
    "otilde" : 245,
    "ouml" : 246,
    "szlig" : 223,
    "thorn" : 254,
    "uacute" : 250,
    "ucirc" : 251,
    "ugrave" : 249,
    "uuml" : 252,
    "yacute" : 253,
    "yuml" : 255,
    "copy" : 169,
    "reg" : 174,
    "nbsp" : 160,
    "iexcl" : 161,
    "cent" : 162,
    "pound" : 163,
    "curren" : 164,
    "yen" : 165,
    "brvbar" : 166,
    "sect" : 167,
    "uml" : 168,
    "ordf" : 170,
    "laquo" : 171,
    "not" : 172,
    "shy" : 173,
    "macr" : 175,
    "deg" : 176,
    "plusmn" : 177,
    "sup1" : 185,
    "sup2" : 178,
    "sup3" : 179,
    "acute" : 180,
    "micro" : 181,
    "para" : 182,
    "middot" : 183,
    "cedil" : 184,
    "ordm" : 186,
    "raquo" : 187,
    "frac14" : 188,
    "frac12" : 189,
    "frac34" : 190,
    "iquest" : 191,
    "times" : 215,
    "divide" : 247,
    "OElig;" : 338,
    "oelig;" : 339,
    "Scaron;" : 352,
    "scaron;" : 353,
    "Yuml;" : 376,
    "fnof;" : 402,
    "circ;" : 710,
    "tilde;" : 732,
    "Alpha;" : 913,
    "Beta;" : 914,
    "Gamma;" : 915,
    "Delta;" : 916,
    "Epsilon;" : 917,
    "Zeta;" : 918,
    "Eta;" : 919,
    "Theta;" : 920,
    "Iota;" : 921,
    "Kappa;" : 922,
    "Lambda;" : 923,
    "Mu;" : 924,
    "Nu;" : 925,
    "Xi;" : 926,
    "Omicron;" : 927,
    "Pi;" : 928,
    "Rho;" : 929,
    "Sigma;" : 931,
    "Tau;" : 932,
    "Upsilon;" : 933,
    "Phi;" : 934,
    "Chi;" : 935,
    "Psi;" : 936,
    "Omega;" : 937,
    "alpha;" : 945,
    "beta;" : 946,
    "gamma;" : 947,
    "delta;" : 948,
    "epsilon;" : 949,
    "zeta;" : 950,
    "eta;" : 951,
    "theta;" : 952,
    "iota;" : 953,
    "kappa;" : 954,
    "lambda;" : 955,
    "mu;" : 956,
    "nu;" : 957,
    "xi;" : 958,
    "omicron;" : 959,
    "pi;" : 960,
    "rho;" : 961,
    "sigmaf;" : 962,
    "sigma;" : 963,
    "tau;" : 964,
    "upsilon;" : 965,
    "phi;" : 966,
    "chi;" : 967,
    "psi;" : 968,
    "omega;" : 969,
    "thetasym;" : 977,
    "upsih;" : 978,
    "piv;" : 982,
    "ensp;" : 8194,
    "emsp;" : 8195,
    "thinsp;" : 8201,
    "zwnj;" : 8204,
    "zwj;" : 8205,
    "lrm;" : 8206,
    "rlm;" : 8207,
    "ndash;" : 8211,
    "mdash;" : 8212,
    "lsquo;" : 8216,
    "rsquo;" : 8217,
    "sbquo;" : 8218,
    "ldquo;" : 8220,
    "rdquo;" : 8221,
    "bdquo;" : 8222,
    "dagger;" : 8224,
    "Dagger;" : 8225,
    "bull;" : 8226,
    "hellip;" : 8230,
    "permil;" : 8240,
    "prime;" : 8242,
    "Prime;" : 8243,
    "lsaquo;" : 8249,
    "rsaquo;" : 8250,
    "oline;" : 8254,
    "frasl;" : 8260,
    "euro;" : 8364,
    "image;" : 8465,
    "weierp;" : 8472,
    "real;" : 8476,
    "trade;" : 8482,
    "alefsym;" : 8501,
    "larr;" : 8592,
    "uarr;" : 8593,
    "rarr;" : 8594,
    "darr;" : 8595,
    "harr;" : 8596,
    "crarr;" : 8629,
    "lArr;" : 8656,
    "uArr;" : 8657,
    "rArr;" : 8658,
    "dArr;" : 8659,
    "hArr;" : 8660,
    "forall;" : 8704,
    "part;" : 8706,
    "exist;" : 8707,
    "empty;" : 8709,
    "nabla;" : 8711,
    "isin;" : 8712,
    "notin;" : 8713,
    "ni;" : 8715,
    "prod;" : 8719,
    "sum;" : 8721,
    "minus;" : 8722,
    "lowast;" : 8727,
    "radic;" : 8730,
    "prop;" : 8733,
    "infin;" : 8734,
    "ang;" : 8736,
    "and;" : 8743,
    "or;" : 8744,
    "cap;" : 8745,
    "cup;" : 8746,
    "int;" : 8747,
    "there4;" : 8756,
    "sim;" : 8764,
    "cong;" : 8773,
    "asymp;" : 8776,
    "ne;" : 8800,
    "equiv;" : 8801,
    "le;" : 8804,
    "ge;" : 8805,
    "sub;" : 8834,
    "sup;" : 8835,
    "nsub;" : 8836,
    "sube;" : 8838,
    "supe;" : 8839,
    "oplus;" : 8853,
    "otimes;" : 8855,
    "perp;" : 8869,
    "sdot;" : 8901,
    "lceil;" : 8968,
    "rceil;" : 8969,
    "lfloor;" : 8970,
    "rfloor;" : 8971,
    "lang;" : 9001,
    "rang;" : 9002,
    "loz;" : 9674,
    "spades;" : 9824,
    "clubs;" : 9827,
    "hearts;" : 9829,
    "diams;" : 9830
  }


}).call(this);

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _domain = require('domain');

var _domain2 = _interopRequireDefault(_domain);

var _synLibAppCache = require('syn/lib/app/Cache');

var _synLibAppCache2 = _interopRequireDefault(_synLibAppCache);

var App = (function (_EventEmitter) {
  function App(connect) {
    var _this = this;

    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this);

    this.socket();

    if (connect) {
      this.socket.on('welcome', function (user) {
        _this.socket.synuser = user;
        _this.emit('ready');
      });
    }

    this.store = {
      onlineUsers: 0
    };

    this.socket.on('online users', function (online) {
      return _this.set('onlineUsers', online);
    });

    this.domain = _domain2['default'].create().on('error', function (error) {
      return _this.emit('error', error);
    });

    this.domain.intercept = function (handler) {
      return function (error) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return _this.domain.run(function () {
          if (error) {
            throw error;
          }
          handler.apply(undefined, args);
        });
      };
    };
  }

  _inherits(App, _EventEmitter);

  _createClass(App, [{
    key: 'get',
    value: function get(key) {
      return this.store[key];
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      this.store[key] = value;

      this.emit('set', key, value);

      return this;
    }
  }, {
    key: 'error',
    value: function error(err) {
      console.log('App error');
    }
  }, {
    key: 'ready',
    value: function ready(fn) {
      this.on('ready', fn);
    }
  }, {
    key: 'socket',
    value: function socket() {

      if (!io.$$socket) {
        io.$$socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);
      }

      this.socket = io.$$socket;
    }
  }, {
    key: 'publish',
    value: function publish(event) {
      var _this2 = this;

      for (var _len2 = arguments.length, messages = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        messages[_key2 - 1] = arguments[_key2];
      }

      var unsubscribe = function unsubscribe() {
        _this2.socket.removeListener('OK ' + event, _this2.handler);
      };

      return {
        subscribe: function subscribe(handler) {
          var _socket$on;

          (_socket$on = _this2.socket.on('OK ' + event, function () {
            for (var _len3 = arguments.length, responses = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              responses[_key3] = arguments[_key3];
            }

            return handler.apply(undefined, [{ unsubscribe: unsubscribe.bind(handler) }].concat(responses));
          })).emit.apply(_socket$on, [event].concat(messages));
        }
      };
    }
  }, {
    key: 'load',
    value: function load() {

      if (!this.template) {
        if (_synLibAppCache2['default'].getTemplate(this.componentName)) {
          this.template = $(_synLibAppCache2['default'].getTemplate(this.componentName));
        } else {
          var View = this.view;
          var view = new View(this.props);
          _synLibAppCache2['default'].setTemplate(this.componentName, view.render());
          this.template = $(_synLibAppCache2['default'].getTemplate(this.componentName));
        }
      }

      return this.template;
    }
  }]);

  return App;
})(_events.EventEmitter);

exports['default'] = App;

function anon() {

  'use strict';

  var domain = require('domain');
  var Socket = require('syn/lib/app/Socket');
  var Cache = require('syn/lib/app/Cache');

  function Domain(onError) {
    return domain.create().on('error', onError);
  }

  /**
   *  @class Synapp
   *  @extends EventEmitter
   */

  function Synapp() {
    var self = this;

    this.domain = new Domain(function (error) {
      console.error('Synapp error', error.stack);
    });

    this.domain.intercept = function (fn, _self) {

      if (typeof fn !== 'function') {
        fn = function () {};
      }

      return function (error) {
        if (error && error instanceof Error) {
          self.domain.emit('error', error);
        } else {
          var args = Array.prototype.slice.call(arguments);

          args.shift();

          fn.apply(_self, args);
        }
      };
    };

    this.location = {};

    this.cache = new Cache();

    this.domain.run(function () {

      /** Location */

      if (window.location.pathname) {

        if (/^\/item\//.test(window.location.pathname)) {
          self.location.item = window.location.pathname.split(/\//)[2];
        }
      }

      self.socket = new Socket(self.emit.bind(self)).socket;

      // self.evaluations = [];

      // self.cache = {
      //   template: {
      //     item: null
      //   }
      // };

      // if ( synapp.user ) {
      //   $('.is-in').removeClass('is-in');
      // }
    });
  }

  require('util').inherits(Synapp, require('events').EventEmitter);

  /**
   *  @method connect
   *  @description Sugar to register a listener to the "connect" event
   *  @arg {function} fn
   *  @deprecated Use ready instead
   */

  Synapp.prototype.connect = function (fn) {
    this.on('connect', fn);

    return this;
  };

  /**
   *  @method ready
   *  @description Sugar to register a listener to the "ready" event
   *  @arg {function} fn
   */

  Synapp.prototype.ready = function (fn) {
    this.on('ready', fn);

    return this;
  };

  // Export

  if (module && module.exports) {
    module.exports = Synapp;
  }

  if (typeof window === 'object') {
    window.Synapp = Synapp;
  }
}
module.exports = exports['default'];

},{"domain":6,"events":7,"syn/lib/app/Cache":59,"syn/lib/app/Socket":62,"util":25}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsPanelController = require('syn/components/Panel/Controller');

var _synComponentsPanelController2 = _interopRequireDefault(_synComponentsPanelController);

var _synComponentsCreatorControllersRender = require('syn/components/Creator/controllers/render');

var _synComponentsCreatorControllersRender2 = _interopRequireDefault(_synComponentsCreatorControllersRender);

var text = {
  'looking up title': 'Looking up'
};

var Creator = (function (_Controller) {
  function Creator(props) {
    _classCallCheck(this, Creator);

    _get(Object.getPrototypeOf(Creator.prototype), 'constructor', this).call(this);

    this.props = props || {};

    this.panel = props.panel;
  }

  _inherits(Creator, _Controller);

  _createClass(Creator, [{
    key: 'template',
    get: function () {
      return $('#' + this.props.panel.id).find('.creator:first');
    }
  }, {
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'create button':
          return this.template.find('.button-create:first');

        case 'form':
          return this.template.find('form');

        case 'dropbox':
          return this.template.find('.drop-box');

        case 'subject':
          return this.template.find('[name="subject"]');

        case 'description':
          return this.template.find('[name="description"]');

        case 'item media':
          return this.template.find('.item-media');

        case 'reference':
          return this.template.find('.reference');

        case 'reference board':
          return this.template.find('.reference-board');

        case 'upload image button':
          return this.template.find('.upload-image-button');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      return _synComponentsCreatorControllersRender2['default'].apply(this, [cb]);
    }
  }]);

  return Creator;
})(_synLibAppController2['default']);

exports['default'] = Creator;

function foo() {

  'use strict';

  module.exports = Creator;

  var Panel = require('syn/components/Panel/Controller');

  var text = {
    'looking up title': 'Looking up'
  };

  /**
   *  @class
   *  @arg {Panel} - panel
   */

  function Creator(panel) {

    if (!app) {
      throw new Error('Missing app');
    }

    if (!(panel instanceof require('syn/components/Panel/Controller'))) {
      throw new Error('Creator: Panel must be a Panel object');
    }

    this.panel = panel;

    this.template = $('#' + this.panel.getId()).find('.creator:first');
  }

  Creator.prototype.find = function (name) {
    switch (name) {
      case 'create button':
        return this.template.find('.button-create:first');

      case 'form':
        return this.template.find('form');

      case 'dropbox':
        return this.template.find('.drop-box');

      case 'subject':
        return this.template.find('[name="subject"]');

      case 'description':
        return this.template.find('[name="description"]');

      case 'item media':
        return this.template.find('.item-media');

      case 'reference':
        return this.template.find('.reference');

      case 'reference board':
        return this.template.find('.reference-board');

      case 'upload image button':
        return this.template.find('.upload-image-button');
    }
  };

  Creator.prototype.render = require('syn/components/Creator/controllers/render');

  Creator.prototype.create = require('syn/components/Creator/controllers/create');

  Creator.prototype.created = require('syn/components/Creator/controllers/created');

  Creator.prototype.packItem = require('syn/components/Creator/controllers/pack-item');
}
module.exports = exports['default'];

},{"syn/components/Creator/controllers/create":37,"syn/components/Creator/controllers/created":38,"syn/components/Creator/controllers/pack-item":39,"syn/components/Creator/controllers/render":40,"syn/components/Panel/Controller":52,"syn/lib/app/Controller":60}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cinco = require('cinco');

var _synComponentsItemView = require('syn/components/Item/View');

var _synComponentsItemView2 = _interopRequireDefault(_synComponentsItemView);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  Creator
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Creator = (function (_Element) {
  function Creator(props) {
    _classCallCheck(this, Creator);

    _get(Object.getPrototypeOf(Creator.prototype), 'constructor', this).call(this, 'form.creator.is-container', {
      name: 'create',
      novalidate: 'novalidate',
      role: 'form',
      method: 'POST'
    });

    this.props = props;

    var itemBox = this.itemBox();

    itemBox.find('.item-text').get(0).empty().add(this.inputs());

    this.add(new _cinco.Element('.is-section').add(itemBox));
  }

  _inherits(Creator, _Element);

  _createClass(Creator, [{
    key: 'modern',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Drag and drop (modern browsers only)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function modern() {
      return new _cinco.Element('.modern').add(new _cinco.Element('h4').text('Drop image here'), new _cinco.Element('p').text('or'));
    }
  }, {
    key: 'legacy',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Legacy input type file (masked by a button for design purposes)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function legacy() {
      return new _cinco.Element('.phasing').add(new _cinco.Element('button.upload-image-button', { type: 'button' }).text('Choose a file'), new _cinco.Element('input.hide', {
        type: 'file',
        value: 'Upload image' }).close());
    }
  }, {
    key: 'dropBox',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Image uploader container
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function dropBox() {
      return new _cinco.Element('.drop-box').add(this.modern(), this.legacy());
    }
  }, {
    key: 'submitButton',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Submit button
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function submitButton() {
      return new _cinco.Element('button.button-create.shy.medium').add(new _cinco.Element('i.fa.fa-bullhorn'));
    }
  }, {
    key: 'itemBox',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Item Component
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function itemBox() {
      return new _synComponentsItemView2['default']({
        item: {
          media: this.dropBox(),
          buttons: new _cinco.Elements(this.submitButton()),
          collapsers: false
        }
      });
    }
  }, {
    key: 'inputs',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Text inputs
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function inputs() {
      return new _cinco.Element('.item-inputs').add(this.subject(), this.description());
    }
  }, {
    key: 'subject',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Subject field
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function subject() {
      return new _cinco.Element('input', {
        type: 'text',
        placeholder: 'Item subject',
        required: 'required',
        name: 'subject' });
    }
  }, {
    key: 'description',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Description field
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function description() {
      return new _cinco.Element('textarea', {
        placeholder: 'Item description',
        required: 'required',
        name: 'description'
      });
    }
  }]);

  return Creator;
})(_cinco.Element);

exports['default'] = Creator;
module.exports = exports['default'];

},{"cinco":31,"syn/components/Item/View":47}],37:[function(require,module,exports){
(function (process){
'use strict';

!(function () {

  'use strict';

  var Nav = require('syn/lib/util/Nav');
  var Item = require('syn/components/Item/Controller');
  var Stream = require('syn/lib/util/Stream');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save() {

    // Self reference

    var creator = this;

    process.nextTick(function () {

      app.domain.run(function () {

        // Hide the Creator           // Catch errors

        Nav.hide(creator.template).error(app.domain.intercept())

        // Hiding complete

        .hidden(function () {

          // Build the JSON object to save to MongoDB

          creator.packItem();

          // In case a file was uploaded

          if (creator.packaged.upload) {

            // Get file from template's data

            var file = creator.template.find('.preview-image').data('file');

            // New stream         //  Catch stream errors

            new Stream(file).on('error', app.domain.intercept(function () {})).on('end', function () {
              creator.packaged.image = file.name;

              console.log('create item', creator.packaged);

              app.socket.emit('create item', creator.packaged);
            });
          }

          // If nof ile was uploaded

          else {
            console.log('create item', creator.packaged);

            app.socket.publish('create item', creator.packaged, creator.created.bind(creator));
          }

          // Listen to answers

          app.socket.once('could not create item', app.domain.intercept());

          // app.socket.on('create item ok', creator.created.bind(creator));
        });
      });
    });

    return false;
  }

  module.exports = save;
})();

}).call(this,require('_process'))
},{"_process":10,"syn/components/Item/Controller":46,"syn/lib/util/Nav":64,"syn/lib/util/Stream":66}],38:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  function created(item) {
    console.log('created item', item);

    this.panel.template.find('.create-new').hide();

    if (this.packaged.upload) {
      item.upload = this.packaged.upload;
    }

    if (this.packaged.youtube) {
      item.youtube = this.packaged.youtube;
    }

    var item = new (require('syn/components/Item/Controller'))(item);

    var items = this.panel.find('items');

    item.load(app.domain.intercept(function () {
      item.template.addClass('new');
      items.prepend(item.template);
      item.render(app.domain.intercept(function () {
        item.find('toggle promote').click();
      }));
    }));
  }

  module.exports = created;
})();

},{"syn/components/Item/Controller":46}],39:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function packItem() {

    var item = {
      type: this.panel.type,
      subject: this.find('subject').val(),
      description: this.find('description').val(),
      user: app.socket.synuser
    };

    // Parent

    if (this.panel.parent) {
      item.parent = this.panel.parent;
    }

    // References

    if (this.find('reference').val()) {
      item.references = [{ url: this.find('reference').val() }];

      if (this.find('reference board').text() && this.find('reference board').text() !== 'Looking up title') {
        item.references[0].title = this.find('reference board').text();
      }
    }

    // Image

    if (this.find('item media').find('img').length) {

      // YouTube

      if (this.find('item media').find('.youtube-preview').length) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      }

      // Upload

      else {
        item.upload = this.find('item media').find('img').attr('src');
        item.image = item.upload;
      }
    }

    this.packaged = item;
  }

  module.exports = packItem;
})();

},{}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilUpload = require('syn/lib/util/Upload');

var _synLibUtilUpload2 = _interopRequireDefault(_synLibUtilUpload);

var _synLibUtilForm = require('syn/lib/util/Form');

var _synLibUtilForm2 = _interopRequireDefault(_synLibUtilForm);

var _synComponentsYouTubeController = require('syn/components/YouTube/Controller');

var _synComponentsYouTubeController2 = _interopRequireDefault(_synComponentsYouTubeController);

var _domain = require('domain');

var _domain2 = _interopRequireDefault(_domain);

function renderCreator(cb) {
  var _this = this;

  var q = new Promise(function (fulfill, reject) {

    var d = _domain2['default'].create().on('error', reject);

    d.run(function () {
      // Make sure template exists in DOM

      if (!_this.template.length) {
        throw new Error('Creator not found in panel ' + _this.panel.getId());
      }

      // Attach component to template's data

      _this.template.data('creator', _this);

      // Emulate input type file's behavior with button

      _this.find('upload image button').on('click', function () {
        _this.find('dropbox').find('[type="file"]').click();
      });

      // Use upload service

      new _synLibUtilUpload2['default'](_this.find('dropbox'), _this.find('dropbox').find('input'), _this.find('dropbox'));

      // Autogrow

      _this.template.find('textarea').autogrow();

      // Get reference's title

      _this.find('reference').on('change', function () {

        var creator = $(this).closest('.creator').data('creator');

        var board = creator.find('reference board');
        var reference = $(this);

        board.removeClass('hide').text('Looking up title');

        app.socket.emit('get url title', $(this).val(), function (error, ref) {
          if (ref.title) {

            board.text(ref.title);
            reference.data('title', ref.title);

            var yt = __YouTube(ref.url);

            if (yt) {
              creator.find('dropbox').hide();

              creator.find('item media').empty().append(yt);
            }
          } else {
            board.text('Looking up').addClass('hide');
          }
        });
      });

      // Build form using Form provider

      var form = new _synLibUtilForm2['default'](_this.template);

      form.send(_this.create);

      // Done

      fulfill();
    });
  });

  if (typeof cb === 'function') {
    q.then(cb.bind(null, null), cb);
  }

  return q;
}

exports['default'] = renderCreator;
module.exports = exports['default'];

},{"domain":6,"syn/components/YouTube/Controller":57,"syn/lib/util/Form":63,"syn/lib/util/Upload":67}],41:[function(require,module,exports){
'use strict';

!(function _DetailsComponent_() {

  'use strict';

  var EditComponent = require('syn/components/EditAndGoAgain/Controller');

  var NavProvider = require('syn/lib/util/Nav');

  /**
   *  @class            DetailsComponent
   *  @arg              {ItemComponent} item
   */

  function DetailsComponent(item) {

    if (!app) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if (!item || !item instanceof require('syn/components/Item/Controller')) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('details');

      if (!self.template.length) {
        throw new Error('Details template not found');
      }
    });
  }

  /**
   *  @method           
   *  @description      DOM selectors abstractions
   *  @return           null
   *  @arg              {string} name
   */

  DetailsComponent.prototype.find = function (name) {
    switch (name) {
      case 'promoted bar':
        return this.template.find('.progress');

      case 'feedback list':
        return this.template.find('.feedback-list');

      case 'votes':
        return this.template.find('.details-votes');

      case 'toggle edit and go again':
        return this.template.find('.edit-and-go-again-toggler');
    }
  };

  /**
   *  @method
   *  @description          DOM manipulation
   *  @arg                  {function} cb
   */

  DetailsComponent.prototype.render = function (cb) {
    var self = this;

    var item = self.item.item;

    self.find('promoted bar').goalProgress({
      goalAmount: 100,
      currentAmount: Math.floor(item.promotions * 100 / item.views),
      textBefore: '',
      textAfter: '%'
    });

    self.find('toggle edit and go again').on('click', function () {
      NavProvider.unreveal(self.template, self.item.template, app.domain.intercept(function () {
        if (self.item.find('editor').find('form').length) {
          console.warn('already loaded');
        } else {
          var edit = new EditComponent(self.item);

          edit.get(app.domain.intercept(function (template) {

            self.item.find('editor').find('.is-section').append(template);

            NavProvider.reveal(self.item.find('editor'), self.item.template, app.domain.intercept(function () {
              NavProvider.show(template, app.domain.intercept(function () {
                edit.render();
              }));
            }));
          }));
        }
      }));
    });

    if (app.socket.synuser) {
      $('.is-in').removeClass('is-in');
    }

    if (!self.details) {
      this.get();
    }
  };

  /**
   *  @method
   *  @description    Display votes using c3.js
   *  @arg            {object} criteria
   *  @arg            {HTMLElement} svg
   */

  DetailsComponent.prototype.votes = function (criteria, svg) {
    var self = this;

    setTimeout(function () {
      var vote = self.details.votes[criteria._id];

      svg.attr('id', 'chart-' + self.details.item._id + '-' + criteria._id);

      var data = [];

      // If no votes, show nothing

      if (!vote) {
        vote = {
          values: {
            '-1': 0,
            '0': 0,
            '1': 0
          },
          total: 0
        };
      }

      for (var number in vote.values) {
        data.push({
          label: 'number',
          value: vote.values[number] * 100 / vote.total
        });
      }

      var columns = ['votes'];

      data.forEach(function (d) {
        columns.push(d.value);
      });

      var chart = c3.generate({
        bindto: '#' + svg.attr('id'),
        data: {
          x: 'x',
          columns: [['x', -1, 0, 1], columns],
          type: 'bar'
        },
        grid: {
          x: {
            lines: 3
          }
        },
        axis: {
          x: {},
          y: {
            max: 90,
            show: false,
            tick: {
              count: 5,
              format: function format(y) {
                return y;
              }
            }
          }
        },
        size: {
          height: 80
        },
        bar: {
          width: $(window).width() / 5
        }
      });
    }, 250);
  };

  /**
   *
   */

  DetailsComponent.prototype.get = function () {

    var self = this;

    app.socket.publish('get item details', self.item.item._id, function (details) {

      console.log('got item details', details);

      self.details = details;

      // Feedback

      details.feedbacks.forEach(function (feedback) {
        var tpl = $('<div class="pretext feedback"></div>');
        tpl.text(feedback.feedback);
        self.find('feedback list').append(tpl).append('<hr/>');
      });

      // Votes

      details.criterias.forEach(function (criteria, i) {
        self.find('votes').eq(i).find('h4').text(criteria.name);

        self.votes(criteria, self.find('votes').eq(i).find('svg'));
      });
    });
  };

  module.exports = DetailsComponent;
})();

},{"syn/components/EditAndGoAgain/Controller":43,"syn/components/Item/Controller":46,"syn/lib/util/Nav":64}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cinco = require('cinco');

var Details = (function (_Element) {
  function Details(props) {
    _classCallCheck(this, Details);

    _get(Object.getPrototypeOf(Details.prototype), 'constructor', this).call(this, 'section');
    this.add(this.invitePeople(), this.progressBar());
    for (var i = 0; i < 4; i++) {
      this.add(new _cinco.Element('.row.details-votes').add(new _cinco.Element('.tablet-30.middle').add(new _cinco.Element('h4', {
        'data-toggle': 'tooltip',
        'data-placement': 'top'
      }))));
    }
    this.add(this.feedback());
  }

  _inherits(Details, _Element);

  _createClass(Details, [{
    key: 'invitePeople',
    value: function invitePeople() {
      return new _cinco.Element('section.feedback-pending.hide').add(new _cinco.Element('h4').text('Feedback pending'), new _cinco.Element('p').text('While you are waiting for your feedback this is a great time to invite the people you know to join the effort to bring synergy to democracy.'), new _cinco.Element('a.btn.invite-people', { target: '_blank' }).text('Send'), new _cinco.Element('hr'));
    }
  }, {
    key: 'progressBar',
    value: function progressBar() {
      return new _cinco.Element('.row').add(new _cinco.Element('.tablet-30.middle').add(new _cinco.Element('h4').text('Promoted')), new _cinco.Element('.tablet-70.middle').add(new _cinco.Element('.progress')));
    }
  }, {
    key: 'feedback',
    value: function feedback() {
      return new _cinco.Element('.details-feedbacks').add(new _cinco.Element('h4').text('Feedback'), new _cinco.Element('.feedback-list'));
    }
  }]);

  return Details;
})(_cinco.Element);

exports['default'] = Details;
module.exports = exports['default'];

},{"cinco":31}],43:[function(require,module,exports){
'use strict';

!(function Component_EditAndGoAgain_Controller() {

  'use strict';

  var Nav = require('syn/lib/util/Nav');
  var Creator = require('syn/components/Creator/Controller');
  var Item = require('syn/components/Item/Controller');
  var Form = require('syn/lib/util/Form');

  /**
   *  @class
   *
   *  @arg {String} type
   *  @arg {String?} parent
   */

  function Edit(item) {

    console.log('EDIT', item);

    if (!app) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if (!item || !item instanceof require('syn/components/Item/Controller')) {
        throw new Error('Item must be an Item');
      }

      self.item = item;
    });
  }

  Edit.prototype.get = function (cb) {
    var edit = this;

    $.ajax({
      url: '/partial/creator'
    }).error(cb).success(function (data) {
      edit.template = $(data);

      cb(null, edit.template);
    });

    return this;
  };

  Edit.prototype.find = function (name) {
    switch (name) {
      case 'create button':
        return this.template.find('.button-create:first');

      case 'dropbox':
        return this.template.find('.drop-box');

      case 'subject':
        return this.template.find('[name="subject"]');

      case 'description':
        return this.template.find('[name="description"]');

      case 'item media':
        return this.template.find('.item-media');

      case 'reference':
        return this.template.find('.reference');

      case 'reference board':
        return this.template.find('.reference-board');
    }
  };

  Edit.prototype.render = function (cb) {

    var edit = this;

    // this.template.find('textarea').autogrow();

    this.template.find('[name="subject"]').val(edit.item.item.subject);
    this.template.find('[name="description"]').val(edit.item.item.description).autogrow();

    if (edit.item.item.references.length) {
      this.template.find('[name="reference"]').val(edit.item.item.references[0].url);
    }

    this.template.find('.item-media').empty().append(edit.item.media());

    var form = new Form(this.template);

    form.send(edit.save);

    return this;
  };

  Edit.prototype.save = require('syn/components/EditAndGoAgain/controllers/save');

  Edit.prototype.toItem = function () {
    var item = {
      from: this.item.item._id,
      subject: this.find('subject').val(),
      description: this.find('description').val(),
      user: app.socket.synuser,
      type: this.item.item.type
    };

    if (this.find('item media').find('img').length) {

      if (this.find('item media').find('.youtube-preview').length) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      } else {
        item.upload = this.find('item media').find('img').attr('src');
      }
    }

    return item;
  };

  module.exports = Edit;
})();

},{"syn/components/Creator/Controller":35,"syn/components/EditAndGoAgain/controllers/save":44,"syn/components/Item/Controller":46,"syn/lib/util/Form":63,"syn/lib/util/Nav":64}],44:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var Nav = require('syn/lib/util/Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save() {
    var edit = this;

    console.log(edit.toItem());

    Nav.hide(edit.template, app.domain.intercept(function () {
      Nav.hide(edit.template.closest('.editor'), app.domain.intercept(function () {

        var new_item = edit.toItem();

        app.socket.emit('create item', new_item);

        app.socket.once('could not create item', function (error) {
          console.error(error);
        });

        app.socket.once('created item', function (item) {
          console.log('created item', item);

          if (new_item.upload) {
            item.upload = new_item.upload;
          }

          if (new_item.youtube) {
            item.youtube = new_item.youtube;
          }

          var item = new (require('syn/components/Item/Controller'))(item);

          item.load(app.domain.intercept(function () {
            item.template.insertBefore(edit.item.template);

            item.render(app.domain.intercept(function () {
              item.find('toggle promote').click();
            }));
          }));
        });
      }));
    }));
  }

  module.exports = save;
})();

},{"syn/components/Item/Controller":46,"syn/lib/util/Nav":64}],45:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var Form = require('syn/lib/util/Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function forgotPassword($vexContent) {
    var signForm = $('form[name="forgot-password"]');

    var form = new Form(signForm);

    form.send(function () {
      var domain = require('domain').create();

      domain.on('error', function (error) {});

      domain.run(function () {

        $('.forgot-password-pending.hide').removeClass('hide');
        $('.forgot-password-email-not-found').not('.hide').addClass('hide');
        $('.forgot-password-ok').not('.hide').addClass('hide');

        app.socket.once('no such email', function (_email) {
          if (_email === form.labels.email.val()) {

            $('.forgot-password-pending').addClass('hide');

            setTimeout(function () {});

            $('.forgot-password-email-not-found').removeClass('hide');
          }
        });

        app.socket.on('password is resettable', function (_email) {
          if (_email === form.labels.email.val()) {
            $('.forgot-password-pending').addClass('hide');

            $('.forgot-password-ok').removeClass('hide');

            setTimeout(function () {
              vex.close($vexContent.data().vex.id);
            }, 2500);
          }
        });

        app.socket.emit('send password', form.labels.email.val());
      });
    });
  }

  module.exports = forgotPassword;
})();

//

// $('.forgot-password-pending').css('display', 'block');

},{"domain":6,"syn/lib/util/Form":63}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsItemControllersMedia = require('syn/components/Item/controllers/media');

var _synComponentsItemControllersMedia2 = _interopRequireDefault(_synComponentsItemControllersMedia);

var _synComponentsItemView = require('syn/components/Item/View');

var _synComponentsItemView2 = _interopRequireDefault(_synComponentsItemView);

var _synComponentsPromoteController = require('syn/components/Promote/Controller');

var _synComponentsPromoteController2 = _interopRequireDefault(_synComponentsPromoteController);

var _synComponentsDetailsController = require('syn/components/Details/Controller');

var _synComponentsDetailsController2 = _interopRequireDefault(_synComponentsDetailsController);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synLibUtilReadMore = require('syn/lib/util/ReadMore');

var _synLibUtilReadMore2 = _interopRequireDefault(_synLibUtilReadMore);

var Item = (function (_Controller) {
  function Item(props) {
    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this);

    this.props = props || {};

    if (this.props.item) {
      this.set('item', this.props.item);
    }

    this.componentName = 'Item';
    this.view = _synComponentsItemView2['default'];
  }

  _inherits(Item, _Controller);

  _createClass(Item, [{
    key: 'media',
    value: function media() {
      return _synComponentsItemControllersMedia2['default'].apply(this);
    }
  }, {
    key: 'makeRelated',
    value: function makeRelated() {
      var button = $('<button class="shy counter"><span class="related-number"></span> <i class="fa"></i></button>');

      return button;
    }
  }, {
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'subject':
          return this.template.find('.item-subject a');

        case 'description':
          return this.template.find('.description');

        case 'toggle promote':
          return this.template.find('.item-toggle-promote');

        case 'promote':
          return this.template.find('.promote');

        case 'reference':
          return this.template.find('.item-reference:first a');

        case 'media':
          return this.template.find('.item-media:first');

        case 'youtube preview':
          return this.template.find('.youtube-preview:first');

        case 'toggle details':
          return this.template.find('.item-toggle-details:first');

        case 'details':
          return this.template.find('.details:first');

        case 'editor':
          return this.template.find('.editor:first');

        case 'toggle arrow':
          return this.template.find('.item-arrow:first');

        case 'promotions':
          return this.template.find('.promoted:first');

        case 'promotions %':
          return this.template.find('.promoted-percent:first');

        case 'children':
          return this.template.find('.children:first');

        case 'collapsers':
          return this.template.find('.item-collapsers:first');

        case 'collapsers hidden':
          return this.template.find('.item-collapsers:first:hidden');

        case 'collapsers visible':
          return this.template.find('.item-collapsers:first:visible');

        case 'related count':
          return this.template.find('.related-count');

        case 'related':
          return this.template.find('.related');

        case 'related count plural':
          return this.template.find('.related-count-plural');

        case 'related name':
          return this.template.find('.related-name');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      var _this = this;

      var item = this.get('item');

      var self = this;

      // Create reference to promote if promotion enabled

      // this.promote = new Promote(this.props, this.template);

      // Create reference to details

      // this.details = new Details(this.props);

      // Set ID

      this.template.attr('id', 'item-' + item._id);

      // Set Data

      this.template.data('item', this);

      // SUBJECT

      this.find('subject').attr('href', '/item/' + item.id + '/' + (0, _string2['default'])(item.subject).slugify().s).text(item.subject).on('click', function (e) {
        var link = $(this);

        var item = link.closest('.item');

        _synLibUtilNav2['default'].scroll(item, function () {
          history.pushState(null, null, link.attr('href'));
          item.find('.item-text .more').click();
        });

        return false;
      });

      // DESCRIPTION   

      this.find('description').text(item.description);

      // MEDIA

      if (!this.find('media').find('img[data-rendered]').length) {
        this.find('media').empty().append(this.media());
      }

      // READ MORE

      this.find('media').find('img').on('load', (function () {
        if (!_this.template.find('.more').length) {
          (0, _synLibUtilReadMore2['default'])(item, _this.template);
        }
      }).bind(item));

      // REFERENCES

      if (item.references && item.references.length) {
        this.find('reference').attr('href', item.references[0].url).text(item.references[0].title || item.references[0].url);
      } else {
        this.find('reference').empty();
      }

      // PROMOTIONS

      this.find('promotions').text(item.promotions);

      // POPULARITY

      this.find('promotions %').text((item.popularity.number || 0) + '%');

      // CHILDREN

      var buttonChildren = this.makeRelated();
      buttonChildren.addClass('children-count');
      buttonChildren.find('i').addClass('fa-fire');
      buttonChildren.find('.related-number').text(item.children);
      this.find('related').append(buttonChildren);

      // HARMONY

      if ('harmony' in item) {
        var buttonHarmony = this.makeRelated();
        buttonHarmony.find('i').addClass('fa-music');
        buttonHarmony.find('.related-number').text(item.harmony);
        this.find('related').append(buttonHarmony);
      }

      this.template.find('.counter').on('click', function () {
        var $trigger = $(this);
        var $item = $trigger.closest('.item');
        var item = $item.data('item');
        item.find('toggle arrow').click();
      });

      // TOGGLE PROMOTE

      this.find('toggle promote').on('click', function () {
        self.togglePromote($(this));
      });

      // TOGGLE DETAILS

      this.find('toggle details').on('click', function () {
        self.toggleDetails($(this));
      });

      // TOGGLE ARROW

      this.find('toggle arrow').removeClass('hide').on('click', function () {
        self.toggleArrow($(this));
      });

      cb();
    }
  }, {
    key: 'togglePromote',
    value: function togglePromote($trigger) {
      if (!this.socket.synuser) {
        Sign.dialog.join();
        return;
      }

      var $item = $trigger.closest('.item');
      var item = $item.data('item');

      var d = this.domain;

      function hideOthers() {
        if ($('.is-showing').length || $('.is-hidding').length) {
          return false;
        }

        if ($('.creator.is-shown').length) {
          _synLibUtilNav2['default'].hide($('.creator.is-shown')).hidden(function () {
            $trigger.click();
          });

          return false;
        }

        if (item.find('details').hasClass('is-shown')) {
          _synLibUtilNav2['default'].hide(item.find('details')).hidden(function () {
            $trigger.click();
          });

          item.find('toggle details').find('.caret').addClass('hide');

          return false;
        }
      }

      function promote() {
        item.promote.get(d.intercept(item.promote.render.bind(item.promote)));
      }

      function showHideCaret() {
        if (item.find('promote').hasClass('is-shown')) {
          $trigger.find('.caret').removeClass('hide');
        } else {
          $trigger.find('.caret').addClass('hide');
        }
      }

      if (hideOthers() === false) {
        return false;
      }

      if (item.find('collapsers hidden').length) {
        item.find('collapsers').show();
      }

      _synLibUtilNav2['default'].toggle(item.find('promote'), item.template, function (error) {

        if (item.find('promote').hasClass('is-hidden') && item.find('collapsers visible').length) {
          item.find('collapsers').hide();
        }

        promote();

        showHideCaret();
      });
    }
  }, {
    key: 'toggleDetails',
    value: function toggleDetails($trigger) {
      var $item = $trigger.closest('.item');
      var item = $item.data('item');

      var d = this.domain;

      function showHideCaret() {
        if (item.find('details').hasClass('is-shown')) {
          $trigger.find('.caret').removeClass('hide');
        } else {
          $trigger.find('.caret').addClass('hide');
        }
      }

      if (item.find('promote').hasClass('is-showing')) {
        return false;
      }

      if (item.find('promote').hasClass('is-shown')) {
        item.find('toggle promote').find('.caret').addClass('hide');
        require('syn/lib/util/Nav').hide(item.find('promote'));
      }

      var hiders = $('.details.is-shown');

      if (item.find('collapsers hidden').length) {
        item.find('collapsers').show();
      }

      require('syn/lib/util/Nav').toggle(item.find('details'), item.template, d.intercept(function () {

        showHideCaret();

        if (item.find('details').hasClass('is-hidden') && item.find('collapsers visible').length) {
          item.find('collapsers').hide();
        }

        if (item.find('details').hasClass('is-shown')) {

          if (!item.find('details').hasClass('is-loaded')) {
            item.find('details').addClass('is-loaded');

            item.details.render(d.intercept());
          }

          if (hiders.length) {
            require('syn/lib/util/Nav').hide(hiders);
          }
        }
      }));
    }
  }, {
    key: 'toggleArrow',
    value: function toggleArrow($trigger) {
      var $item = $trigger.closest('.item');
      var item = $item.data('item');
      var arrow = $trigger.find('i');

      var d = this.domain;

      if (item.find('collapsers hidden').length) {
        item.find('collapsers').show();
      }

      _synLibUtilNav2['default'].toggle(item.find('children'), item.template, d.intercept(function () {

        console.log('item type', item.item.type);

        if (item.find('children').hasClass('is-hidden') && item.find('collapsers visible').length) {
          item.find('collapsers').hide();
        }

        if (item.find('children').hasClass('is-shown') && !item.find('children').hasClass('is-loaded')) {

          item.find('children').addClass('is-loaded');

          console.log('we have an item!!!', item);

          var harmony = item.item.type.harmony;

          if (harmony.length) {
            var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

            item.find('children').append(split);

            var panelLeft = new (require('syn/components/Panel/Controller'))(harmony[0], item.item._id);

            panelLeft.load(d.intercept(function (template) {
              template.addClass('split-view');

              split.find('.left-split').append(template);

              setTimeout(function () {
                panelLeft.render(d.intercept(function () {
                  panelLeft.fill(d.intercept());
                }));
              });
            }));

            var panelRight = new (require('syn/components/Panel/Controller'))(harmony[1], item.item._id);

            panelRight.load(d.intercept(function (template) {
              template.addClass('split-view');

              split.find('.right-split').append(template);

              setTimeout(function () {
                panelRight.render(d.intercept(function () {
                  panelRight.fill(d.intercept());
                }));
              });
            }));
          }

          var subtype = item.item.subtype;

          if (subtype) {
            var subPanel = new (require('syn/components/Panel/Controller'))(subtype, item.item._id);

            subPanel.load(d.intercept(function (template) {
              item.find('children').append(template);

              setTimeout(function () {
                subPanel.render(d.intercept(function () {
                  subPanel.fill(d.intercept());
                }));
              });
            }));
          }
        }

        if (arrow.hasClass('fa-arrow-down')) {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        } else {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
      }));
    }
  }]);

  return Item;
})(_synLibAppController2['default']);

exports['default'] = Item;
module.exports = exports['default'];

},{"string":33,"syn/components/Details/Controller":41,"syn/components/Item/View":47,"syn/components/Item/controllers/media":48,"syn/components/Panel/Controller":52,"syn/components/Promote/Controller":54,"syn/lib/app/Controller":60,"syn/lib/util/Nav":64,"syn/lib/util/ReadMore":65}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cinco = require('cinco');

var _synLibAppPage = require('syn/lib/app/Page');

var _synLibAppPage2 = _interopRequireDefault(_synLibAppPage);

var _synComponentsItemDefaultButtonsView = require('syn/components/ItemDefaultButtons/View');

var _synComponentsItemDefaultButtonsView2 = _interopRequireDefault(_synComponentsItemDefaultButtonsView);

var _synComponentsPromoteView = require('syn/components/Promote/View');

var _synComponentsPromoteView2 = _interopRequireDefault(_synComponentsPromoteView);

var _synComponentsDetailsView = require('syn/components/Details/View');

var _synComponentsDetailsView2 = _interopRequireDefault(_synComponentsDetailsView);

var Item = (function (_Element) {
  function Item(props) {
    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this, '.item');

    this.attr('id', props.item ? 'item-' + props.item.id : '');

    this.props = props || {};

    this.add(this.media(), this.buttons(), this.text(), this.arrow(), this.collapsers(), new _cinco.Element('.clear'));
  }

  _inherits(Item, _Element);

  _createClass(Item, [{
    key: 'media',
    value: function media() {
      var _this = this;

      return new _cinco.Element('.item-media-wrapper').add(new _cinco.Element('.item-media').add(function () {
        if (_this.props.item) {
          if (_this.props.item.media) {
            return _this.props.item.media;
          } else if (_this.props.item.image) {
            return new _cinco.Element('img.img-responsive', {
              src: _this.props.item.image });
          }
        }

        return [];
      }));
    }
  }, {
    key: 'buttons',
    value: function buttons() {
      var _this2 = this;

      var itemButtons = new _cinco.Element('.item-buttons').condition(function () {
        if ('buttons' in _this2.props) {
          return _this2.props.buttons !== false;
        }
        return true;
      });

      if (this.props.item && this.props.item.buttons) {
        itemButtons.add(this.props.item.buttons);
      } else {
        itemButtons.add(new _synComponentsItemDefaultButtonsView2['default'](this.props));
      }

      return itemButtons;
    }
  }, {
    key: 'subject',
    value: function subject() {
      var _this3 = this;

      return new _cinco.Element('h4.item-subject.header').add(new _cinco.Element('a', {
        href: function href(locals) {
          if (locals && locals.item) {
            return (0, _synLibAppPage2['default'])('Item Page', locals && locals.item);
          }
          return '#';
        }
      }).text(function () {
        if (_this3.props.item) {
          return _this3.props.item.subject;
        }
        return '';
      }));
    }
  }, {
    key: 'description',
    value: function description() {
      var _this4 = this;

      return new _cinco.Element('.item-description.pre-text').text(function () {
        if (_this4.props.item) {
          return _this4.props.item.description;
        }
        return '';
      });
    }
  }, {
    key: 'text',
    value: function text() {
      return new _cinco.Element('.item-text').add(new _cinco.Element('.item-truncatable').add(this.subject(), this.description(), new _cinco.Element('.clear.clear-text')));
    }
  }, {
    key: 'collapsers',
    value: function collapsers() {
      var _this5 = this;

      return new _cinco.Element('.item-collapsers').condition(function () {
        if ('collapsers' in _this5.props) {
          return _this5.props.collapsers !== false;
        }
        return true;
      }).add(this.promote(), this.details(), this.below());
    }
  }, {
    key: 'promote',
    value: function promote() {
      return new _cinco.Element('.promote.is-container').add(new _cinco.Element('.is-section'));
    }
  }, {
    key: 'below',
    value: function below() {
      return new _cinco.Element('.children.is-container').add(new _cinco.Element('.is-section'));
    }
  }, {
    key: 'details',
    value: function details() {
      return new _cinco.Element('.details.is-container').add(new _cinco.Element('.is-section'));
    }
  }, {
    key: 'arrow',
    value: function arrow() {
      var _this6 = this;

      return new _cinco.Element('.item-arrow').condition(function () {
        if (_this6.props.item) {
          return _this6.props.item.collapsers !== false;
        }
        return true;
      }).add(new _cinco.Element('div').add(new _cinco.Element('i.fa.fa-arrow-down')));
    }
  }]);

  return Item;
})(_cinco.Element);

exports['default'] = Item;
module.exports = exports['default'];

},{"cinco":31,"syn/components/Details/View":42,"syn/components/ItemDefaultButtons/View":49,"syn/components/Promote/View":55,"syn/lib/app/Page":61}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synComponentsYouTubeView = require('syn/components/YouTube/View');

var _synComponentsYouTubeView2 = _interopRequireDefault(_synComponentsYouTubeView);

function MediaController() {
  var item = this.get('item');

  var references = item.references || [];

  // YouTube

  if (references.length) {

    var youtube = new _synComponentsYouTubeView2['default']({
      settings: { env: synapp.props.settings.env },
      item: item
    });

    if (youtube.children.length) {
      var _YouTube$resolve = _synComponentsYouTubeView2['default'].resolve(youtube.children[0].selector);

      var element = _YouTube$resolve.element;

      if (element === 'iframe') {
        return $(youtube.render());
      }
    }
  }

  // adjustImage

  if (item.adjustImage) {
    return $(item.adjustImage.replace(/\>$/, ' class="img-responsive" />'));
  }

  // Item has image

  if (item.image && /^http/.test(item.image)) {
    var _src = item.image;

    var _image = $('<img/>');

    _image.addClass('img-responsive');

    _image.attr('src', _src);

    return _image;
  }

  // YouTube Cover Image

  if (item.youtube) {
    return $(new _synComponentsYouTubeView2['default']({
      item: {
        references: [{
          url: 'http://youtube.com/watch?v=' + item.youtube
        }]
      },
      settings: { env: synapp.props.settings.env }
    }).render());
  }

  // Uploaded image

  if (item.upload) {
    var src = item.image;

    var image = $('<img/>');

    image.addClass('img-responsive');

    image.attr('src', item.upload);

    return image;
  }

  // default image

  var image = $('<img/>');

  image.addClass('img-responsive');

  image.attr('src', synapp.config['default item image']);

  return image;
}

exports['default'] = MediaController;
module.exports = exports['default'];

},{"syn/components/YouTube/View":58}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cinco = require('cinco');

var ItemDefaultButtons = (function (_Elements) {
  function ItemDefaultButtons(props) {
    _classCallCheck(this, ItemDefaultButtons);

    _get(Object.getPrototypeOf(ItemDefaultButtons.prototype), 'constructor', this).call(this);

    var loginButton = new _cinco.Element('button.item-toggle-promote.shy');

    loginButton.add(new _cinco.Element('span.promoted').text('0'), new _cinco.Element('i.fa.fa-bullhorn'));

    var joinButton = new _cinco.Element('button.item-toggle-details.shy');

    joinButton.add(new _cinco.Element('span.promoted-percent').text('0%'), new _cinco.Element('i.fa.fa-signal'));

    var related = new _cinco.Element('div').add(new _cinco.Element('span.related'));

    this.add(loginButton, new _cinco.Element('div'), joinButton, related);
  }

  _inherits(ItemDefaultButtons, _Elements);

  return ItemDefaultButtons;
})(_cinco.Elements);

exports['default'] = ItemDefaultButtons;
module.exports = exports['default'];

},{"cinco":31}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synLibUtilForm = require('syn/lib/util/Form');

var _synLibUtilForm2 = _interopRequireDefault(_synLibUtilForm);

var Join = (function (_Controller) {
  function Join(props) {
    _classCallCheck(this, Join);

    _get(Object.getPrototypeOf(Join.prototype), 'constructor', this).call(this);

    this.props = props || {};

    this.form = new _synLibUtilForm2['default'](this.template);

    this.form.send(this.submit.bind(this));

    this.template.find('.i-agree').on('click', function () {

      var agreed = $(this).find('.agreed');

      if (agreed.hasClass('fa-square-o')) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      } else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });
  }

  _inherits(Join, _Controller);

  _createClass(Join, [{
    key: 'template',
    get: function () {
      return $('form[name="join"]');
    }
  }, {
    key: 'submit',
    value: function submit(e) {
      var _this = this;

      var d = this.domain;

      d.run(function () {

        _this.template.find('.please-agree').addClass('hide');

        _this.template.find('.already-taken').hide();

        if (_this.form.labels.password.val() !== _this.form.labels.confirm.val()) {
          _this.form.labels.confirm.focus().addClass('error');

          return;
        }

        if (!_this.template.find('.agreed').hasClass('fa-check-square-o')) {
          _this.template.find('.please-agree').removeClass('hide');

          return;
        }

        $.ajax({
          url: '/sign/up',
          type: 'POST',
          data: {
            email: _this.form.labels.email.val(),
            password: _this.form.labels.password.val()
          }
        }).error(function (response, state, code) {
          if (response.status === 401) {
            _this.template.find('.already-taken').show();
          }
        }).success(function (response) {

          $('a.is-in').css('display', 'inline');

          $('.topbar .is-out').remove();

          vex.close(_this.props.$vexContent.data().vex.id);
        });
      });
    }
  }]);

  return Join;
})(_synLibAppController2['default']);

exports['default'] = Join;

!(function () {

  'use strict';

  var Form = require('syn/lib/util/Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function join($vexContent) {
    var $form = $('form[name="join"]');

    $form.find('.i-agree').on('click', function () {

      var agreed = $(this).find('.agreed');

      if (agreed.hasClass('fa-square-o')) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      } else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });

    var form = new Form($form);

    function join() {
      app.domain.run(function () {

        $form.find('.please-agree').addClass('hide');
        $form.find('.already-taken').hide();

        if (form.labels.password.val() !== form.labels.confirm.val()) {
          form.labels.confirm.focus().addClass('error');

          return;
        }

        if (!$form.find('.agreed').hasClass('fa-check-square-o')) {
          $form.find('.please-agree').removeClass('hide');

          return;
        }

        $.ajax({
          url: '/sign/up',
          type: 'POST',
          data: {
            email: form.labels.email.val(),
            password: form.labels.password.val()
          }
        }).error(function (response, state, code) {
          if (response.status === 401) {
            $form.find('.already-taken').show();
          }
        }).success(function (response) {

          $('a.is-in').css('display', 'inline');

          $('.topbar .is-out').remove();

          vex.close($vexContent.data().vex.id);
        });
      });
    }

    form.send(join);
  }

  module.exports = join;
})();
module.exports = exports['default'];

},{"syn/lib/app/Controller":60,"syn/lib/util/Form":63}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synLibUtilForm = require('syn/lib/util/Form');

var _synLibUtilForm2 = _interopRequireDefault(_synLibUtilForm);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var Login = (function (_Controller) {
  function Login(props) {
    _classCallCheck(this, Login);

    _get(Object.getPrototypeOf(Login.prototype), 'constructor', this).call(this);

    this.props = props || {};

    this.form = new _synLibUtilForm2['default'](this.template);

    this.form.send(this.submit.bind(this));
  }

  _inherits(Login, _Controller);

  _createClass(Login, [{
    key: 'template',
    get: function () {
      return $('form[name="login"]');
    }
  }, {
    key: 'submit',
    value: function submit(e) {
      var _this = this;

      var d = this.domain;

      d.run(function () {
        if ($('.login-error-404').hasClass('is-shown')) {
          return _synLibUtilNav2['default'].hide($('.login-error-404'), d.intercept(function () {
            // this.send(login);
            _this.form.submit();
          }));
        }

        if ($('.login-error-401').hasClass('is-shown')) {
          return _synLibUtilNav2['default'].hide($('.login-error-401'), d.intercept(function () {
            // this.send(login);
            _this.form.submit();
          }));
        }

        $.ajax({
          url: '/sign/in',
          type: 'POST',
          data: {
            email: _this.form.labels.email.val(),
            password: _this.form.labels.password.val()
          } }).error(function (response) {
          switch (response.status) {
            case 404:
              _synLibUtilNav2['default'].show($('.login-error-404'));
              break;

            case 401:
              _synLibUtilNav2['default'].show($('.login-error-401'));
              break;
          }
        }).success(function (response) {
          $('a.is-in').css('display', 'inline');

          $('.topbar .is-out').remove();

          vex.close(_this.props.$vexContent.data().vex.id);
        });
      });
    }
  }]);

  return Login;
})(_synLibAppController2['default']);

exports['default'] = Login;
module.exports = exports['default'];

},{"syn/lib/app/Controller":60,"syn/lib/util/Form":63,"syn/lib/util/Nav":64}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsCreatorController = require('syn/components/Creator/Controller');

var _synComponentsCreatorController2 = _interopRequireDefault(_synComponentsCreatorController);

var _synComponentsItemController = require('syn/components/Item/Controller');

var _synComponentsItemController2 = _interopRequireDefault(_synComponentsItemController);

var _synComponentsPanelView = require('syn/components/Panel/View');

var _synComponentsPanelView2 = _interopRequireDefault(_synComponentsPanelView);

var _synLibAppCache = require('syn/lib/app/Cache');

var _synLibAppCache2 = _interopRequireDefault(_synLibAppCache);

var Panel = (function (_Controller) {
  function Panel(props) {
    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this);

    this.props = props;

    this.componentName = 'Panel';
    this.view = _synComponentsPanelView2['default'];

    if (this.props.panel) {
      this.set('panel', this.props.panel);
    }

    if (this.props.panel) {
      this.type = this.props.panel.type;
      this.parent = this.props.panel.parent;
      this.skip = this.props.panel.skip || 0;
      this.size = this.props.panel.size || synapp.config['navigator batch size'];
      this.id = Panel.getId(this.props.panel);
    }
  }

  _inherits(Panel, _Controller);

  _createClass(Panel, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'title':
          return this.template.find('.panel-title:first');

        case 'toggle creator':
          return this.template.find('.toggle-creator:first');

        case 'creator':
          return this.template.find('.creator:first');

        case 'items':
          return this.template.find('.items:first');

        case 'load more':
          return this.template.find('.load-more:first');

        case 'create new':
          return this.template.find('.create-new:first');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      var _this = this;

      var q = new Promise(function (fulfill, reject) {

        var d = _this.domain;

        d.run(function () {

          var panel = _this.get('panel');

          // Fill title                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          _this.find('title').text(panel.type.name);

          // Toggle Creator

          _this.find('toggle creator').on('click', function () {
            if (_this.socket.synuser) {
              _synLibUtilNav2['default'].toggle(_this.find('creator'), _this.template, d.intercept());
            } else {
              Sign.dialog.join();
            }
          });

          // Panel ID

          if (!_this.template.attr('id')) {
            _this.template.attr('id', _this.id);
          }

          var creator = new _synComponentsCreatorController2['default'](_this.props);

          creator.render().then(fulfill, d.intercept.bind(d));

          _this.find('load more').on('click', function () {
            _this.fill();
            return false;
          });

          _this.find('create new').on('click', function () {
            _this.find('toggle creator').click();
            return false;
          });

          // Done

          fulfill();
        }, reject);
      });

      if (typeof cb === 'function') {
        q.then(cb.bind(null, null), cb);
      }

      return q;
    }
  }, {
    key: 'fill',
    value: function fill(item, cb) {
      var _this2 = this;

      if (typeof item === 'function' && !cb) {
        cb = item;
        item = undefined;
      }

      var panel = this.toJSON();

      if (item) {
        panel.item = item;
        panel.type = undefined;
      }

      this.publish('get items', panel).subscribe(function (pubsub, _panel, items) {
        if (Panel.getId(panel) !== Panel.getId(_panel)) {
          return;
        }

        pubsub.unsubscribe();

        console.log('got panel items', items);

        _this2.template.find('.hide.pre').removeClass('hide');
        _this2.template.find('.show.pre').removeClass('show').hide();

        _this2.template.find('.loading-items').hide();

        if (items.length) {

          _this2.find('create new').hide();
          _this2.find('load more').show();

          if (items.length < synapp.config['navigator batch size']) {
            _this2.find('load more').hide();
          }

          _this2.skip += items.length;

          _this2.preInsertItem(items, cb);
        } else {
          _this2.find('create new').show();
          _this2.find('load more').hide();
        }
      });
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var json = {
        type: this.type,
        size: this.size,
        skip: this.skip };

      if (this.parent) {
        json.parent = this.parent;
      }

      return json;
    }
  }, {
    key: 'preInsertItem',
    value: function preInsertItem(items, cb) {
      var _this3 = this;

      var d = this.domain;

      /** Load template */

      if (!_synLibAppCache2['default'].getTemplate('Item')) {
        new _synComponentsItemController2['default']().load();
        return this.preInsertItem(items, cb);
      }

      /** Items to object */

      items = items.map(function (item) {
        var props = {};

        for (var _i in _this3.props) {
          props[_i] = _this3.props;
        }

        props.item = item;

        var itemComponent = new _synComponentsItemController2['default'](props);

        itemComponent.load();

        _this3.find('items').append(itemComponent.template);

        return itemComponent;
      });

      var i = 0;
      var len = items.length;

      function next() {
        i++;

        if (i === len && cb) {
          cb();
        }
      }

      items.forEach(function (item) {
        return item.render(d.intercept(next));
      });
    }
  }]);

  return Panel;
})(_synLibAppController2['default']);

Panel.getId = function (panel) {
  var id = 'panel-' + (panel.type._id || panel.type);

  if (panel.parent) {
    id += '-' + panel.parent;
  }

  return id;
};

exports['default'] = Panel;
module.exports = exports['default'];
/** This is about another panel */
// item: app.location.item

},{"syn/components/Creator/Controller":35,"syn/components/Item/Controller":46,"syn/components/Panel/View":53,"syn/lib/app/Cache":59,"syn/lib/app/Controller":60,"syn/lib/util/Nav":64}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cinco = require('cinco');

var _synComponentsCreatorView = require('syn/components/Creator/View');

var _synComponentsCreatorView2 = _interopRequireDefault(_synComponentsCreatorView);

var Panel = (function (_Element) {
  function Panel(props) {
    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this, '.panel');

    this.props = props || {};

    this.attr('id', function () {
      if (props.panel) {
        var id = 'panel-' + (props.panel.type._id || props.panel.type);
        return id;
      }
    });

    this.add(this.panelHeading(), this.panelBody());
  }

  _inherits(Panel, _Element);

  _createClass(Panel, [{
    key: 'panelHeading',
    value: function panelHeading() {
      return new _cinco.Element('.panel-heading').add(new _cinco.Element('h4.fa.fa-plus.toggle-creator').condition(this.props.creator !== false), new _cinco.Element('h4.panel-title'));
    }
  }, {
    key: 'panelBody',
    value: function panelBody() {
      var body = new _cinco.Element('.panel-body');

      if (this.props.creator !== false) {
        body.add(new _synComponentsCreatorView2['default'](this.props));
      }

      var items = new _cinco.Element('.items');

      body.add(items);

      body.add(this.loadingItems());

      body.add(new _cinco.Element('.padding.hide.pre').add(this.viewMore(), this.addSomething()));

      return body;
    }
  }, {
    key: 'loadingItems',
    value: function loadingItems() {
      return new _cinco.Element('.loading-items.hide').add(new _cinco.Element('i.fa.fa-circle-o-notch.fa-spin'), new _cinco.Element('span').text('Loading items...'));
    }
  }, {
    key: 'viewMore',
    value: function viewMore() {
      return new _cinco.Element('.load-more.hide').add(new _cinco.Element('a', { href: '#' }).text('View more'));
    }
  }, {
    key: 'addSomething',
    value: function addSomething() {
      return new _cinco.Element('.create-new').add(new _cinco.Element('a', { href: '#' }).text('Click the + to be the first to add something here'));
    }
  }]);

  return Panel;
})(_cinco.Element);

exports['default'] = Panel;
module.exports = exports['default'];

},{"cinco":31,"syn/components/Creator/View":36}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synComponentsItemController = require('syn/components/Item/Controller');

var _synComponentsItemController2 = _interopRequireDefault(_synComponentsItemController);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsEditAndGoAgainController = require('syn/components/EditAndGoAgain/Controller');

var _synComponentsEditAndGoAgainController2 = _interopRequireDefault(_synComponentsEditAndGoAgainController);

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var Promote = (function (_Controller) {
  function Promote(props, item) {
    var _this = this;

    _classCallCheck(this, Promote);

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this);

    this.props = props || {};

    if (this.props.item) {
      this.set('item', item);
    }

    this.template = item.find('promote');

    this.store = {
      item: null,
      limit: 5
    };

    this.on('set', function (key, value) {
      switch (key) {
        case 'limit':
          _this.renderLimit(value);
          break;
      }
    });

    this.domain.run(function () {
      if (!_this.template.length) {
        throw new Error('Promote template not found');
      }
    });
  }

  _inherits(Promote, _Controller);

  _createClass(Promote, [{
    key: 'renderLimit',
    value: function renderLimit(limit) {
      this.find('limit').text(limit);
    }
  }]);

  return Promote;
})(_synLibAppController2['default']);

exports['default'] = Promote;
module.exports = exports['default'];

},{"syn/components/EditAndGoAgain/Controller":43,"syn/components/Item/Controller":46,"syn/lib/app/Controller":60,"syn/lib/util/Nav":64}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cinco = require('cinco');

var Promote = (function (_Element) {
  function Promote(props) {
    _classCallCheck(this, Promote);

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this, 'section');

    this.props = props || {};

    this.add(this.compose());
  }

  _inherits(Promote, _Element);

  _createClass(Promote, [{
    key: 'promoteImage',
    value: function promoteImage(hand) {
      return new _cinco.Element('.image.gutter', {
        style: 'float: left; width: 40%',
        className: [hand + '-item']
      });
    }
  }, {
    key: 'promoteSubject',
    value: function promoteSubject(hand) {
      return new _cinco.Element('.subject.gutter', {
        className: [hand + '-item']
      }).add(new _cinco.Element('h4'));
    }
  }, {
    key: 'promoteDescription',
    value: function promoteDescription(hand) {
      return new _cinco.Element('.description.gutter.pre-text', {
        className: [hand + '-item']
      });
    }
  }, {
    key: 'promoteReference',
    value: function promoteReference(hand) {
      return new _cinco.Element('.references.gutter', {
        className: [hand + '-item']
      }).add(new _cinco.Element('a', {
        rel: 'nofollow',
        target: '_blank'
      }));
    }
  }, {
    key: 'promoteSliders',
    value: function promoteSliders(hand) {

      var sliders = new _cinco.Element('.sliders', {
        className: [hand + '-item']
      });

      for (var i = 0; i < 4; i++) {
        var slider = new _cinco.Element('.criteria-wrapper');

        slider.add(new _cinco.Element('row').add(new _cinco.Element('.tablet-40').add(new _cinco.Element('h4').add(new _cinco.Element('button.criteria-name.shy.block').text('Criteria'))), new _cinco.Element('.tablet-60', {
          style: 'margin-top: 2.5em'
        }).add(new _cinco.Element('input.block', {
          type: 'range',
          min: '-1',
          max: '1',
          value: '0',
          step: '1'
        }))));

        slider.add(new _cinco.Element('.row.is-container.criteria-description-section').add(new _cinco.Element('.is-section').add(new _cinco.Element('.gutter.watch-100.criteria-description'))));

        sliders.add(slider);
      }

      return sliders;
    }
  }, {
    key: 'promoteFeedback',
    value: function promoteFeedback(hand) {
      return new _cinco.Element('.feedback', {
        className: [hand + '-item']
      }).add(new _cinco.Element('textarea.feedback-entry.block', {
        placeholder: 'Can you provide feedback that would encourage the author to create a statement that more people would unite around?'
      }));
    }
  }, {
    key: 'promoteButton',
    value: function promoteButton(hand) {
      return new _cinco.Element('.gutter', {
        className: [hand + '-item']
      }).add(new _cinco.Element('button.block.promote').text('Promote'));
    }
  }, {
    key: 'editAndGoAgain',
    value: function editAndGoAgain(hand) {
      return new _cinco.Element('.gutter', {
        className: [hand + '-item']
      }).add(new _cinco.Element('button.block.edit-and-go-again-toggle').text('Edit and go again'));
    }
  }, {
    key: 'compose',
    value: function compose() {
      return new Elements().add(new _cinco.Element('header.promote-steps').add(new _cinco.Element('h2').add(new _cinco.Element('span.cursor').text('1'), new _cinco.Element('span').text(' of '), new _cinco.Element('span.limit').text('5')), new _cinco.Element('h4').text('Evaluate each item below')), new _cinco.Element('.items-side-by-side').add(
      // 1 column
      new _cinco.Element('.split-hide-up').add(this.promoteImage('left'), this.promoteSubject('left'), this.promoteDescription('left'), this.promoteReference('left'), this.promoteSliders('left'), this.promoteFeedback('left'), this.promoteButton('left'), this.editAndGoAgain('left'), this.promoteImage('right'), this.promoteSubject('right'), this.promoteDescription('right'), this.promoteReference('right'), this.promoteSliders('right'), this.promoteFeedback('right'), this.promoteButton('right'), this.editAndGoAgain('right')),

      // 2 columns
      new _cinco.Element('.split-hide-down').add(new _cinco.Element('.row').add(new _cinco.Element('.split-50.watch-100').add(this.promoteImage('left'), this.promoteSubject('left'), this.promoteDescription('left')), new _cinco.Element('.split-50.watch-100').add(this.promoteImage('right'), this.promoteSubject('right'), this.promoteDescription('right'))), new _cinco.Element('.row').add(new _cinco.Element('.split-50.watch-100').add(this.promoteReference('left')), new _cinco.Element('.split-50.watch-100').add(this.promoteReference('right'))), new _cinco.Element('.row').add(new _cinco.Element('.split-50.watch-100').add(this.promoteSliders('left'), this.promoteFeedback('left')), new _cinco.Element('.split-50.watch-100').add(this.promoteSliders('right'), this.promoteFeedback('right'))), new _cinco.Element('h4.text-center').text('Which of these is most important for the community to consider?'), new _cinco.Element('.row').add(new _cinco.Element('.split-50.watch-100').add(this.promoteButton('left')), new _cinco.Element('.split-50.watch-100').add(this.promoteButton('right'))), new _cinco.Element('.row').add(new _cinco.Element('.split-50.watch-100').add(this.editAndGoAgain('left')), new _cinco.Element('.split-50.watch-100').add(this.editAndGoAgain('right')))), new _cinco.Element('button.finish.block').text('Neither')));
    }
  }]);

  return Promote;
})(_cinco.Element);

exports['default'] = Promote;
module.exports = exports['default'];

},{"cinco":31}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsLoginController = require('syn/components/Login/Controller');

var _synComponentsLoginController2 = _interopRequireDefault(_synComponentsLoginController);

var _synComponentsJoinController = require('syn/components/Join/Controller');

var _synComponentsJoinController2 = _interopRequireDefault(_synComponentsJoinController);

var _synComponentsForgotPasswordController = require('syn/components/ForgotPassword/Controller');

var _synComponentsForgotPasswordController2 = _interopRequireDefault(_synComponentsForgotPasswordController);

var TopBar = (function (_Controller) {
  function TopBar(props) {
    _classCallCheck(this, TopBar);

    _get(Object.getPrototypeOf(TopBar.prototype), 'constructor', this).call(this);

    this.props = props;

    this.template = $('.topbar');
  }

  _inherits(TopBar, _Controller);

  _createClass(TopBar, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'online users':
          return this.template.find('.online-users');

        case 'right section':
          return this.template.find('.topbar-right');

        case 'login button':
          return this.template.find('.login-button');

        case 'join button':
          return this.template.find('.join-button');

        case 'is in':
          return this.template.find('.is-in');

        case 'is out':
          return this.template.find('.is-out');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      this.find('online users').text(synapp.app.get('onlineUsers'));

      synapp.app.on('set', function (key, value) {
        if (key === 'onlineUsers') {
          _this.find('online users').text(value);
        }
      });

      this.find('right section').removeClass('hide');

      if (!this.socket.synuser) {
        this.find('login button').on('click', this.loginDialog.bind(this));
        this.find('join button').on('click', this.joinDialog.bind(this));
        this.find('is in').hide();
      } else {
        this.find('is out').remove();
        this.find('is in').css('display', 'inline');
      }
    }
  }, {
    key: 'loginDialog',
    value: function loginDialog() {
      var _this2 = this;

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      vex.dialog.confirm({

        afterOpen: function afterOpen($vexContent) {
          _this2.find('login button').off('click').on('click', function () {
            return vex.close();
          });

          new _synComponentsLoginController2['default']({ $vexContent: $vexContent });

          $vexContent.find('.forgot-password-link').on('click', function () {
            new _synComponentsForgotPasswordController2['default']();
            vex.close($vexContent.data().vex.id);
            return false;
          });
        },

        afterClose: function afterClose() {
          $('.login-button').on('click', function () {
            return _this2.loginDialog();
          });
        },

        message: $('#login').text(),

        buttons: [$.extend({}, vex.dialog.buttons.NO, {
          text: 'x Close'
        })]
      });
    }
  }, {
    key: 'joinDialog',
    value: function joinDialog() {
      var _this3 = this;

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      vex.dialog.confirm({

        afterOpen: function afterOpen($vexContent) {
          _this3.find('join button').off('click').on('click', function () {
            vex.close();
          });

          new _synComponentsJoinController2['default']({ $vexContent: $vexContent });
        },

        afterClose: function afterClose() {
          var _this4 = this;

          $('.join-button').on('click', function () {
            return _this4.joinDialog();
          });
        },

        message: $('#join').text(),
        buttons: [$.extend({}, vex.dialog.buttons.NO, {
          text: 'x Close'
        })],
        callback: function callback(value) {},
        defaultOptions: {
          closeCSS: {
            color: 'red'
          }
        }
      });
    }
  }]);

  return TopBar;
})(_synLibAppController2['default']);

exports['default'] = TopBar;
module.exports = exports['default'];

},{"syn/components/ForgotPassword/Controller":45,"syn/components/Join/Controller":50,"syn/components/Login/Controller":51,"syn/lib/app/Controller":60}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synComponentsYouTubeView = require('syn/components/YouTube/View');

var _synComponentsYouTubeView2 = _interopRequireDefault(_synComponentsYouTubeView);

function YouTube(url) {
  return (0, _synComponentsYouTubeView2['default'])({ url: url, settings: { env: synapp.env } });
}

exports['default'] = YouTube;
module.exports = exports['default'];

},{"syn/components/YouTube/View":58}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cinco = require('cinco');

var YouTube = (function (_Element) {
  function YouTube(props) {
    _classCallCheck(this, YouTube);

    _get(Object.getPrototypeOf(YouTube.prototype), 'constructor', this).call(this, '.video_container');

    if (props.item && props.settings.env !== 'development') {
      var references = props.item.references || [];

      if (references.length) {
        var url = references[0].url;

        if (YouTube.regex.test(url)) {
          this.add(this.iframe());
        }
      }
    }
  }

  _inherits(YouTube, _Element);

  _createClass(YouTube, [{
    key: 'iframe',
    value: function iframe(url) {
      var youTubeId = undefined;

      url.replace(url, function (m, v) {
        return youTubeId = v;
      });

      return new _cinco.Element('iframe[allowfullscreen]', {
        frameborder: '0',
        width: '300',
        height: '175',
        src: 'http://www.youtube.com/embed/' + youTubeId + '?autoplay=0'
      });
    }
  }]);

  return YouTube;
})(_cinco.Element);

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

exports['default'] = YouTube;
module.exports = exports['default'];

},{"cinco":31}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Cache = (function () {
  function Cache() {
    _classCallCheck(this, Cache);

    this.cache = {
      templates: {}
    };
  }

  _createClass(Cache, [{
    key: 'getTemplate',
    value: function getTemplate(tpl) {
      return this.cache.templates[tpl];
    }
  }, {
    key: 'setTemplate',
    value: function setTemplate(tpl, val) {
      this.cache.templates[tpl] = val;
    }
  }]);

  return Cache;
})();

exports['default'] = new Cache();
module.exports = exports['default'];

},{}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synApp = require('syn/app');

var _synApp2 = _interopRequireDefault(_synApp);

var Controller = (function (_App) {
  function Controller() {
    _classCallCheck(this, Controller);

    _get(Object.getPrototypeOf(Controller.prototype), 'constructor', this).call(this);
  }

  _inherits(Controller, _App);

  return Controller;
})(_synApp2['default']);

exports['default'] = Controller;
module.exports = exports['default'];

},{"syn/app":34}],61:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var S = require('string');

  function Page(page, more) {

    switch (page) {
      case 'Home':
        return '/';

      case 'Item Page':
        return '/item/' + more.id + '/' + S(more.subject).slugify().s;

      case 'Terms Of Service':
        return '/page/terms-of-service';

      case 'Profile':
        return '/page/profile';

      case 'Sign Out':
        return '/sign/out';

      case 'Sign With Facebook':
        return '/sign/facebook';

      case 'Sign With Twitter':
        return '/sign/twitter';

      default:
        throw new Error('Page not registered: ' + page);
    }
  }

  module.exports = Page;
})();

},{"string":33}],62:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  function Socket(emit) {
    var self = this;

    /** Socket */

    self.socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);

    self.socket.once('welcome', function onSocketWelcome(user) {
      emit('ready', user);
      if (user) {
        console.info('Welcome', user);
        $('a.is-in').css('display', 'inline');
        self.socket.synuser = user;
      }
    });

    self.socket.publish = function (event) {

      var args = [];
      var done;

      for (var i in arguments) {
        if (+i) {
          if (typeof arguments[i] === 'function') {
            done = arguments[i];
          } else {
            args.push(arguments[i]);
          }
        }
      }

      self.socket.emit.apply(self.socket, [event].concat(args));

      self.socket.on('OK ' + event, done);
    };

    self.socket.on('error', function onSocketError(error) {
      console.error('socket error', error);
    });
  }

  module.exports = Socket;
})();

},{}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _synLibUtilDomainRun = require('syn/lib/util/domain-run');

var _synLibUtilDomainRun2 = _interopRequireDefault(_synLibUtilDomainRun);

var Form = (function () {
  function Form(form) {
    var _this = this;

    _classCallCheck(this, Form);

    var self = this;

    this.form = form;

    this.labels = {};

    form.find('[name]').each(function () {
      self.labels[$(this).attr('name')] = $(this);
    });

    // #193 Disable <Enter> keys

    form.find('input').on('keydown', function (e) {
      if (e.keyCode === 13) {
        return false;
      }
    });

    form.on('submit', function (e) {
      setTimeout(function () {
        return _this.submit(e);
      });
      return false;
    });
  }

  _createClass(Form, [{
    key: 'send',
    value: function send(fn) {
      this.ok = fn;
      return this;
    }
  }, {
    key: 'submit',
    value: function submit(e) {
      var errors = [];

      this.form.find('[required]').each(function () {
        var val = $(this).val();

        if (!val) {

          if (!errors.length) {
            $(this).addClass('error').focus();
          }

          errors.push({ required: $(this).attr('name') });
        } else {
          $(this).removeClass('error');
        }
      });

      if (!errors.length) {
        this.ok();
      }

      return false;
    }
  }]);

  return Form;
})();

exports['default'] = Form;
module.exports = exports['default'];

},{"syn/lib/util/domain-run":68}],64:[function(require,module,exports){
(function (process){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  N   A   V

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

'use strict';

!(function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toggle(elem, poa, cb) {
    if (!elem.hasClass('is-toggable')) {
      elem.addClass('is-toggable');
    }

    if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    if (elem.hasClass('is-shown')) {
      unreveal(elem, poa, cb);
    } else {
      reveal(elem, poa, cb);
    }
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function reveal(elem, poa, cb) {
    var emitter = new (require('events').EventEmitter)();

    if (typeof cb !== 'function') {
      cb = console.log.bind(console);
    }

    emitter.revealed = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    setTimeout(function () {
      if (!elem.hasClass('is-toggable')) {
        elem.addClass('is-toggable');
      }

      console.log('%c reveal', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '<no id>', elem.attr('class'));

      if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
        var error = new Error('Animation already in progress');
        error.code = 'ANIMATION_IN_PROGRESS';
        return cb(error);
      }

      elem.removeClass('is-hidden').addClass('is-showing');

      if (poa) {
        scroll(poa, function () {
          show(elem, function () {
            emitter.emit('success');
            cb();
          });
        });
      } else {
        show(elem, function () {
          emitter.emit('success');
          cb();
        });
      }
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function unreveal(elem, poa, cb) {
    if (!elem.hasClass('is-toggable')) {
      elem.addClass('is-toggable');
    }

    console.log('%c unreveal', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '', elem.attr('class'));

    if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    elem.removeClass('is-shown').addClass('is-hiding');

    if (poa) {
      scroll(poa, function () {
        hide(elem, cb);
      });
    } else {
      hide(elem, cb);
    }
  }

  /**
   *  @function scroll
   *  @description Scroll the page till the point of attention is at the top of the screen
   *  @return null
   *  @arg {function} pointOfAttention - jQuery List
   *  @arg {function} cb - Function to call once scroll is complete
   *  @arg {number} speed - A number of milliseconds to set animation duration
   */

  function scroll(pointOfAttention, cb, speed) {
    // console.log('%c scroll', 'font-weight: bold',
    //   (pointOfAttention.attr('id') ? '#' + pointOfAttention.attr('id') + ' ' : ''), pointOfAttention.attr('class'));

    var emitter = new (require('events').EventEmitter)();

    emitter.scrolled = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    emitter.then = function (fn, fn2) {
      emitter.on('success', fn);
      if (fn2) emitter.on('error', fn2);
      return this;
    };

    var poa = pointOfAttention.offset().top - 60;

    var current = $('body,html').scrollTop();

    if (typeof cb !== 'function') {
      cb = function () {};
    }

    if (current === poa || current > poa && current - poa < 50 || poa > current && poa - current < 50) {

      emitter.emit('success');

      return typeof cb === 'function' ? cb() : true;
    }

    $.when($('body,html').animate({ scrollTop: poa + 'px' }, 500, 'swing')).then(function () {

      emitter.emit('success');

      if (typeof cb === 'function') {
        cb();
      }
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function show(elem, cb) {

    var emitter = new (require('events').EventEmitter)();

    emitter.shown = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    setTimeout(function () {

      console.log('%c show', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '', elem.attr('class'));

      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

      if (elem.hasClass('.is-showing') || elem.hasClass('.is-hiding')) {

        emitter.emit('error', new Error('Already in progress'));

        if (typeof cb === 'function') {
          cb(new Error('Show failed'));
        }

        return false;
      }

      // make sure margin-top is equal to height for smooth scrolling

      elem.css('margin-top', '-' + elem.height() + 'px');

      // animate is-section

      $.when(elem.find('.is-section:first').animate({
        marginTop: 0
      }, 500)).then(function () {
        elem.removeClass('is-showing').addClass('is-shown');

        if (elem.css('margin-top') !== 0) {
          elem.animate({ 'margin-top': 0 }, 250);
        }

        emitter.emit('success');

        if (cb) {
          cb();
        }
      });

      elem.animate({
        opacity: 1
      }, 500);
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function hide(elem, cb) {
    var emitter = new (require('events').EventEmitter)();

    emitter.hiding = function (cb) {
      this.on('hiding', cb);
      return this;
    };

    emitter.hidden = function (cb) {
      this.on('hidden', cb);
      return this;
    };

    emitter.error = function (cb) {
      this.on('error', cb);
      return this;
    };

    process.nextTick(function () {

      var domain = require('domain').create();

      domain.on('error', function (error) {
        emitter.emit('error', error);
      });

      domain.run(function () {

        if (!elem.length) {
          return cb();
        }

        // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

        if (elem.hasClass('.is-showing') || elem.hasClass('.is-hiding')) {
          emitter.emit('bounced');
          return false;
        }

        emitter.emit('hiding');

        console.log('%c hide', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '', elem.attr('class'));

        elem.removeClass('is-shown').addClass('is-hiding');;

        elem.find('.is-section:first').animate({
          'margin-top': '-' + elem.height() + 'px' }, 1000, function () {
          elem.removeClass('is-hiding').addClass('is-hidden');

          emitter.emit('hidden');

          if (cb) cb();
        });

        elem.animate({
          opacity: 0
        }, 1000);
      });
    });

    return emitter;
  }

  module.exports = {
    toggle: toggle,
    reveal: reveal,
    unreveal: unreveal,
    show: show,
    hide: hide,
    scroll: scroll
  };
})();

// 'padding-top': elem.height() + 'px'

}).call(this,require('_process'))
},{"_process":10,"domain":6,"events":7}],65:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  function spanify(des) {

    return des.replace(/\n/g, '\n ').split(' ').map(function (word) {
      var span = $('<span class="word"></span>');
      span.text(word + ' ');
      return span;
    });
  }

  function readMore(item, $item) {

    /** {HTMLElement} Description wrapper in DOM */

    var $description = $item.find('.item-description');

    /** {HTMLElement} Image container in DOM */

    var $image = $item.find('.item-media img');

    /** {HTMLElement}  Text wrapper (Subject + Description + Reference) */

    var $text = $item.find('.item-text');

    /** {HTMLElement} Subject container in DOM */

    var $subject = $item.find('.item-subject');

    /** {HTMLElement} Reference container in DOM */

    var $reference = $item.find('.item-reference');

    /** {HTMLElement} Arrow container in DOM */

    var $arrow = $item.find('.item-arrow');

    /** {Number} Image height */

    var imgHeight = $image.height();

    // If screen >= phone, then divide imgHeight by 2

    if ($('body').width() <= $('#screen-tablet').width()) {
      imgHeight *= 2;
    }

    /** {Number} Top position of text wrapper */

    var top = $text.offset().top;

    // If **not** #intro, then subtract subject's height

    if ($item.attr('id') !== 'intro') {

      // Subtract height of subject from top

      top -= $subject.height();
    }

    // If screen >= tablet

    if ($('body').width() >= $('#screen-tablet').width()) {
      // Subtract 40 pixels from top

      top -= 40;
    }

    // If screen >= phone

    else if ($('body').width() >= $('#screen-phone').width()) {
      top -= 80;
    }

    // console.info( item.subject.substr(0, 30) + '...', 'top', Math.ceil(top), ',', Math.ceil(imgHeight) );

    // Clear description

    $description.text('');

    // Spanify each word

    spanify(item.description).forEach(function (word) {
      $description.append(word);
    });

    // Hide words that are below limit

    for (var i = $description.find('.word').length - 1; i >= 0; i--) {
      var word = $description.find('.word').eq(i);
      // console.log(Math.ceil(word.offset().top), Math.ceil(top),
      //   { word: Math.ceil(word.offset().top - top), top: top, imgHeight: imgHeight, limit: Math.ceil(imgHeight), hide: (word.offset().top - top) > imgHeight })
      if (word.offset().top - top > imgHeight) {
        word.addClass('hidden-word').hide();
      }
    }

    if ($description.find('.hidden-word').length) {
      var more = $('<a href="#" class="more">more</a>');

      more.on('click', function () {

        if ($(this).hasClass('more')) {
          $(this).removeClass('more').addClass('less').text('less');
          $(this).closest('.item-description').find('.hidden-word').show();
        } else {
          $(this).removeClass('less').addClass('more').text('more');
          $(this).closest('.item-description').find('.hidden-word').hide();
        }

        return false;
      });

      $description.append(more);
    }

    // Hide reference if too low and breaks design

    if ($reference.text() && $arrow.offset().top - $reference.offset().top < 15) {

      var more;

      if ($description.find('.more').length) {
        more = $description.find('.more');
      } else {
        more = $('<a href="#" class="more">more</a>');

        more.on('click', function () {

          if ($(this).hasClass('more')) {
            $(this).removeClass('more').addClass('less').text('less');
            $reference.show();
          } else {
            $(this).removeClass('less').addClass('more').text('more');
            $reference.hide();
          }

          return false;
        });
      }

      $description.append(more);

      $reference.css('padding-bottom', '10px').data('is-hidden-reference', true).hide();
    }
  }

  module.exports = readMore;
})();

},{}],66:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Stream(file) {

    var stream = ss.createStream();

    // stream.end = function (cb) {
    //   this.on('end', cb);

    //   return this;
    // };

    // stream.error = function (cb) {
    //   this.on('error', cb);

    //   return this;
    // };

    ss(app.socket).emit('upload image', stream, { size: file.size, name: file.name });

    ss.createBlobReadStream(file).pipe(stream);

    return stream;
  }

  module.exports = Stream;
})();

},{}],67:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  /**
   *  @class    Upload
   *  @arg      {HTMLElement} dropzone
   *  @arg      {Input} file_input
   *  @arg      {HTMLElement} thumbnail - Preview container
   *  @arg      {Function} cb
   */

  function Upload(dropzone, file_input, thumbnail, cb) {
    this.dropzone = dropzone;
    this.file_input = file_input;
    this.thumbnail = thumbnail;
    this.cb = cb;

    this.init();
  }

  Upload.prototype.init = function () {

    if (window.File) {
      if (this.dropzone) {
        this.dropzone.on('dragover', this.hover.bind(this)).on('dragleave', this.hover.bind(this)).on('drop', this.handler.bind(this));
      }

      if (this.file_input) {
        this.file_input.on('change', this.handler.bind(this));
      }
    } else {
      if (dropzone) {
        dropzone.find('.modern').hide();
      }
    }
  };

  Upload.prototype.hover = function (e) {
    e.stopPropagation();
    e.preventDefault();
  };

  Upload.prototype.handler = function (e) {
    this.hover(e);

    var files = e.target.files || e.originalEvent.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      this.preview(f, e.target);
    }
  };

  Upload.prototype.preview = function (file, target) {
    var upload = this;

    var img = new Image();

    img.classList.add('img-responsive');
    img.classList.add('preview-image');

    img.addEventListener('load', function () {

      $(img).data('file', file);

      upload.thumbnail.empty().append(img);
    }, false);

    img.src = (window.URL || window.webkitURL).createObjectURL(file);

    if (this.cb) {
      this.cb(null, file);
    }
  };

  module.exports = Upload;
})();

},{}],68:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var domain = require('domain');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function domainRun(fn, reject) {
    var d = domain.create();

    d.intercept = function (fn, _self) {

      if (typeof fn !== 'function') {
        fn = function () {};
      }

      return function (error) {
        if (error && error instanceof Error) {
          d.emit('error', error);
        } else {
          var args = Array.prototype.slice.call(arguments);

          args.shift();

          fn.apply(_self, args);
        }
      };
    };

    d.on('error', function onDomainError(error) {
      console.error(error);

      if (error.stack) {
        error.stack.split(/\n/).forEach(function (line) {
          line.split(/\n/).forEach(console.warn.bind(console));
        });
      }

      if (typeof reject === 'function') {
        reject(error);
      }
    });

    d.run(function () {
      fn(d);
    });
  }

  module.exports = domainRun;
})();

},{"domain":6}]},{},[1]);
