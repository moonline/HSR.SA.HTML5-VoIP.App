define(["Configuration"], function(Configuration) {
	var ContactbookPrototypes = {};

	Object.keys(Configuration.contactbookImport).forEach(function(key){
		Configuration.contactbookImport[key].forEach(function(contactbookPrototype) {
			require([contactbookPrototype.type], function(ConcreteContactbook){
				ContactbookPrototypes[contactbookPrototype.type] = ConcreteContactbook;
			});
		});
	});

	return ContactbookPrototypes;
});