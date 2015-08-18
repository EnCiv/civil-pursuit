'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentsApp = require('../components/app');

var _componentsApp2 = _interopRequireDefault(_componentsApp);

var _events = require('events');

window.makePanelId = function (panel) {
  console.log('make panel id', panel);
  var id = panel.type._id;

  if (panel.parent) {
    id += '-' + panel.parent;
  } else if (panel.item) {
    id += '-' + panel.item._id;
  }

  return id;
};

function makePanel(panel) {
  var p = {
    panel: {
      skip: 0,
      limit: 6
    },
    items: [],
    active: null
  };

  if (typeof panel === 'object') {
    if (panel.type) {
      p.panel.type = panel.type;
    }

    if (panel.parent) {
      p.panel.parent = panel.parent;
    }
  } else if (typeof panel === 'string') {
    var bits = panel.split('-');

    p.panel.type = { _id: bits[0] };

    if (bits[1]) {
      p.panel.parent = bits[1];
    }
  }

  return p;
}

function logA(message) {
  for (var _len = arguments.length, messages = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    messages[_key - 1] = arguments[_key];
  }

  console.info.apply(console, ['%c' + message, 'color: magenta; font-weight: bold'].concat(messages));
}

function logB(message) {
  for (var _len2 = arguments.length, messages = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    messages[_key2 - 1] = arguments[_key2];
  }

  console.info.apply(console, ['%c' + message, 'color: blue; font-weight: bold'].concat(messages));
}

function logC(message) {
  for (var _len3 = arguments.length, messages = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    messages[_key3 - 1] = arguments[_key3];
  }

  console.info.apply(console, ['%c' + message, 'color: green; font-weight: bold'].concat(messages));
}

var props = {
  online: 0,
  path: location.pathname,
  user: null,
  ready: false,
  intro: window.synapp.intro,
  newItem: null,
  close: false,
  topLevelType: null,
  panels: {},
  items: {},
  created: {}
};

function render() {
  logA('Rendering app', props);
  _react2['default'].render(_react2['default'].createElement(_componentsApp2['default'], props), document.getElementById('synapp'));
}

/*******************************************************************************

                          ===     DISPATCHER      ====

*******************************************************************************/

window.Dispatcher = new _events.EventEmitter();

window.Dispatcher.on('set active', function (panel, section) {
  logB('set active', panel, section);

  var id = typeof panel === 'string' ? panel : makePanelId(panel);

  if (props.panels[id].active === section) {
    props.panels[id].active = null;
  } else {
    props.panels[id].active = section;
  }

  render();
}).on('get evaluation', function (item) {
  logB('get evaluation', item);
  window.socket.emit('get evaluation', item);
}).on('create item', function (item) {
  logB('create item', item);
  window.socket.emit('create item', item);
}).on('get more items', function (panel) {
  var id = typeof panel === 'string' ? panel : makePanelId(panel);

  logB('get more items', props.panels[id]);

  var Panel = props.panels[id].panel;

  Panel.skip += 6;

  window.socket.emit('get items', Panel);
}).on('add view', function (item) {
  logB('add view', item);
  window.socket.emit('add view', item);
}).on('promote item', function (item, position, evaluatedItem, view) {
  logB('promote item', item, position, evaluatedItem, view);

  var saveFeedback = function saveFeedback(position) {
    var feedback = view.querySelectorAll('.promote-' + position + ' .user-feedback');

    for (var i = 0; i < feedback.length; i++) {
      var value = feedback[i].value;

      if (value) {
        var id = feedback[i].closest('.item').id.split('-')[1];

        window.Dispatcher.emit('insert feedback', id, value);

        feedback[i].value = '';
      }
    }
  };

  var saveVotes = function saveVotes(position) {
    var votes = view.querySelectorAll('.promote-' + position + ' [type="range"]');

    var visibleVotes = [];

    for (var i = 0; i < votes.length; i++) {
      if (votes[i].offsetHeight) {
        var id = votes[i].closest('.item').id.split('-')[1];

        var vote = {
          criteria: votes[i].dataset.criteria,
          value: votes[i].value,
          item: id
        };

        visibleVotes.push(vote);

        votes[i].value = 0;
      }
    }

    window.Dispatcher.emit('insert votes', visibleVotes);
  };

  if (item) {
    window.socket.emit('promote', item);
  }

  var evaluation = props.items[evaluatedItem._id].evaluation;

  var isEnd = evaluation.cursor === evaluation.limit;

  if (evaluation.cursor <= evaluation.limit) {
    if (position === 'left') {

      if (evaluation.right) {
        saveFeedback('right');
        saveVotes('right');
      }

      if (evaluation.cursor < evaluation.limit) {
        evaluation.cursor++;

        evaluation.right = evaluation.items[evaluation.cursor];
      }
    } else if (position === 'right') {

      if (evaluation.left) {
        saveFeedback('left');
        saveVotes('left');
      }

      if (evaluation.cursor < evaluation.limit) {
        evaluation.cursor++;

        evaluation.left = evaluation.items[evaluation.cursor];
      }
    } else {
      saveFeedback('left');
      saveVotes('left');
      saveFeedback('right');
      saveVotes('right');

      if (evaluation.cursor < evaluation.limit) {
        evaluation.cursor++;

        evaluation.left = evaluation.items[evaluation.cursor];
      }

      if (evaluation.cursor < evaluation.limit) {
        evaluation.cursor++;

        evaluation.right = evaluation.items[evaluation.cursor];
      }
    }
  } else {
    evaluation.cursor = evaluation.limit;
  }

  if (isEnd) {
    delete props.items[evaluatedItem._id].evaluation;
  }

  // scroll to top

  var top = view.getBoundingClientRect().top;
  var pageYOffset = window.pageYOffset;

  window.scrollTo(0, pageYOffset + top - 60);

  render();
}).on('get details', function (item) {
  logB('get details', item);
  window.socket.emit('get item details', item);
}).on('get items', function (panel) {
  var id = typeof panel === 'string' ? panel : makePanelId(panel);

  logB('get items', id);

  var Panel = props.panels[id];

  if (!Panel) {
    Panel = makePanel(panel);
  }

  panel = Panel.panel;

  panel.skip = Panel.skip;
  panel.limit = Panel.limit;

  window.socket.emit('get items', panel);
}).on('insert feedback', function (item, value) {
  logB('leave feedback', item, value);
  window.socket.emit('insert feedback', item, value);
}).on('insert votes', function (votes) {
  logB('insert votes', votes);
  window.socket.emit('insert votes', votes);
});

