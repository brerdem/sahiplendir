angular.module('Sahiplendir.services', [])

<!-- CAMERA -->

.factory('Camera', ['$q', function($q) {
 	
  return {
    getPicture: function(options) {
      var q = $q.defer();
      
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    }	
  }
}])


<!-- LOCAL STORAGE -->

.factory('$localstorage', ['$window', function($window) {
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
}])

<!-- LOADING -->

.factory('LoadingService', ['$ionicLoading', function($ionicLoading) {
  return {
    show: function() {
		return $ionicLoading.show({
      		template: "<div class='loading-custom'></div>"
    	})
		
    },
    hide: function() {
    	return $ionicLoading.hide();
    }
  }
}])


<!-- POST SERVICE -->

.factory('PostService', ['LoadingService', function(LoadingService) {
	
	var title = '';
	var message = '';
	var photos = [];
	var postloc;
	var address = ''; 
	
	return {
	
		setTitle : function(t) {
			title = t;
		},
		
		getTitle : function() {
			return title;
		},
		
		setMessage : function(m) {
			message = m;
		},
		
		getMessage : function() {
			return message;
		},
		
		setAddress : function(a) {
			address = a;
		},
		
		getAddress : function() {
			return address;
		},
		
		addPhoto : function(p) {
			photos.push(p);
		},
		
		getAllPhotos : function() {
			return photos;
		},
		getFirstPhoto : function() {
			return photos[0] || {};
		},				
		
		
		post : function() {
				LoadingService.show();
				console.log(postloc);
				var PostObj = Parse.Object.extend("Post");
				var post = new PostObj();
									
				post.set("postTitle", title);
				post.set("postMessage", message);
				post.set("postAddress", address);
				post.set("postLocation", this.postloc);
				post.set("postPhotos", JSON.stringify(photos));
				post.set("userPointer", Parse.User.current());
				
				post.save(null, {       
					success: function(item) {
						LoadingService.hide();
						console.log("saved");		
					
					},
					error: function(error) {
					//Failure Callback
					
					console.log(error.message);
					
					}
				});	
		}
	}
	
}])








