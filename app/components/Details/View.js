'use strict';

import {Element} from 'cinco';

class Details extends Element {

  constructor (props) {
    super('section');
    this.add(
      this.invitePeople(),
      this.progressBar()
    )
    for ( var i = 0; i < 4; i ++ ) {
      this.add(
        new Element('.row.details-votes').add(
          new Element('.tablet-30.middle').add(
            new Element('h4', {
              'data-toggle'     :   'tooltip',
              'data-placement'  :   'top'
            })
          )
        )
      );
    }
    this.add(this.feedback());
  }

  invitePeople () {
    return new Element('section.feedback-pending.hide').add(
      new Element('h4').text('Feedback pending'),
      
      new Element('p').text(
        'While you are waiting for your feedback this is a great time to invite the people you know to join the effort to bring synergy to democracy.'),
      
      new Element('a.btn.invite-people', { target: '_blank' })
        .text('Send'),
      
      new Element('hr')
    )
  }

  progressBar () {
    return new Element('.row').add(
      new Element('.tablet-30.middle').add(
        new Element('h4').text('Promoted')
      ),

      new Element('.tablet-70.middle').add(
        new Element('.progress')
      )
    );
  }

  feedback () {
    return new Element('.details-feedbacks').add(
      new Element('h4').text('Feedback'),
      new Element('.feedback-list')
    );
  }
}

export default Details;
