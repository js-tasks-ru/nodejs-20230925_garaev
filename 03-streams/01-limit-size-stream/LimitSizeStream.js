const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  _default = Number(0);

  constructor(options) {
    super(options);
    this.limit = options.limit;
  }

  bufferEncode(chunk, encoding) {
    if(encoding === 'buffer') {
      return chunk;
    }
    return Buffer.from(chunk, encoding);
  };

  get accum() {
    return this._default;
  }
  set accum(value) {
    this._default = value;
  }

  isLength(value) {
    return this.limit >= value;
  };

  processData(chunk, encoding) {
    const bufferChunk = this.bufferEncode(chunk, encoding);
    this.accum += bufferChunk.length;

    if (!this.isLength(this.accum)) {
      throw new LimitExceededError();
    }
    return chunk;
  };

  _transform(chunk, encoding, callback) {
    try {
      const processedChunk = this.processData(chunk, encoding)
      callback(null, processedChunk);
    } catch (error) {
      callback(error, null);
    }
  }
}

module.exports = LimitSizeStream;