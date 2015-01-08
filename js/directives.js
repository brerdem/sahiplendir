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
    templateUrl : "ionMenuList.html"
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


