/**
 * Created by tobias on 10/29/13.
 */
var Domain = App.Model.Domain;

module("EventManager Tests");
test("EventManager Test", function() {
	expect(1);

	Domain.EventManager.addListener({
		notify: function(event, sender) {
			ok(event, "check notification");
		}
	},'call');
	Domain.EventManager.notify('call',{ message: 'nothing'},this);
	Domain.EventManager.notify('setting',{ message: 'nothing'},this);
});
