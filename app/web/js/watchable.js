/**
	* @example 
	*	// Prototype
	* require('watchit').useProto();
	*	var foo = true;
	*	this.$watch('foo', console.log.bind(console));
	* setInterval(function () {
	*		console.log('foo', foo);
	*		foo = ! foo;
	* });
	*
	*	// Constructor
	* var $watch = require('watchit');
	*	var foo = true;
	* $watch('foo', console.log.bind(console));
	* setInterval(function () {
	*		console.log('foo', foo);
	*		foo = ! foo;
	* });
*/

;(function () {

	function Listen (obj, prop, value, watch) {
		var name = prop;
		var is;
		var old;

		Object.defineProperty(
			obj,
			prop,
			{
				set: function (value) {
					console.info(['set', name, 'to', value, is]);

					old = is;

					this.value = is = value;

					if ( watch ) {
						watch(name, is, old);
					}
				},

				get: function () {
					return this.value;
				}
		});

		obj[prop] = value;
	}

	Object.prototype.$watch = function(prop, watcher) {

		if ( ! this.__watchers ) {
			this.__watchers = {};
		}

		if ( ! this.__watchers[prop] ) {
			this.__watchers[prop] = [];
		}

		this.__watchers[prop].push(watcher);

		if ( typeof this[prop] === 'undefined' ) {
			new Listen(this, prop, null,
				function (name, value, diff) {
					if ( this.__watchers[name] ) {
						this.__watchers[name].forEach(function (watcher) {
							watcher(value, diff);
						});
					}
				}.bind(this));
		}

		else {
			var value = this[prop];

			new Listen(this, prop, value,
				function (name, value, diff) {
					if ( this.__watchers[name] ) {
						this.__watchers[name].forEach(function (watcher) {
							watcher(value, diff);
						});
					}
				}.bind(this));
		}
		
		return this
	};

})();
