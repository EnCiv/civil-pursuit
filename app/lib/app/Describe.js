'use strict';

import {EventEmitter} from 'events';
import {Domain} from 'domain';
import util from 'util';
import colors from 'colors';
import WebDriver from 'synlib/test/webdriver';
import Page from 'synlib/app/page';
import run from 'synlib/util/run';

class Describe extends EventEmitter {

  constructor (name, options) {
    super();

    this._name = name;

    this._options = options;

    this._before = [];

    this._assertions = [];

    this._definitions = {};

    this._disposed = false;

    this._isClean = true;

    for ( let option in options ) {
      switch ( option ) {
        case 'web driver':
          this.driver(options['web driver']);
      }
    }
  }

  /** Create disposable models */

  disposable (...models) {

    if ( ! this.define('disposable') ) {
      this.define('disposable', {});
    }

    let promises = models.map(model =>
      require('synmodels/' + model.model)
        .disposable()
        .then(disposed => {
          console.log('>> new disposable', model.model, disposed);
          this.define('disposable')[model.model] = disposed
        })
    );

    return Promise.all(promises);
  }

  /** Alias to build and runAll */

  run () {
    run(
      () => {
        console.log(this._name.bgBlue.bold);

        this.init();

        this.on('built', assertions => this.runAll(assertions));
      },
      error => { this.emit('error', error) }
    );

    return this;
  }

  /** Build the assertions but create disposable data and start driver first if any needed */

  init () {
    run.next(
      d => {
        if ( this._options.disposable && ! this._disposed ) {
          return this.disposable(...this._options.disposable).then(() => {
            this._disposed = true;
            this.emit('disposed');
            this.init();
          });
        }

        if ( this._driverOptions ) {
          this._driver = new WebDriver(this._driverOptions);

          this.emit('message', 'start driver', this._driverOptions);

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
      },
      error => { this.emit('error', error) }
    );

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

      run(
        d => {
          if ( typeof assertion.describe === 'function' ) {
            assertion = assertion.describe();
            assertion.context = {};
          }

          if ( typeof assertion.context === 'function' ) {
            assertion = assertion.context();
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

            case 'before':
              assertion.handler()
                .then(fulfill, reject);
              return;

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
                      //this.emit('ok', assertion.describe);

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

            case 'html':
              this.getHTML(assertion, context, fulfill, reject);
              return;

            case 'classes':
              this.getClasses(assertion, context.classes, fulfill, reject);
              return;

            case 'click':
              this.click(assertion, context, fulfill, reject);
              return;

            case 'pause':
              this.pause(assertion, context, fulfill, reject);
              return;

            case 'not':
              this.not(assertion, context, fulfill, reject);
              return;

            case 'value':
              if ( 'set' in context ) {
                this.setValue(assertion, context.value, context.set, fulfill, reject);
              }
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
        },
        reject
      );
    
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

      .on('message', (...messages) => this.emit('message from', test._name, ...messages))

      .on('message from', (test, ...messages) => this.emit('message from', test, ...messages))

      .on('ok', (ok, step, total) => this.emit('ok from', ok, test._name, step, total))

      .on('built', promises => test.runAll(promises))

      .on('done', () => {
        fulfill();
      });
  }

  /** Get visibility
  */

  getVisibility (visible, assertion, context, fulfill, reject) {
    let d = new Domain().on('error', error => {
      console.log('error', error);
      this.emit('ko', assertion.describe);
      reject(error);
    });

    d.run(() => {

      let contextKey = visible ? 'visible' : 'hidden';
      let selector = context[contextKey];

      if ( typeof selector === 'function' ) {
        selector = selector();
      }

      this._driver.client.isVisible(selector, d.intercept(
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

            fulfill();
          }

          else {
            this.emit('ko', assertion.describe);

            let errorMessage = util.format('Element is not %s: %s',
              contextKey, context[contextKey]);

            reject(new Error(errorMessage));
          }
        }));
    });
  }

  /** Driver get attribute
  */

