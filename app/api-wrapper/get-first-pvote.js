'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function getFirstPvote(item, criteria, cb){
    if(cb)
        return apiWrapper.Immediate.call(this,['get first pvote', item, criteria], cb)
    else {
        return new Promise((ok,ko)=>{
            apiWrapper.Immediate.call(this,['get first pvote', item, criteria], result=>ok(result))
        })
    }
}

export default getFirstPvote;
