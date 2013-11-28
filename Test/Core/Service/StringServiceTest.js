define(["QUnit", "Core/Framework/Interface"], function(QUnit, Interface) {
	'use strict';

	QUnit.module("StringService Tests");
	QUnit.test("StringService Test", function () {
		var testString1 = "address: sip:464652@hali.com; type=private";
		var testString2 = "mail;type=work: sandro@test.com; sandro@business.com";

		QUnit.deepEqual(testString1.splitOnce(':'), ["address", " sip:464652@hali.com; type=private"], "check correct splitting result parts");
		QUnit.strictEqual(testString1.splitOnce(':').length, 2, "check correct number of splitting parts");


		var KeyAndValue = testString2.splitOnce(':');
		var keyAndAttribute = KeyAndValue[0].splitOnce(';');
		var attributeAndAttributeValue = keyAndAttribute[1].splitOnce('=');
		var values = KeyAndValue[1].split(';');

		QUnit.deepEqual(KeyAndValue, ["mail;type=work", " sandro@test.com; sandro@business.com"], "check vcard splitting key/value");
		QUnit.deepEqual(keyAndAttribute, ["mail", "type=work"], "check vcard splitting key/attribute");
		QUnit.deepEqual(attributeAndAttributeValue, ["type", "work"], "check vcard splitting attributeKey/attributevalue");
		QUnit.deepEqual(values, [" sandro@test.com", " sandro@business.com"], "check vcard splitting values");
	});

});