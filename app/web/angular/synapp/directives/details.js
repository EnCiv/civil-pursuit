;(function () {

  module.exports = [Details];

  function Details () {
    return {
      restrict: 'C',
      link: function ($scope, $elem) {
        $scope.emailBody = "I'm helping to bring synergy to democracy by voicing my opinion. I'm participating in the topic: " + '"' + $scope.item.subject + '". Please join me at Synaccord ' + location.href;
      }
    };
  }

})();

[
{
    "description" : "Is the problem efficiently communicated?",
    "name" : "Concise",
    "type" : "Topic"
},{
    "description" : "Is there enough information here to agree or disagree?",
    "name" : "Complete",
    "type" : "Topic"
},{
    "description" : "Can the problem be measured?",
    "name" : "Measurable",
    "type" : "Topic"
},{
    "description" : "Is the problem statement free from implying what the answer should be and free from blame of specific individuals or groups.",
    "name" : "Unbiased",
    "type" : "Topic"
},

{
    "description" : "Is the problem efficiently communicated?",
    "name" : "Concise",
    "type" : "Problem"
},{
    "description" : "Is there enough information here to agree or disagree?",
    "name" : "Complete",
    "type" : "Problem"
},{
    "description" : "Can the problem be measured?",
    "name" : "Measurable",
    "type" : "Problem"
},{
    "description" : "Is the problem statement free from implying what the answer should be and free from blame of specific individuals or groups.",
    "name" : "Unbiased",
    "type" : "Problem"
},

{
    "description" : "Is the problem efficiently communicated?",
    "name" : "Concise",
    "type" : "Agree"
},{
    "description" : "Is there enough information here to agree or disagree?",
    "name" : "Complete",
    "type" : "Agree"
},{
    "description" : "Can the problem be measured?",
    "name" : "Measurable",
    "type" : "Agree"
},{
    "description" : "Is the problem statement free from implying what the answer should be and free from blame of specific individuals or groups.",
    "name" : "Unbiased",
    "type" : "Agree"
},

{
    "description" : "Is the problem efficiently communicated?",
    "name" : "Concise",
    "type" : "Disagree"
},{
    "description" : "Is there enough information here to agree or disagree?",
    "name" : "Complete",
    "type" : "Disagree"
},{
    "description" : "Can the problem be measured?",
    "name" : "Measurable",
    "type" : "Disagree"
},{
    "description" : "Is the problem statement free from implying what the answer should be and free from blame of specific individuals or groups.",
    "name" : "Unbiased",
    "type" : "Disagree"
},

{
    "description" : "Is the problem efficiently communicated?",
    "name" : "Concise",
    "type" : "Solution"
},{
    "description" : "Is there enough information here to agree or disagree?",
    "name" : "Complete",
    "type" : "Solution"
},{
    "description" : "Can the problem be measured?",
    "name" : "Measurable",
    "type" : "Solution"
},{
    "description" : "Is the problem statement free from implying what the answer should be and free from blame of specific individuals or groups.",
    "name" : "Unbiased",
    "type" : "Solution"
},

{
    "description" : "Is the problem efficiently communicated?",
    "name" : "Concise",
    "type" : "Con"
},{
    "description" : "Is there enough information here to agree or disagree?",
    "name" : "Complete",
    "type" : "Con"
},{
    "description" : "Can the problem be measured?",
    "name" : "Measurable",
    "type" : "Con"
},{
    "description" : "Is the problem statement free from implying what the answer should be and free from blame of specific individuals or groups.",
    "name" : "Unbiased",
    "type" : "Con"
}
]