// @create-index
// imagine one day a program that automatically generates this (in ES5 compatible format).
// until that day, this is manual
//
// TypeComponent will accept a function (.default) or a module (exports), so you don't need to add .default to new entries.  
// Also, TypeComponent.attributes() will return module.attributes if it is defined.
'use strict';

var  Components={
        'PanelList': require('./panel-list').default,
        'Subtype': require('./subtype').default,
        'QSortItems': require('./qsort-items').default,
        'QSortWhy': require('./qsort-why').default,
        'QSortRefine': require('./qsort-refine').default,
        'QSortReLook': require('./qsort-relook').default,
        'QSortFinale': require('./qsort-finale').default,
        'LoginPanel': require('./login-panel').default,
        'ProfilePanel': require('./profile-panel').default,
        'CafeIdea': require('./cafe-idea').default,
        'NextStep': require('./next-step').default,
        'QSortRandomItems': require('./qsort-random-items').default,
        'QSortTotals': require('./qsort-totals').default,
        'RuleList': require('./rule-list').default,
        'PanelQuestions': require('./panel-questions').default,
        'ProfileCheck': require('./profile-check').default,
        'Totals': require('./totals').default,
        'TurkSubmit': require('./turk-submit').default,
        'AskItemWhy': require('./ask-item-why').default,
        'AskWebRTC': require('./ask-webrtc').default,
        'DiscussionGroupSync': require('./discussion-group-sync'),
        'QSortItemsSummary': require('./qsort-items-summary').default,
        'SupportAcceptOppose': require('./support-accept-oppose').default
    }

export default Components;