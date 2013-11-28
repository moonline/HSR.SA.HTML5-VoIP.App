require.config({
	baseUrl: "../Src",
	paths: {
		"Test": "../Test"
	},
	shim: {
		Handlebars: {
			exports: "Handlebars"
		},
		jQuery: {
			exports: "jQuery"
		}
	}
});

define(["Core/Framework/InterfaceTest.js"],
 	function(InterfaceTest) {
		'use strict';
	}
);