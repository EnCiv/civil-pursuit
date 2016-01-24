'use strict';

import selectors              from 'syn/../../selectors.json';
import config                 from 'syn/../../public.json';
import Criteria               from 'syn/../../dist/models/criteria';
import Item                   from 'syn/../../dist/models/item';
import YouTube                from 'syn/../../dist/components/youtube';

function isEvaluationView (driver, item, options = {}) {
  const locals = {};

  return it => {
    it('should evaluate item for reference', () =>
      Item.evaluate(item.user, item)
        .then(evaluation => { locals.evaluation = evaluation })
    );

    it('should see item', () =>
      driver.isVisible(
        `${selectors.item.id.prefix}${item._id}`, 2500
      )
    );

    it('should see item evaluation', () =>
      driver.isVisible(
        `${selectors.evaluation.id.prefix}${item._id}`
      )
    );

    it('Cursor', it => {
      it('should see cursor', () =>
        driver.isVisible([
          `${selectors.evaluation.id.prefix}${item._id}`,
          selectors.evaluation.cursor
        ].join(' '))
      );

      it('should be a number', () =>
        driver.hasText([
          `${selectors.evaluation.id.prefix}${item._id}`,
          selectors.evaluation.cursor
        ].join(' '), /^\d+$/)
      );

      if ( 'cursor' in options ) {
        it(`should be ${options.cursor}`, () =>
          driver.hasText([
            `${selectors.evaluation.id.prefix}${item._id}`,
            selectors.evaluation.cursor
          ].join(' '), options.cursor.toString())
        );
      }
    });

    it('Limit', it => {
      it('should see limit', () =>
        driver.isVisible([
          `${selectors.evaluation.id.prefix}${item._id}`,
          selectors.evaluation.limit
        ].join(' '))
      );

      it('should be a number', () =>
        driver.hasText([
          `${selectors.evaluation.id.prefix}${item._id}`,
          selectors.evaluation.limit
        ].join(' '), /^\d+$/)
      );

      if ( 'limit' in options ) {
        it(`should be ${options.limit}`, () =>
          driver.hasText([
            `${selectors.evaluation.id.prefix}${item._id}`,
            selectors.evaluation.limit
          ].join(' '), options.limit.toString())
        );
      }
    });

    it('Screen size', it => {
      it('should get view port size', () =>
        driver.client.getViewportSize()
          .then(viewport => { locals.viewport = viewport })
      );

      it('should set view size', () => {
        if ( locals.viewport.width >= 440 ) {
          locals.screen = '[data-screen="phone-and-up"]';
        }
        else {
          locals.screen = '[data-screen="up-to-phone"]';
        }
      });
    });

    it('Left panel', it => {
      it('should see left panel', () =>
        driver.isVisible([
          `${selectors.evaluation.id.prefix}${item._id}`,
          locals.screen,
          selectors.evaluation.left
        ].join(' '))
      );

      it('Media', it => {
        if ( YouTube.isYouTube(item) ) {
          it('should have a youtube video', () =>
            driver.isVisible([
              `${selectors.evaluation.id.prefix}${item._id}`,
              locals.screen,
              selectors.evaluation.left,
              selectors.item.video
            ].join(' '))
          );

          it('should be the right link', () =>
            driver.attributeMatches([
              `${selectors.evaluation.id.prefix}${item._id}`,
              locals.screen,
              selectors.evaluation.left,
              selectors.item.video
            ].join(' '), 'src',
              `http://www.youtube.com/embed/${YouTube.getId(item.references[0].url)}?autoplay=0`
            )
          );
        }

        else {
          it('should have an image', () =>
            driver.isVisible([
              `${selectors.evaluation.id.prefix}${item._id}`,
              locals.screen,
              selectors.evaluation.left,
              selectors.item.image
            ].join(' '))
          );
        }

        if ( ( 'left' in options ) ) {
          if ( 'image' in options.left ) {
            it('should have item image', () =>
              driver.attributeMatches([
                `${selectors.evaluation.id.prefix}${item._id}`,
                locals.screen,
                selectors.evaluation.left,
                selectors.item.image
              ].join(' '), 'src', options.left.image)
            );
          }
          else {
            it('should have default image', () =>
              driver.attributeMatches([
                `${selectors.evaluation.id.prefix}${item._id}`,
                locals.screen,
                selectors.evaluation.left,
                selectors.item.image
              ].join(' '), 'src', config["default item image"])
            );
          }
        }
      });

      it('Subject', it => {
        it('should have a subject', () =>
          driver.isVisible([
            `${selectors.evaluation.id.prefix}${item._id}`,
            locals.screen,
            selectors.evaluation.left,
            selectors.item.subject
          ].join(' '))
        );

        if ( ( 'left' in options ) ) {
          it('should have item subject', () =>
            driver.hasText([
              `${selectors.evaluation.id.prefix}${item._id}`,
              locals.screen,
              selectors.evaluation.left,
              selectors.item.subject
            ].join(' '), options.left.subject)
          );
        }
      });

      it('Description', it => {
        it('should have a description', () =>
          driver.isVisible([
            `${selectors.evaluation.id.prefix}${item._id}`,
            locals.screen,
            selectors.evaluation.left,
            selectors.item.description
          ].join(' '))
        );

        if ( ( 'left' in options ) ) {
          it('should have item description', () =>
            driver.hasText([
              `${selectors.evaluation.id.prefix}${item._id}`,
              locals.screen,
              selectors.evaluation.left,
              selectors.item.description
            ].join(' '), options.left.description)
          );
        }
      });

      it('Feedback', it => {
        it('should have a feedback', () =>
          driver.isVisible([
            `${selectors.evaluation.id.prefix}${item._id}`,
            locals.screen,
            selectors.evaluation.left,
            selectors.feedback.input
          ].join(' '))
        );

        it('should have the right placeholder', () =>
          driver.attributeMatches([
            `${selectors.evaluation.id.prefix}${item._id}`,
            locals.screen,
            selectors.evaluation.left,
            selectors.feedback.input
          ].join(' '), 'placeholder', 'Can you provide feedback that would encourage the author to create a statement that more people would unite around?')
        );
      });

      it('Sliders', it => {
        it('should have sliders', () =>
          driver.isVisible([
            `${selectors.evaluation.id.prefix}${item._id}`,
            locals.screen,
            selectors.evaluation.left,
            selectors.sliders.selector
          ].join(' '))
        );

        it('should get criterias', () =>
          Criteria.find().then(criterias => { locals.criterias = criterias })
        );

        it('each criterias are in view', () =>
          Promise.all(locals.criterias.map(criteria => driver.isVisible([
            `${selectors.evaluation.id.prefix}${item._id}`,
            locals.screen,
            selectors.evaluation.left,
            `${selectors.sliders.criteria.prefix}${criteria._id}`
          ].join(' '))))
        );

        it('each criterias have a slider', () =>
          Promise.all(locals.criterias.map(criteria => driver.isVisible([
            `${selectors.evaluation.id.prefix}${item._id}`,
            locals.screen,
            selectors.evaluation.left,
            `${selectors.sliders.criteria.prefix}${criteria._id}`,
            selectors.sliders.criteria.slider
          ].join(' '))))
        );
      });

      it('Promote', it => {
        if ( locals.evaluation.items.length > 1 ) {
          it('should have a promote button', it => {
            driver.isVisible([
              `${selectors.evaluation.id.prefix}${item._id}`,
              locals.screen,
              selectors.evaluation.left,
              selectors.evaluation.promote
            ])
          });
        }
      });

      it('Button', it => {
        it('should have a button', () =>
          driver.isVisible([
            `${selectors.evaluation.id.prefix}${item._id}`,
            selectors.evaluation.button
          ].join(' '))
        );

        if ( ( 'button' in options ) ) {
          it('should have the right text', () =>
            driver.hasText([
              `${selectors.evaluation.id.prefix}${item._id}`,
              selectors.evaluation.button
            ].join(' '), options.button)
          );
        }
      });
    });
  };
}

export default isEvaluationView;
