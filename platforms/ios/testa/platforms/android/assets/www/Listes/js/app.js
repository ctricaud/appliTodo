'use strict';
var listesApp = angular.module('listesApp', ['ngRoute','ngCookies','ajoslin.mobile-navigate','ngMobile','ngSanitize','listesDir','listesControllers','listesFilters','ui.bootstrap']);
 
listesApp.config(['$routeProvider',
   function($routeProvider) {
     $routeProvider.
       when('/new', {
         templateUrl: 'Listes/template/ajoutListe.html',
         controller: 'ListesAjout'
       }).
       when('/liste/:idListe', {
         templateUrl: 'Listes/template/detailListe.html',
         controller: 'ListeDetail'
       }).
       when('/listeOptions/:idListe', {
         templateUrl: 'Listes/template/optionListe.html',
         controller: 'ListeOption'
       }).
       when('/listeChamps/:idListe', {
         templateUrl: 'Listes/template/listeChamps.html',
         controller: 'ListeChamps'
       }).
       otherwise({
         templateUrl: 'Listes/template/liste.html',
         controller: 'ListesCtrl'
       });
	   
   }]);
   
listesApp.config(function ( $httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}); 

listesApp.constant('mySettings', {
    domaine: 'http://dev.infinyList.com'
});

