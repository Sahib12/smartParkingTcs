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

.controller('searchController', function($scope, $stateParams) {
    
})

.controller('currentController', function($scope, $stateParams, $firebaseAuth, $cordovaGeolocation, $ionicPopup, $ionicPlatform) {
    
    $ionicPlatform.registerBackButtonAction(function (event) {
        alert("Back button will not work here. Please use the home button to exit the app");
        event.preventDefault();
    }, 100);
    
    $scope.done = false;
   
    
       var options = {timeout: 100000, enableHighAccuracy: true};
    
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                  $scope.currentLat = position.coords.latitude;
                  $scope.currentLong = position.coords.longitude;


              }, function(error){
                console.log("Could not get location");
                  console.log(error);
              });
    
     $scope.authObj = $firebaseAuth();
        
        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
          if (firebaseUser) {
              $scope.uid = firebaseUser.uid;
            console.log("Signed in as:", firebaseUser.uid);
              
              firebase.database().ref('user_details/' + $scope.uid + '/current').once('value',
                function(data){
                    console.log("This is the current state and the current state of the user is ");
                    console.log(data.val());
                    $scope.currentState = data.val();
                    $scope.bookedDate = new Date($scope.currentState.timeIn)
                    firebase.database().ref('deviceInfo/' + $scope.currentState.sensorId).on('value',function(snapshot){
                        if(snapshot.val().occupied > 0){
                            //Modifying the database
                            // this is the variable that holds the data
                            $scope.entireDataRate = snapshot.val().rate;
                            $scope.entireData = snapshot.val();
                            console.log($scope.entireData);
                            $scope.done;

                            var key1 = firebase.database().ref('user_details/' + $scope.uid + '/past/').push().key;

                            firebase.database().ref('user_details/' + $scope.uid + '/current').set(null);

                            //alert("Thank you for using our service on the next prompt you will see your bill amount");
                            firebase.database().ref('deviceInfo/' + $scope.currentState.sensorId + '/locked').set(false);
                            var date1 = new Date();
                            var date2 = $scope.currentState.timeIn;
                            //alert(date2);
                            var diffmili = date1.getTime() - date2; 
                            //alert(diffmili/60000);
                            var tmp = diffmili/60000;
                            var cost = snapshot.val().rate * tmp;
                            //alert(cost);

                            firebase.database().ref('user_details/' + $scope.uid + '/past/' + key1).set({timeIn: $scope.currentState.timeIn, timeOut: date1.getTime(), sensorId: $scope.currentState.sensorId, bill:cost});
                            $scope.timein = $scope.currentState.timeIn;
                            $scope.timeout = date1.getTime();
                            $scope.rate = $scope.entireData.rate;
                            $scope.cost = cost;
                            $scope.done = true;
                            $scope.$apply();
                            
                        }
                    })},
                function(data){console.log(data)}

            )
              
             
          } 
            else {
                $state.go('app.login');
            }
          
        })
    
    
    
    
})

