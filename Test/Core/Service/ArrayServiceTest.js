define(["QUnit", "Core/Service/ArrayService"], function(QUnit, ArrayService) {
	'use strict';


	QUnit.module('Array Service Tests');
	QUnit.test("ArrayService trimElementsTest", function () {
		var listWithWS = [" hello Frank", "Go to work", "Sarah "];
		listWithWS.trimElements();

		QUnit.deepEqual(listWithWS, ["hello Frank", "Go to work", "Sarah"], "check trimming of each element without removing ws inside");
		QUnit.deepEqual(listWithWS.trimElements(), ["hello Frank", "Go to work", "Sarah"], "check trimming of each element with list return");
	});


	QUnit.test("ArrayService containsTest", function () {
		var list = ["hello Frank", "Go to work", "Sarah"];

		QUnit.deepEqual(list.contains('Sarah'), true, "check list containing element");
		QUnit.deepEqual(list.contains("Sara"), false, "check list is not containing subelement");
		QUnit.deepEqual(ArrayService.listContains(list, "hello Frank"), true, "check ArrayService.listContains wrapper");
	});


	QUnit.test("ArrayService listToStringTest", function () {
		var list = ["hello Frank", "Go to work", "Sarah"];
		var person = { "name": "Sarah", "lastName": "Meier", "getAge": function () {
			return 26;
		}};

		QUnit.deepEqual(ArrayService.listToString(list), "0: hello Frank, 1: Go to work, 2: Sarah, ", "check string representation of list");
		QUnit.deepEqual(ArrayService.listToString(person), "name: Sarah, lastName: Meier, ", "check string representation of object");
	});

});