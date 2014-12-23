// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('Sahiplendir', ['ionic'])

 app.config(function($stateProvider, $urlRouterProvider) {
	
      $urlRouterProvider.otherwise('/tab/signin')

      $stateProvider
	  
	  
	  .state('tabs', {
        url: '/tab',
		abstract: true,
        templateUrl: "login.html",
		controller: 'LoginCtrl'
      })

	  .state('tabs.signup', {
        url: '/signup',
		views: {
			'signup-tab': {
			  templateUrl: "templates/signup.html",
			  controller: 'SignUp'
			}
      	},
		data: {
                authenticate: false
        }
      })
	  
	   .state('tabs.signin', {
        url: '/signin',
		views: {
			'signin-tab': {
			  templateUrl: "templates/signin.html",
			 controller: 'SignIn'
			}
      	},
		data: {
                authenticate: false
        }
      })
	  
	
	  
      .state('home', {
        url: '/home',
		controller: 'MainPageCtrl',
        templateUrl: 'home.html'
		
      })
	  
      .state('list', {
        url: '/list',
		controller: 'ListCtrl',
        templateUrl: 'list.html'
      })
	  .state('profile', {
        url: '/profile',
		controller: 'ProfileCtrl',
        templateUrl: 'templates/profile.html',
		data: {
			   authenticate: true
		}
      })
	 
	  
})

app.run(['$rootScope', '$state', '$ionicPlatform', function($rootScope, $state, $ionicPlatform) { 
	$rootScope.$state = $state; 
	/*$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
          if (toState.data.authenticate && !Parse.User.current()) {
            // User isn’t authenticated
            $state.transitionTo("tabs.signin");
            event.preventDefault(); 
          }
    });*/
	
	
}]);

<!-- LOCAL STORAGE -->

app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);


app.controller('MainPageCtrl', function($scope, $state) {
	$scope.images = [
		{url:'http://test.clckwrk.im/test/1.jpg', text:'Hello Moto 1'},
		{url:'http://test.clckwrk.im/test/2.jpg', text:'Hello Moto 2'},
		{url:'http://test.clckwrk.im/test/3.jpg', text:'Hello Moto 3'}
	];
	
	$scope.startApp = function() {
    	$state.go('list');
 	 };
});

app.controller('ListCtrl', function($scope) {
	$scope.items = [];
  for (var i = 0; i < 20; i++) {
    $scope.items.push('Item ' + i);
  }
});

app.controller('SideMenuCtrl', function($scope, $ionicSideMenuDelegate) {
	$scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
});



app.controller("SideMenuListCtrl", function($scope) {
  
  $scope.data = {
    items : []
  };
  
  for(var i = 0; i < 25; i++) {
    $scope.data.items.push({
      id : i,
      label : "Item " + i
    })
  }
  
})


app.controller("SignUp", function($scope) {
    
})

app.controller("SignIn", function($scope) {
    
})

app.controller("MainCtrl", function($scope) {
    
})

app.controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {
		
	var fbLogged = new Parse.Promise();

    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            return;
        }
        var expDate = new Date(
            new Date().getTime() + response.authResponse.expiresIn * 1000
        ).toISOString();

        var authData = {
            id: String(response.authResponse.userID),
            access_token: response.authResponse.accessToken,
            expiration_date: expDate
        }
        fbLogged.resolve(authData);
        fbLoginSuccess = null;
        console.log("fblogin response str:"+JSON.stringify(response));
    };

    var fbLoginError = function(error){
        fbLogged.reject(error);
    };

	$scope.login = function() {
        console.log('Login');
        if (!window.cordova) {
            facebookConnectPlugin.browserInit('1510553752541619');
        }
        facebookConnectPlugin.login(['email'], fbLoginSuccess, fbLoginError);

        fbLogged.then( function(authData) {
            console.log('Promised string:'+JSON.stringify(authData));
            return Parse.FacebookUtils.logIn(authData);
        })
        .then( function(userObject) {
			console.log("userobject: "+JSON.stringify(userObject));
			
            var authData = userObject.get('authData');
			console.log("authdata-promise:"+authData);
            facebookConnectPlugin.api('/me', null, 
                function(response) {
                    console.log("/me response:"+response);
					userObject.set('name', response.name);
                    userObject.set('email', response.email);
					userObject.set('fbId', response.id);
                    userObject.save();
					//$scope.name = response.name;
					 $state.go('profile');
                },
                function(error) {
                    console.log("/me error:"+error);
                }
            );
            /*facebookConnectPlugin.api('/me/picture', null,
                function(response) {
					console.log("/me pic response:"+response.url);
					
                    userObject.set('profilePicture', response.url);
                    userObject.save();
                }, 
                function(error) {
                    console.log("me pic error:"+error);
                }
            );*/
           
        }, function(error) {
            console.log("user object:"+error);
        });
    };
	
	
}]);


app.controller("ProfileCtrl", function($scope, $state) {
    
})


app.directive("ionMenuList", function() {
  return {
    restrict : "E",
    templateUrl : "ionMenuList.html"
  }
})

function errorHandler(error) {
  alert(error.message);
}






