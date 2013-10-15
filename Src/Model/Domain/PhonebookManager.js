/**
 * Created by tobias on 10/8/13.
 */
var Domain = App.Model.Domain;

Domain.PhonebookManager = function() {
	var phonebooks = new Array();

	this.add = function(phonebook) {
		if(typeof phonebook.getEntries() === 'function' && typeof phonebook.count() === 'function') {
			phonebooks.push(phonebook);
		}
	}
	this.getPhonebooks = function() {
		return phonebooks;
	}
}