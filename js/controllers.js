angular.module('Sahiplendir.controllers', [])


.controller('MainPageCtrl', function($scope, $state) {
	
	$scope.op = 1;
	$scope.descClass = '';
	
	
	$scope.posts = [
		{image:'http://test.clckwrk.im/test/1.jpg', text:'Hello Moto 1'},
		{image:'http://test.clckwrk.im/test/2.jpg', text:'Hello Moto 2'},
		{image:'http://test.clckwrk.im/test/3.jpg', text:'Hello Moto 3'}
	];
	
	$scope.desc = $scope.posts[0].text;
	
	$scope.startApp = function() {
    	$state.go('list');
 	 };
	 
	 $scope.changeSlide = function(index) {
		 $scope.op = 0;
		$scope.descClass = 'slider-text-anim-start';
		 
		 
		 $scope.desc = $scope.posts[index].text;
		
		
	 }
	 
})

.controller('PostsCtrl', function($scope) {
	$scope.items = [];
  for (var i = 0; i < 20; i++) {
    $scope.items.push('Item ' + i);
  }
})

.controller('InfoCtrl', function($scope) {
	$scope.items = [];
  for (var i = 0; i < 20; i++) {
    $scope.items.push('Item ' + i);
  }
})

.controller('SideMenuCtrl', function($scope, $ionicSideMenuDelegate) {
	$scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
  $scope.user = {
   
	  name : Parse.User.current() ? Parse.User.current().get('name') : 'Sahiplendir',
	  id : Parse.User.current() ? Parse.User.current().get('fbId') : 'undefined',
	  email : Parse.User.current() ? Parse.User.current().get('email') : 'no mail'
  }
})



.controller("SideMenuListCtrl", function($scope) {
 
  $scope.data = {
    items : [
		{href: '#/home', icon: 'sahiplendir-icon-home assertive', label : 'Ana Sayfa'},
		{href: '#/posts', icon: 'sahiplendir-icon-cat energized', label : 'Hayvanları Gör'},
		{href: '#/info', icon: 'sahiplendir-icon-info royal', label : 'Yararlı Bilgiler'}
	]
  };
 
   
  
})


.controller("SignUp", function($scope) {
    
})

.controller("SignIn", function($scope) {
    
})

.controller("MainCtrl", function($scope) {
    
})

.controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {
		
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
	
	
}])


.controller("ProfileCtrl", function($scope, $state) {
    
})


