// @create-index
// imagine one day a program that automatically generates this (in ES5 compatible format).
// until that day, this is manual
'use strict';

var  Components={
        'PanelList': require('./panel-list').default,
        'Subtype': require('./subtype').default,
        'QSortItems': require('./qsort-items').default,
        'QSortWhy': require('./qsort-why').default,
        'QSortRefine': require('./qsort-refine').default,
        'QSortReLook': require('./qsort-relook').default,
        'LoginPanel': require('./qsort-finale').default,
        'QSortFinale': require('./login-panel').default,
        'ProfilePanel': require('./profile-panel').default,     
    }

export default Components;