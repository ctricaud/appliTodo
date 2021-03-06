var listesControllers = angular.module('listesControllers', []);
 
//===========================================================================================
//1. Le controleur pour la liste des listes
//===========================================================================================
listesControllers.controller('uniqCtrl', function ($scope,$http,$window,$location,$sanitize, mySettings) {
	//===========================================================================================
	//1.2 On récupère les informations sur la page qu'on veut parser
	//===========================================================================================
	//1.2.1 Les informations d'url
	$scope.url = window.sessionStorage.getItem("url");
	
	//1.2.2 On vérifie qu'on a bien récupéré une url
	if ($scope.url==undefined) {
		$scope.erreur=true;
		$scope.message="Nous n'avons pas retrouvé de site à parser ou copier.";
		return;
	}
	
	//1.2.3 On supprime l'url qui était en attente
	//window.sessionStorage.removeItem("url");
	
	//===========================================================================================
	//1.3 On récupère les informations sur la page qu'on veut parser
	//===========================================================================================
	var FormData = {
	  'url':encodeURIComponent($scope.url)
	};

	$http.post(mySettings.domaine+'/webservices/extension.php?code=1', FormData, {cache:false}).success(function(data) {	
		$scope.selection=false;
		
		if (data['code']==undefined || data['code']==2 || data['listes']==undefined) {
		//Une erreur s'est produite, sans doute un mauvais token
			$scope.erreur=true;
			$scope.message="Impossible d'accéder à votre compte, veuillez vous reconnecter.";
			return;
		}

		if (data['code']==1) {
			//L'url n'est pas prévue pour être traitées
			$scope.erreur=true;
			$scope.snapshot=true;
			$scope.message="Le site que vous voulez analyser n'est pas encore disponible à cet usage.";
			$scope.question="Si vous souhaitez ajouter une copie d'écran à une liste de copie d'écran, sélectionnez la ci-dessous:";

			//On va chercher les listes qui correspondent au modèle snapshot
			$http.post(mySettings.domaine+'/webservices/extension.php?code=3', FormData, {cache:false}).success(function(data) {	
				if (data['code']==undefined || data['code']==2 || data['listes']==undefined) {
					//Une erreur s'est produite, sans doute un mauvais token
					$scope.erreur=true;
					$scope.snapshot=false;
					$scope.message="Impossible d'accéder à votre compte, veuillez vous reconnecter.";
					return;
				}
				else {
					$scope.listes2=data['listes'];
					
					if ($scope.listes2.length==0) {
						$scope.listes2=new Array();
						$scope.listes2[0]=new Array();
						$scope.listes2[0]['lst_nom']='Nouvelle Liste Snap Shot';
					}
					
				}
			});
			return;
		}

		//On récupère les données
		$scope.listes=data['listes'];
		
		$scope.erreur=false;
		$scope.snapshot=false;
			
		
		if ($scope.listes.length>0) {
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
				//On affiche le message en retour
				if (data['message']!=undefined) {
					$window.location=data['message']; }
				else {
					$scope.message="Un incident s'est produit pendant l'analyse de votre page.";}
			})		
		}
		else {
			//On doit créer une nouvelle liste avant de la parser
			var FormData = {
			  'url':encodeURIComponent($scope.url)
			};
	
			$http.post(mySettings.domaine+'/webservices/extension.php?code=2', FormData, {cache:false}).success(function(data) {	
				if (data['idListe']!=undefined) {
					//On insère l'information
					idListe=data['idListe'];
				
					$http.get(mySettings.domaine+'/webservices/parse.php?idListe='+idListe+'&url='+encodeURIComponent($scope.url)).success(function(data) {
						//On affiche le message en retour
						if (data['message']!=undefined) {
							$window.location=data['message']; }
						else {
							$scope.message="Un incident s'est produit pendant l'analyse de votre page.";}
					})		
				}
				else {
					$scope.message="Un incident s'est produit pendant la création de votre liste.";}
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
		
			$http.get(mySettings.domaine+'/webservices/upload.php?width='+window.innerWidth+'&idListe='+idListe+'&url='+encodeURIComponent($scope.url)).success(function(data) {
				//On affiche le message en retour
				if (data['message']!=undefined) {
					$window.location=data['message']; }
				else {
					$scope.message="Un incident s'est produit pendant la copie de votre page.";}
			})		
		}

		else {
			//On doit créer une nouvelle liste avant de la parser
			var FormData = {
			  'url':'///'
			};
	
			$http.post(mySettings.domaine+'/webservices/extension.php?code=2', FormData, {cache:false}).success(function(data) {	
				if (data['idListe']!=undefined) {
					//On insère l'information
					idListe=data['idListe'];
				
					$http.get(mySettings.domaine+'/webservices/upload.php?width='+window.innerWidth+'&idListe='+idListe+'&url='+encodeURIComponent($scope.url)).success(function(data) {
						//On affiche le message en retour
						if (data['message']!=undefined) {
							$window.location=data['message']; }
						else {
							$scope.message="Un incident s'est produit pendant la copie de votre page.";}
					})		
				}
				else {
					$scope.message="Un incident s'est produit pendant la création de votre liste.";}
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
//2. Le controleur pour la saisie
//===========================================================================================
listesControllers.controller('saisieCtrl', function ($scope,$http,$window, mySettings) {
	$scope.addURL=function() {
		window.sessionStorage.setItem("url",$scope.url);	
		window.location='#/';
	}
});
