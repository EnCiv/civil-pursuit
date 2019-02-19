'use strict';

import Item from '../models/item';

export default function getQueryItems(query, own, cb) {
	try {
		if (!cb) return;
		const userId = this.synuser ? this.synuser.id : null;
		if (own) {
			if (userId) {
				query.user = userId;
			} else {
				cb([], 0); // request to get the users's own items but no user logged in so return nothing
			}
		}
		if (!query.deleted) query.deleted = { $exists: false }; // don't find deleted items - unless explicit
		Item
			.getPanelItems(query, userId)
			.then(
				results => {
					cb(results.items, results.count)
				},
				err => {
					cb([], 0);
					this.error(err);
				}
			);
	}

	catch (error) {
		this.error(error);
	}
}

import apiWrapper from "../lib/util/api-wrapper"
export function clientGetQueryItems(query, own, cb) {
	const message=['get query items', query, own];
	if (cb)
		return apiWrapper.Immediate.call(this, message, cb)
	else {
		return new Promise((ok, ko) => {
			apiWrapper.Immediate.call(this, message, result => ok(result))
		})
	}
}


