'use strict';

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
              'Element ' + (exists ? 'exists' : 'does not exist: ') +
                this.selector));
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

    else {
      console.log('is what?')
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
      if ( typeof value === 'string' ) {
        this.driver.setValue(this.selector, value, error => {
          if ( error ) {
            return reject(error);
          }
          fulfill();
        });
      }
      else {
        this.driver.getValue(this.selector, (error, text) => {
          if ( error ) {
            return reject(error);
          }
          fulfill(text);
        });
      }
        
    });
  }

  keys (keys) {
    return new Promise((fulfill, reject) => {
      this.driver.keys(keys).then(fulfill);
    });
  }

  count (selector, cb) {
    return new Promise((fulfill, reject) => {
      this.driver.getHTML(this.selector + ' ' + selector, (error, html) => {
        if ( error ) {
          return fulfill(0);
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
          fulfill(text);
        });
      });
    }
  }

  attr (attr, value) {
    if ( ( '1' in arguments ) ) {

    }
    else {
      return new Promise((fulfill, reject) => {
        this.driver.getAttribute(this.selector, attr, (error, attrs) => {
          if ( error ) {
            return reject(error);
          }
          fulfill(attrs);
        });
      });
    }
  }

  upload (file) {
    return new Promise((fulfill, reject) => {
      this.driver.chooseFile(this.selector, file, error => {
        if ( error ) {
          return reject(error);
        }
        fulfill();
      });
    });
  }

  html () {
    return new Promise((fulfill, reject) => {
      this.driver.getHTML(this.selector, (error, html) => {
        if ( error ) {
          return reject(error);
        }
        fulfill(html);
      });
    });
  }
}

export default Selector;