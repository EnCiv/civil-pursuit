'use strict';

import selectors              from 'syn/../../selectors.json';
import config                 from 'syn/../../public.json';

function isEvaluationView (driver, item, options = {}) {
  const locals = {};

  return it => {
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

      it('Image', it => {
        it('should have an image', () =>
          driver.isVisible([
            `${selectors.evaluation.id.prefix}${item._id}`,
            locals.screen,
            selectors.evaluation.left,
            selectors.item.image
          ].join(' '))
        );

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

    });

  };
}

export default isEvaluationView;
