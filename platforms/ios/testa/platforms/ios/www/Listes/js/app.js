'use strict';
//===================================================================================
//1. Création de l'application
//===================================================================================
var listesApp = angular.module('listesApp', ['ngRoute','ngCookies','ajoslin.mobile-navigate','ngMobile','ngSanitize','listesDir','listesControllers','listesFilters','ui.bootstrap']);
 
//===================================================================================
//2. Routes à suivre en fonction de l'url
//===================================================================================
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
   
//===================================================================================
//3. Autoirisation de cross domaine
//===================================================================================
listesApp.config(function ( $httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}); 

//===================================================================================
//4. Les constantes de l'appli javascript
//===================================================================================
listesApp.constant('mySettings', {
    domaine: 'http://dev.infinyList.com'
});

//===================================================================================
//5. Interception des requêtes http
//===================================================================================
listesApp.config(function ($provide, $httpProvider) {
  
  //===================================================================================
  // 5.1 On intercepte les appels et retour
  //===================================================================================
  $provide.factory('MyHttpInterceptor', function ($q,$window,$location) {
    return {
      //===================================================================================
  	  // 5.1.1 Appel: C'est un succès
      //===================================================================================
  	  request: function (config) {
        //On regarde si c'est un web service qu'on est en train d'appeler
			if (config.url.indexOf('/webservices/')>=0) {
			//On vérifie que le jeton est bien en place
				var jwt='';
				if ($window.sessionStorage.getItem('jwt')) {
					//On récupère le jeton dans le stockage de session
					jwt=$window.sessionStorage.getItem('jwt');
				}
				else {
					if ($window.localStorage.getItem('jwt')) {
						//On récupère le jeton dans le stockage local
						jwt=$window.localStorage.getItem('jwt');
						//On met à jour le stockage de session
						$window.sessionStorage.setItem('jwt',jwt)
					}	
					else {
						//On sauvegarde l'url qui a posé problème
						$window.localStorage.setItem('lastUrl',$location.absUrl());
						//On renvoie su la page de login
						window.location="account/index.html";
					}
				}
				
				if (config.method=='GET') {
					//Si c'est un get on le rajoute à l'url
					var addUrl = (config.url.indexOf("?")>=0) ? '&jwt='+jwt : '&jwt='+jwt;
					config.url+=addUrl;
				}
				
				if (config.method=='POST') {
					//Si c'est un post on le rajoute les données à data
					config.data['jwt']=jwt;
				}
				
				//console.log(config);
				return config;
			}	//Fin de vérification qu'on appelle un webservice
 
        // Sinon on retourne l'objet
        return config || $q.when(config);
      },
 
      //===================================================================================
  	  // 5.1.2 Appel: c'est un échec
      //===================================================================================
  	  requestError: function (rejection) {
        // console.log(rejection); // Contains the data about the error on the request.
        // Return the promise rejection.
        return $q.reject(rejection);
      },
 
      //===================================================================================
  	  // 5.1.3 Retour: C'est un succès
      //===================================================================================
  	  response: function (response) {
		//console.log(response); // Contains the data from the response.
        //On retourne sinon la réponse reçue
        return response || $q.when(response);
      },
 
      //===================================================================================
  	  // 5.1.4 Retour: C'est un échec
      //===================================================================================
  	  responseError: function (rejection) {
		//On récupère le status du retour
		var status=rejection.status
		
		if (status===401) {
			//On sauvegarde l'url qui a posé problème
			$window.localStorage.setItem('lastUrl',$location.absUrl());
			//On déconnecte l'utilisateur
			window.location="account/index.html#/abandon";
		}
        return $q.reject(rejection);
      }
    };
  });
 
  // Add the interceptor to the $httpProvider.
  $httpProvider.interceptors.push('MyHttpInterceptor');
 
});