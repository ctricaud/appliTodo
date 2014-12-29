angular.module('listesFilters', []).filter('checkmark', function() {
  return function(input) {
    return (input==1) ? '\u2713' : '';
  };
});