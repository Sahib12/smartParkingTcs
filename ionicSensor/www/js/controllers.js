angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('sendController', function($scope, $stateParams, $ionicPlatform, $window, $interval) {
    
    
    var config = {
    apiKey: "AIzaSyC-mPkUYLOsuLTrzv-IdfiADXdloAjI5eo",
    authDomain: "smartparking1998.firebaseapp.com",
    databaseURL: "https://smartparking1998.firebaseio.com",
    projectId: "smartparking1998",
    storageBucket: "smartparking1998.appspot.com",
    messagingSenderId: "94170178175"
  };
  firebase.initializeApp(config);
    
    $scope.formData = {
        url : "Enter the url here"
    }
    $scope.sendData = function(){
        firebase.database().ref('/deviceInfo/' + key + "/url").set($scope.formData.url)
    }
    
  
    
    
    
    console.log("Yes the controller is running fine");
    
    var key = $window.localStorage['uniqueKey'];
    if(!key){
        key = firebase.database().ref().push().key;
        $window.localStorage['uniqueKey'] = key;
        console.log("The alloted key is " + key );
    }
    
    console.log(key);
    
    
    
    
    function sendGPSData(){
        console.log("Running sendgpsdata");
        var onSuccess = function(position) {
            console.log('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp: '         + position.timestamp                + '\n');
            
            firebase.database().ref('/deviceInfo/' + key + "/lat").set(position.coords.latitude);
       
            firebase.database().ref('/deviceInfo/' + key + "/long").set(position.coords.longitude);
            
            
            var firebaseRef = firebase.database().ref('devices/');

          // Create a new GeoFire instance at the random Firebase location
          var geoFire = new GeoFire(firebaseRef);
          var geoQuery;
            
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;        
            var myID = key;
            try{
                geoFire.set(myID, [lat, lon]).then(function() {
                  console.log(myID + ": setting position to [" + lat + "," + lon + "]");
                  //alert("HEllo");
                }, function(err){
                    console.log(err);
                    throw err;
                });
                }
            catch(err){
                console.log(err);
                throw err;
            }
            
            
        };
            
            // onError Callback receives a PositionError object
            //
        function onError(error) {
            console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
        }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    
    $ionicPlatform.ready(function(){
        function error() {
              console.warn('Camera permission is not turned on');
            }

            function success( status ) {
              if( !status.hasPermission ) error();
            }
        var permissions = cordova.plugins.permissions;
        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, success, error);
        console.log("Yes the ready block is executeing")
/*
        setInterval(function(){
          
        }, 10000);
        
        setInterval(function(){
            sendGPSData();
        },10000)*/
        
    function onSuccess(values) {
          $scope.state = values[0];
             console.log($scope.state);
            firebase.database().ref('/deviceInfo/' + key + "/occupied").set($scope.state);
            firebase.database().ref('/deviceInfo/' + key + "/rate").set(10);
      };
      
      function onError(error) {
          console.log(error);
          throw error;
          
      };
        
        sensors.enableSensor("PROXIMITY");

        $interval(function(){
          sendGPSData();
          sensors.getState(onSuccess, onError);
        }, 5000);


    
        
    })
});
