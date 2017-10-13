'use strict';

import sequencer from 'promise-sequencer';
import publicConfig from '../../../../public.json';
import Mungo from 'mungo';

/**
 *  Return an object representing a batch of random item 
 * {items: []}
*/

function getRandomItems(panel, size, userId) {
    var query = Object.assign({}, panel);

    // convert objectId's to objects or they won't work in mongo
    if(typeof query.parent === 'string') query.parent=Mungo.Type.ObjectID.convert(query.parent);
    if(typeof query.type==='string') query.type=Mungo.Type.ObjectID.convert(query.type);
    if(typeof query.user==='string') query.user=Mungo.Type.ObjectID.convert(query.user);

    delete query.skip; // not part of the query
    delete query.limit; // not part of the query

    const seq = [];

    // get 'size' random items that match the query
    seq.push(() =>
        this.aggregate(
            [
                { $match: query },
                { $sample: { size: size } }
            ]
        )
    //        .skip(panel.skip || 0)
    //        .limit(panel.limit || publicConfig['navigator batch size'])
    );

    // convert the raw database output into Mongo objects of 'this' type
    // populate all the referenced and calculations
    seq.push(samples => Promise.all(samples.map(rawItem => (new this(rawItem, true)).toPanelItem(userId))));

    return new Promise((ok, ko) => {
        sequencer(seq)
            .then(results => ok({items: results[1]}))
            .catch(ko);
    });
}

export default getRandomItems;