.controller('lockedController', function($scope, $stateParams, $firebaseAuth, $state,$cordovaGeolocation,$ionicPopup, $ionicPlatform, $window) {
    $ionicPlatform.registerBackButtonAction(function (event) {
        alert("Back button will not work. Please use the cancel booking button or use the home button on your phone to exit.");
        event.preventDefault();
    }, 100);
  
    
    var options = {timeout: 100000, enableHighAccuracy: true};
    
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                  $scope.currentLat = position.coords.latitude;
                  $scope.currentLong = position.coords.longitude;


              }, function(error){
                console.log("Could not get location");
                  console.log(error);
              });
    
    $scope.cancelBooking = function(){
        firebase.database().ref('deviceInfo/' + $stateParams.id + '/locked').set(false).then(
            function(){
                console.log('1st data removed successfully');
                firebase.database().ref('locked/' + $scope.uid + '/booking').set(false).then(
                    function(){
                        console.log('2nd Data removed successfully');
                        $window.localStorage['rl'] = 'true';
                        $state.go('app.home',{}, {reload: true});
                    }
                )
            }
        )
    }
    
    $scope.authObj = $firebaseAuth();
        
        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
          if (firebaseUser) {
              $scope.uid = firebaseUser.uid;
            console.log("Signed in as:", firebaseUser.uid);
              runAfterAuth(); 
             
          } 
            else {
                $state.go('app.login');
            }
          
        })
    
        function runAfterAuth(){
            var sensorId= $stateParams.id;
            var tempRef = firebase.database().ref('deviceInfo/' + sensorId);
            tempRef.on('value', function(snapshot) {
                //This contains the information about the object
                $scope.entireObj = snapshot.val();
                console.log("The value of the sensor is " + snapshot.val());
                if(snapshot.val().occupied == 0){
                    
                      var confirmPopup = $ionicPopup.confirm({
                             title: 'Confirmation',
                             template: 'We have detected that someone has parked the vehicle on your booked slot, have you parked the vehicle?'
                          });

                          confirmPopup.then(function(res) {
                             if(res) {
                                console.log("yes i am the one who has parked the vehicle.");
                        // Now adding the parking details to the database.
                        firebase.database().ref('deviceInfo/' + sensorId + '/locked').set(true);
                        firebase.database().ref('locked/' + $scope.uid + '/booking').set(false);
                        firebase.database().ref("user_details/" + $scope.uid + "/current").set(
                        {timeIn: new Date().getTime(),
                         sensorId: sensorId}
                        ).then(function(){
                            console.log("The user_detais/ current set successfully");
                            //Redirecting the user to the current state.
                            firebase.database().ref('deviceInfo/' + sensorId).off();
                            $state.go("app.current");

                        }, function(){console.log("An error occured")})
                                
                             } else {
                                console.log('Not sure!');
                             }
                          });
                    
                }
            });
        }
    
    
})

.controller('logoutController', function($scope, $firebaseAuth){
    var authObj = $firebaseAuth();
    var response = confirm('Are you sure you want to sign out ?');
    if(response){
        authObj.$signOut();
        $state.go('app.login');
    }
})

.controller('previousController', function($scope, $firebaseAuth, $firebaseArray, $ionicPlatform, $ionicLoading){
    
    
    $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Loading...',
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
    
    $scope.show();
    
    $ionicPlatform.registerBackButtonAction(function (event) {
        alert("Please click the home button on your phone to exit the app");
        event.preventDefault();
    }, 100);
    
     $scope.authObj = $firebaseAuth();
        
        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
          if (firebaseUser) {
              
              $scope.uid = firebaseUser.uid;
            console.log("Signed in as:", firebaseUser.uid);
              
             var ref = firebase.database().ref('user_details/' + $scope.uid + '/past');  
    var list = $firebaseArray(ref);
    list.$loaded()
      .then(function(x) {
        //if($scope.x.length == 0) alert("No bookings found");
        $scope.itemList = x;
        $scope.hide();
      })
      .catch(function(error) {
        alert(error);
        console.log("Error:", error);
        $scope.hide();
    });
          } 
            else {
                $scope.hide();
                $state.go('app.login');
            }
          
        })
    
    
})


.controller('loginController', function($scope, $firebaseAuth, $state, $ionicPlatform, $ionicLoading, $state) {
    
    $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Loading...',
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
    
    $ionicPlatform.registerBackButtonAction(function (event) {
        alert("It is mandatory to login. Please use the home button to exit.");
        event.preventDefault();
    }, 100);
    
    $scope.formData = {
        email : "",
        password: "",
    }
    
    $scope.goSignUp = function(){
        $state.go('app.signup');
    }
    
    $scope.doLogin = function(){
        
        $scope.show();
        
        $scope.authObj = $firebaseAuth();
        $scope.authObj.$signInWithEmailAndPassword($scope.formData.email, $scope.formData.password).then(function(firebaseUser) {
          console.log("Signed in as:", firebaseUser.uid);
            $scope.hide();
            $state.go('app.home');
        }).catch(function(error) {
            $scope.hide();
          console.error("Authentication failed:", error);
          alert("Authentication failed, please make sure that you have entered correct id and password");
        });
    }
})

