'use strict';

class Promote extends Controller {

  constructor (props, itemController) {

    super();

    this.props = props || {};

    if ( this.props.item ) {
      this.set('item', this.props.item);
    }

    this.template = itemController.find('promote');

    this.itemController = itemController;

    this.store = {
      item: null,
      limit : 5,
      cursor: 1,
      left: null,
      right: null,
      criterias: [],
      items: []
    };

    this.on('set', (key, value) => {
      switch ( key ) {
        case 'limit':
          this.renderLimit(value);
          break;

        case 'cursor':
          this.renderCursor(value);
          break;

        case 'left':
          this.renderLeft(value);
          break;

        case 'right':
          this.renderRight(value);
          break;
      }
    });

    this.domain.run(() => {
      if ( ! this.template.length ) {
        throw new Error('Promote template not found');
      }
    });
  }

  find (name, more) {
    switch ( name ) {

      case 'item subject':        return this.template.find('.subject.' + more +'-item h4');

      case 'item description':    return this.template.find('.description.' + more +'-item');;

      case 'cursor':                  return this.template.find('.cursor');

      case 'limit':                   return this.template.find('.limit');

      case 'side by side':            return this.template.find('.items-side-by-side');

      case 'finish button':           return this.template.find('.finish');

      case 'sliders':                 return this.find('side by side').find('.sliders.' + more + '-item');

      case 'item image':              return this.find('side by side').find('.image.' + more + '-item');

      case 'item persona':            return this.find('side by side').find('.persona.' + more + '-item');

      case 'item references':         return this.find('side by side').find('.references.' + more + '-item a');

      case 'item persona image':      return this.find('item persona', more).find('img');

      case 'item persona name':       return this.find('item persona', more).find('.user-full-name');

      case 'item feedback':           return this.find('side by side').find('.' + more + '-item.feedback .feedback-entry');

      case 'promote button':          return this.find('side by side').find('.' + more + '-item .promote');

      case 'promote label':           return this.find('side by side').find('.promote-label');

      case 'edit and go again button':  return this.find('side by side').find('.' + more + '-item .edit-and-go-again-toggle');
    }
  }

  renderLimit (limit) {
    this.find('limit').text(limit);
  }

  renderCursor (cursor) {
    this.find('cursor').text(cursor);
  }

  renderLeft (left) {
    this.renderItem('left');
  }

  renderRight (right) {
    this.renderItem('right');
  }

  renderItem (hand) {
    return renderItem.apply(this, [hand]);
  }

  render (cb) {
    return render.apply(this, [cb]);
  }

  save (hand) {
    let self = this;

    // feedback

    let feedback = this.find('item feedback', hand);

    if ( feedback.val() ) {

      if ( ! feedback.hasClass('do-not-save-again') ) {
        this
          .publish('insert feedback', {
            item: this.get(hand)._id,
            feedback: feedback.val()
          })
          
          .subscribe(pubsub => pubsub.unsubscribe());

        feedback.addClass('do-not-save-again');
      }

      // feedback.val('');
    }

    // votes

    let votes = [];

    this.template
      .find('.items-side-by-side:visible .' +  hand + '-item input[type="range"]:visible')
      .each(function () {
        var vote = {
          item: self.get(hand)._id,
          value: +$(this).val(),
          criteria: $(this).data('criteria')
        };

        votes.push(vote);
      });

    this
      .publish('insert votes', votes)
      .subscribe(pubsub => pubsub.unsubscribe());
  }

  getEvaluation (cb) {
    if ( ! this.get('evaluation') ) {

      let item = this.itemController.get('item');

      // Get evaluation via sockets

      this.publish('get evaluation', item._id)
        .subscribe((pubsub, evaluation) => {
          if ( evaluation.item.toString() === item._id.toString() ) {
            console.info('got evaluation', evaluation);
            
            pubsub.unsubscribe();

            let limit = 5;

            if ( evaluation.items.length < 6 ) {
              limit = evaluation.items.length - 1;

              if ( ! evaluation.limit && evaluation.items.length === 1 ) {
                limit = 1;
              }
            }

            this.set('criterias', evaluation.criterias);

            this.set('items', evaluation.items);

            this.set('limit', limit);

            this.set('cursor', 1);

            this.set('left', evaluation.items[0]);

            this.set('right', evaluation.items[1]);

            cb();
          }
        });
    }

    else {
      cb();
    }
  }

}

export default Promote;

import Nav          from 'syn/lib/util/Nav';
import Edit         from 'syn/components/EditAndGoAgain/Controller';
import Controller   from 'syn/lib/app/Controller';
import render       from 'syn/components/Promote/controllers/render';
import renderItem   from 'syn/components/Promote/controllers/render-item';
