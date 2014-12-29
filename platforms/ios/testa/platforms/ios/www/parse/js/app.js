'use strict';

var listesApp = angular.module('listesApp', ['ngRoute','ngSanitize','listesControllers']);
 
listesApp.config(['$routeProvider',
   function($routeProvider) {
     $routeProvider.
       when('/login', {
         templateUrl: 'login.html',
         controller: 'loginCtrl'
       }).
       otherwise({
         templateUrl: 'template/liste.html',
         controller: 'uniqCtrl'
       });
	   
   }]);
   

listesApp.constant('mySettings', {
    domaine: 'http://dev.infinyList.com'
});

