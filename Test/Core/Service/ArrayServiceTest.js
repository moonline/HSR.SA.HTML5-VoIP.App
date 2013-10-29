/**
 * Created by tobias on 10/29/13.
 */
var Service = App.Core.Service;

module('Array Service Tests');
test("ArrayService trimElementsTest", function() {
	var listWithWS = [" hello Frank", "Go to work", "Sarah "];
	listWithWS.trimElements();

	deepEqual(listWithWS, ["hello Frank", "Go to work", "Sarah"], "check trimming of each element without removing ws inside");
	deepEqual(listWithWS.trimElements(), ["hello Frank", "Go to work", "Sarah"], "check trimming of each element with list return");
});


test("ArrayService containsTest", function() {
	var list = ["hello Frank", "Go to work", "Sarah"];

	deepEqual(list.contains('Sarah'), true, "check list containing element");
	deepEqual(list.contains("Sara"), false, "check list is not containing subelement");
	deepEqual(Service.ArrayService.listContains(list,"hello Frank"), true, "check ArrayService.listContains wrapper");
});


test("ArrayService listToStringTest", function() {
	var list = ["hello Frank", "Go to work", "Sarah"];
	var person = { "name": "Sarah", "lastName": "Meier", "getAge": function() { return 26; }};

	deepEqual(Service.ArrayService.listToString(list), "0: hello Frank, 1: Go to work, 2: Sarah, ", "check string representation of list");
	deepEqual(Service.ArrayService.listToString(person), "name: Sarah, lastName: Meier, ", "check string representation of object");
});