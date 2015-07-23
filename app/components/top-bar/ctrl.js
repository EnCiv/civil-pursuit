/**
 * @package     App.Component.TopbBar.Controller
*/

'use strict';

import Controller       from '../../lib/app/controller';
import Login            from '../../components/login/ctrl';
import Join             from '../../components/join/ctrl';
import ForgotPassword   from '../../components/forgot-password/ctrl';

class TopBar extends Controller {

  /**
   *  @arg    {Object} props
  */

  constructor (props) {
    super();

    this.props = props;

    this.template = $('.topbar');

    this.store['online users'] = 0;

    this.socket.on('online users', (num) =>
      this.set('online users', num)
    );

    this.on('set', (key, value) => {
      if ( key === 'online users' ) {
        this.renderOnlineUsers();
      }
    });
  }

  find (name) {
    switch ( name ) {
      case 'online users':
        return this.template.find('.online-users');

      case 'right section':
        return this.template.find('.topbar-right');

      case 'login button':
        return this.template.find('.login-button');

      case 'join button':
        return this.template.find('.join-button');

      case 'is in':
        return this.template.find('.is-in');

      case 'is out':
        return this.template.find('.is-out');

      case 'link to profile':
        return $('.link-to-profile', this.template);
    }
  }

  render () {
    this.renderOnlineUsers();

    synapp.app.on('set', (key, value) => {
      if ( key === 'onlineUsers' ) {
        this.find('online users').text(value);
      }
    });

    this.find('right section').removeClass('hide');

    if ( ! this.socket.synuser ) {
      this.find('login button').on('click', this.loginDialog.bind(this));
      this.find('join button').on('click', this.joinDialog.bind(this));
      this.find('is in').hide();
    }

    else {
      this.find('is out').remove();
      this.find('is in').css('display', 'inline');
    }
  }

  renderOnlineUsers () {
    this.find('online users').text(this.get('online users'));
  }

  loginDialog () {
    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: ($vexContent) => {
        this.find('login button')
          .off('click')
          .on('click', () => vex.close());

        new Login({ $vexContent: $vexContent });

        $vexContent.find('.forgot-password-link').on('click', () => {
          new ForgotPassword();
          vex.close($vexContent.data().vex.id);
          return false;
        });
      },

      afterClose: () => {
        $('.login-button').on('click', () => this.loginDialog());
      },

      message: $('#login').text(),

      buttons: [
         $.extend({}, vex.dialog.buttons.NO, {
            text: 'x Close'
          })
      ]
    });
  }

  joinDialog () {
    vex.defaultOptions.className = 'vex-theme-flat-attack';

    let joinDialog = this.joinDialog.bind(this);

    vex.dialog.confirm({

      afterOpen: ($vexContent) => {
        this.find('join button')
          .off('click')
          .on('click', () => {
            vex.close();
          });

        new Join({ $vexContent: $vexContent });
      },

      afterClose: () => {
        $('.join-button').on('click', () => joinDialog());
      },

      message: $('#join').text(),
      buttons: [
         $.extend({}, vex.dialog.buttons.NO, {
            text: 'x Close'
          })
      ],
      callback: (value) => {
        
      },
      defaultOptions: {
        closeCSS: {
          color: 'red'
        }
      }
    });
  }

}

export default TopBar;
