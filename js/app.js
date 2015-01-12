// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('Sahiplendir', ['ionic', 'Sahiplendir.controllers', 'Sahiplendir.directives'])

app.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

app.config(function($stateProvider, $urlRouterProvider) {
	
	//$ionicConfigProvider.views.maxCache(0);
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
		cache: false,
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
        templateUrl: 'templates/home.html'
		
      })
	  
      .state('posts', {
        url: '/posts',
		controller: 'PostsCtrl',
        templateUrl: 'templates/posts.html'
	  })
	  .state('profile', {
        url: '/profile',
		controller: 'ProfileCtrl',
        templateUrl: 'templates/profile.html',
		data: {
			   authenticate: true
		}
      })
	  
	  .state('info', {
        url: '/info',
		controller: 'InfoCtrl',
        templateUrl: 'templates/info.html',
		
      })
	  
	  
	  .state('post', {
        url: '/post',
		abstract: true
		
      })
	  

	  .state('post.add', {
        url: '/add',
		abstract: true,
		views: {
			'@' : {
				templateUrl: 'templates/post-add.html',
				controller : 'PostAddCtrl'
			}
		}
		
		
	  })
	  
	  .state('post.add.photo', {
        url: '/photo',
		views: {
			'' : {
				controller: 'PostAddPhotoCtrl',
				templateUrl: 'templates/post-add-photo.html'
			}
		}
	  })
	 
	   .state('post.add.location', {
        url: '/location',
		views: {
			'' : {
				controller: 'PostAddLocationCtrl',
				templateUrl: 'templates/post-add-location.html'
			}
		}
	  })
	  
	  .state('post.add.message', {
        url: '/message',
		views: {
			'' : {
				controller: 'PostAddMessageCtrl',
				templateUrl: 'templates/post-add-message.html'
			}
		}
	  })
	
	  
	
	  
	  $urlRouterProvider.otherwise('/tab/signin')
	  
	  	
	 
	  
});

app.run(['$rootScope', '$state', '$ionicPlatform', function($rootScope, $state, $ionicPlatform) { 
	$rootScope.$state = $state;
	
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
		  // org.apache.cordova.statusbar required
		  StatusBar.styleDefault();
		}
  	});
	
	
	/*$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
          if (toState.data.authenticate && !Parse.User.current()) {
            // User isn’t authenticated
            $state.transitionTo("tabs.signin");
            event.preventDefault(); 
          }
    });*/
	
	
}]);






