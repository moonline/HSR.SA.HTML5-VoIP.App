define(["Model/Domain/Account", "Model/Domain/User"], function (Account, User) {
	'use strict';

    var AccountController = function($scope, $location, accountService) {
            $scope.accountManager = accountService.accountManager;
            $scope.accountManager.load();
            
            $scope.addUser = function() {
                var user = new User(
                    prompt('Please insert your username'),
                    prompt('Please insert a password (empty for none)'),
                    prompt('Please insert your firstname'),
                    prompt('Please insert your lastname'),
                    null,
                    null
                );
                while(accountService.accountManager.findByUsername(user.username) !== null) {
                    user.username = prompt('username is already used. Please take an other');
                }
                if(user.username) {
                    accountService.accountManager.add(user);
                }
            };
            
            $scope.deleteUser = function(user) {
                if (confirm("rly?")) {
                    accountService.accountManager.remove(user);
                }
            };
    
            $scope.addDummyUsers = function() {
                var bruce = new User('bruce', 'password', 'Bruce', 'Willis', null, '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');
                bruce.setAccount(new Account('ChannelXHR',{ "nick": 'bruce' }));
                accountService.accountManager.add(bruce);

                var james = new User('bond', '', 'James', 'Bond', null, null);
                james.setAccount(new Account('ChannelXHR',{ "nick": 'bond' }));
                accountService.accountManager.add(james);

                var michelle = new User('michelle', 'password', 'Michelle', 'Monoghan', null, null);
                michelle.setAccount(new Account('ChannelXHR',{ "nick": 'michelle' }));
                accountService.accountManager.add(michelle);

                var hilary = new User('hilary', '', 'Hilary', 'Swank', null, null);
                hilary.setAccount(new Account('ChannelXHR',{ "nick": 'hilary' }));
                accountService.accountManager.add(hilary);
            };
            
            $scope.resetToDummies = function() {
                accountService.accountManager.users = {};
                $scope.addDummyUsers();
            };
    
            $scope.login = function(user) {
                if (user.password) {
                    var passwordtext = 'Password for ' + user.username + '? (Warning: not concealed)';
                    do {
                        var password = prompt(passwordtext);
                        if (!password) {
                                return;
                        }
                        passwordtext = 'Wrong password. ' + passwordtext;
                    } while (password !== user.password);
                }
                
                accountService.currentUser = user;
                $location.url('/contacts');
            };
    };

    return AccountController;
});
