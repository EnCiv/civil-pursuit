'use strict';

import Item from '../models/item';
import Mungo from 'mungo';

function createItem(item, cb) {
	try {
		// mungo complains about extra properties that may be in the object, so we just delete them
		const schemaKeys = Object.keys(Item.schema).concat(['_id']);
		Object.keys(item).forEach(inputKey => schemaKeys.includes(inputKey) || delete item[inputKey]);

		item.user = Mungo.mongodb.ObjectID(this.synuser.id);

		Item.create(item).then(
			item1 => {
				if (!item1) logger.error("createItem Item.create returned false for:", item);
				try {
					item1
						.toPanelItem()
						.then(
							item2 => {
								if (!item2) logger.error("CreateItem toPanelItem returned false for:", item1);
								if (typeof cb === 'function') cb(item2);
								this.emit('OK create item', item2);
							},
							(err) => {
								logger.error("createItem: .toPanelItem returned error:", err, item1);
								if (typeof cb === 'function') cb();
								this.error(err)
							}
						)
				}
				catch (err) {
					logger.error("createItem: .toPannel caught error:", err, item1);
					if (typeof cb === 'function') cb(); this.error(err)
				}
			},
			(err) => {
				logger.error("createItem: .create returned an error:", err, item);
				if (typeof cb === 'function') cb(); this.error(err)
			}
		);
	}
	catch (err) {
		logger.error("createItem: caught error:", err, item);
		if (typeof cb === 'function') cb(); this.error(err)
	}
}

export default createItem;
