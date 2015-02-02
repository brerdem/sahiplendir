angular.module('Sahiplendir.services', [])

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



.factory('LoadingService', ['$ionicLoading', function($ionicLoading) {
  return {
    show: function() {
		
		var cls = (Math.random() > .5) ? 'loading-custom': 'loading-custom bg2';		
		console.log(cls);
		return $ionicLoading.show({
			
      		template: "<div class='"+cls+"'></div>"
    	})
		
    },
    hide: function() {
    	return $ionicLoading.hide();
    }
  }
}])



.factory('AlertService', ['$ionicPopup', function($ionicPopup) {
  return {
    show: function(msg, type) {
		
		title_str = (typeof type === "undefined") ? "Hata!" : "Başarılı!";
		color_cls = (typeof type === "undefined") ? "assertive" : "balanced";
		img_src = (typeof type === "undefined") ? "cat_fail" : "cat_success";
		
		var alertPopup = $ionicPopup.alert({
			 title: '<span class="'+color_cls+'">'+title_str+'</span>',
			 template: '<div class="alert-container"><img src="img/'+img_src+'.png"><div>'+msg+'</div></div></div>'
		});
		return alertPopup;
	}
  }
  
}])



.factory('PostService', ['LoadingService', '$q', function(LoadingService, $q) {
	
	var title = '';
	var message = '';
	var photos = [];
	var postloc;
	var address = '';
	var allposts = [];
	
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
				var q = $q.defer();
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
						q.resolve(item);
						LoadingService.hide();
						console.log("saved");		
					
					},
					error: function(error) {
					//Failure Callback
					q.reject(error);
					console.log(error.message);
					
					}
				});
				return q.promise;
					
		},
		
		resetPosts : function() {
			return allposts = [];
		},
		
		getAllPosts : function() {
			return allposts;
		},
		
		getPosts : function() {
			var q = $q.defer();
			
			if (allposts.length <= 0) {
				allposts = [];
				LoadingService.show();
				var Posts = Parse.Object.extend("Post");
				var query = new Parse.Query(Posts);
				query.include("userPointer");
				console.log(Parse.User.current());
				/*if (type == 'me') {
					query.equalTo("userPointer", Parse.User.current());
				}*/
				query.find({
				  success: function(results) {
					for (var i = 0; i < results.length; i++) {
						
						photos_arr = JSON.parse(results[i].get("postPhotos"));
						
						var obj = {
							id: results[i].id,
							title: results[i].get("postTitle") || '',
							message: results[i].get("postMessage") || '',
							photos: (photos_arr.length > 0) ? photos_arr : [{small: 'img/no-post-thumb.png', large: 'img/no-post.png'}],
							userid : results[i].get("userPointer").id || '',
							userfullname: results[i].get("userPointer").get("name") || '',
							userpic: results[i].get("userPointer").get("profilePicture") || '',
							created: results[i].createdAt || '',
							location: {lat : results[i].get("postLocation").latitude, lng : results[i].get("postLocation").longitude} || {},
							address : results[i].get("postAddress") || ''
						}
						allposts.push(obj);
					}
					LoadingService.hide();
					q.resolve(allposts);
					
	
				  },
				  error: function(error) {
					  LoadingService.hide();
					 q.reject(error);
					console.log("Error: " + error.code + " " + error.message);
				  }
				  
				});	
				
				
			} else {
				q.resolve(allposts);
			}
			
			return q.promise;
		}
	
	}
	
}])



.factory('VeterinarianService', ['LoadingService', '$q', function(LoadingService, $q) {
	
	
	var allvets = [];
	
	return {

		
		resetVets : function() {
			return allvets = [];
		},
		
		getAllVets : function() {
			return allvets;
		},
		
		getVets : function() {
			var q = $q.defer();
			
			if (allvets.length <= 0) {
				
				LoadingService.show();
				var Vets = Parse.Object.extend("Veterinarian");
				var query = new Parse.Query(Vets);
							
				query.find({
				  success: function(results) {
					for (var i = 0; i < results.length; i++) {
											
						var obj = {
							id: results[i].id,
							name: results[i].get("name") || '',
							location: {lat : results[i].get("loc").latitude, lng : results[i].get("loc").longitude} || {},
							tel : results[i].get("tel"),
							email: results[i].get("email"),
							address : results[i].get("address") || ''
						}
						allvets.push(obj);
					}
					LoadingService.hide();
					q.resolve(allvets);
					
	
				  },
				  error: function(error) {
					 LoadingService.hide();
					 q.reject(error);
					console.log("Error: " + error.code + " " + error.message);
				  }
				  
				});	
				
				
			} else {
				q.resolve(allvets);
			}
			
			return q.promise;
		}
	
	}
	
}])