.controller('signupController', function($scope, $firebaseAuth, $state, $ionicPlatform) {
    
     $ionicPlatform.registerBackButtonAction(function (event) {
        alert("It is mandatory to login. Please use the home button to exit.");
        event.preventDefault();
    }, 100);
    
    $scope.goLogin = function(){
        $state.go('app.login');
    }
    
    $scope.formData = {
        name : "",
        email : "",
        password: "",
    }
    console.log("Hi");
    
    $scope.authObj = $firebaseAuth();
        
        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
          if (firebaseUser) {
            console.log("Signed in as:", firebaseUser.uid);
              $state.go('app.home');
          } 
          
        })
    
    
    $scope.doSignup =  function(){
		alert("If after signup you get an error, 'this email id is already in use' please ignore the error and restart the application");
        console.log("Hi");
        
        
            $scope.authObj.$createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password).then(function(){
                console.log("User created successfully!");
                //$state.go('app.home');
            }, function(err){
                alert(err);
            })
            
    

        
    }
        
})

.controller('homeController', function($scope, $firebaseAuth, $state, $ionicModal,$cordovaGeolocation, $ionicPlatform, $timeout,$firebaseObject, $http, $state, $ionicPopup, $ionicLoading,$window) {
    
     $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Loading...',
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
    
   
    
    $scope.formData1 = {
        radius: 100
    }
    
    if($window.localStorage['window'] == 'true'){
        $window.location.reload(true);
        $window.localStorage['window'] == 'false';
    }
    
    $scope.formData = {
        email:"",
        password: "",
    }
    
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }
    
    function deg2rad(deg) {
  return deg * (Math.PI/180)
}
    
    
    
    $scope.locations = [];
    
    $scope.finalLocations = [];
    
$scope.fetchNearby = function (lat, lon){
    
    $scope.finalLocations = [];
     
        console.log("Fetch nearbuy is running");
        $scope.currentLat = lat;
        $scope.currentLong = lon;
        
        
          
        var firebaseRef = firebase.database().ref('devices/');

          // Create a new GeoFire instance at the random Firebase location
        var geoFire = new GeoFire(firebaseRef);
   
        var radius = $scope.formData1.radius;
        var operation;

        /*
        if (typeof geoQuery !== "undefined") {
          operation = "Updating";

          geoQuery.updateCriteria({
            center: [lat, lon],
            radius: radius
          });

        } else {*/
        
          operation = "Creating";
        console.log(radius);
          geoQuery = geoFire.query({
            center: [lat, lon],
            radius: radius
          });

          geoQuery.on("key_entered", function(key, location, distance) {
              
            console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
              
              var lat = location[0];
              var long = location[1];

               var latLng = new google.maps.LatLng(lat, long);
              
              var marker = new google.maps.Marker({
                position: latLng,
                map: $scope.map
            })
              
              $scope.locations.push({lat:lat, long:long, distance: distance.toFixed(2)});
              $scope.locations.reverse();
              
              var ref = firebase.database().ref('/deviceInfo/' + key);
              var obj = $firebaseObject(ref);
              
              obj.$loaded().then(function(data){
                  data.distance = Math.round(getDistanceFromLatLonInKm($scope.currentLat, $scope.currentLong, data.lat, data.long),2);
                  $scope.finalLocations.push(data);
                  console.log($scope.finalLocations);
              })
              
          });
         
         

          geoQuery.on("key_exited", function(key, location, distance) {
            console.log(key, location, distance);
            console.log(key + " is located at [" + location + "] which is no longer within the query (" + distance.toFixed(2) + " km from center)");
          });
        //}

        console.log(operation + " the query: centered at [" + lat + "," + lon + "] with radius of " + radius + "km")
        
        
        
        return false;
        
        
    }
    
    $scope.execAfterAuth = function (){
    
        $ionicPlatform.ready(function(){
                var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, success, error);

            function error() {
              console.warn('Camera permission is not turned on');
            }

            function success( status ) {
              if( !status.hasPermission ) error();
            }



            var options = {timeout: 10000, enableHighAccuracy: true};

              $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                  var lat = position.coords.latitude;
                  var long = position.coords.longitude;

                   var latLng = new google.maps.LatLng(lat, long);

                var mapOptions = {
                  center: latLng,
                  zoom: 10,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                
                  
                  
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map
                })

                $timeout(function(){$scope.fetchNearby(lat, long);},5000);


              }, function(error){
                console.log("Could not get location");
                  console.log(error);
              });

            
            /*
             var searchBox = new google.maps.places.SearchBox(document.getElementById("mapsearch"));

            google.maps.event.addListener(searchBox,'places_changed',function(){
                var places = searchBox.getPlaces();
                var bounds = new google.maps.LatLngBounds();
                var i,place;
                var place = places[0];
                var latLng = new google.maps.LatLng(lat, long);
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map
                })

                for(i=0; place=places[i]; i++){
                    bounds.extend(place.geometry.location);
                    marker.setPosition(place.geometry.location);
                }
                
                $scope.map.fitBounds(bounds);
                $scope.map.setZoom(14);
                console.log(places);


            })
            */

            firebase.database().ref('locked/' + $scope.uid + '/booking').once('value',function(data){
                if(data.val()){
                    $state.go('app.locked', {id: data.val()});
                }
            })

            firebase.database().ref('user_details/' + $scope.uid + '/current').once('value',function(data){
                if(data.val()){
                    $state.go('app.current');
                }
            })


        })

        $scope.hide();
    }

    
    $scope.redirectLogin = function(){
        $scope.closeModal();
        $state.go('app.login');
        
    }
    
    $scope.redirectSignup = function(){
        $scope.closeModal();
        $state.go('app.signup');
    }
    
    $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope,
	hardwareBackButtonClose: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
    
  $scope.openModal = function() {
    $scope.modal.show();
  };
    
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
    
    $scope.authObj = $firebaseAuth();
    $scope.show();
    $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser) {
          $scope.hide();
          $scope.uid = firebaseUser.uid;
        console.log("Signed in as: sahib", firebaseUser.uid);
          $scope.hide();
          $scope.execAfterAuth();
      } 
      else {

          $scope.hide();
        console.log("Signed out");
          setTimeout(function(){
              $scope.openModal();
          }, 2000);

      }
    })
    /*
    $scope.authObj.$signInWithEmailAndPassword($scope.formData.email, $scope.formData.password).then(function(firebaseUser) {
      console.log("Signed in as:", firebaseUser.uid);
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
*/    

    
    $scope.bookSlot = function(url,sensorId){
        $scope.show();
        console.log("The url given to the bookslot function is as follows.");
        $scope.show();
        //Opening the check modal which will check whether the server is live or not
        
        
        //Checking whether the slot is responding or not
        
        if(!url){
            $scope.hide();
            alert("Try to book another slot, server at this slot is not responding.")
        }
        
        $http.get(url).then(
          function successCallback(response) {

              console.log(response);
            if(response){
                console.log("The server is working absolutely fine.");
                // Then we will set this parking state in the locked mode.
                firebase.database().ref('locked/' + $scope.uid + '/booking').set(sensorId).then(
                    function(data){
                        firebase.database().ref('deviceInfo/' + sensorId + '/locked').set(true);
                        console.log("Data is set successfully.");
                        $scope.hide();
                        $state.go('app.locked',{id:sensorId});
                    },
                    function(err){
                        console.log(err);
                    }
                )
            }
              console.log(response);
              $scope.hide();
          },
          function errorCallback(response) {
            console.log("Unable to perform get request");
              $scope.hide();
            $scope.showAlert();
              $scope.hide();
              
          }
        );
        
    }
    
  $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'The server installed at this slot is not responding.',
     template: 'Please try after some time.'
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };
    
    
    // Here we are ge
    
})


