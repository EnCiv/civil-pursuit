'use strict';

import { EventEmitter } from 'events';
import should           from 'should';
import WebDriver        from 'webdriverio';
import Selector         from './milk-selector';
import wrap             from '../../lib/util/run';
import UserModel        from '../../models/user';

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

class Milk extends EventEmitter {

  static formatToHTMLText (str) {
    return str
      .replace(/  +/g, ' ');
  }

  constructor (name, options) {
    super();

    this.name = name;
    // @deprecated use this.name
    this._name = name;

    this.options = options || {};

    this.options.viewport = this.options.viewport || 'phone';

    this.actions = [];
    this._keys = {};

    console.log('DRIVER'.bgBlue.bold + this.name.bgCyan.bold, this.options);
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

  set (key, value, message, condition) {
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

      message = message || '>>> Set ' + key;

      this.actions.push(
        { handler: handler, message: message, condition : condition }
      );

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

  setCookie (cookie) {
    return new Promise((fulfill, reject) => {
      this.driver.setCookie(cookie, (error, cookies) => {
        if ( error ) {
          return reject(error);
        }
        fulfill(cookies.filter({ name : 'synuser' })[0]);
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

      // if ( typeof url === 'string' || /^\//.test(url) ) {
      //   url = process.env.SYNAPP_SELENIUM_TARGET + url;
      // }

      let handler = () => new Promise((fulfill, reject) => {

        let go = url => {

          if ( typeof url === 'string' || /^\//.test(url) ) {
            url = process.env.SYNAPP_SELENIUM_TARGET + url;
          }
          
          this.driver.url(url, (error, result) => {
            if ( error ) {
              return reject(error);
            }
            
            this.driver.pause(2000, (error, result) => {
              if ( error ) {
                return reject(error);
              }

              if ( this.options.session ) {
                if ( this.options.session === '/test' ) {
                  console.log('DISPOSABLE USER'.bgBlue.bold + this.name.bgCyan.bold);
                  
                  UserModel.disposable()
                    .then(
                      user => {
                        let cookie = {
                          name      :   'synuser',
                          value     :   JSON.stringify({
                            id      :   user._id,
                            email   :   user.email
                          }),
                          httpOnly  :   true
                        };
                        
                        this.driver.setCookie(cookie, (error, cookies) => {
                          console.log('---------cookies', cookies, error)
                        });

                        this.driver.refresh(() => { console.log('Refreshed!') });

                        this.driver.getCookie((error, cookies) => {
                          if ( error ) {
                            return reject(error);
                          }
                          console.log(cookies)
                          fulfill();
                        });
                      },
                      error => this.emit('error', error)
                    );

                  return;
                }
              }

              fulfill(result);
            });
          });
        };

        if ( typeof url === 'function' ) {

          url = url();

          if ( url instanceof Promise ) {
            console.log('url is a promise');
            url = url.then(
              url   => go(url),
              error => this.emit('error', error)
            );
          }

          else if ( typeof url === 'string' ) {
            go(url);
          }

          return;
        }

        else {
          go(url);
        }
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
          browserName: this.options.vendor || 'firefox'
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

        this.driver.pause(2500, () => this.emit('ready'));
      });
    });
  }

}

export default Milk;
