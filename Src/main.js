/**
 * Created by tobias on 10/8/13.
 */
'use strict'; // use JS strict mode


window.onload = function() {
	App.Configuration.nick = prompt('Please insert your nick name');
	document.getElementById('user').innerHTML = App.Configuration.nick;

	var addressbookController = new Controller.AddressbookController();
	addressbookController.list();

	var phoneController = new Controller.PhoneController();
};