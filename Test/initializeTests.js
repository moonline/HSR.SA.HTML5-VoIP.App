require.config({
	baseUrl: "../Src",
	paths: {
		"Configuration": "../Configuration/appConfiguration",
		"Test": "../Test",
		"QUnit": "../Test/Lib/QUnit/qunit-1.12.0",
		"jQuery": "Core/Lib/JQuery/jQuery.2.0.3"
	},
	shim: {
		QUnit: {
			exports: "QUnit"
		},
		jQuery: {
			exports: "jQuery"
		}
	}
});


define([
	"Core/Service/StringService",
	"Core/Service/ArrayService",
	"Test/Core/Framework/InterfaceTest",
	"Test/Core/Service/StringServiceTest",
	"Test/Core/Service/ArrayServiceTest",
	"Test/Core/Service/LogTest",

	"Test/Model/Domain/Channel/ChannelWebSocketTest",
	"Test/Model/Domain/Channel/ChannelXHRTest",
	"Test/Model/Domain/Addressbook/AddressbookVcardTest",
	"Test/Model/Domain/AddressbookManagerTest",
	"Test/Model/Domain/EventManagerTest",
	"Test/Model/Domain/AccountManagerTest"
]);