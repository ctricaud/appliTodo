//===========================================================================================
//Définition de la liste des controleurs pour l'ajout de liste
//
//1. Le controleur pour la page de login
//
//
//===========================================================================================
var myControllers = angular.module('myControllers', []);
 
//===========================================================================================
//1. Le controleur pour la liste des listes
//===========================================================================================
myControllers.controller('friendsCtrl', function ($scope,$http, mySettings) {
	//1.1 On récupère la liste des amis
	function lectureFriends() {
		$http.get(mySettings.domaine+'/webservices/share.php?code=2').success(function(data) {
			$scope.friends=data;
			$scope.friendsLength=Object.keys(data).length
			})
	}
	
	lectureFriends();
	
	//1.2 Ajout d'un contact
	$scope.addContact=function() {
		//On appelle la visualisation du carnet d'adresse
		window.plugins.ContactChooser.chooseContact(function (contactInfo) {
			setTimeout(function () { // use timeout to fix iOS alert problem
				name=contactInfo.displayName;
				email=contactInfo.email;
				phone=contactInfo.phoneNumber;
				//name="Clémence Tricaud";
				//email="clemence.tricaud@hec.edu";
				//phone="01.02.03.04.05";
				
				//On envoie l'information sur le webservice
				var FormData = {
					  'name':name,
					  'email':email,
					  'phone':phone
					};
			
					$http.post(mySettings.domaine+'/webservices/share.php?code=1', FormData, {cache:false}).success(function(data) {
						//On insère l'information
						lectureFriends();
					});

				}, 0);
		});
		
		
	}

	//1.3 Destruction
	$scope.deleteFriend=function(friend) {
		//On envoie l'information sur le webservice
		var FormData = {
			  'email':friend.emailFriend
			};
	
		$http.post(mySettings.domaine+'/webservices/share.php?code=3', FormData, {cache:false}).success(function(data) {
			//On met à jour l'affichage
			lectureFriends();
		});
	}
});

//===========================================================================================
//7. Le controleur pour afficher la liste des champs
//===========================================================================================
myControllers.controller('headerController', function ($scope,$http,$window,$route, gettextCatalog, mySettings) {
	//7.1 Les items du menu
	$scope.items = new Array();
	
	$i=$scope.items.push(new Array());
	$scope.items[$i-1]['menu']="Gérer ma liste d'amis";
	$scope.items[$i-1]['action']="friends()";

	$i=$scope.items.push(new Array());
	$scope.items[$i-1]['menu']="Accueil";
	$scope.items[$i-1]['action']="accueil()";

	//7.5 pour gérer ses amis
	$scope.friends=function() {
		window.location='index.html#/friends';
	};
	
	$scope.accueil=function() {
		window.location='../index.html';
	};
	
   
});

