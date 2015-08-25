'use strict';

import React from 'react';
import App from '../components/app';
import { EventEmitter } from 'events';

window.makePanelId = function (panel) {
  // console.log('make panel id', panel);
  let id = panel.type._id;

  if ( panel.parent ) {
    id += `-${(panel.parent._id || panel.parent)}`;
  }

  else if ( panel.item ) {
    id += `-${panel.item._id}`;
  }

  return id;
}

function makePanel (panel) {
  let p = {
    panel : {
      skip : 0,
      limit : 6
    },
    items : [],
    active : null
  };

  if ( typeof panel === 'object' ) {
    if ( panel.type ) {
      p.panel.type = panel.type;
    }

    if ( panel.parent ) {
      p.panel.parent = panel.parent;
    }
  }

  else if ( typeof panel === 'string' ) {
    let bits = panel.split('-');

    p.panel.type = { _id : bits[0] };

    if ( bits[1] ) {
      p.panel.parent = bits[1];
    }
  }

  return p;
}

function INFO (message, ...messages) {
  console.info(`%c${message}`, 'color: magenta; font-weight: bold', ...messages);
}

function INCOMING (message, ...messages) {
  console.info(`%c${message}`, 'color: blue; font-weight: bold', ...messages);
}

function OUTCOMING (message, ...messages) {
  console.info(`%c${message}`, 'color: green; font-weight: bold', ...messages);
}

let props         =   {
  online          :   0,
  path            :   location.pathname,
  user            :   null,
  ready           :   false,
  intro           :   window.synapp.intro,
  newItem         :   null,
  close           :   false,
  topLevelType    :   null,
  panels          :   {},
  items           :   {},
  created         :   {},
  urlParams       :   {},
  userToReset     :   null
};

