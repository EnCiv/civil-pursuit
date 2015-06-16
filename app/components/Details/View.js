'use strict';

import { Element, Elements } from 'cinco/es5';

class Details extends Element {

  constructor (props) {
    super('section');
    
    this
      .add(
        this.invitePeople(),
        this.progressBar()
      )
    
      .add(this.votes())
    
      .add(this.feedback());
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

  votes () {
    let votes = new Elements();

    for ( let i = 0; i < 4; i ++ ) {
      votes.add(
        new Element('.row.details-votes').add(
          new Element('.tablet-30.middle').add(
            new Element('h4', {
              'data-toggle'     :   'tooltip',
              'data-placement'  :   'top'
            }).text('Criteria')
          ),
          new Element('.tablet-70.middle').add(
            new Element('svg.chart')
          )
        )
      );
    }

    return votes;
  }
}

export default Details;
