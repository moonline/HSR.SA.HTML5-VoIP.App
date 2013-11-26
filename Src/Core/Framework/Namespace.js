(function () {
	'use strict';

	/**
	 *
	 * @param namespace e.q. 'App.Domain.Model'
	 * @returns a namespace path
	 */
	var getNamespace = function(namespace) {
		var actualPart = window;
		namespace.split('.').forEach(function(part, index){
			actualPart[part] = actualPart[part] || {};
			actualPart = actualPart[part];
		});
		return actualPart;
	};

	var namespace = getNamespace('App.Core.Framework');
	namespace.namespace = getNamespace;


})();