/**
 * `DataFactory` Data -> monson factory
 * 
 * @module synapp
 * @method factory::data
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

module.exports = function DataFactory (Model) {

  var batchSize = synapp["navigator batch size"];

  return {
    model: function (model) {
      return Model.request(model);
    },

    Item: {
      set: function (id, set) {
        return Model.request('Item')

          .addQuery({ _id: id })

          .put(JSON.stringify(set));
      },

      evaluate: function (id) {
        return Model.request('Item')

          .action('evaluate')

          .params([id])

          .get();
      },

      get: function (id) {
        return Model.request('Item')

          .action('details')

          .params([id])

          .get();
      }
    },

    Topic: {
      get: function () {
        return Model.request('Item')

          .addQuery({ type: 'Topic' })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Problem: {
      get: function (topic) {
        return Model.request('Item')

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
        return Model.request('Item')

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
        return Model.request('Item')

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
        return Model.request('Item')

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
        return Model.request('Item')

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
        return Model.request('Item')

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
        return Model.request('Feedback')

          .post({
            item: itemId,
            feedback: feedback
          });
      }
    }
  };
};
