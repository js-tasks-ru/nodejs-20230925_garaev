const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  _accum = String( '', null);
  constructor(options) {
    super(options);
  }

  /**
   * get accum
   * @returns {string}
   */
  get accum() {
    return this._accum;
  }

  /**
   * set accum
   * @param value
   */
  set accum(value) {
    this._accum  = value;
  }

  /**
   * transform stroke
   * @param chunk
   * @param encoding
   * @param callback
   * @private
   */
  _transform = (chunk, encoding, callback) => {
    this.accum += chunk.toString();
    if(this.accum.includes(os.EOL)) {
      const split = this.accum.split(os.EOL);
      this.accum = split.pop();
      split.map((str)=> {
        this.push(str);
      })
    }
    callback();
  }
  /**
   * @param callback
   * @private
   */
  _flush = (callback) => {
    if(this.accum) {
      this.push(this.accum);
    }
    callback();
  }
}

/**
 * module export LineSplitStream
 * @type {LineSplitStream}
 */
module.exports = LineSplitStream;