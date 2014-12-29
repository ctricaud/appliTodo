angular.module('listesDir',[])
.directive('ctRegle', function () {
    return {
      restrict: 'AE',
      template: '<img height=12 ng-src="images/check.png" ng-show="trouve"><img height=12 ng-src="images/uncheck.png" ng-hide="trouve">',
      scope: {
        num: '=',
		regles: '='
      },
      link: function (scope, elem, attrs) {
        scope.stars = [];
		scope.trouve=false;
        for (var i = 0; i < scope.regles.length; i++) {
          if (scope.regles[i].regleNum==scope.num) {
			  scope.trouve=true;
			  break;
		  }
        }
      }
  }
})
.directive('bindHtmlUnsafe', function( $parse, $compile ) {
    return function( $scope, $element, $attrs ) {
        var compile = function( newHTML ) {
            newHTML = $compile(newHTML)($scope);
            $element.html('').append(newHTML);        
        };
        
        var htmlName = $attrs.bindHtmlUnsafe;
        
        $scope.$watch(htmlName, function( newHTML ) {
            if(!newHTML) return;
            compile(newHTML);
        });
   
    };
});