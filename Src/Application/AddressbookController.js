/**
 * Created by tobias on 10/8/13.
 */
var Controller = App.Controller;
var Domain = App.Model.Domain;
var Addressbook = Domain.Addressbook;

Controller.AddressbookController = function() {
	//var phonebookManager = new Domain.PhonebookManager();
	//phonebookManager.add(new Addressbook.PhonebookJson());

	this.list = function() {
		var addressbookManager = new Domain.AddressbookManager();
		addressbookManager.load();

		document.querySelector('#importFile').addEventListener('change', function(event) {
			var file = event.target.files[0];

			if (file) {
				var reader = new FileReader();
				reader.onload = function(e) {
					var contents = e.target.result;
					addressbookManager.add(new Domain.Addressbook(JSON.parse(contents)));
					renderEntryList(addressbookManager);
				}
				reader.readAsText(file);
				document.querySelector('#import').remove(0);
			} else {
				console.log("Failed to load file");
			}
		}, false);
		renderEntryList(addressbookManager);
	};

	var renderEntryList = function(addressbookManager) {
		var addressbookElement = document.querySelector('#addressbook div.content');
		console.log(addressbookManager);
		//addressbookManager.getAddressbooks().forEach(function(addressbook) {
		var addressbook = addressbookManager.getAddressbooks()[0];
		if(addressbook) {
			var addressbookElement = document.querySelector('#addressbook div.content');
			var panel = document.querySelector('#addressbook div.panel');

			var entryCounter = document.createElement('span');
			entryCounter.setAttribute('class','numberOfEntries');
			entryCounter.innerHTML = addressbook.count()+' Entries';

			panel.appendChild(entryCounter);

			addressbook.getEntries().forEach(function(bookEntry, i) {

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
	//	});
	}
};