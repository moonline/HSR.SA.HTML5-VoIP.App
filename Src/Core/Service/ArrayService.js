/**
 * Created by tobias on 10/12/13.
 */
var Service = App.Model.Service;

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
