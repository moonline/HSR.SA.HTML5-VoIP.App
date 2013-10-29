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
					var addressbook = new Addressbook.AddressbookJson();
					addressbook.load(JSON.parse(e.target.result));

					addressbookManager.add(addressbook);

					renderEntryList(addressbookManager);
				};
				reader.readAsText(file);
				//document.querySelector('#import').remove(0);
			} else {
				console.log("Failed to load file");
			}
		}, false);
		renderEntryList(addressbookManager);
	};

	var renderEntryList = function(addressbookManager) {
		var panelTabNav = document.querySelector('#addressbook nav');
		var addressbookElement = document.querySelector('#addressbook .addressbookContent');
		addressbookElement.innerHTML = "";
		panelTabNav.innerHTML = "";

		addressbookManager.getAddressbooks().forEach(function(addressbook, i) {

			var addressbookSlide = document.createElement('div');
			addressbookSlide.className = "addressbookSlide";

			var addressbookTab = document.createElement('span');
			addressbookTab.innerHTML = "AB"+i+" ("+addressbook.count()+")";
			panelTabNav.appendChild(addressbookTab);

			addressbookTab.onclick = function(event) {
				var tabs = document.querySelectorAll('#addressbook nav span');
				Array.prototype.slice.call(tabs).forEach(function(tab, j) {
					tab.className = "";
				});
				event.target.className = "active";

				var slides = document.querySelectorAll('#addressbook .addressbookContent .addressbookSlide');
				Array.prototype.slice.call(slides).forEach(function(slide, k) {
					slide.className = "addressbookSlide";
					if(slide == addressbookSlide) {
						slide.className = slide.className+" active";
					}
				});
			};

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
				sip.setAttribute('class','sip callButton');
				sip.setAttribute('data-call',bookEntry.sip);
				sip.setAttribute('title', bookEntry.sip);
				var sipLink = document.createElement('a');
				sipLink.setAttribute('href','sip:'+bookEntry.sip);
				sipLink.innerHTML = '✆ '+'sip';
				sip.appendChild(sipLink);

				entry.appendChild(pic);
				entry.appendChild(name);
				entry.appendChild(sip);

				if(bookEntry.nick) {
					var nick = document.createElement('span');
					nick.setAttribute('class','nick callButton');
					nick.setAttribute('data-call', bookEntry.nick);
					nick.setAttribute('title', bookEntry.nick);
					nick.innerHTML = '✆ '+'direct';
					nick.onclick = function() {
						Domain.EventManager.notify('startCall', { "receiver": bookEntry.nick }, 'addressbookEntry');
					}
					entry.appendChild(nick);
				}

				addressbookSlide.appendChild(entry);
			});
			addressbookElement.appendChild(addressbookSlide);
		});

		var addressbooks = document.querySelectorAll('#addressbook .addressbookContent .addressbookSlide');
		var tabs = document.querySelectorAll('#addressbook nav span');
		if(addressbooks && addressbooks.length > 0) {
			addressbooks[0].className = addressbooks[0].className+" active";
			tabs[0].className = "active";
		}
	}
};