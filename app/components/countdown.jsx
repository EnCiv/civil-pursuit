'use strict';

import React              from 'react';
import moment             from 'moment';
import Panel              from './panel';
import Button             from './util/button';
import userType           from '../lib/proptypes/user';
import discussionType     from '../lib/proptypes/discussion';

class Countdown extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  timer = null;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    const remainingSeconds  =   React.findDOMNode(this.refs.remainingSeconds);
    const remainingMinutes  =   React.findDOMNode(this.refs.remainingMinutes);
    const remainingHours    =   React.findDOMNode(this.refs.remainingHours);
    const remainingDays     =   React.findDOMNode(this.refs.remainingDays);

    this.timer = setInterval(() => {
      const remainingTime = this.countRemainingTime();

      if ( remainingTime.days ) {
        remainingDays.querySelector('span').innerText = remainingTime.days;
      }

      if ( remainingTime.hours ) {
        remainingHours.querySelector('span').innerText = remainingTime.hours;
      }

      if ( remainingTime.minutes ) {
        remainingMinutes.querySelector('span').innerText = remainingTime.minutes;
      }

      remainingSeconds.innerText = remainingTime.seconds;
    }, 1000);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  countRemainingTime () {
    const now             =   Date.now(),
      interval            =   new Date(this.props.discussion.deadline ) - now,
      days                =   Math.floor(interval / ( 1000 * 60 * 60 * 24)),
      daysRemainder       =   interval % ( 1000 * 60 * 60 * 24),
      hours               =   Math.floor(daysRemainder / ( 1000 * 60 * 60 )),
      hoursRemainder      =   daysRemainder % ( 1000 * 60 * 60 ),
      minutes             =   Math.floor(hoursRemainder / ( 1000 * 60 )),
      minutesRemainder    =   hoursRemainder % ( 1000 * 60 ),
      seconds             =   Math.floor(minutesRemainder / 1000);

    return { interval, days, hours, minutes, seconds };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  inlineEmail () {
    const { discussion } = this.props;

    const subject = encodeURIComponent(discussion.subject);

    const description = encodeURIComponent(
      discussion.description
        .replace(/\{hostname\}/g, location.hostname)
    );

    return `mailto:?Subject=${subject}&Body=${description}`;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  register () {
    document.querySelector('.syn-top_bar-join_button button').click();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const now = moment();
    const { discussion, user } = this.props;

    let { deadline } = discussion;

    deadline = moment(new Date(deadline));

    const month     =   deadline.format('MMM');
    const day       =   deadline.format('D');
    const year      =   deadline.format('YYYY');
    const hour      =   deadline.format('h');
    const minute    =   deadline.format('mm');
    const meridian  =   deadline.format('a');

    let button = (
      <Button block primary medium onClick={ this.register.bind(this) }>Register</Button>
    );

    if ( user && discussion.registered.some(id => id === user.id ) ) {
      button = (
        <div>
          <h4 className="success">Thank you for registering!</h4>
          <h4>Invite the diverse people you know</h4>
          <a href={ this.inlineEmail() } target="_blank" className="button primary" style={{ width: '30%' }}>Email</a>
        </div>
      );
    }

    const openings = discussion.goal - discussion.registered.length;

    return (
      <Panel title="Countdown" className="text-center">
        <h2>Countdown to discussion</h2>

        <h1>
          { month }. {day}, {year}, {hour}:{minute} {meridian}
        </h1>

        <h2>
          <span ref="remainingDays"><span>0</span>d </span>
          <span ref="remainingHours"><span>00</span>:</span>
          <span ref="remainingMinutes"><span>00</span>:</span>
          <span ref="remainingSeconds"><span>00</span></span>
        </h2>

        <h3>Openings remaining</h3>

        <h2>{ openings }</h2>

        { button }
      </Panel>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Countdown;
