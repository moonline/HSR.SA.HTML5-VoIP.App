define([
		"QUnit",
		"Model/Domain/User",
		"Model/Domain/ContactbookManager",
		"Model/Domain/Addressbook/AddressbookVcard",
		"Model/Domain/Addressbook/AddressbookJson"
	],
	function(QUnit, User, ContactbookManager, AddressbookVcard, AddressbookJson) {
	'use strict';


	var vcard1 = "BEGIN:VCARD\n\
N:Swank;Hilary;;;\n\
IMPP;SIP:564895214@corephone.com\n\
PHOTO;BASE64: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\
END:VCARD";
	var vcard2 = "BEGIN:VCARD\n\
N:Bourne;Jason;;;\n\
IMPP;SIP:564895214@treadstone.gov\n\
PHOTO;BASE64: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\n\
END:VCARD";
	var jsonContacts = [
		{
			"sip": "8234985@freephone.net",
			"name": "James Bond",
			"photo": ""
		},
		{
			"sip": "69345592@usa.gov",
			"nick": "rice",
			"name": "Condolisa Rice"
		},
		{
			"sip": "739715625@ekiga.net",
			"name": "Diana Johnson",
			"photo": "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"
		}
	];


	QUnit.module("ContactbookManager Tests");
	QUnit.asyncTest("ContactbookManager Test", function () {
		window.localStorage.clear();

		var user = new User('testUser', '', 'Test', 'User', '', '');
		var manager = new ContactbookManager(user);

		var addressBookVCard = new AddressbookVcard();
		addressBookVCard.addEntry(vcard1);
		addressBookVCard.addEntry(vcard2);
		manager.add(addressBookVCard);

		var addressbookJson = new AddressbookJson();
		addressbookJson.load(jsonContacts);
		manager.add(addressbookJson);

		var newManager = new ContactbookManager(user);
		newManager.load(function() {
			var contactbooks = newManager.getContactbooks();

			QUnit.strictEqual(contactbooks[0] instanceof AddressbookVcard, true, "check correct class type after restore");
			QUnit.strictEqual(contactbooks[1] instanceof AddressbookJson, true, "check correct class type after restore");
			QUnit.strictEqual(newManager.getContactbooks()[0].getEntries().length, manager.getContactbooks()[0].getEntries().length, "check correct number of entries restored");
			QUnit.strictEqual(JSON.stringify(newManager.getContactbooks()), JSON.stringify(manager.getContactbooks()), "check correct data restore");
			QUnit.start();
		});
	});

});