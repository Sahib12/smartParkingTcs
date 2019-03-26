const firebase = require("firebase");
irebase.initializeApp({
  // ...
});

// Create a Firebase reference where GeoFire will store its information
var firebaseRef = firebase.database().ref();

// Create a GeoFire index
var geoFire = new GeoFire(firebaseRef);