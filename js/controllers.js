angular.module('Sahiplendir.controllers', ['Sahiplendir.services'])


.controller('MainPageCtrl', function($scope, $state, $timeout, $ionicSlideBoxDelegate) {
	
	$scope.isHiddenText = true;
	$scope.currentSlide = 0;
	
	$scope.posts = [
		{image:'http://test.clckwrk.im/test/1.jpg', text:'Tekir kedi, 4 aylık, sevecen, ajgsdauygdhafshdfashdfashfdahsfdhgasfdhgafhdssfahdfashdfashdfahsgdfhasdfhasgfdhasfdhasgfdhagsfdhsafdh'},
		{image:'http://test.clckwrk.im/test/2.jpg', text:'Sarman, tahmini 4 aylık, aşırı oyuncu'},
		{image:'http://test.clckwrk.im/test/3.jpg', text:'Labrador, 2 yaşında, İskenderun\'da barınakta'}
	];
	
	$scope.desc = $scope.posts[0].text;
	
	$scope.addPost = function() {
    	$state.go('post.add');
 	 };
	 
	 $scope.changeSlide = function(index) {
		$scope.currentSlide = $ionicSlideBoxDelegate.currentIndex();
		$scope.isHiddenText = false;
		
		$timeout(function() {$scope.isHiddenText = true},200);
		
		$scope.desc = $scope.posts[index].text;
		
		
	 }
	 
	 $scope.mainLinks = [
	 	{href: '#/home', bg:'assertive-bg' , icon: 'sahiplendir-icon-home', label : 'Ana Sayfa'},
		{href: '#/posts', bg:'energized-bg' , icon: 'sahiplendir-icon-cat', label : 'Hayvanları Gör'},
		{href: '#/info',  bg:'royal-bg', icon: 'sahiplendir-icon-info', label : 'Yararlı Bilgiler'}
	 ]
	 
	 
})

// POSTS

.controller('PostsCtrl', function($scope) {
	$scope.items = [];
  for (var i = 0; i < 20; i++) {
    $scope.items.push('Item ' + i);
  }
})


.controller('PostDetailCtrl', function($scope) {
	
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
	  email : Parse.User.current() ? Parse.User.current().get('email') : 'no mail',
	  picture : Parse.User.current() ? Parse.User.current().get('profilePicture') : 'no',
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


.controller("PostAddCtrl", function($scope,  $ionicSlideBoxDelegate, Camera, $timeout, $ionicPopup, LoadingService) {
		
	// PHOTO GALLERY
	
	$scope.postPhotos = [];
	
	
	
	// PHOTO ADD
	
	/*$scope.stopSlide = function(index) {
	 	$ionicSlideBoxDelegate.$getByHandle('post-main').enableSlide(false);
	}*/
	
	$scope.addPostPhoto = function(from) {
		
		var opt = {
			
		  quality: 50,
		  correctOrientation: true,
		  targetWidth: 400,
		  targetHeight: 400,
		  saveToPhotoAlbum: false,
		  //destinationType: 0,// base64 string
		  sourceType  : (from == 'camera') ? 1 : 0 // camera or library
		
		}
				
		Camera.getPicture(opt).then(function(imageURL) {
		  
		  $scope.lastPhoto = imageURL;
		  LoadingService.show();
		  savePost();
     	  //$timeout(function() { $ionicSlideBoxDelegate.next();  console.log($scope.imageURL)},400);

		}, function(err) {
		  console.err(err);
		}, opt);
      
  	}
	
	
	
	
	
	
	
	
	// SAVE POST
	
	 function savePost() {
		
		console.log ('photo url:'+$scope.lastPhoto)
		window.resolveLocalFileSystemURL($scope.lastPhoto, gotFile, gotFail);
		
		function gotFail(e) {
			console.log("FileSystem Error");
			console.dir(e);
		};
		
		function gotFile(fileEntry) {
			
			fileEntry.file(function(file) {
				
				var reader = new FileReader();
			
				reader.onloadend = function(e) {
					
					var name = "large.jpg";
					
					var parseFile = new Parse.File(name, {base64: e.target.result });
					parseFile.save().then(function() {
				
						var cloudObj = {
							url: parseFile.url(),
							postTitle: 'test title hello',
							postMessage: 'test message hello'
						}
						
						console.log("large: " +cloudObj.url);	
																
						Parse.Cloud.run('savePostImage', cloudObj, {
						  success: function(thumbUrl) {
							
								console.log("thumbUrl: " +thumbUrl)		
								$scope.postPhotos.push({large: parseFile.url(), small: thumbUrl});
								console.log($scope.postPhotos);
								
								$timeout(function() { $ionicSlideBoxDelegate.update(); LoadingService.hide()},  500);
								//$ionicSlideBoxDelegate.update();
								
								
			
									/*var alertPopup = $ionicPopup.alert({
										template: 'Kaydedildi..'
									}).then(function(res) {
										
										console.log('Test Alert Box');
									});*/
							
						  },
						  error: function(error) {
							  console.log("from controller: "+error.message);
						  }
						});
						
					}, function (error) {
						console.log(error.message);
							
					})
				
				}
	
				reader.readAsDataURL(file);
		   });

		}
	
  	}

})

.controller("SignUp", function($scope) {
    
})

.controller("SignIn", function($scope) {
    
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
					facebookConnectPlugin.api('/me/picture?type=normal&redirect=false', null,
						function(res) {
							console.log("/me pic response:"+res.data.url);
							
							userObject.set('profilePicture', res.data.url);
							userObject.save();
							$state.go('profile');
						}, 
						function(error) {
							console.log("me pic error:"+error);
						}
            		);
					
					//
                },
                function(err) {
                    console.log("/me error:"+err);
                }
            );
            
           
        }, function(error) {
            console.log("user object:"+error);
        });
    };
	
	
}])


.controller("ProfileCtrl", function($scope, $state) {
    $scope.logout = function() {
		Parse.User.logOut();
		facebookConnectPlugin.logout(
		function (success) {
			console.log('successfully logged out');
		}, 
		function(error) {
			console.log('not logged out');
		});
		
		
		$state.go('tabs.signin');	
		
	}
})

//



