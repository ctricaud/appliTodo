
var listesControllers = angular.module('listesControllers', []);
 
//===========================================================================================
//1. Le controleur pour la liste des listes
//===========================================================================================
listesControllers.controller('uniqCtrl', function ($scope,$http,$window,$location,$sanitize, mySettings) {
	//===========================================================================================
	//1.1 On vérifie qu'un numéro d'utilisateur est bien renseigné
	//===========================================================================================
	//if ($window.localStorage.token==undefined){
		//On renvoie sur la page de login;
		//window.location="#/login";
	//}
	
	
	//===========================================================================================
	//1.2 On récupère les informations sur la page qu'on veut parser
	//===========================================================================================
	//1.2.1 Les informations d'url
	$scope.url = window.sessionStorage.getItem("url");
	
	//1.2.2 On récupère la liste des listes de l'utilisateur
	var FormData = {
	  'url':encodeURIComponent($scope.url)
	};

	$http.post(mySettings.domaine+'/webservices/extension.php?code=1', FormData, {cache:false}).success(function(data) {	
		$scope.selection=false;
		
		if (data.indexOf("Erreur")==2) {
			//Une erreur s'est produite, sans doute un mauvais token
			$scope.erreur=true;
			$scope.message="Impossible d'accéder à votre compte, veuillez vous reconnecter.";
			return;
		}

		if (data.indexOf("Pas de liste")==2) {
			//L'url n'est pas prévue pour être traitées
			$scope.erreur=true;
			$scope.snapshot=true;
			$scope.message="Le site que vous voulez analyser n'est pas encore disponible à cet usage.";
			$scope.question="Si vous souhaitez ajouter une copie d'écran à une liste de copie d'écran, sélectionnez la ci-dessous:";

			//On va chercher les listes qui correspondent au modèle snapshot
			$http.post(mySettings.domaine+'/webservices/extension.php?code=3', FormData, {cache:false}).success(function(data) {	
				if (data.indexOf("Erreur")==2) {
					//Une erreur s'est produite, sans doute un mauvais token
					$scope.erreur=true;
					$scope.snapshot=false;
					$scope.message="Impossible d'accéder à votre compte, veuillez vous reconnecter.";
					return;
				}
				else {
					$scope.listes2=data;
					$scope.listesLength=Object.keys(data).length;
					
					if ($scope.listesLength==0) {
						$scope.listes2=new Array();
						$scope.listes2[0]=new Array();
						$scope.listes2[0]['lst_nom']='Nouvelle Liste Snap Shot';
					}
					
				}
			});
			return;
		}

		//On récupère les données
		$scope.listes=data;
		
		if (typeof data == "object") {
			$scope.listesLength=Object.keys(data).length;}
		else {
			$scope.listesLength=0;}
		$scope.erreur=false;
		$scope.snapshot=false;
			
		
		if ($scope.listesLength>0) {
			$scope.message="Sélectionnez la liste où importer la page web."
		}
		else {
			$scope.message="Cliquez sur le bouton pour créer une nouvelle liste et importer les données de la pageweb.";
			$scope.listes=new Array();
			$scope.listes[0]=new Array();
			$scope.listes[0]['lst_nom']='Nouvelle Liste Automatique';
		}

	})
	
	$scope.selListe=function (liste) {
		//===========================================================================================
		//1.2.3 L'utilisateur a choisi une liste, on envoie la page dessus
		//===========================================================================================
	    $scope.message="Votre page est en cours d'extraction";
		$scope.selection=true;
		
		if (liste._id!=undefined) {
			idListe=liste._id.$id;
		
			$http.get(mySettings.domaine+'/webservices/parse.php?idListe='+idListe+'&url='+encodeURIComponent($scope.url)).success(function(data) {
				//On récupère toutes les informations en retour
				$scope.message=data;
			})		
		}
		else {
			//On doit créer une nouvelle liste avant de la parser
			var FormData = {
			  'JWT' :$window.localStorage.token ,
			  'url':encodeURIComponent($scope.url)
			};
	
			$http.post(mySettings.domaine+'/webservices/extension.php?code=2', FormData, {cache:false}).success(function(data) {	
				//On insère l'information
				idListe=data;
			
				$http.get(mySettings.domaine+'/webservices/parse.php?idListe='+idListe+'&url='+encodeURIComponent($scope.url)).success(function(data) {
					//On récupère toutes les informations en retour
					$scope.message=data;
				})		
			});
		}
	}
	


	$scope.selListeSnap=function (liste) {
		//===========================================================================================
		//L'utilisateur fait un snap de la page actuelle
		//===========================================================================================
	    $scope.message="Votre page est en cours de copie";
		$scope.selection=true;
		
		if (liste._id!=undefined) {
			idListe=liste._id.$id;
		
			chrome.tabs.executeScript($scope.tabId, {file: 'js/page.js'}, function() {
				loaded = true;
				sendScrollMessage($scope.tab);
			});
		
		
		}
		else {
			//On doit créer une nouvelle liste avant de la parser
			var FormData = {
			  'JWT' :$window.localStorage.token ,
			  'url':'///'
			};
	
			$http.post(mySettings.domaine+'/webservices/extension.php?code=2', FormData, {cache:false}).success(function(data) {	
				//On insère l'information
				idListe=data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			
				chrome.tabs.executeScript($scope.tabId, {file: 'js/page.js'}, function() {
					loaded = true;
					sendScrollMessage($scope.tab);
				});
			});
		}
	}
	


	$scope.abandon=function() {
		delete $window.localStorage.token;
		window.location="#/login";
	}
	
	$scope.close=function() {
		window.close();
	}

});


//===========================================================================================
//2. Le controleur pour le login
//===========================================================================================
listesControllers.controller('loginCtrl', function ($scope,$http,$window, mySettings) {
	$scope.login = function() {
	    var FormData = {
		  'email' :$scope.Email ,
		  'password':$scope.password
		};

		$http.post(mySettings.domaine+'/webservices/auth.php', FormData, {cache:false}).success(function(data) {	
			if (Object.keys(data).length>1) {
				//On récupère le code de retour
				if (data[0]!=0) {
					// C'est une erreur, on l'affiche
					$scope.message=data[1];
				}
				else {
					//On récupère le jwt et on le met en lieu sur
					JWT=data[1];
					$window.localStorage.token=JWT;
					
					//Puis on reirige sur la page de login	
					window.location="#";
				}
			}
			else {
				//Un problème semble survenir, on n'a pas de retour correct
				$scope.message='Une erreur est survenue. Impossible de vous identifier.';
			};
		})
	};
});
