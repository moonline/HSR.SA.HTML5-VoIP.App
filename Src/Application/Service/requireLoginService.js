define([], function() {
	var requireLoginService = ['$location', 'accountService', function($location, accountService) {
		/**
		 * Redirects user if not logged in
		 * 
		 * @returns boolean logged in
		 */
		return function() {
			var fail = {
				abort: true
			};
			var dontFail = {
				abort: false
			};
			
			if (!accountService.currentUser) {
				sessionStorage.loginPath = $location.url();
				$location.url('/');
				return fail;
			}
			
			delete sessionStorage.loginPath;
			return dontFail;
		};
	}];
	
	return requireLoginService;
});
