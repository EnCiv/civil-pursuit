'use strict';

import {EventEmitter} from 'events';
import {Domain} from 'domain';
import colors from 'colors';
import WebDriver from 'syn/lib/test/webdriver';
import Page from 'syn/lib/app/Page';

class Describe extends EventEmitter {

  constructor (name, options) {
    super();

    this._name = name;

    this._options = options;

    this._before = [];

    this._assertions = [];

    this._definitions = {};

    this._isClean = true;

    for ( let option in options ) {
      switch ( option ) {
        case 'web driver':
          this.driver(options['web driver']);
      }
    }
  }

  /** Alias to build and runAll */

  run () {
    console.log(this._name.bgBlue.bold);

    this.init();

    this.on('built', assertions => this.runAll(assertions));

    return this;
  }

  /** Build the assertions but start driver first if needed */

  init () {
    process.nextTick(() => {
      if ( this._driverOptions ) {
        this._driver = new WebDriver(this._driverOptions);

        this.emit('message', 'start driver');

        this._driver
          .on('ready', () =>
            this.emit('message', 'driver ready', this._driverOptions))

          .on('ready', () => this.build());

        // this._driver.on('ready', () => this.build());

        // this._driver.on('ready', () => this.emit('driver ready'));

        // this.on('error', () => this._driver.client.end());
      }
      else {
        this.build();
      }
    });

    return this;
  }

  /** Build this assertions into promises */

  build () {

    this.on('ko', () => this._isClean = false);

    // this.emit('message', 'Building', this._name);

    let assertions = this._assertions.map(assertion => (fulfill, reject) => {
      // this.emit('message', 'Building test', assertion, this._name, this._isClean);

      if ( ! this._isClean ) {
        this.emit('ko', assertion.describe);
        return reject(new Error('Test is not clean'));
      }

      let d = new Domain().on('error', reject);

      d.run(() => {

        if ( typeof assertion.describe === 'function' ) {
          assertion = assertion.describe();
        }

        if ( (assertion instanceof Describe) ) {
          return this.buildModule(assertion, fulfill, reject);
        }

        let context = assertion.context;
        let contextKey = Object.keys(context)[0];
        let contextValue;

        switch ( contextKey ) {
          case 'lambda':
            contextValue = context.lambda;
            break;

          case 'definition':
            contextValue = this._definitions[context[contextKey]];
            break;

          case 'document':
            switch ( context.document ) {
              case 'title':

                this._driver.client.getTitle(d.intercept(title => {

                  if ( ! this._isClean ) {
                    this.emit('ko', assertion.describe);
                    reject(new Error('Is not clean'));
                    return;
                  }

                  try {
                    assertion.handler(title);
                    this.emit('ok', assertion.describe);

                    fulfill();
                  }
                  catch ( error ) {
                    this.emit('ko', assertion.describe);
                    reject(error);
                  }
                }));

                return;
            }
            break;

          case 'visible':
            this.getVisibility(true, assertion, context, fulfill, reject);
            return;

          case 'hidden':
            this.getVisibility(false, assertion, context, fulfill, reject);
            return;

          case 'attribute':
            let attr = Object.keys(context.attribute)[0];
            let selector = context.attribute[attr];
            this._driver.client.getAttribute(selector, attr,
              d.intercept( attr => {
                if ( ! this._isClean ) {
                  this.emit('ko', assertion.describe);
                  reject(new Error('Is not clean'));
                  return;
                }

                try {
                  assertion.handler(attr);
                  this.emit('ok', assertion.describe);

                  fulfill();
                }
                catch ( error ) {
                  this.emit('ko', assertion.describe);
                  reject(error);
                }
              }));
            return;

          case 'text':
            this.getText(assertion, context, fulfill, reject);
            return;
        }

        try {
          assertion.handler(contextValue);
          this.emit('ok', assertion.describe);

          fulfill();
        }
        catch ( error ) {
          this.emit('ko', assertion.describe, error);
          reject(error);
        }

      })
    });

    this.emit('built', assertions);

    return this;
  }

  /** Build module
  */

