function Watchable () {
	this.watchers = {};
	this.scope = {};
}

Watchable.prototype.watch = function (prop, cb) {
	this.watchers[prop] = this.watchers[prop] || [];
	this.watchers[prop].push(cb);

	return this;
};

Watchable.prototype.set = function (prop, value) {
	if ( this.scope[prop] ) {
		this.scope[prop] = value;
	}

	else {
		new Watchable.Inject(this.scope, prop, value,
			function (name, value, diff) {
				if ( this.watchers[name] ) {
					this.watchers[name].forEach(function (watcher) {
						watcher(value, diff);
					});
				}
			}.bind(this));

	}

	return this;
};

Watchable.Inject = function (obj, prop, value, watch) {
	var name = prop;
	var is;
	var old;

	Object.defineProperty(
		obj,
		prop,
		{

			set: function (value) {
				// console.info(['set', name, 'to', value, is]);

				old = is;

				this.value = is = value;

				if ( watch ) {
					watch(name, is, old);
				}

			},
			
			get: function () {
				// console.info('get', name, 'which is', is);
				return is;
			}

	});

	obj[prop] = value;
}
