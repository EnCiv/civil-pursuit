/** ***********************************************************************************  MODULE  **/
var synapp = angular.module('synapp', []);
/** ********************************************************************************  FACTORIES  **/
synapp.factory({
  'SignFactory': 	require('./factory/Sign'),
  'TopicFactory': 	require('./factory/Topic')
});
/** *******************************************************************************  DIRECTIVES  **/
synapp.directive({
  'synappSign': 	require('./directive/sign'),
  'synappTopics': 	require('./directive/topics')
});
// ---------------------------------------------------------------------------------------------- \\