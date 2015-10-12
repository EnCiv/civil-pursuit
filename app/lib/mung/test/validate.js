'use strict';

import should from 'should';

class _String {
  static validate (value) {
    return typeof value === 'string';
  }

  static convert (value) {
    return String(value);
  }
}

class _Number {
  static validate (value) {
    return value.constructor === Number && isFinite(value);
  }

  static convert (value) {
    return +value;
  }
}

class _Boolean {
  static validate (value) {
    return typeof value === 'boolean';
  }

  static convert (value) {
    return !!value;
  }
}

class _Object {
  static validate (value) {
    return typeof value === 'object' && value !== null && ! Array.isArray(value);
  }
}

class _Mixed {
  static validate (value) {
    return true;
  }
}

function validate (value, type, convert = false) {

  if ( Array.isArray(type) ) {
    if ( ! Array.isArray(value) ) {
      return false;
    }

    if ( type.length === 1 ) {
      return value
        .map(value => validate(value, type[0], convert))
        .every(value => value);
    }

    else if ( value.length !== type.length ) {
      return false;
    }

    else {
      return value
        .map((value, index) => validate(value, type[index], convert))
        .every(value => value);
    }
  }

  if ( type === String ) {
    type = _String;
  }

  else if ( type === Number ) {
    type = _Number;
  }

  else if ( type === Boolean ) {
    type = _Boolean;
  }

  else if ( type === Object ) {
    type = _Object;
  }

  if ( convert && type.convert ) {
    value = type.convert(value);
  }

  return type.validate(value);
}

validate('hello', String).should.be.true;

validate(123, String).should.be.false;
validate(123, String, true).should.be.true;

validate(/abc/, String).should.be.false;
validate(/abc/, String, true).should.be.true;

validate(true, String).should.be.false;
validate(true, String, true).should.be.true;

validate(null, String).should.be.false;
validate(null, String, true).should.be.true;

validate([1, true], String).should.be.false;
validate([1, true], String, true).should.be.true;

validate({}, String).should.be.false;
validate({}, String, true).should.be.true;

validate(['a'], [String]).should.be.true;
validate(['a', 'b', 'c'], [String]).should.be.true;
validate(['a', 'b', 'c', 1], [String]).should.be.false;
validate(['a', 'b', 'c', 1], [String], true).should.be.true;

validate([0, 1, null, false, {}], [String]).should.be.false;
validate([0, 1, null, false, {}], [String], true).should.be.true;

validate([0, 'a'], [Number, String]).should.be.true;

validate(1, Number).should.be.true;
validate('a', Number).should.be.false;
validate('a', Number, true).should.be.false;
validate('1', Number, true).should.be.true;
validate(true, Number).should.be.false;
validate(true, Number, true).should.be.true;

validate(true, Boolean).should.be.true;
validate(false, Boolean).should.be.true;
validate(0, Boolean).should.be.false;
validate(0, Boolean, true).should.be.true;

validate({}, Object).should.be.true;
validate('hello', Object).should.be.false;
validate([], Object).should.be.false;

validate([], _Mixed).should.be.true;
validate(1, _Mixed).should.be.true;
validate('a', _Mixed).should.be.true;
validate(null, _Mixed).should.be.true;
validate({}, _Mixed).should.be.true;
