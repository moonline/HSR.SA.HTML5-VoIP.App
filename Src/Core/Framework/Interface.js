/**
 * Created by tobias on 10/16/13.
 */
var Framework = App.Core.Framework;

Framework.Interface = function(name, methods) {
	this.name = name;
	this.methods = methods;
};

Framework.Interface.prototype = {
	/**
	 * check if object implement the interface
	 *
	 * @param object: the object which implements the interface
	 */
	implementedBy: function(object) {
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
	}
};