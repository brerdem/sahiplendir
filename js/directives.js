angular.module('Sahiplendir.directives', [])

.directive('backColor', function(){
    return function(scope, element, attrs){
        var clr = attrs.backColor;
        var content = element.find('a');
        content.css({
            'background-color': ''+clr+'-bg',
           
        });
    };
})


.directive('emailAvailable', function() { // available
    return {
		restrict : 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
			elem.bind('blur', function (e) {
				var val = elem.val();
				console.log(val);
					
				
					if(val.match(/[a-z0-9\-_]+@[a-z0-9\-_]+\.[a-z0-9\-_]{2,}/)) {
					
									
							var query = new Parse.Query(Parse.User);
							  query.equalTo("email", val);
							  query.find({
								  success: function(results) {
									  console.log("length: "+results.length);
									  if (results.length == 0) {
										ctrl.$setValidity('unique', true);
										
									  } else {
										ctrl.$setValidity('unique', false);
										 
									  }
									  scope.$apply();
									  
									 
								  },
								  error: function(error) {
									
									  return undefined
								  }
							 })
					
					 
						
					} else {
						console.log("variable is undefined");
						return undefined;
					}
			})

        }
    };
})





.directive("ionMenuList", function() {
  return {
    restrict : "E",
    templateUrl : "templates/ion-menu-list.html"
  }
})

.directive('postPhoto', function() {
	return {
		restrict : "E",
    	template : '<div>hello moto</div>',
		link : function(scope, element, attrs){
			           
        }
	}
	
})

.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(41.043396, 29.008060),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($element[0], mapOptions);
  
        $scope.onCreate({map: map});

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          e.preventDefault();
          return false;
        });
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
});




