'use strict';
//===========================================================================================================
//1. Définition des routes
//===========================================================================================================
var myApp = angular.module('myApp', ['ngRoute','ngCookies','ajoslin.mobile-navigate','ngMobile','gettext', 'ngSanitize','myControllers','ui.bootstrap']);
myApp.config(['$routeProvider',
   function($routeProvider) {
     $routeProvider.
       when('/friends', {
         templateUrl: 'template/friends.html',
         controller: 'friendsCtrl'
       }).
       otherwise({
         templateUrl: 'template/friends.html',
         controller: 'friendsCtrl'
       });
	   
   }]);


//===========================================================================================================
//4. Les constantes
//===========================================================================================================
myApp.constant('mySettings', {
    domaine: 'http://dev.infinyList.com'
});

//===================================================================================
//5. Interception des requêtes http
//===================================================================================
myApp.config(function ($provide, $httpProvider) {
  
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
					var addUrl = (config.url.indexOf("?")>=0) ? '&jwt='+jwt : '?jwt='+jwt;
					config.url+=addUrl;
				}
				
				if (config.method=='POST') {
					//Si c'est un post on le rajoute les données à data
					config.data['jwt']=jwt;
					var addUrl = (config.url.indexOf("?")>=0) ? '&jwt='+jwt : '?jwt='+jwt;
					config.url+=addUrl;
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
			window.location="../account/index.html#/abandon";
		}
        return $q.reject(rejection);
      }
    };
  });
 
  // Add the interceptor to the $httpProvider.
  $httpProvider.interceptors.push('MyHttpInterceptor');
 
});
