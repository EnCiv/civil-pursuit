'use strict';

import {EventEmitter} from 'events';
import WebDriver from 'webdriverio';
import wrap from 'syn/lib/util/run';
import should from 'should';

function fnToStr (fn) {
  let bits = fn.toString().split(/\{/);
  bits.shift();
  let str = bits.join('{');
  return str
    .replace(/return/, '')
    .replace(/\s\s+/g, '')
    .replace(/\t/g, '')
    .replace(/\n/g, '')
    .replace(/\}$/, '')
    .trim();
}

class Selector {
  constructor (selector, context) {
    this.selector = selector;

    this.driver = context.driver;
  }

  is (state) {

    if ( typeof state === 'boolean' ) {
      return new Promise((fulfill, reject) => {
        this.driver.isExisting(this.selector, (error, exists) => {
          if ( error ) {
            return reject(error);
          }
          if ( exists !== state ) {
            return reject(new Error(
              'Element ' + (exists ? 'exists' : 'does not exist: ' +
                this.selector)));
          }
          fulfill();
        });
      });
    }

    else if ( state === ':visible' ) {
      return new Promise((fulfill, reject) => {
        this.driver.isVisible(this.selector, (error, visible) => {
          if ( error ) {
            return reject(error);
          }
          if ( ! visible ) {
            return reject(new Error('Selector ' + this.selector + ' is **not** visible'));
          }
          fulfill();
        });
      });
    }

    else if ( state === ':hidden' ) {
      return new Promise((fulfill, reject) => {
        this.driver.isVisible(this.selector, (error, visible) => {
          if ( error ) {
            return reject(error);
          }
          if ( visible ) {
            return reject(new Error('Selector ' + this.selector + ' is **not** hidden'));
          }
          fulfill();
        });
      });
    }

    else if ( /^\./.test(state) ) {
      let _className = state.replace(/^\./, '');

      return new Promise((fulfill, reject) => {
        this.driver.getAttribute(this.selector, 'class',
          (error, className) => {
            if ( error ) {
              return reject(error);
            }
            let assertClasses = (classList) => {
              let classes = classList.split(/\s+/);

              try {
                classes.indexOf(_className).should.be.above(-1);
                fulfill();
              }
              catch ( error ) {
                this.emit('ko', assertion.describe);
                reject(error);
              }
            };

            if ( Array.isArray(className) ) {
              className.forEach(assertClasses);
            }
            else {
              assertClasses(className);
            }
          }
        );
      });
    }
  }

  not (state) {
    if ( state === ':visible' ) {
      return new Promise((fulfill, reject) => {
        this.driver.isVisible(this.selector, (error, visible) => {
          if ( error ) {
            return reject(error);
          }
          if ( visible ) {
            return reject(new Error('Selector ' + this.selector + ' is **not** visible'));
          }
          fulfill();
        });
      });
    }

    else if ( /^\./.test(state) ) {
      let _className = state.replace(/^\./, '');

      return new Promise((fulfill, reject) => {
        this.driver.getAttribute(this.selector, 'class',
          (error, className) => {
            if ( error ) {
              return reject(error);
            }
            let assertClasses = (classList) => {
              let classes = classList.split(/\s+/);

              try {
                classes.indexOf(_className).should.be.exactly(-1);
                fulfill();
              }
              catch ( error ) {
                this.emit('ko', assertion.describe);
                reject(error);
              }
            };

            if ( Array.isArray(className) ) {
              className.forEach(assertClasses);
            }
            else {
              assertClasses(className);
            }
          }
        );
      });
    }
  }

  click () {
    return new Promise((fulfill, reject) => {
      this.driver.click(this.selector, error => {
        if ( error ) {
          return reject(error);
        }
        fulfill();
      });
    });
  }

  val (value) {
    return new Promise((fulfill, reject) => {
      this.driver.setValue(this.selector, value, error => {
        if ( error ) {
          return reject(error);
        }
        fulfill();
      });
    });
  }

  count (selector, cb) {
    return new Promise((fulfill, reject) => {
      this.driver.getHTML(this.selector + ' ' + selector, (error, html) => {
        if ( error ) {
          return reject(error);
        }
        if ( ! html ) {
          fulfill(0);
        }
        else if ( ! Array.isArray(html) ) {
          fulfill(1);
        }
        else {
          fulfill(html.length);
        }
      });
    });
  }

