define([], function() {
	var loginCheckService = {
		requireLogin: function($location, accountService) {
			if (!accountService.currentUser) {
				sessionStorage.loginPath = $location.url;
				$location.url('/');
			} else {
				delete sessionStorage.loginPath;
			}
		}
	};
	
	return loginCheckService;
});
