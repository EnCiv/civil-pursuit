// @create-index
// imagine one day a program that automatically generates this (in ES5 compatible format).
// until that day, this is manual
'use strict';

var Components = {
        'CreateHarmony': require('./create-harmony'),
        'Details': require('./details'),
        'Edit': require('./edit'),
        'Harmony': require('./harmony'),
        'Post': require('./post'),
        'Promote': require('./promote'),
        'QSortButtons': require('./qsort-buttons'),
        'Refine': require('./refine'),
        'Subtype': require('./subtype'),
        "Totals": require('./totals'),
        "UseComponent": require('./use-component')
}

export default Components;