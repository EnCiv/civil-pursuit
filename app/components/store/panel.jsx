'use strict';

import React from 'react';
import makePanelId from '../../lib/app/make-panel-id';
import publicConfig from '../../../public.json';

class PanelStore extends React.Component {

	id;

	state = { panel: null, count: null };

	constructor(props) {
		super(props);
		if (this.props.items) {
			this.state.panel = {};
			this.state.panel.type = this.props.type;
			this.state.panel.parent = this.props.parent || null;
			this.state.panel.items = this.props.items.slice(0);
			this.state.panel.limit = this.props.limit || publicConfig['navigator batch size'];
		}
	}


	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	componentDidMount() {
		this.okCreateItemBound = this.okCreateItem.bind(this);
		window.socket.on('OK create item', this.okCreateItemBound);

		if (!this.state.panel) {
			const panel = { type: this.props.type };

			if (this.props.parent) {
				panel.parent = this.props.parent; //._id;
			}

			if (this.props.limit) { panel.limit = this.props.limit }

			if (this.props.own) { panel.own = this.props.own }

			this.id = makePanelId(panel);

			window.socket.emit('get items', panel, this.okGetItems.bind(this));
		} else {
			this.id = makePanelId({ type: this.props.type, parent: this.props.parent || null });
		}
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	componentWillUnmount() {
		window.socket.off('OK create item', this.okCreateItemBound);
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	okGetItems(panel, count) {
		if (makePanelId(panel) === this.id) {
			this.setState({ panel, count });
		}
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	okCreateItem(item) {
		const parentId = this.props.parent ? this.props.parent._id || this.props.parent : undefined;
		const itemParentId = item.parent ? item.parent._id || item.parent : undefined;
		const itemTypeId= this.props.type._id || this.props.type; 

		let index;
		if (item._id && this.state.panel.items && ((index = this.state.panel.items.findIndex(itm => itm._id === item._id)) !== -1)) { // if the item being created is already in there, just update it
			var items = this.state.panel.items.slice();
			Object.assign(items[index], item);
			this.setState({ panel: { items: items, type: this.state.panel.type, parent: this.props.parent } })
		} else if (item.type._id === itemTypeId && itemParentId === parentId) {
			let oldItems = this.state.panel.items || [];
			var items = [item].concat(oldItems);
			this.setState({ panel: {...this.state.panel, items}});
		}
	}


	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	render() {
		//onsole.info("PanelStore.render, this.props, this.state")
		if (this.state.panel && this.state.panel.items)  // render children when there are items to render
			return (
				<section>
					{React.Children.map(this.props.children, child => React.cloneElement(child, Object.assign({}, this.state, { PanelCreateItem: this.okCreateItem.bind(this) }), child.props.children))}
				</section>
			);
		else
			return null;
	}
}

export default PanelStore;
