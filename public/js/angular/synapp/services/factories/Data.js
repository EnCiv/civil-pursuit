/**
 * `DataFactory` Data -> monson factory
 * 
 * @module synapp
 * @method factory::data
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

module.exports = function DataFactory (MonsonFactory) {

  var batchSize = synapp["navigator batch size"];

  return {
    model: function (model) {
      return MonsonFactory.request(model);
    },

    Item: {
      set: function (id, set) {
        return MonsonFactory.request('Item')

          .addQuery({ _id: id })

          .put(JSON.stringify(set));
      },

      evaluate: function (id) {
        return MonsonFactory.request('Item')

          .action('evaluate')

          .params([id])

          .get();
      },

      get: function (id) {
        return MonsonFactory.request('Item')

          .action('details')

          .params([id])

          .get();
      }
    },

    Topic: {
      get: function () {
        return MonsonFactory.request('Item')

          .addQuery({ type: 'Topic' })

          .sort('promotions', true)
          .sort('created', true)

          .limit(batchSize)

          .get();
      }
    },

    Problem: {
      get: function (topic) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Problem',
            parent: topic
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Agree: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Agree',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Disagree: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Disagree',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Solution: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Solution',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Pro: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Pro',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Con: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Con',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Feedback: {
      create: function (itemId, feedback) {
        return MonsonFactory.request('Feedback')

          .post({
            item: itemId,
            feedback: feedback
          });
      }
    }
  };
};
