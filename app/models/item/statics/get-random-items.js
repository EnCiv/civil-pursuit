'use strict';

import sequencer from 'promise-sequencer';
import publicConfig from '../../../../public.json';

/**
 *  Return an object representing a batch of random item 
 * {items: []}
*/

function getRandomItems(panel, size, userId) {
    var query = Object.assign({}, panel);
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
            .skip(panel.skip || 0)
            .limit(panel.limit || publicConfig['navigator batch size'])
    );

    // convert the raw database output into Mongo objects of 'this' type
    seq.push(samples => {
        samples.map(rawItem => new this(rawItem, true))
    });

    // populate all the referenced and calculations
    seq.push(items => Promise.all(items.map(item => item.toPanelItem(userId))));

    return new Promise((ok, ko) => {
        sequencer(seq)
            .then(results => ok({items: results[2]}))
            .catch(ko);
    });
}

export default getRandomItems;
