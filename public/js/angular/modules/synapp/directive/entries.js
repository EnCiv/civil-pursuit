// .synapp-entries

module.exports = function (TopicFactory, SignFactory, EntryFactory, CriteriaFactory, VoteFactory) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      $scope.votes = {};

      function charts (entryId) {

        var votes = $scope.votes[entryId];

        var data;

        for ( var criteria in votes ) {
          data = [];

          for ( var value in votes[criteria].values ) {
            data.push({
              label: value,
              value: votes[criteria].values[value] * 100 / votes[criteria].total
            });
          }

          chart(data, entryId, criteria);
        }
      }

      function chart (data, entryId, criteriaId) {
        console.log('data chart', data);
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 300  - margin.left - margin.right,
          height = 70 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        var y = d3.scale.linear()
          .range([height, 0]);

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

        var chart = d3.select("#chart-" + entryId + '-' + criteriaId)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function (d) {
          return d.label;
        }));

        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        chart.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.label); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("width", x.rangeBand());

/*        var barWidth = width / data.length;

        var bar = chart.selectAll("g")
          .data(data)
          .enter().append("g")
          .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

        bar.append("rect")
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .attr("width", barWidth - 1);

        bar.append("text")
          .attr("x", barWidth / 2)
          .attr("y", function(d) { return y(d.value) + 3; })
          .attr("dy", ".75em")
          .text(function(d) { return d.value; });*/
      }

      function type(d) {
        d.frequency = +d.frequency;
        return d;
      }

      function findTopicBySlug (cb) {
        TopicFactory.findBySlug($attr.topic)

          .success(function (topic) {
            $scope.topic = topic;
            cb();
          });
      }

      function findTopicById (cb) {
        TopicFactory.findById($scope.entry.topic)

          .success(function (topic) {
            $scope.topic = topic;
            cb();
          });
      }

      function findUserByEmail (cb) {
        SignFactory.findByEmail($attr.user)

          .success(function (user) {
            $scope.user = user;
            cb();
          });
      }

      function findCriterias (cb) {
        CriteriaFactory.find()

          .success(function (criterias) {
            $scope.criterias = criterias;
            cb();
          });
      }

      function findEntryVotes (entry, cb) {
        VoteFactory.getAccumulation(entry)

          .success(function (votes) {
            $scope.votes[entry] = votes;
            cb();
          });
      }

      function findEntries (cb) {
        EntryFactory.find({
          topic:  $scope.topic._id,
          user:   $scope.user ? $scope.user._id : null
        })

          .success(function (entries) {

            entries = entries.map(function (entry) {
              entry.promoted = Math.ceil(entry.promotions * 100 / entry.views);
              return entry;
            });

            entries.sort(function (a,b) {
              if ( a.promoted > b.promoted ) {
                return -1;
              }
              if ( a.promoted < b.promoted ) {
                return 1;
              }
              return 0;
            });

            $scope.entries = entries;
            cb();
          });
      }

      function findEntry (cb) {
        EntryFactory.findById($attr.entry)

          .success(function (entry) {
            $scope.entry = entry;
            cb();
          });
      }

      // FLOW

      flow();

      function flow () {

        if ( $attr.entry ) {
          findEntry(function () {
            console.log('entry', $scope.entry);
            findTopicById(function () {
              console.log('topic', $scope.topic);
            });
          });
        }

        else {
          findTopicBySlug(function () {

            if ( $attr.user ) {
              
              findUserByEmail(function () {
                
                findCriterias(function () {

                  findEntries(function () {
                    
                    $scope.entries.forEach(function (entry) {
                      findEntryVotes(entry._id, function () {
                        charts(entry._id);
                      });
                    });

                  });
                });
              });
            }

            else {
              
              findCriterias(function () {

                findEntries(function () {
                  
                  $scope.entries.forEach(function (entry) {
                    findEntryVotes(entry._id, function () {
                      charts(entry._id);
                    });
                  });

                });
              });
            }

          });
        }
      }
    }
  };
};