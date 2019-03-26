    
var config = {
    apiKey: "AIzaSyC-mPkUYLOsuLTrzv-IdfiADXdloAjI5eo",
    authDomain: "smartparking1998.firebaseapp.com",
    databaseURL: "https://smartparking1998.firebaseio.com",
    projectId: "smartparking1998",
    storageBucket: "smartparking1998.appspot.com",
    messagingSenderId: "94170178175"
  };
  firebase.initializeApp(config);
    
  
    
    
    
    console.log("Yes the controller is running fine");
    
    var key = window.localStorage['uniqueKey'];
    if(!key){
        key = firebase.database().ref().push().key;
        window.localStorage['uniqueKey'] = key;
        console.log("The alloted key is " + key );
    }
    
    console.log(key);
    
    
    
    
    function sendData(){
        var lat = parseFloat(document.getElementById("lat").value);
        console.log(lat);
        
        var long = parseFloat(document.getElementById("long").value);
        console.log(long);
        
        var prox = parseFloat(document.getElementById("prox").value);
        console.log(prox);
        
        var url = document.getElementById("url").value;
        console.log(url);
        if(url == ""){
            url = "https://helpless-dragon-45.localtunnel.me";
        }
        
        firebase.database().ref('/deviceInfo/' + key + "/occupied").set(prox);
        firebase.database().ref('/deviceInfo/' + key + "/rate").set(10);
        
        
        firebase.database().ref('/deviceInfo/' + key + "/lat").set(lat);
       
        firebase.database().ref('/deviceInfo/' + key + "/long").set(long);
        firebase.database().ref('/deviceInfo/' + key + "/url").set(url);
         var firebaseRef = firebase.database().ref('devices/');

          // Create a new GeoFire instance at the random Firebase location
          var geoFire = new GeoFire(firebaseRef);

          var geoQuery;
                  
            var myID = key;
            try{
                geoFire.set(myID, [lat, long]).then(function() {
                  console.log(myID + ": setting position to [" + lat + "," + long + "]");
                  //alert("HEllo");
                }, function(err){
                    throw err;
                });
            }
            catch(err){
                throw err;
            }
    }

    setInterval(function(){
        sendData();
    }, 5000);
    
   
    
    