'use strict';

import should               from 'should';
import describe             from 'redtea';
import printRequest         from '../../lib/util/express-pretty';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Express Pretty' , [
    {
      'must be a function' : (ok, ko) => {
        printRequest.should.be.a.Function();
        ok();
      }
    },
    {
      'Request' : [
        {
          'Visitor' : [
            {
              'GET' : [
                {
                  'should return an object' : (ok, ko) => {
                    locals.pretty = printRequest({
                      method : 'GET',
                      url : '/'
                    });
                    locals.pretty.should.be.an.Object();
                    ok();
                  }
                },
                {
                  'Time' : [
                    {
                      'should have property time' : (ok, ko) => {
                        locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3);
                        ok();
                      }
                    },
                    {
                      'should have property hours' : (ok, ko) => {
                        locals.pretty.time[0].should.be.a.String();
                        ok();
                      }
                    },
                    {
                      'should have property minutes' : (ok, ko) => {
                        locals.pretty.time[1].should.be.a.String();
                        ok();
                      }
                    },
                    {
                      'should have property seconds' : (ok, ko) => {
                        locals.pretty.time[2].should.be.a.String();
                        ok();
                      }
                    }
                  ]
                },
                {
                  'User' : [
                    {
                      'should have property user' : (ok, ko) => {
                        locals.pretty.should.have.property('user')
                          .which.is.an.Object();
                        ok();
                      }
                    },
                    {
                      'should have a name which is visitor' : (ok, ko) => {
                        locals.pretty.user.should.have.property('name')
                          .which.is.exactly('visitor');
                        ok();
                      }
                    },
                    {
                      'should be in magenta' : (ok, ko) => {
                        locals.pretty.user.should.have.property('color')
                          .which.is.exactly('magenta');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Status' : [
                    {
                      'should be hellipsis' : (ok, ko) => {
                        locals.pretty.should.have.property('status')
                          .which.is.exactly('...');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Method' : [
                    {
                      'should be GET' : (ok, ko) => {
                        locals.pretty.should.have.property('method')
                          .which.is.exactly('GET');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'URL' : [
                    {
                      'should be /' : (ok, ko) => {
                        locals.pretty.should.have.property('url')
                          .which.is.exactly('/');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Color' : [
                    {
                      'should be grey' : (ok, ko) => {
                        locals.pretty.should.have.property('color')
                          .which.is.exactly('grey');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'String' : [
                    {
                      'should be an array' : (ok, ko) => {
                        locals.pretty.should.have.property('pretty')
                          .which.is.an.Array();
                        ok();
                      }
                    }
                  ]
                }
              ]
            },
            {
              'POST' : [
                {
                  'should return an object' : (ok, ko) => {
                    locals.pretty = printRequest({
                      method : 'POST',
                      url : '/'
                    });
                    locals.pretty.should.be.an.Object();
                    ok();
                  }
                },
                {
                  'Time' : [
                    {
                      'should have property time' : (ok, ko) => {
                        locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3);
                        ok();
                      }
                    },
                    {
                      'should have property hours' : (ok, ko) => {
                        locals.pretty.time[0].should.be.a.String();
                        ok();
                      }
                    },
                    {
                      'should have property minutes' : (ok, ko) => {
                        locals.pretty.time[1].should.be.a.String();
                        ok();
                      }
                    },
                    {
                      'should have property seconds' : (ok, ko) => {
                        locals.pretty.time[2].should.be.a.String();
                        ok();
                      }
                    }
                  ]
                },
                {
                  'User' : [
                    {
                      'should have property user' : (ok, ko) => {
                        locals.pretty.should.have.property('user')
                          .which.is.an.Object();
                        ok();
                      }
                    },
                    {
                      'should have a name which is visitor' : (ok, ko) => {
                        locals.pretty.user.should.have.property('name')
                          .which.is.exactly('visitor');
                        ok();
                      }
                    },
                    {
                      'should be in magenta' : (ok, ko) => {
                        locals.pretty.user.should.have.property('color')
                          .which.is.exactly('magenta');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Status' : [
                    {
                      'should be hellipsis' : (ok, ko) => {
                        locals.pretty.should.have.property('status')
                          .which.is.exactly('...');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Method' : [
                    {
                      'should be POST' : (ok, ko) => {
                        locals.pretty.should.have.property('method')
                          .which.is.exactly('POST');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'URL' : [
                    {
                      'should be /' : (ok, ko) => {
                        locals.pretty.should.have.property('url')
                          .which.is.exactly('/');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Color' : [
                    {
                      'should be grey' : (ok, ko) => {
                        locals.pretty.should.have.property('color')
                          .which.is.exactly('grey');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'String' : [
                    {
                      'should be an array' : (ok, ko) => {
                        locals.pretty.should.have.property('pretty')
                          .which.is.an.Array();
                        ok();
                      }
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
                  'should return an object' : (ok, ko) => {
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
                    ok();
                  }
                },
                {
                  'Time' : [
                    {
                      'should have property time' : (ok, ko) => {
                        locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3);
                        ok();
                      }
                    },
                    {
                      'should have property hours' : (ok, ko) => {
                        locals.pretty.time[0].should.be.a.String();
                        ok();
                      }
                    },
                    {
                      'should have property minutes' : (ok, ko) => {
                        locals.pretty.time[1].should.be.a.String();
                        ok();
                      }
                    },
                    {
                      'should have property seconds' : (ok, ko) => {
                        locals.pretty.time[2].should.be.a.String();
                        ok();
                      }
                    }
                  ]
                },
                {
                  'User' : [
                    {
                      'should have property user' : (ok, ko) => {
                        locals.pretty.should.have.property('user')
                          .which.is.an.Object();
                        ok();
                      }
                    },
                    {
                      'should have a name which is signedin@synapp.com' : (ok, ko) => {
                        locals.pretty.user.should.have.property('name')
                          .which.is.exactly('signedin@synapp.com');
                        ok();
                      }
                    },
                    {
                      'should be in magenta' : (ok, ko) => {
                        locals.pretty.user.should.have.property('color')
                          .which.is.exactly('blue');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Status' : [
                    {
                      'should be hellipsis' : (ok, ko) => {
                        locals.pretty.should.have.property('status')
                          .which.is.exactly('...');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Method' : [
                    {
                      'should be GET' : (ok, ko) => {
                        locals.pretty.should.have.property('method')
                          .which.is.exactly('GET');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'URL' : [
                    {
                      'should be /' : (ok, ko) => {
                        locals.pretty.should.have.property('url')
                          .which.is.exactly('/');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Color' : [
                    {
                      'should be grey' : (ok, ko) => {
                        locals.pretty.should.have.property('color')
                          .which.is.exactly('grey');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'String' : [
                    {
                      'should be an array' : (ok, ko) => {
                        locals.pretty.should.have.property('pretty')
                          .which.is.an.Array();
                        ok();
                      }
                    }
                  ]
                }
              ]
            },
            {
              'POST' : [
                {
                  'should return an object' : (ok, ko) => {
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
                    ok();
                  }
                },
                {
                  'Time' : [
                    {
                      'should have property time' : (ok, ko) => {
                        locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3);
                        ok();
                      }
                    },
                    {
                      'should have property hours' : (ok, ko) => {
                        locals.pretty.time[0].should.be.a.String();
                        ok();
                      }
                    },
                    {
                      'should have property minutes' : (ok, ko) => {
                        locals.pretty.time[1].should.be.a.String();
                        ok();
                      }
                    },
                    {
                      'should have property seconds' : (ok, ko) => {
                        locals.pretty.time[2].should.be.a.String();
                        ok();
                      }
                    }
                  ]
                },
                {
                  'User' : [
                    {
                      'should have property user' : (ok, ko) => {
                        locals.pretty.should.have.property('user')
                          .which.is.an.Object();
                        ok();
                      }
                    },
                    {
                      'should have a name which is signedin@synapp.com' : (ok, ko) => {
                        locals.pretty.user.should.have.property('name')
                          .which.is.exactly('signedin@synapp.com');
                        ok();
                      }
                    },
                    {
                      'should be in magenta' : (ok, ko) => {
                        locals.pretty.user.should.have.property('color')
                          .which.is.exactly('blue');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Status' : [
                    {
                      'should be hellipsis' : (ok, ko) => {
                        locals.pretty.should.have.property('status')
                          .which.is.exactly('...');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Method' : [
                    {
                      'should be POST' : (ok, ko) => {
                        locals.pretty.should.have.property('method')
                          .which.is.exactly('POST');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'URL' : [
                    {
                      'should be /' : (ok, ko) => {
                        locals.pretty.should.have.property('url')
                          .which.is.exactly('/');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'Color' : [
                    {
                      'should be grey' : (ok, ko) => {
                        locals.pretty.should.have.property('color')
                          .which.is.exactly('grey');
                        ok();
                      }
                    }
                  ]
                },
                {
                  'String' : [
                    {
                      'should be an array' : (ok, ko) => {
                        locals.pretty.should.have.property('pretty')
                          .which.is.an.Array();
                        ok();
                      }
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
                      'should return an object' : (ok, ko) => {
                        locals.pretty = printRequest({
                          method : 'GET',
                          url : '/'
                        }, { statusCode : 200 });
                        locals.pretty.should.be.an.Object();
                        ok();
                      }
                    },
                    {
                      'Time' : [
                        {
                          'should have property time' : (ok, ko) => {
                            locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3);
                            ok();
                          }
                        },
                        {
                          'should have property hours' : (ok, ko) => {
                            locals.pretty.time[0].should.be.a.String();
                            ok();
                          }
                        },
                        {
                          'should have property minutes' : (ok, ko) => {
                            locals.pretty.time[1].should.be.a.String();
                            ok();
                          }
                        },
                        {
                          'should have property seconds' : (ok, ko) => {
                            locals.pretty.time[2].should.be.a.String();
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'User' : [
                        {
                          'should have property user' : (ok, ko) => {
                            locals.pretty.should.have.property('user')
                              .which.is.an.Object();
                            ok();
                          }
                        },
                        {
                          'should have a name which is visitor' : (ok, ko) => {
                            locals.pretty.user.should.have.property('name')
                              .which.is.exactly('visitor');
                            ok();
                          }
                        },
                        {
                          'should be in magenta' : (ok, ko) => {
                            locals.pretty.user.should.have.property('color')
                              .which.is.exactly('magenta');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Status' : [
                        {
                          'should be hellipsis' : (ok, ko) => {
                            locals.pretty.should.have.property('status')
                              .which.is.exactly('200');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Method' : [
                        {
                          'should be GET' : (ok, ko) => {
                            locals.pretty.should.have.property('method')
                              .which.is.exactly('GET');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'URL' : [
                        {
                          'should be /' : (ok, ko) => {
                            locals.pretty.should.have.property('url')
                              .which.is.exactly('/');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Color' : [
                        {
                          'should be green' : (ok, ko) => {
                            locals.pretty.should.have.property('color')
                              .which.is.exactly('green');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'String' : [
                        {
                          'should be an array' : (ok, ko) => {
                            locals.pretty.should.have.property('pretty')
                              .which.is.an.Array();
                            ok();
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  '300' : [
                    {
                      'should return an object' : (ok, ko) => {
                        locals.pretty = printRequest({
                          method : 'GET',
                          url : '/'
                        }, { statusCode : 300 });
                        locals.pretty.should.be.an.Object();
                        ok();
                      }
                    },
                    {
                      'Time' : [
                        {
                          'should have property time' : (ok, ko) => {
                            locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3);
                            ok();
                          }
                        },
                        {
                          'should have property hours' : (ok, ko) => {
                            locals.pretty.time[0].should.be.a.String();
                            ok();
                          }
                        },
                        {
                          'should have property minutes' : (ok, ko) => {
                            locals.pretty.time[1].should.be.a.String();
                            ok();
                          }
                        },
                        {
                          'should have property seconds' : (ok, ko) => {
                            locals.pretty.time[2].should.be.a.String();
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'User' : [
                        {
                          'should have property user' : (ok, ko) => {
                            locals.pretty.should.have.property('user')
                              .which.is.an.Object();
                            ok();
                          }
                        },
                        {
                          'should have a name which is visitor' : (ok, ko) => {
                            locals.pretty.user.should.have.property('name')
                              .which.is.exactly('visitor');
                            ok();
                          }
                        },
                        {
                          'should be in magenta' : (ok, ko) => {
                            locals.pretty.user.should.have.property('color')
                              .which.is.exactly('magenta');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Status' : [
                        {
                          'should be hellipsis' : (ok, ko) => {
                            locals.pretty.should.have.property('status')
                              .which.is.exactly('300');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Method' : [
                        {
                          'should be GET' : (ok, ko) => {
                            locals.pretty.should.have.property('method')
                              .which.is.exactly('GET');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'URL' : [
                        {
                          'should be /' : (ok, ko) => {
                            locals.pretty.should.have.property('url')
                              .which.is.exactly('/');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Color' : [
                        {
                          'should be cyan' : (ok, ko) => {
                            locals.pretty.should.have.property('color')
                              .which.is.exactly('cyan');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'String' : [
                        {
                          'should be an array' : (ok, ko) => {
                            locals.pretty.should.have.property('pretty')
                              .which.is.an.Array();
                            ok();
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  '400' : [
                    {
                      'should return an object' : (ok, ko) => {
                        locals.pretty = printRequest({
                          method : 'GET',
                          url : '/'
                        }, { statusCode : 400 });
                        locals.pretty.should.be.an.Object();
                        ok();
                      }
                    },
                    {
                      'Time' : [
                        {
                          'should have property time' : (ok, ko) => {
                            locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3);
                            ok();
                          }
                        },
                        {
                          'should have property hours' : (ok, ko) => {
                            locals.pretty.time[0].should.be.a.String();
                            ok();
                          }
                        },
                        {
                          'should have property minutes' : (ok, ko) => {
                            locals.pretty.time[1].should.be.a.String();
                            ok();
                          }
                        },
                        {
                          'should have property seconds' : (ok, ko) => {
                            locals.pretty.time[2].should.be.a.String();
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'User' : [
                        {
                          'should have property user' : (ok, ko) => {
                            locals.pretty.should.have.property('user')
                              .which.is.an.Object();
                            ok();
                          }
                        },
                        {
                          'should have a name which is visitor' : (ok, ko) => {
                            locals.pretty.user.should.have.property('name')
                              .which.is.exactly('visitor');
                            ok();
                          }
                        },
                        {
                          'should be in magenta' : (ok, ko) => {
                            locals.pretty.user.should.have.property('color')
                              .which.is.exactly('magenta');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Status' : [
                        {
                          'should be hellipsis' : (ok, ko) => {
                            locals.pretty.should.have.property('status')
                              .which.is.exactly('400');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Method' : [
                        {
                          'should be GET' : (ok, ko) => {
                            locals.pretty.should.have.property('method')
                              .which.is.exactly('GET');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'URL' : [
                        {
                          'should be /' : (ok, ko) => {
                            locals.pretty.should.have.property('url')
                              .which.is.exactly('/');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Color' : [
                        {
                          'should be yellow' : (ok, ko) => {
                            locals.pretty.should.have.property('color')
                              .which.is.exactly('yellow');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'String' : [
                        {
                          'should be an array' : (ok, ko) => {
                            locals.pretty.should.have.property('pretty')
                              .which.is.an.Array();
                            ok();
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  '500' : [
                    {
                      'should return an object' : (ok, ko) => {
                        locals.pretty = printRequest({
                          method : 'GET',
                          url : '/'
                        }, { statusCode : 500 });
                        locals.pretty.should.be.an.Object();
                        ok();
                      }
                    },
                    {
                      'Time' : [
                        {
                          'should have property time' : (ok, ko) => {
                            locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3);
                            ok();
                          }
                        },
                        {
                          'should have property hours' : (ok, ko) => {
                            locals.pretty.time[0].should.be.a.String();
                            ok();
                          }
                        },
                        {
                          'should have property minutes' : (ok, ko) => {
                            locals.pretty.time[1].should.be.a.String();
                            ok();
                          }
                        },
                        {
                          'should have property seconds' : (ok, ko) => {
                            locals.pretty.time[2].should.be.a.String();
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'User' : [
                        {
                          'should have property user' : (ok, ko) => {
                            locals.pretty.should.have.property('user')
                              .which.is.an.Object();
                            ok();
                          }
                        },
                        {
                          'should have a name which is visitor' : (ok, ko) => {
                            locals.pretty.user.should.have.property('name')
                              .which.is.exactly('visitor');
                            ok();
                          }
                        },
                        {
                          'should be in magenta' : (ok, ko) => {
                            locals.pretty.user.should.have.property('color')
                              .which.is.exactly('magenta');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Status' : [
                        {
                          'should be hellipsis' : (ok, ko) => {
                            locals.pretty.should.have.property('status')
                              .which.is.exactly('500');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Method' : [
                        {
                          'should be GET' : (ok, ko) => {
                            locals.pretty.should.have.property('method')
                              .which.is.exactly('GET');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'URL' : [
                        {
                          'should be /' : (ok, ko) => {
                            locals.pretty.should.have.property('url')
                              .which.is.exactly('/');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'Color' : [
                        {
                          'should be red' : (ok, ko) => {
                            locals.pretty.should.have.property('color')
                              .which.is.exactly('red');
                            ok();
                          }
                        }
                      ]
                    },
                    {
                      'String' : [
                        {
                          'should be an array' : (ok, ko) => {
                            locals.pretty.should.have.property('pretty')
                              .which.is.an.Array();
                            ok();
                          }
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
