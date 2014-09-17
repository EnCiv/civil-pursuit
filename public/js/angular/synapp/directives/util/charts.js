module.exports = function () {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      console.log('7777');

      charts($attr.entry);

      function charts (entryId) {

        return console.log($scope.getEntry());

        console.log($scope, entryId);

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
      }
    }
  };
};