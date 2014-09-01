/** ***********************************************************************************  MODULE  **/
var synapp = angular.module('synapp', []);
/** ********************************************************************************  FACTORIES  **/
synapp.factory({
  'SignFactory': 	require('./factory/Sign'),
  'TopicFactory': 	require('./factory/Topic'),
  'EntryFactory': 	require('./factory/Entry')
});
/** *******************************************************************************  DIRECTIVES  **/
synapp.directive({
  'synappSign': 	require('./directive/sign'),
  'synappTopics': 	require('./directive/topics'),
  'synappCreate':	require('./directive/create')
});
// ---------------------------------------------------------------------------------------------- \\