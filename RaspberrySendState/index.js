
const fs = require('fs');
const path = require('path');
const firebase = require("firebase");

var GeoFire = require('geofire');
const serialport = require("serialport");




var config = {
    apiKey: "AIzaSyC-mPkUYLOsuLTrzv-IdfiADXdloAjI5eo",
    authDomain: "smartparking1998.firebaseapp.com",
    databaseURL: "https://smartparking1998.firebaseio.com",
    projectId: "smartparking1998",
    storageBucket: "",
    messagingSenderId: "94170178175"
  };
 firebase.initializeApp(config);
 
var lat = 75;
var lng = 26;
var rate = 10;
// IMPORTANT - WE NEED TO HARD CODE THESE VALUES BECAUSE WE DO NOT HAVE THE GPS MODULE ATTACHED TO THE ARDUINO
// BOARD. IF GPS MODULE IS PRESENT REPLACE THESE ABOVE VALUES BY THE VALUES COMING FROM ARDIUNO.
 
var obj = {
	'lat': lat,
	'long': lng,
	'rate': rate,
	'url': 'http://sample',
}
 
async function fileHandling(){ 
 // Doing the file handling
 const filePath = './file.txt'
var key = "";
try {
  if (fs.existsSync(filePath, 'utf8')) {
    //file exists
	console.log("File exists");
	key = fs.readFileSync(path.join(__dirname, filePath)).toString();
  }
  else{
	  key = await firebase.database().ref('devices/').push().key;
	  await fs.writeFile("file.txt", key);
	  console.log("file does not exist");
  }
  console.log("The key is " + key);
} catch(err) {
  console.log(err);
}

await firebase.database().ref('deviceInfo/' + key + '/').set(obj);

var firebaseRef = firebase.database().ref('devices/');
// Create a GeoFire index
var geofire = new GeoFire(firebaseRef);
await geofire.set(key, [lat, lng]);
//File handling end

} 

fileHandling();



const Readline = require('@serialport/parser-readline');
var port = new serialport('/dev/ttyACM0', {
	br: 9600 // This is the transfer rate
});  // This is the port number to which arduino port is connected.

var readLine = serialport.parsers.ReadLine;
var parser = port.pipe(new Readline({ delimiter: '\n' }));
port.pipe(parser);

port.on('open', onPortOpen);
parser.on('data', onData);
port.on('close', onClose);
port.on('error', onError);


function onPortOpen(){
	console.log('Port open');
}

async function onData(data){
	console.log("data received : " + data);
	if(data == "yes"){
		await firebase.database().ref('deviceInfo/' + key + '/occupied').set(5);
	}
	else{
		await firebase.database().ref('deviceInfo/' + key + '/occupied').set(0);
	}
}

function onClose(){
	console.log('Port closed');
}

function onError(){
	console.log('Error occured');
}
 
 
 
 /*
  
var Request = require("request");

var id = 10001;

var jsonObj = {};
	jsonObj[id] = true;

	Request.put({
		"headers": { "content-type": "application/json" },
		"url": "https://smartparking1998.firebaseio.com/devices.json",
		"body": JSON.stringify(jsonObj)
	})
  
async function getId(){
	
	
	
	
	let fileData = JSON.parse(fs.readFileSync('location.txt', 'utf-8'));
	console.log(fileData);
	let infrared = JSON.parse(fs.readFileSync('infrared.txt', 'utf-8'));
	console.log(infrared);
	var locationObj = {
		latitude: fileData.latitude,
		longitude: fileData.longitude,
	}
	
	var temp = infrared["stk3x1x alsprx"].values[0];

	if(temp != 0) locationObj.occupied = false;
	else locationObj.occupied = true;
	//sending the sensor data

	await Request.put({
		"headers": { "content-type": "application/json" },
		"url": "https://smartparking1998.firebaseio.com/devices/" + id + ".json",
		"body": JSON.stringify(locationObj)
	})
	
}





//setInterval(function(){sample()}, 10000);
setInterval(function(){getId()}, 10000);

*/


  