window.location.search.replace(
  /([^?=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => { props.urlParams[$1] = $3 }
);

function render () {
  INFO('Rendering app', props);
  React.render(<App { ...props } />, document.getElementById('synapp'));
}

/*******************************************************************************

                          ===     DISPATCHER      ====

*******************************************************************************/

window.Dispatcher = new EventEmitter();

window.Dispatcher

  .on('set active', (panel, section) => {
    INCOMING('set active', panel, section);

    let id = typeof panel === 'string' ? panel : makePanelId(panel);

    if ( props.panels[id].active === section ) {
      props.panels[id].active = null;
    }

    else {
      props.panels[id].active = section;
    }

    render();
  })

  .on('get evaluation', item => {
    INCOMING('get evaluation', item);
    window.socket.emit('get evaluation', item);
  })

  .on('create item', item => {
    INCOMING('create item', item);
    window.socket.emit('create item', item);
  })

  .on('get more items', panel => {
    let id = typeof panel === 'string' ? panel : makePanelId(panel);

    INCOMING('get more items', props.panels[id]);

    let Panel = props.panels[id].panel;

    Panel.skip += 6;

    window.socket.emit('get items', Panel);
  })

  .on('add view', item => {
    INCOMING('add view', item);
    window.socket.emit('add view', item);
  })

  .on('promote item', (item, position, evaluatedItem, view) => {
    INCOMING('promote item', item, position, evaluatedItem, view);

    let saveFeedback = (position) => {
      let feedback = view.querySelectorAll(`.promote-${position} .user-feedback`);

      for ( let i = 0; i < feedback.length; i ++ ) {
        let value = feedback[i].value;

        if ( value ) {
          let id = feedback[i].closest('.item').id.split('-')[1];

          window.Dispatcher.emit('insert feedback', id, value);

          feedback[i].value = '';
        }
      }
    };

    let saveVotes = position => {
      let votes = view.querySelectorAll(`.promote-${position} [type="range"]`);

      let visibleVotes = [];

      for ( let i = 0; i < votes.length; i ++ ) {
        if ( votes[i].offsetHeight ) {
          let id = votes[i].closest('.item').id.split('-')[1];

          let vote = {
            criteria : votes[i].dataset.criteria,
            value: votes[i].value,
            item : id
          };

          visibleVotes.push(vote);

          votes[i].value = 0;
        }
      }

      window.Dispatcher.emit('insert votes', visibleVotes);
    };

    if ( item ) {
      window.socket.emit('promote', item);
    }

    let { evaluation } = props.items[evaluatedItem._id];

    let isEnd = evaluation.cursor === evaluation.limit;

    if ( evaluation.cursor <= evaluation.limit ) {
      if ( position === 'left' ) {

        if ( evaluation.right ) {
          saveFeedback('right');
          saveVotes('right');
        }

        if ( evaluation.cursor < evaluation.limit ) {
          evaluation.cursor ++;

          evaluation.right = evaluation.items[evaluation.cursor];
        }
      }
      else if ( position === 'right' ) {

        if ( evaluation.left ) {
          saveFeedback('left');
          saveVotes('left');
        }

        if ( evaluation.cursor < evaluation.limit ) {
          evaluation.cursor ++;

          evaluation.left = evaluation.items[evaluation.cursor];
        }
      }
      else {
        saveFeedback('left');
        saveVotes('left');
        saveFeedback('right');
        saveVotes('right');

        if ( evaluation.cursor < evaluation.limit ) {
          evaluation.cursor ++;

          evaluation.left = evaluation.items[evaluation.cursor];
        }

        if ( evaluation.cursor < evaluation.limit ) {
          evaluation.cursor ++;

          evaluation.right = evaluation.items[evaluation.cursor];
        }
      }
    }

    else {
      evaluation.cursor = evaluation.limit;
    }

    if ( isEnd ) {
      delete props.items[evaluatedItem._id].evaluation;
    }

    // scroll to top

    let top = view.getBoundingClientRect().top;
    let { pageYOffset } = window;

    window.scrollTo(0, pageYOffset + top - 60);

    render();
  })

  .on('get details', item => {
    INCOMING('get details', item);
    window.socket.emit('get item details', item);
  })

  .on('get items', panel => {
    let id = typeof panel === 'string' ? panel : makePanelId(panel);

    INCOMING('get items', id);

    let Panel = props.panels[id];

    if ( ! Panel ) {
      Panel = makePanel(panel);
    }

    panel = Panel.panel;

    panel.skip = Panel.skip;
    panel.limit = Panel.limit;

    window.socket.emit('get items', panel);
  })

  .on('get item', item => {
    if ( typeof item === 'string' ) {
      item = { _id : item };
    }

    INCOMING('get item', item);
    window.socket.emit('get item', item);
  })

  .on('insert feedback', (item, value) => {
    INCOMING('leave feedback', item, value);
    window.socket.emit('insert feedback', item, value);
  })

  .on('insert votes', votes => {
    INCOMING('insert votes', votes);
    window.socket.emit('insert votes', votes);
  })

  .on('get user', query => {
    INCOMING('get user', query);
    window.socket.emit('get user', query);
  })

  .on('reset password', (user, password) => {
    INCOMING('reset password', user, password);
    window.socket.emit('reset password', user.activation_key, user.activation_token, password);
  });


/*******************************************************************************

                          ===     SOCKET      ====

*******************************************************************************/

window.socket = io();

window.socket

  .on('welcome', user => {
    props.ready = true;
    props.user = user;
    render();

    INCOMING('get top level type');

    window.socket.emit('get top level type');
  })

  .on('online users', users => {
    props.online = users;
    render();
  })

  .on('OK get top level type', type => {
    OUTCOMING('got top level type', type);

    props.topLevelType = makePanelId({ type });

    props.panels[props.topLevelType] = makePanel({ type });

    render ();

    INCOMING('getting top level items');

    window.socket.emit('get items', { type });
  })

  .on('OK get items', (panel, count, items) => {
    OUTCOMING('got items', panel, count, items);
    let id = makePanelId(panel);

    if ( ! props.panels[id] ) {
      props.panels[id] = { panel, items, active : null };
    }

    else {
      props.panels[id].items.push(...items);

      if ( panel.skip ) {
        props.panels[id].skip = panel.skip;
      }

      if ( panel.limit ) {
        props.panels[id].limit = panel.limit;
      }

      props.panels[id].count = count;
    }

    items.forEach(item => {
      props.items[item._id] = { panel : id };
    });

    render();
  })

  .on('OK get evaluation', evaluation => {
    OUTCOMING('got evaluation', evaluation);

    evaluation.cursor = 1;

    evaluation.limit = 5;

    if ( evaluation.items[0] ) {
      evaluation.left = evaluation.items[0];
      window.Dispatcher.emit('add view', evaluation.items[0]);
    }

    if ( evaluation.items[1] ) {
      evaluation.right = evaluation.items[1];
      window.Dispatcher.emit('add view', evaluation.items[1]);
    }

    props.items[evaluation.item._id].evaluation = evaluation;
    render();
  })

  .on('OK create item', item => {
    OUTCOMING('created item', item);

    let parent = item.lineage[item.lineage.length -1];

    if ( parent ) {
      parent = parent._id;
    }

    let panelId = makePanelId({ type : item.type, parent });

    console.log({ panelId })

    if ( Array.isArray(props.panels[panelId].items) ) {
      props.panels[panelId].items.unshift(item);
    }
    else {
      props.panels[panelId].items.push(item);
    }

    props.items[item._id] = { panel : panelId };

    props.created = { panel : panelId, item : item._id };

    render();

    props.created = {};
  })

  .on('item changed', item => {
    OUTCOMING('item changed', item);

    let panel = { type : item.type };

    if ( item.lineage.length ) {
      panel.parent = item.lineage[item.lineage.length - 1];
    }

    let id = makePanelId(panel);

    if ( ! props.panels[id] ) {
      props.panels[id] = makePanel(id);
      props.panels[id].items.push(item);
    }

    props.panels[id].items = props.panels[id].items.map(panelItem => {
      if ( panelItem._id === item._id ) {
        return item;
      }

      return panelItem;
    });

    render();
  })

  .on('OK get item details', details => {
    OUTCOMING('got details', details);

    props.items[details.item._id].details = details;

    render();
  })

  .on('OK insert feedback', feedback => {
    OUTCOMING('feedback inserted', feedback);

    let item = props.items[feedback.item];

    if ( item.details ) {
      item.details.feedback.push(feedback);

      render();
    }
  })

  .on('OK insert votes', votes => {
    OUTCOMING('votes saved', votes);

    let item = props.items[votes[0].item];

    if ( item.details ) {

      let _votes = item.details.votes;

      for ( let vote in votes ) {
        if ( _votes[vote.criteria] ) {
          _votes[vote.criteria].total ++;
          _votes[vote.criteria].values[vote.value] ++;
        }
        else {
          _votes[vote.criteria] = {
            total : 1,
            values : {
              '-1' : vote.value === -1 ? 1 : 0,
              '0' : vote.value === 0 ? 1 : 0,
              '1' : vote.value === 1 ? 1 : 0
            }
          }
        }
      }

      render();
    }
  })

  .on('OK get item', item => {
    OUTCOMING('got item', item);
    let panelId = makePanelId({ type : item.type, parent : item.parent });
    props.panels[panelId].items.unshift(item);
    render();
    setTimeout(() => {
      let view = document.querySelector(`#item-${item._id}`);
      let top = view.getBoundingClientRect().top;
      let { pageYOffset } = window;

      window.scrollTo(0, pageYOffset + top - 60);

      props.panels[panelId].active = `${item._id}-edit-and-go-again`;

      render();
    }, 500);
  })

  .on('OK get user', user => {
    OUTCOMING('OK get user', user);
    props.userToReset = user;
    render();
  })

  .on('OK reset password', () => {
    OUTCOMING('OK reset password');
    window.Dispatcher.emit('password reset');
  })
;
