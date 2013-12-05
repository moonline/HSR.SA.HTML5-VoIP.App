define(function() {
	'use strict';

	var Interface = function(name, methods) {
		this.name = name;
		this.methods = methods;
	};

	/**
	 * check if object implement the interface
	 *
	 * @param object the object which implements the interface
	 */
	Interface.prototype.assertImplementedBy= function(object) {
		var implementsInterface = true;
		if(typeof(object.implementInterface) === 'undefined' || object.implementInterface !== this.name) {
			implementsInterface = false;
			throw new Error("Object does not declare interface implementation");
		}
		this.methods.forEach(function(method){
			if(typeof(object[method]) === 'undefined') {
				implementsInterface = false;
				throw new Error("Object does not implement interface method "+method);
			}
		});
		return implementsInterface;

	};

	return Interface;
});