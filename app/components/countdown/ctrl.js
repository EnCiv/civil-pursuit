'use strict';

import Controller   from '../../lib/app/controller';
import moment       from 'moment';

class CountDownCtrl extends Controller {
  constructor (props) {
    super(props);

    this.props = props;

    this.template = $('#countdown');
  }

  find (name) {
    switch (name) {
      case 'panel':
          return $('#countdown-panel');
        break;

      case 'remaining days': return $('.countdown-days', this.template);
      case 'remaining hours': return $('.countdown-hours', this.template);
      case 'remaining minutes': return $('.countdown-minutes', this.template);
      case 'remaining seconds': return $('.countdown-seconds', this.template);

      case 'goal': return $('.discussion-goal', this.template);
      case 'registered': return $('.discussion-registered', this.template);
      case 'register': return $('.discussion-register_button', this.template);

      case 'panel title':
        return this.template.find('.panel-title');

      case 'is registered': return $('.discussion-is_registered', this.template);

      case 'invite': return $('.discussion-invite_people', this.template);

      case 'invite by email': return $('.discussion-invite_people-button_email', this.template);

      case 'deadline month': return $('.discussion-deadline-month', this.template);

      case 'deadline day': return $('.discussion-deadline-day', this.template);

      case 'deadline year': return $('.discussion-deadline-year', this.template);

      case 'deadline hour': return $('.discussion-deadline-hour', this.template);

      case 'deadline minute': return $('.discussion-deadline-minute', this.template);

      case 'deadline ampm': return $('.discussion-deadline-ampm', this.template);

      default:

    }
  }

  render () {
    this.find('panel title').text('Countdown');
    this
      .publish('get discussion')
      .subscribe((pubsub, discussion) => {
        pubsub.unsubscribe();

        this.discussion = discussion;

        this.renderDeadline();

        this.timer = setInterval(this.renderCountdown.bind(this), 1000);

        this.renderGoal();

        this.renderRegister();
      });
  }

  renderDeadline () {
    let deadline = moment(new Date(this.discussion.deadline));

    this.find('deadline month').text(deadline.format('MMM'));
    this.find('deadline day').text(deadline.format('D'));
    this.find('deadline year').text(deadline.format('YYYY'));
    this.find('deadline hour').text(deadline.format('h'));
    this.find('deadline minute').text(deadline.format('mm'));
    this.find('deadline ampm').text(deadline.format('a'));
  }

  renderCountdown () {
    let deadline = new Date(this.discussion.deadline);

    let now = Date.now();

    let interval = deadline - now;

    if ( interval < 0 ) {
      console.log('deadline OK');
      clearTimeout(this.timer);
      return this.renderDeadlineMet();
    }

    let days = Math.floor(interval / ( 1000 * 60 * 60 * 24));

    let daysRemainder = interval % ( 1000 * 60 * 60 * 24);

    let hours = Math.floor(daysRemainder / ( 1000 * 60 * 60 ));

    let hoursRemainder = daysRemainder % ( 1000 * 60 * 60 );

    let minutes = Math.floor(hoursRemainder / ( 1000 * 60 ));

    let minutesRemainder = hoursRemainder % ( 1000 * 60 );

    let seconds = Math.floor(minutesRemainder / 1000);

    this.find('remaining days').text(days);

    if ( days < 2 ) {
      this.find('remaining days label').text('day');
    }

    this.find('remaining hours').text(hours < 10 ? `0${hours}` : hours);

    this.find('remaining minutes').text(minutes < 10 ? `0${minutes}` : minutes);

    this.find('remaining seconds').text(seconds < 10 ? `0${seconds}` : seconds);

  }

  renderGoal () {
    this.find('registered').text(this.discussion.registered.length);
    this.find('goal').text(this.discussion.goal);
  }

  renderRegister () {

    if ( this.socket.synuser && this.discussion.registered.some(user => this.socket.synuser.id) ) {
      this.find('register').hide();
      this.find('is registered').removeClass('hide');
      this.find('invite').removeClass('hide');
      this.find('invite by email').attr('href', `mailto:?Subject=${encodeURIComponent(this.discussion.subject)}&Body=${encodeURIComponent(this.discussion.description.replace(/\{hostname\}/g, location.hostname))}`)
    }

    else {
      this.find('register').on('click', () => {
        $('.join-button').click();
      });
    }
  }

  renderDeadlineMet () {
    this.template.hide();
    $('.panels').removeClass('hide');
  }
}

export default CountDownCtrl;
