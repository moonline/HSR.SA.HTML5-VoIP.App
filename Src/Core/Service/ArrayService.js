/**
 * Created by tobias on 10/12/13.
 */
var Service = App.Core.Service;
Service.ArrayService = {};


/**
 * checks if the list contains the needle
 *
 * @param list: the list to search the needle in
 * @param needle: the element to search in the list
 * @returns {boolean}
 */
Array.prototype.contains = function(needle) {
	var contains = false;
	this.forEach(function(listElement) {
		if(listElement === needle) {
			contains = true;
		}
	});
	return contains;
};

Service.ArrayService.listContains = function(list, needle) {
	return list.contains(needle);
};


/**
 * creates a string with the properties and their values
 *
 * @param list:  array or object
 * @returns {string}: a String like 'key1: value1, key2: value2, key3: value3,'
 */
Service.ArrayService.listToString = function(list) {
	var representation = '';
	for(var index in list) {
		// fetch only properties an no methods
		if(list.hasOwnProperty(index) && typeof(list[index]) !== 'function') {
			representation += index+': '+list[index]+', ';
		}
	};
	return representation;
};


/**
 * trim white spaces from array elements
 *
 * @returns {Array}
 */
Array.prototype.trimElements = function() {
	this.forEach(function(element, i) {
		this[i] = element.trim();
	}.bind(this));
	return this;
};