'use strict';

var importListe = angular.module('importListe', ['ngRoute','ngCookies','ngSanitize','importControllers']);
 
importListe.config(['$routeProvider',
   function($routeProvider) {
     $routeProvider.
       when('/erreur', {
         templateUrl: 'template',
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
         templateUrl: 'template/choixListe.html',
         controller: 'selectionCtrl'
       });
	   
   }]);
   

importListe.constant('mySettings', {
    domaine: 'http://dev.infinyList.com'
});
