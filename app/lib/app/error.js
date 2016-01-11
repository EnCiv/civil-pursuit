'use strict';

class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name)
  }
}

class SynError extends ExtendableError {

  static CONFIG_NOT_FOUND = 1

  constructor (message, options = {}, code) {
    super(message);
    this.options = options;
    this.code = code;
  }

}

export default SynError;
