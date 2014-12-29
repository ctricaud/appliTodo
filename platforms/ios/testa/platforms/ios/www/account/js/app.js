'use strict';

var myApp = angular.module('myApp', ['ngRoute','ngCookies','ngSanitize','myControllers']);
 
myApp.config(['$routeProvider',
   function($routeProvider) {
     $routeProvider.
       when('/abandon', {
         templateUrl: 'template/abandon.html',
         controller: 'abandonCtrl'
       }).
       when('/creation', {
         templateUrl: 'template/creation.html',
         controller: 'creationCtrl'
       }).
       when('/password/:id', {
         templateUrl: 'template/password.html',
         controller: 'passwordCtrl'
       }).
       when('/password', {
         templateUrl: 'template/password.html',
         controller: 'passwordCtrl'
       }).
       when('/newpwd/:id', {
         templateUrl: 'template/setupPassword.html',
         controller: 'setupPasswordCtrl'
       }).
       when('/validation/:id', {
         templateUrl: 'template/validation.html',
         controller: 'validationCtrl'
       }).
       otherwise({
         templateUrl: 'template/login.html',
         controller: 'loginCtrl'
       });
	   
   }]);
   

myApp.constant('mySettings', {
    domaine: 'http://dev.infinyList.com'
});