  buildModule (assertion, fulfill, reject) {
    // this.emit('message', 'assertion is a module', assertion, this._name);

    let test = assertion
      .init();

    test
      // .on('error', error => {
      //   this.emit('error', error);
      //   this._isClean = false;
      //   reject(error);
      // })

      .on('ko', (ko, error) => {
        this._isClean = false;
        this.emit('ko', ko);
        // this.emit('error', error);
        // reject(error);
      })

      .on('message', (...messages) => this.emit('message', ...messages))

      .on('ok', ok => this.emit('ok', test._name + '/' + ok))

      .on('built', promises => test.runAll(promises))

      .on('done', () => {
        fulfill();
      });
  }

  /** Get visibility
  */

  getVisibility (visible, assertion, context, fulfill, reject) {
    let d = new Domain().on('error', reject);

    d.run(() => {
      this._driver.client.isVisible(context.visible, d.intercept(
        isVisible => {
          if ( ! this._isClean ) {
            this.emit('ko', assertion.describe);
            reject(new Error('Is not clean'));
            return;
          }

          let ok = isVisible;

          if ( ! visible ) {
            ok = ! isVisible;
          }

          if ( ok ) {
            this.emit('ok', assertion.describe);

            fulfill();
          }

          else {
            this.emit('ko', assertion.describe);
            reject(error);
          }
        }));
    });
  }

  /** Driver getText
  */

  getText (assertion, context, fulfill, reject) { // 253

    console.log(context)

    let d = new Domain().on('error', reject);

    d.run(() => {
      let selector = context.text;

      this._driver.client.getText(selector, d.intercept( text => {
        if ( ! this._isClean ) {
          this.emit('ko', assertion.describe);
          reject(new Error('Is not clean'));
          return;
        }

        try {
          assertion.handler(text);
          this.emit('ok', assertion.describe);

          fulfill();
        }
        catch ( error ) {
          this.emit('ko', assertion.describe);
          reject(error);
        }
      }));
    });

  }

  /** Run an array of built assertions (as promises)
   *  @arg    [Promise] assertions
  */

  runAll (assertions) {

    let runned = 0;

    let runOneByOne = () => {
      this.emit(
        'message',
        'Running test ' + (runned + 1) + '/' + assertions.length,
        this._name,
        '>',
        this._assertions[runned].describe
      );

      new Promise(assertions[runned]).then(
        ok => {

          runned ++;

          if ( runned === assertions.length ) {
            this.emit('done');
            if ( this._driver ) {
              this._driver.client.end();
            }
          }

          else {
            runOneByOne();
          }
        },

        error => {
          this.emit('error', error);
          this.emit('failed');
        }
      );
    };

    runOneByOne();
  }

  /** Add a new assertion */

  assert (describe, context, handler) {

    if ( describe instanceof Describe ) {
      this._assertions.push(describe);
    }

    else {
      this._assertions.push({
        describe  : describe,
        context   : context,
        handler   : handler || (() => {})
      });
    }

    return this;
  }

  /** Add a new definition */

  define (key, value) {
    this._definitions[key] = value;
    return this;
  }

  /** Create driver client (or inherit driver from outside)
   *  @arg        {Object|WebDriver} options - if Object, is options to be passed to a new driver client, else if is WebDriver, this object will use this WebDriver as its driver
   *  @return     Describe
   */

  driver (options) {

    if ( options instanceof WebDriver ) {
      this._driverOptions = null;
      this._driver = options;
      return this;
    }

    let uri;

    let url = process.env.SYNAPP_SELENIUM_TARGET;

    if ( typeof options.page === 'string' ) {
      url += Page(options.page);
    }

    else if ( Array.isArray(options.page) ) {
      url += Page.apply(null, options.page);
    }

    else if ( options.page === false ) {
      url += '/no/such/page';
    }

    else if ( options.page === null ) {
      url += '/item/1234/no-such-item';
    }

    let driverOptions = {
      url       :   url,
      width     :   800,
      height    :   900
    };

    if ( options.user ) {
      driverOptions.cookie = {
        synuser     :   {
          value     :   {
            id      :   options.user._id,
            email   :   options.user.email
          }
        }
      };
    }

    this._driverOptions = driverOptions;

    return this;
  }

}

export default Describe;
