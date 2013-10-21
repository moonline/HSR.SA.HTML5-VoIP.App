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
Service.ArrayService.listContains = function(list, needle) {
	var contains = false;
	list.forEach(function(listElement) {
		if(listElement === needle) {
			contains = true;
		}
	});
	return contains;
}


/**
 * creates a string with the properties and their values
 *
 * @param list:  array or object
 * @returns {string}
 */
Service.ArrayService.listToString = function(list) {
	var representation = '';
	for(var index in list) {
		representation += index+': '+list[index]+', '
	};
	return representation;
}