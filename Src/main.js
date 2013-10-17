/**
 * Created by tobias on 10/8/13.
 */
'use strict'; // use JS strict mode


var Controller = App.Controller;

window.onload = function() {
	var controller = new Controller.PhonebookController();
	controller.list();
}
