'use strict';


import PVote from '../models/pvote'
import ObjectID from 'bson-objectid';

export default function subscribePvoteInfo(itemId, cb) {
	const user = this.synuser && this.synuser.id;
	if (!user) return cb(false);
	PVote.subscribe(this, ObjectID(itemId), ObjectID(user), cb); // 'this' is a socket belonging to the API caller
}

// Client Side
import apiWrapper from '../lib/util/api-wrapper';

export function clientSubscribePvoteInfo(itemId, subscription, cb) {
	return apiWrapper.Push.call(this, ['subscribe pvote info', itemId], result => {
		if (result) {
			if (!this._subscriberList) {
				this._subscriberList = [];
				this._unsubscribe = () => {
					var func; while (func = this._subscriberList.shift()) func();
				}
			}
			this._subscriberList.push(() => window.socket.removeListener('PvoteInfo-' + itemId, subscription));
			window.socket.on('PvoteInfo-' + itemId, subscription);
		}
		cb(result)
	})
}