/*******************************************************************************

                          ===     SOCKET      ====

*******************************************************************************/

window.socket = io();

window.socket.on('welcome', function (user) {
  props.ready = true;
  props.user = user;
  render();

  logB('get top level type');

  window.socket.emit('get top level type');
}).on('online users', function (users) {
  props.online = users;
  render();
}).on('OK get top level type', function (type) {
  logC('got top level type', type);

  props.topLevelType = makePanelId({ type: type });

  props.panels[props.topLevelType] = makePanel({ type: type });

  render();

  logB('getting top level items');

  window.socket.emit('get items', { type: type });
}).on('OK get items', function (panel, count, items) {
  logC('got items', panel, count, items);
  var id = makePanelId(panel);

  if (!props.panels[id]) {
    props.panels[id] = { panel: panel, items: items, active: null };
  } else {
    var _props$panels$id$items;

    (_props$panels$id$items = props.panels[id].items).push.apply(_props$panels$id$items, _toConsumableArray(items));

    if (panel.skip) {
      props.panels[id].skip = panel.skip;
    }

    if (panel.limit) {
      props.panels[id].limit = panel.limit;
    }

    props.panels[id].count = count;
  }

  items.forEach(function (item) {
    props.items[item._id] = { panel: id };
  });

  render();
}).on('OK get evaluation', function (evaluation) {
  logC('got evaluation', evaluation);

  evaluation.cursor = 1;

  evaluation.limit = 5;

  if (evaluation.items[0]) {
    evaluation.left = evaluation.items[0];
    window.Dispatcher.emit('add view', evaluation.items[0]);
  }

  if (evaluation.items[1]) {
    evaluation.right = evaluation.items[1];
    window.Dispatcher.emit('add view', evaluation.items[1]);
  }

  props.items[evaluation.item._id].evaluation = evaluation;
  render();
}).on('OK create item', function (item) {
  logC('created item', item);

  var parent = item.lineage[item.lineage.length - 1];

  if (parent) {
    parent = parent._id;
  }

  var panelId = makePanelId({ type: item.type, parent: parent });

  console.log({ panelId: panelId });

  if (Array.isArray(props.panels[panelId].items)) {
    props.panels[panelId].items.unshift(item);
  } else {
    props.panels[panelId].items.push(item);
  }

  props.items[item._id] = { panel: panelId };

  props.created = { panel: panelId, item: item._id };

  render();

  props.created = {};
}).on('item changed', function (item) {
  logC('item changed', item);

  var id = makePanelId(item);

  props.panels[id].items = props.panels[id].items.map(function (panelItem) {
    if (panelItem._id === item._id) {
      return item;
    }

    return panelItem;
  });

  render();
}).on('OK get item details', function (details) {
  logC('got details', details);

  props.items[details.item._id].details = details;

  render();
}).on('OK insert feedback', function (feedback) {
  logC('feedback inserted', feedback);

  var item = props.items[feedback.item];

  if (item.details) {
    item.details.feedback.push(feedback);

    render();
  }
}).on('OK insert votes', function (votes) {
  logC('votes saved', votes);

  var item = props.items[votes[0].item];

  if (item.details) {

    var _votes = item.details.votes;

    for (var vote in votes) {
      if (_votes[vote.criteria]) {
        _votes[vote.criteria].total++;
        _votes[vote.criteria].values[vote.value]++;
      } else {
        _votes[vote.criteria] = {
          total: 1,
          values: {
            '-1': vote.value === -1 ? 1 : 0,
            '0': vote.value === 0 ? 1 : 0,
            '1': vote.value === 1 ? 1 : 0
          }
        };
      }
    }

    render();
  }
});