  width (width) {
    if ( typeof width === 'number' ) {

    }
    else {
      return new Promise((fulfill, reject) => {
        this.driver.getElementSize(this.selector, (error, size) => {
          if ( error ) {
            return reject(error);
          }
          fulfill(size.width);
        });
      });
    }
  }

  height (height) {
    if ( typeof height === 'number' ) {

    }
    else {
      return new Promise((fulfill, reject) => {
        this.driver.getElementSize(this.selector, (error, size) => {
          if ( error ) {
            return reject(error);
          }
          fulfill(size.height);
        });
      });
    }
  }

  text (text) {
    if ( text ) {

    }
    else {
      return new Promise((fulfill, reject) => {
        this.driver.getText(this.selector, (error, text) => {
          if ( error ) {
            return reject(error);
          }
          console.log('GOT TEXT', this.selector, text)
          fulfill(text);
        });
      });
    }
  }
}

class Milk extends EventEmitter {

  constructor (name, options) {
    super();

    this.name = name;
    // @deprecated use this.name
    this._name = name;

    this.options = options || {};

    this.options.viewport = this.options.viewport || 'phone';

    this.actions = [];
    this._keys = {};
  }

  wrap (fn) {
    wrap(fn, error => this.emit('error', error));
    return this;
  }

  intercept (d) {
    return d.intercept(() => {});
  }

  get (key) {
    return this._keys[key];
  }

  set (key, value, message) {
    return this.wrap(d => {
      
      let handler = () => new Promise((fulfill, reject) => {
        if ( typeof value === 'function' ) {
          let promise = value();

          if ( ! ( promise instanceof Promise) ) {
            promise = new Promise(ok => ok(promise));
          }

          promise
            .then(result => this._keys[key] = result, this.intercept(d))
            .then(fulfill);
        }
        else {
          this._keys[key] = value;
          fulfill();
        }
      });

      message = message || 'Set ' + key;

      this.actions.push({ handler: handler, message: message });

      return this;
    });
  }

  run (driver) {
    return this.wrap(d => {
      console.log('RUN'.bgBlue.bold + this.name.bgCyan.bold +
        this.actions.length.toString().bgMagenta);
      
      if ( driver ) {
        this.driver = driver;
        process.nextTick(() => this.emit('ready'));
      }

      else {
        this.startDriver();
      }

      this.on('ready', () => {
        let current = 0;
        let total = this.actions.length;

        let runOne = () => {

          let action = this.actions[current];

          if ( action ) {
            // console.log((current + '/' + this.actions.length + ' ' + action.message).grey);

            if ( action.condition ) {
              let condition = action.condition;

              if ( typeof condition === 'function' ) {
                condition = condition(current);
              }

              // console.log('condition?', condition)

              if ( ! condition ) {
                this.emit('skip', action.message);
                current ++;
                runOne();
                return;
              }
            }

            let promise = action.handler(current);

            promise
              .then(
                ok => {
                  this.emit('ok', action.message, current, this.actions.length);
                  // console.log('good bye', this.get('Type'))
                  current ++;
                  runOne();
                },
                error => {
                  if ( this.clean ) {
                    this.clean();
                  }
                  this.emit('error', error)
                }
              );
          }

          else {
            if ( this.clean ) {
              this.clean();
            }
            this.emit('done');
          }

        };

        runOne();
      });

    });
  }

  ok (handler, message, condition) {
    message = message || 'Asserting ' + fnToStr(handler);

    this.actions.push(
      { message: message, handler: handler, condition : condition }
    );

    return this;
  }

  wait (seconds, message, condition) {
    message = message || 'Pause ' + seconds + ' seconds';

    this.actions.push({
      message : message,
      handler : () => new Promise((fulfill, reject) => {
        this.driver.pause(seconds * 1000, error => {
          if ( error ) {
            return reject(error);
          }
          fulfill();
        });
      }),
      condition : condition
    });

    return this;
  }

