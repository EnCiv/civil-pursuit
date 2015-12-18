'use strict';

import should               from 'should';
import describe             from 'redtea';
import printRequest         from '../../lib/util/express-pretty';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Express Pretty' , [
    {
      'must be a function' : () =>
        printRequest.should.be.a.Function()
    },
    {
      'Request' : [
        {
          'Visitor' : [
            {
              'GET' : [
                {
                  'should return an object' : () => {
                    locals.pretty = printRequest({
                      method : 'GET',
                      url : '/'
                    });

                    locals.pretty.should.be.an.Object();
                  }
                },
                {
                  'Time' : [
                    {
                      'should have property time' : () =>
                        locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
                    },
                    {
                      'should have property hours' : () =>
                        locals.pretty.time[0].should.be.a.String()
                    },
                    {
                      'should have property minutes' : () =>
                        locals.pretty.time[1].should.be.a.String()
                    },
                    {
                      'should have property seconds' : () =>
                        locals.pretty.time[2].should.be.a.String()
                    }
                  ]
                },
                {
                  'User' : [
                    {
                      'should have property user' : () =>
                        locals.pretty.should.have.property('user')
                          .which.is.an.Object()
                    },
                    {
                      'should have a name which is visitor' : () =>
                        locals.pretty.user.should.have.property('name')
                          .which.is.exactly('visitor')
                    },
                    {
                      'should be in magenta' : () =>
                        locals.pretty.user.should.have.property('color')
                          .which.is.exactly('magenta')
                    }
                  ]
                },
                {
                  'Status' : [
                    {
                      'should be hellipsis' : () =>
                        locals.pretty.should.have.property('status')
                          .which.is.exactly('...')
                    }
                  ]
                },
                {
                  'Method' : [
                    {
                      'should be GET' : () =>
                        locals.pretty.should.have.property('method')
                          .which.is.exactly('GET')
                    }
                  ]
                },
                {
                  'URL' : [
                    {
                      'should be /' : () =>
                        locals.pretty.should.have.property('url')
                          .which.is.exactly('/')
                    }
                  ]
                },
                {
                  'Color' : [
                    {
                      'should be grey' : () =>
                        locals.pretty.should.have.property('color')
                          .which.is.exactly('grey')
                    }
                  ]
                },
                {
                  'String' : [
                    {
                      'should be an array' : () =>
                        locals.pretty.should.have.property('pretty')
                          .which.is.an.Array()
                    }
                  ]
                }
              ]
            },
            {
              'POST' : [
                {
                  'should return an object' : () => {
                    locals.pretty = printRequest({
                      method : 'POST',
                      url : '/'
                    });
                    locals.pretty.should.be.an.Object();
                  }
                },
                {
                  'Time' : [
                    {
                      'should have property time' : () =>
                        locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
                    },
                    {
                      'should have property hours' : () =>
                        locals.pretty.time[0].should.be.a.String()
                    },
                    {
                      'should have property minutes' : () =>
                        locals.pretty.time[1].should.be.a.String()
                    },
                    {
                      'should have property seconds' : () =>
                        locals.pretty.time[2].should.be.a.String()
                    }
                  ]
                },
                {
                  'User' : [
                    {
                      'should have property user' : () =>
                        locals.pretty.should.have.property('user')
                          .which.is.an.Object()
                    },
                    {
                      'should have a name which is visitor' : () =>
                        locals.pretty.user.should.have.property('name')
                          .which.is.exactly('visitor')
                    },
                    {
                      'should be in magenta' : () =>
                        locals.pretty.user.should.have.property('color')
                          .which.is.exactly('magenta')
                    }
                  ]
                },
                {
                  'Status' : [
                    {
                      'should be hellipsis' : () =>
                        locals.pretty.should.have.property('status')
                          .which.is.exactly('...')
                    }
                  ]
                },
                {
                  'Method' : [
                    {
                      'should be POST' : () =>
                        locals.pretty.should.have.property('method')
                          .which.is.exactly('POST')
                    }
                  ]
                },
                {
                  'URL' : [
                    {
                      'should be /' : () =>
                        locals.pretty.should.have.property('url')
                          .which.is.exactly('/')
                    }
                  ]
                },
                {
                  'Color' : [
                    {
                      'should be grey' : () =>
                        locals.pretty.should.have.property('color')
                          .which.is.exactly('grey')
                    }
                  ]
                },
                {
                  'String' : [
                    {
                      'should be an array' : () =>
                        locals.pretty.should.have.property('pretty')
                          .which.is.an.Array()
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          'Signed in user' : [
            {
              'GET' : [
                {
                  'should return an object' : () => {
                    locals.pretty = printRequest({
                      method : 'GET',
                      url : '/',
                      cookies : {
                        synuser : {
                          email : 'signedin@synapp.com'
                        }
                      }
                    });
                    locals.pretty.should.be.an.Object();
                  }
                },
                {
                  'Time' : [
                    {
                      'should have property time' : () =>
                        locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
                    },
                    {
                      'should have property hours' : () =>
                        locals.pretty.time[0].should.be.a.String()
                    },
                    {
                      'should have property minutes' : () =>
                        locals.pretty.time[1].should.be.a.String()
                    },
                    {
                      'should have property seconds' : () =>
                        locals.pretty.time[2].should.be.a.String()
                    }
                  ]
                },
                {
                  'User' : [
                    {
                      'should have property user' : () =>
                        locals.pretty.should.have.property('user')
                          .which.is.an.Object()
                    },
                    {
                      'should have a name which is signedin@synapp.com' : () =>
                        locals.pretty.user.should.have.property('name')
                          .which.is.exactly('signedin@synapp.com')
                    },
                    {
                      'should be in magenta' : () =>
                        locals.pretty.user.should.have.property('color')
                          .which.is.exactly('blue')
                    }
                  ]
                },
                {
                  'Status' : [
                    {
                      'should be hellipsis' : () =>
                        locals.pretty.should.have.property('status')
                          .which.is.exactly('...')
                    }
                  ]
                },
                {
                  'Method' : [
                    {
                      'should be GET' : () =>
                        locals.pretty.should.have.property('method')
                          .which.is.exactly('GET')
                    }
                  ]
                },
                {
                  'URL' : [
                    {
                      'should be /' : () =>
                        locals.pretty.should.have.property('url')
                          .which.is.exactly('/')
                    }
                  ]
                },
                {
                  'Color' : [
                    {
                      'should be grey' : () =>
                        locals.pretty.should.have.property('color')
                          .which.is.exactly('grey')
                    }
                  ]
                },
                {
                  'String' : [
                    {
                      'should be an array' : () =>
                        locals.pretty.should.have.property('pretty')
                          .which.is.an.Array()
                    }
                  ]
                }
              ]
            },
            {
              'POST' : [
                {
                  'should return an object' : () => {
                    locals.pretty = printRequest({
                      method : 'POST',
                      url : '/',
                      cookies : {
                        synuser : {
                          email : 'signedin@synapp.com'
                        }
                      }
                    });
                    locals.pretty.should.be.an.Object();
                  }
                },
                {
                  'Time' : [
                    {
                      'should have property time' : () =>
                        locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
                    },
                    {
                      'should have property hours' : () =>
                        locals.pretty.time[0].should.be.a.String()
                    },
                    {
                      'should have property minutes' : () =>
                        locals.pretty.time[1].should.be.a.String()
                    },
                    {
                      'should have property seconds' : () =>
                        locals.pretty.time[2].should.be.a.String()
                    }
                  ]
                },
                {
                  'User' : [
                    {
                      'should have property user' : () =>
                        locals.pretty.should.have.property('user')
                          .which.is.an.Object()
                    },
                    {
                      'should have a name which is signedin@synapp.com' : () =>
                        locals.pretty.user.should.have.property('name')
                          .which.is.exactly('signedin@synapp.com')
                    },
                    {
                      'should be in magenta' : () =>
                        locals.pretty.user.should.have.property('color')
                          .which.is.exactly('blue')
                    }
                  ]
                },
                {
                  'Status' : [
                    {
                      'should be hellipsis' : () =>
                        locals.pretty.should.have.property('status')
                          .which.is.exactly('...')
                    }
                  ]
                },
                {
                  'Method' : [
                    {
                      'should be POST' : () =>
                        locals.pretty.should.have.property('method')
                          .which.is.exactly('POST')
                    }
                  ]
                },
                {
                  'URL' : [
                    {
                      'should be /' : () =>
                        locals.pretty.should.have.property('url')
                          .which.is.exactly('/')
                    }
                  ]
                },
                {
                  'Color' : [
                    {
                      'should be grey' : () =>
                        locals.pretty.should.have.property('color')
                          .which.is.exactly('grey')
                    }
                  ]
                },
                {
                  'String' : [
                    {
                      'should be an array' : () =>
                        locals.pretty.should.have.property('pretty')
                          .which.is.an.Array()
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'Response' : [
        {
          'Visitor' : [
            {
              'GET' : [
                {
                  '200' : [
                    {
                      'should return an object' : () => {
                        locals.pretty = printRequest({
                          method : 'GET',
                          url : '/'
                        }, { statusCode : 200 });
                        locals.pretty.should.be.an.Object();
                      }
                    },
                    {
                      'Time' : [
                        {
                          'should have property time' : () =>
                            locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
                        },
                        {
                          'should have property hours' : () =>
                            locals.pretty.time[0].should.be.a.String()
                        },
                        {
                          'should have property minutes' : () =>
                            locals.pretty.time[1].should.be.a.String()
                        },
                        {
                          'should have property seconds' : () =>
                            locals.pretty.time[2].should.be.a.String()
                        }
                      ]
                    },
                    {
                      'User' : [
                        {
                          'should have property user' : () =>
                            locals.pretty.should.have.property('user')
                              .which.is.an.Object()
                        },
                        {
                          'should have a name which is visitor' : () =>
                            locals.pretty.user.should.have.property('name')
                              .which.is.exactly('visitor')
                        },
                        {
                          'should be in magenta' : () =>
                            locals.pretty.user.should.have.property('color')
                              .which.is.exactly('magenta')
                        }
                      ]
                    },
                    {
                      'Status' : [
                        {
                          'should be hellipsis' : () =>
                            locals.pretty.should.have.property('status')
                              .which.is.exactly('200')
                        }
                      ]
                    },
                    {
                      'Method' : [
                        {
                          'should be GET' : () =>
                            locals.pretty.should.have.property('method')
                              .which.is.exactly('GET')
                        }
                      ]
                    },
                    {
                      'URL' : [
                        {
                          'should be /' : () =>
                            locals.pretty.should.have.property('url')
                              .which.is.exactly('/')
                        }
                      ]
                    },
                    {
                      'Color' : [
                        {
                          'should be green' : () =>
                            locals.pretty.should.have.property('color')
                              .which.is.exactly('green')
                        }
                      ]
                    },
                    {
                      'String' : [
                        {
                          'should be an array' : () =>
                            locals.pretty.should.have.property('pretty')
                              .which.is.an.Array()
                        }
                      ]
                    }
                  ]
                },
                {
                  '300' : [
                    {
                      'should return an object' : () => {
                        locals.pretty = printRequest({
                          method : 'GET',
                          url : '/'
                        }, { statusCode : 300 });
                        locals.pretty.should.be.an.Object();
                      }
                    },
                    {
                      'Time' : [
                        {
                          'should have property time' : () =>
                            locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
                        },
                        {
                          'should have property hours' : () =>
                            locals.pretty.time[0].should.be.a.String()
                        },
                        {
                          'should have property minutes' : () =>
                            locals.pretty.time[1].should.be.a.String()
                        },
                        {
                          'should have property seconds' : () =>
                            locals.pretty.time[2].should.be.a.String()
                        }
                      ]
                    },
                    {
                      'User' : [
                        {
                          'should have property user' : () =>
                            locals.pretty.should.have.property('user')
                              .which.is.an.Object()
                        },
                        {
                          'should have a name which is visitor' : () =>
                            locals.pretty.user.should.have.property('name')
                              .which.is.exactly('visitor')
                        },
                        {
                          'should be in magenta' : () =>
                            locals.pretty.user.should.have.property('color')
                              .which.is.exactly('magenta')
                        }
                      ]
                    },
                    {
                      'Status' : [
                        {
                          'should be hellipsis' : () =>
                            locals.pretty.should.have.property('status')
                              .which.is.exactly('300')
                        }
                      ]
                    },
                    {
                      'Method' : [
                        {
                          'should be GET' : () =>
                            locals.pretty.should.have.property('method')
                              .which.is.exactly('GET')
                        }
                      ]
                    },
                    {
                      'URL' : [
                        {
                          'should be /' : () =>
                            locals.pretty.should.have.property('url')
                              .which.is.exactly('/')
                        }
                      ]
                    },
                    {
                      'Color' : [
                        {
                          'should be cyan' : () =>
                            locals.pretty.should.have.property('color')
                              .which.is.exactly('cyan')
                        }
                      ]
                    },
                    {
                      'String' : [
                        {
                          'should be an array' : () =>
                            locals.pretty.should.have.property('pretty')
                              .which.is.an.Array()
                        }
                      ]
                    }
                  ]
                },
                {
                  '400' : [
                    {
                      'should return an object' : () => {
                        locals.pretty = printRequest({
                          method : 'GET',
                          url : '/'
                        }, { statusCode : 400 });
                        locals.pretty.should.be.an.Object();
                      }
                    },
                    {
                      'Time' : [
                        {
                          'should have property time' : () =>
                            locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
                        },
                        {
                          'should have property hours' : () =>
                            locals.pretty.time[0].should.be.a.String()
                        },
                        {
                          'should have property minutes' : () =>
                            locals.pretty.time[1].should.be.a.String()
                        },
                        {
                          'should have property seconds' : () =>
                            locals.pretty.time[2].should.be.a.String()
                        }
                      ]
                    },
                    {
                      'User' : [
                        {
                          'should have property user' : () =>
                            locals.pretty.should.have.property('user')
                              .which.is.an.Object()
                        },
                        {
                          'should have a name which is visitor' : () =>
                            locals.pretty.user.should.have.property('name')
                              .which.is.exactly('visitor')
                        },
                        {
                          'should be in magenta' : () =>
                            locals.pretty.user.should.have.property('color')
                              .which.is.exactly('magenta')
                        }
                      ]
                    },
                    {
                      'Status' : [
                        {
                          'should be hellipsis' : () =>
                            locals.pretty.should.have.property('status')
                              .which.is.exactly('400')
                        }
                      ]
                    },
                    {
                      'Method' : [
                        {
                          'should be GET' : () =>
                            locals.pretty.should.have.property('method')
                              .which.is.exactly('GET')
                        }
                      ]
                    },
                    {
                      'URL' : [
                        {
                          'should be /' : () =>
                            locals.pretty.should.have.property('url')
                              .which.is.exactly('/')
                        }
                      ]
                    },
                    {
                      'Color' : [
                        {
                          'should be yellow' : () =>
                            locals.pretty.should.have.property('color')
                              .which.is.exactly('yellow')
                        }
                      ]
                    },
                    {
                      'String' : [
                        {
                          'should be an array' : () =>
                            locals.pretty.should.have.property('pretty')
                              .which.is.an.Array()
                        }
                      ]
                    }
                  ]
                },
                {
                  '500' : [
                    {
                      'should return an object' : () => {
                        locals.pretty = printRequest({
                          method : 'GET',
                          url : '/'
                        }, { statusCode : 500 });
                        locals.pretty.should.be.an.Object();
                      }
                    },
                    {
                      'Time' : [
                        {
                          'should have property time' : () =>
                            locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
                        },
                        {
                          'should have property hours' : () =>
                            locals.pretty.time[0].should.be.a.String()
                        },
                        {
                          'should have property minutes' : () =>
                            locals.pretty.time[1].should.be.a.String()
                        },
                        {
                          'should have property seconds' : () =>
                            locals.pretty.time[2].should.be.a.String()
                        }
                      ]
                    },
                    {
                      'User' : [
                        {
                          'should have property user' : () =>
                            locals.pretty.should.have.property('user')
                              .which.is.an.Object()
                        },
                        {
                          'should have a name which is visitor' : () =>
                            locals.pretty.user.should.have.property('name')
                              .which.is.exactly('visitor')
                        },
                        {
                          'should be in magenta' : () =>
                            locals.pretty.user.should.have.property('color')
                              .which.is.exactly('magenta')
                        }
                      ]
                    },
                    {
                      'Status' : [
                        {
                          'should be hellipsis' : () =>
                            locals.pretty.should.have.property('status')
                              .which.is.exactly('500')
                        }
                      ]
                    },
                    {
                      'Method' : [
                        {
                          'should be GET' : () =>
                            locals.pretty.should.have.property('method')
                              .which.is.exactly('GET')
                        }
                      ]
                    },
                    {
                      'URL' : [
                        {
                          'should be /' : () =>
                            locals.pretty.should.have.property('url')
                              .which.is.exactly('/')
                        }
                      ]
                    },
                    {
                      'Color' : [
                        {
                          'should be red' : () =>
                            locals.pretty.should.have.property('color')
                              .which.is.exactly('red')
                        }
                      ]
                    },
                    {
                      'String' : [
                        {
                          'should be an array' : () =>
                            locals.pretty.should.have.property('pretty')
                              .which.is.an.Array()
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ] );

}

export default test;
