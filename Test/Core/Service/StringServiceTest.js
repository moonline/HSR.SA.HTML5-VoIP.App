(function () {
	'use strict';


	module("StringService Tests");
	test("StringService Test", function () {
		var testString1 = "address: sip:464652@hali.com; type=private";
		var testString2 = "mail;type=work: sandro@test.com; sandro@business.com";

		deepEqual(testString1.splitOnce(':'), ["address", " sip:464652@hali.com; type=private"], "check correct splitting result parts");
		strictEqual(testString1.splitOnce(':').length, 2, "check correct number of splitting parts");


		var KeyAndValue = testString2.splitOnce(':');
		var keyAndAttribute = KeyAndValue[0].splitOnce(';');
		var attributeAndAttributeValue = keyAndAttribute[1].splitOnce('=');
		var values = KeyAndValue[1].split(';');

		deepEqual(KeyAndValue, ["mail;type=work", " sandro@test.com; sandro@business.com"], "check vcard splitting key/value");
		deepEqual(keyAndAttribute, ["mail", "type=work"], "check vcard splitting key/attribute");
		deepEqual(attributeAndAttributeValue, ["type", "work"], "check vcard splitting attributeKey/attributevalue");
		deepEqual(values, [" sandro@test.com", " sandro@business.com"], "check vcard splitting values");
	});

})();