  import (TestClass, options, message, condition) {
    return this.wrap(d => {

      message = message || 'Importing ' + TestClass.name;

      options = options || {};

      let handler = () => new Promise((fulfill, reject) => {
        let driver;

        if ( typeof options === 'function' ) {
          options = options();
        }

        if ( ! ('driver' in options) ) {
          options.driver = false;
        }

        let importee = new TestClass(options);

        if ( importee.props && importee.props.driver === false ) {
          driver = this.driver;
        }

        importee.run(driver)
          .on('ok', (ok, step, total) => 
            this.emit('ok from', ok, importee.constructor.name, step, total))
          .on('ok from', (ok, test, step, total) => 
            this.emit('ok from', ok, test, step, total))
          .on('done', fulfill)
          .on('error', reject)
          .on('ko', ko => this.emit('ko from', ko, importee.constructor.name))
          .on('ko from',
            (ko, from) => this.emit('ko from', ko, from))
          .on('skip', skip => this.emit('skip from', skip, importee.constructor.name))
          .on('skip from',
            (skip, from) => this.emit('skip from', skip, from));
      });

      this.actions.push(
      { message: message, handler: handler, condition : condition }
    );

    });
  }

  cookie (name, message) {
    return this.wrap(d => {

      message = message || 'Getting cookie ' + name;

      let handler = () => this.getCookie(name);

      this.actions.push({ message: message, handler: handler });

    });
  }

  getCookie (name) {
    return new Promise((fulfill, reject) => {
      this.driver.getCookie(name, (error, cookie) => {
        if ( error ) {
          return reject(error);
        }
        fulfill(cookie);
      });
    });
  }

  when (condition, ...thens) {
    return this.wrap(d => {
      thens.forEach(then => {
        let cmd = Object.keys(then)[0];
        this[cmd]()
      });
    });
  }

  each (iterable, iterator, message) {
    return this.wrap(d => {
      message = message || 'For each';

      let handler = (index) => new Promise((fulfill, reject) => {
        if ( typeof iterable === 'function' ) {
          iterable = iterable();
        }

        let current = this.actions.length;

        iterable.forEach(it => iterator(it));

        let actions = [];

        for ( let i = 0; i <= index ; i ++ ) {
          if ( this.actions[i] ) {
            actions.push(this.actions[i]);
          }
        }

        for ( let i = current; i <= this.actions.length ; i ++ ) {
          if ( this.actions[i] ) {
            actions.push(this.actions[i]);
          }
        }

        for ( let i = index + 1; i < current ; i ++ ) {
          if ( this.actions[i] ) {
            actions.push(this.actions[i]);
          }
        }

        fulfill();
      });

      this.actions.push({ message: message, handler: handler });
    });
  }

  

  find (selector) {
    return new Selector(selector, this);
  }

  go (url, message) {
    return this.wrap(d => {

      if ( /^\//.test(url) ) {
        url = process.env.SYNAPP_SELENIUM_TARGET + url;
      }

      let handler = () => new Promise((fulfill, reject) => {
        this.driver.url(url, (error, result) => {
          if ( error ) {
            return reject(error);
          }
          this.driver.pause(2000, (error, result) => {
            if ( error ) {
              return reject(error);
            }
            fulfill(result);
          });
        });
      });

      message = message || 'Going to url ' + url;

      this.actions.push({ message: message, handler: handler });
    });
  }

  title (then, message) {
    return this.wrap(d => {
      message = message || 'Get title';

      let handler = () => new Promise((fulfill, reject) => {
        this.driver.getTitle((error, title) => {
          if ( error ) {
            return reject(error);
          }
          try {
            then(title);
            fulfill(title);
          }
          catch ( error ) {
            reject(error);
          }
        });
      });

      this.actions.push({ message: message, handler: handler });
    });
  }

  startDriver () {
    wrap(() => {
      let options = {
        desiredCapabilities : {
          browserName: 'firefox'
        }
      };

      console.log('DRIVER'.bgBlue.bold + this.name.bgCyan.bold);

      this.driver = WebDriver.remote(options).init(() => {

        switch ( this.options.viewport ) {
          case 'phone':
            this.driver.setViewportSize({ width: 440, height: 620 });
            break;

          case 'tablet':
            this.driver.setViewportSize({ width: 768, height: 992 });
            break;
        }

        this.emit('ready');
      });
    });
  }

}

export default Milk;
