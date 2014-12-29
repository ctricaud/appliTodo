//===========================================================================================
//Définition de la liste des controleurs pour l'ajout de liste
//
//0. Les fonctions dont on a besoin
//1. Le controleur pour la liste des listes potentielles
//
//
//===========================================================================================
var importControllers = angular.module('importControllers', []);

 
//===========================================================================================
//1. Le controleur pour la liste des listes
//===========================================================================================
importControllers.controller('selectionCtrl', function ($scope,$http, $cookieStore, $interval, $log, mySettings) {
	//1.0 On récupère le modèle et les informations correspndants à la liste à importer
	url='../datas/sacs.json';
	$scope.scan=window.sessionStorage.getItem("scan");

	if ($scope.scan==undefined ||$scope.scan.indexOf('dev.infinylist.com')==-1) {
		//C'est un mauvais scan on affiche la page d'erreur
		$scope.erreur=true;
		$scope.message="Ce code ne correspond à aucune liste disponible";
	}
	
	
	$http.get(mySettings.domaine+'/webservices/ajoutListe.php?code=0&url='+url).success(function(data) {
		$scope.liste=data;

		//1.1 On récupère les listes de l'utilisateur correspondant à la liste à importer
		$http.get(mySettings.domaine+'/webservices/ajoutListe.php?code=1&idModele='+$scope.liste.modele).success(function(data) {
			$scope.listes=data;
			$scope.listesLength=Object.keys(data).length
	
		})		
	})

	$scope.selListe=function(liste) {
		//1.3 On traite le choix de l'utilisateur
		if (liste==undefined) {
			//1.4 On créée un nouvelle liste
			var FormData = {
			  'idModele' :$scope.liste.modele ,
			  'lst_nom':$scope.liste.nomListe
			};
	
			$http.post(mySettings.domaine+'/webservices/listes.php?code=3', FormData, {cache:false}).success(function(data) {	
				//On insère l'information
				$idListe=data;
				if ($idListe.length>24) {$idListe=$idListe.substr($idListe.length-24);}
			
				//1.4.2 On importe la nouvelle liste
				importListe($idListe,0,url);		
			});

		}
		else {
			//1.5 On créée un groupement dans la liste choisie
			$idListe=liste._id.$id;
			var FormData = {
			  'title':$scope.liste.nomListe,
			  'idListe':$idListe,
			  'commentaire':$scope.liste.Origine
			};
	
			$http.post(mySettings.domaine+'/webservices/ajoutListe.php?code=2', FormData, {cache:false}).success(function(data) {	
				//On insère l'information
				$id=data;
				if ($id.length>24) {$id=$id.substr($id.length-24);}
			
				//1.4.2 On importe la nouvelle liste
				importListe($idListe,$id,url);		
			});
		}
	}

function importListe($idListe,idCat) {
	var FormData = {
	  'url':url,
	  'idListe':$idListe,
	  'idCat':idCat
	};

	$http.post(mySettings.domaine+'/webservices/ajoutListe.php?code=3', FormData, {cache:false}).success(function(data) {	
		//On renvoie sur la liste indiquée
		window.location='../index.html#/liste/'+$idListe+"-"+idCat;
	});
}

   
});


