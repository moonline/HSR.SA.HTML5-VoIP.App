/**
 * Created by tobias on 10/8/13.
 */
var Controller = App.Controller;
var Domain = App.Model.Domain;
var Addressbook = Domain.Phonebook;

Controller.AddressbookController = function() {
	//var phonebookManager = new Domain.PhonebookManager();
	//phonebookManager.add(new Addressbook.PhonebookJson());

	this.list = function() {
		document.querySelector('#importFile').addEventListener('change', function(event) {
			var file = event.target.files[0];

			if (file) {
				var reader = new FileReader();
				reader.onload = function(e) {
					var contents = e.target.result;
					renderEntryList(JSON.parse(contents));
				}
				reader.readAsText(file);
				document.querySelector('#import').remove(0);
			} else {
				console.log("Failed to load file");
			}
		}, false);
	}

	var renderEntryList = function(addressbookData) {
		var jsonAddressbook = new Addressbook.AddressbookJson(addressbookData);

		var addressbookElement = document.querySelector('#addressbook .content');
		var panel = document.querySelector('#addressbook .panel');

		var entryCounter = document.createElement('span');
		entryCounter.setAttribute('class','numberOfEntries');
		entryCounter.innerHTML = jsonAddressbook.count()+' Entries';

		panel.appendChild(entryCounter);

		jsonAddressbook.getEntries().forEach(function(bookEntry, i) {

			var entry = document.createElement('div');
			entry.setAttribute('class','entry');

			var pic = document.createElement('span');
			pic.setAttribute('class','pic');
			if(bookEntry.hasOwnProperty('photo') && bookEntry.photo !== "" && typeof(bookEntry.photo) !== 'undefined') {
				pic.setAttribute('style','background-image: url("data:image/png;base64,'+bookEntry.photo+'");');
			} else {
				pic.setAttribute('style','background-image: url("Resources/Img/person.png");');
			}

			var name = document.createElement('span');
			name.setAttribute('class','name');
			name.innerHTML = bookEntry.name;

			var sip = document.createElement('span');
			sip.setAttribute('class','sip');
			var sipLink = document.createElement('a');
			sipLink.setAttribute('href','sip:'+bookEntry.sip);
			sipLink.innerHTML = bookEntry.sip;
			sip.appendChild(sipLink);

			entry.appendChild(pic);
			entry.appendChild(name);
			entry.appendChild(sip);

			addressbookElement.appendChild(entry);
		});
	}
}