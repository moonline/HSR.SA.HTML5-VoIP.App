/**
 * Created by tobias on 10/8/13.
 */
'use strict'; // use JS strict mode


window.onload = function() {
	//var controller = new Controller.PhoneController();
	//controller.callAction();
	var addressbookController = new Controller.AddressbookController();
	addressbookController.list();
}