// @create-index
// imagine one day a program that automatically generates this (in ES5 compatible format).
// until that day, this is manual
'use strict';

var  Components={
        'Details': require('./Details').default,
        'Harmony': require('./Harmony').default,
        'Promote': require('./Promote').default,
        'Subtype': require('./Subtype').default,
}

export default Components;