  getAttribute (assertion, context, fulfill, reject) {
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
          fulfill();
        }
        catch ( error ) {
          this.emit('ko', assertion.describe);
          reject(error);
        }
      }));
  }

  /** Driver get atribute
  */

  getClasses (assertion, selector, fulfill, reject) {
    let d = new Domain().on('error', error => {
      console.log('error', error);
      this.emit('ko', assertion.describe);
      reject(error);
    });

    d.run(() => {
      this._driver.client.getAttribute(selector, 'class',
        d.intercept( attr => {
          if ( ! this._isClean ) {
            this.emit('ko', assertion.describe);
            reject(new Error('Is not clean'));
            return;
          }

          let assertClasses = (classList) => {
            let classes = classList.split(/\s+/);

            try {
              assertion.handler(classes);
              fulfill();
            }
            catch ( error ) {
              this.emit('ko', assertion.describe);
              reject(error);
            }
          };

          if ( Array.isArray(attr) ) {
            attr.forEach(assertClasses);
          }
          else {
            assertClasses(attr);
          }

        }));
    });
  }

  /** Driver getText
  */

  getText (assertion, context, fulfill, reject) { // 253

    let d = new Domain().on('error', reject);

    d.run(() => {
      let selector = context.text;

      this._driver.client.getText(selector, d.intercept(text => {
        if ( ! this._isClean ) {
          this.emit('ko', assertion.describe);
          reject(new Error('Is not clean'));
          return;
        }

        try {
          assertion.handler(text);

          fulfill();
        }
        catch ( error ) {
          this.emit('ko', assertion.describe);
          reject(error);
        }
      }));
    });

  }

  setValue (assertion, selector, value, fulfill, reject) {
    let d = new Domain().on('error', reject);

    d.run(() => {
      this._driver.client.setValue(selector, value, d.intercept(fulfill));
    });
  }

  /** Driver getHTML
  */

  getHTML (assertion, context, fulfill, reject) { // 253

    let d = new Domain().on('error', reject);

    d.run(() => {
      let selector = context.html;

      this._driver.client.getHTML(selector, d.intercept(html => {
        if ( ! this._isClean ) {
          this.emit('ko', assertion.describe);
          reject(new Error('Is not clean'));
          return;
        }

        try {
          assertion.handler(html);

          fulfill();
        }
        catch ( error ) {
          this.emit('ko', assertion.describe);
          reject(error);
        }
      }));
    });

  }

  /** Driver click
  */

  click (assertion, context, fulfill, reject) { // 253

    let d = new Domain().on('error', reject);

    d.run(() => {
      let selector = context.click;

      this._driver.client.click(selector, d.intercept(html => { fulfill() }));
    });

  }

  /** Driver pause
  */

  pause (assertion, context, fulfill, reject) { // 253

    let d = new Domain().on('error', reject);

    d.run(() => {
      let s = context.pause;

      this._driver.client.pause(s * 1000, d.intercept(html => { fulfill() }));
    });

  }

  /** Driver element does not exist
  */

  not (assertion, context, fulfill, reject) { // 253

    let d = new Domain().on('error', reject);

    d.run(() => {
      let selector = context.not;

      this._driver.client.isExisting(selector, d.intercept(exists => {
        if ( ! this._isClean ) {
          this.emit('ko', assertion.describe);
          reject(new Error('Is not clean'));
          return;
        }

        if ( ! exists ) {
          fulfill();
        }
        else {
          reject(new Error('Does exist: ' + selector));
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
        (runned + 1) + '/' + assertions.length,
        this._assertions[runned].describe
      );

      new Promise(assertions[runned]).then(
        ok => {

          this.emit('ok', (this._assertions[runned].describe), runned, assertions.length);

          runned ++;

          if ( runned === assertions.length ) {

            // Remove disposable items
            if ( this.define('disposable') ) {
              let removers = [];

              for ( let disposable of this._options.disposable ) {
                if ( this.define('disposable')[disposable.name] ) {
                  removers.push(this.define('disposable')[disposable.name]
                    .remove());
                }
              }

              Promise.all(removers).then(
                () => this.emit('done'),
                (error) => this.emit('error', error)
              );

            }

            else {
              this.emit('done')
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

  /** Scripts to run before */

  before (describe, handler) {
    this._assertions.push({
      describe  : describe,
      context   : { before: true },
      handler   : handler
    });

    return this;
  }

  select (name, selector) {
    let $ = {
      is: (state, not) => {

        if ( /^:visible/.test(state) ) {
          if ( not ) {
            this.assert(name + ' should be hidden', { hidden: selector });
          }
          else {
            this.assert(name + ' should be visible', { visible: selector });
          }
        }

        if ( /\./.test(state) ) {
          state.replace(/\.([a-z0-9-_\/]+)/i, (matches, className) => {
            if ( not ) {
              this.assert(name + ' should not have class ' + className,
                { classes: selector },
                classes => classes.indexOf(className).should.be.exactly(-1));
            }
            else {
              this.assert(name + ' should have class ' + className,
                { classes: selector },
                classes => classes.indexOf(className).should.be.above(-1));
            }
          });
        }
        return $;
      },
      click: () => {
        this.assert(name + ' should click', { click: selector });
      },
      val: (value) => {
        if ( typeof value === 'string' ) {
          this.assert(name + ' should have value ' + value,
            { value: selector, set: value });
        }
      }
    };

    $.not = (state) => {
      if ( state ) {
        $.is(state, true)
      }
      else {
        this.assert(name + ' should not be present', { not: selector });
      }
    };

    return $;
  }

  /** Get/set definition */

  define (key, value) {
    if ( '1' in arguments ) {
      this._definitions[key] = value;
      return this;
    }
    return this._definitions[key];
  }

  /** Create driver client (or inherit driver from outside)
   *  @arg        {Object|WebDriver} options - if Object, is options to be passed to a new driver client, else if is WebDriver, this object will use this WebDriver as its driver
   *  @return     Describe
   */

  driver (options) {

    options = options || {};

    if ( options instanceof WebDriver ) {
      this._driverOptions = null;
      this._driver = options;
      return this;
    }

    let url;

    if ( options.url ) {
      url = options.url;
    }

    else if ( options.uri ) {
      if ( typeof options.uri === 'string' ) {
         url = process.env.SYNAPP_SELENIUM_TARGET + options.uri;
      }
      else if ( typeof options.uri === 'function' ) {
         url = process.env.SYNAPP_SELENIUM_TARGET + options.uri();
      }
    }

    else {
      url = process.env.SYNAPP_SELENIUM_TARGET;

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

    console.log('driver options', driverOptions)

    this._driverOptions = driverOptions;

    return this;
  }

}

export default Describe;
