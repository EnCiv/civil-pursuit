/** ***********************************************************************************  MODULE  **/
var deps = [];

if ( typeof createPage === 'boolean' ) {
	deps.push('angularFileUpload');
}

var synapp = angular.module('synapp', deps);
/** ********************************************************************************  FACTORIES  **/
synapp.factory({
  'SignFactory': 	require('./factory/Sign'),
  'TopicFactory': 	require('./factory/Topic'),
  'EntryFactory': 	require('./factory/Entry')
});
/** ******************************************************************************  CONTROLLERS  **/
synapp.controller({
  'UploadCtrl': 	require('./controller/upload')
});
/** *******************************************************************************  DIRECTIVES  **/
synapp.directive({
  'synappSign': 	require('./directive/sign'),
  'synappTopics': 	require('./directive/topics'),
  'synappCreate':	require('./directive/create')
});
// ---------------------------------------------------------------------------------------------- \\