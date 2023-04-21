'use strict';

import React from 'react';
import Input from '../util/input';

class City extends React.Component {
	name = 'city';

	saveInfo(v) {
		if (this.props.onChange) this.props.onChange({ [this.name]: v.value });
	}

	render() {

		const { children, info, property, collection, ...newProps } = this.props;

		return (
			<div>
				<Input {...newProps} onChange={this.saveInfo.bind(this)} defaultValue={info[this.name]} style={{ display: 'inline', width: '10em' }} />
			</div>
		);
	}
}

export default City;
