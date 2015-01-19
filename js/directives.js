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




