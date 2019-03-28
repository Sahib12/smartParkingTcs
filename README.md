# Introduction

To create a system through which we can solve the parking problem in our country. Every free space can be used for parking vehicles .These free spaces can be open land, parking area of any building, shopping mall etc. In fact one can lend the residential parking space when they are away for office or holiday.  Solving this problem by using Arduino Boards and Raspberry Pi at parking slots for detecting parked vehicles and developing a hybrid application prototype using Ionic Framework and Cordova which gives the direction to nearest parking spot with details of its location. User can navigate to the available spot using google maps application and also see previous booking details.

# Working

* At each and every parking slot an Arduino board with IR sensor connected to a Raspbery pi is installed, which will be used to detect whether a parking slot is occupied or not.
​
* A node server will run on the raspberry pi which will enable the users to book a parking slot in advance via REST API calls.
​
* A node application will run on the raspberry pi which will continuously send the state of the Infrared sensor (Whether the parking slot is occupied or not) to a centralized database (We have used Firebase Realtime Database).​

* Geohashes are used for storing the location coordinates of these parking slots because geohashes enable us to sort the parking slots according to their coordinates (Latitude and Longitude).​

* A hybrid application is built using Ionic Framework v1 and Cordova. This application will be used by the users to​
Get the list of nearest available parking slots, book a parking slot, get directions to it on google maps and to get the list of their past bookings.

# Installation

## Arduino Integration with IR sensor

Paste the following code in the Arduino ide and push it to your Arduino board. Here we have used pin number 8, you can use any pin, just update that pin number in the below code.
 ```
void setup() {
 Serial.begin(9600);
 pinMode(8, INPUT);// set pin as input

}

void loop() {
  int detect = digitalRead(8);
  if(detect == LOW){
    
   Serial.println("yes"); 
  }else{
    
   Serial.println("no");  
  }
  delay(500);
}
```

REFERENCES TAKEN FROM :​
* https://github.com/adafruit/Raw-IR-decoder-for-Arduino/blob/master/rawirdecodestruct/rawirdecodestruct.ino​
* http://surajpassion.in/ir-obstacle-sensor-with-arduino/​
* https://www.popsci.com/diy/article/2013-01/program-arduino-few-simple-steps​


## Connecting Arduino with Raspberry Pi

Arduino Board is connect to Raspberry Pi. Raspberry Pi performs two major functions.

* It sends the state of IR sensor to Firebase Realtime Database.
* It runs a node server, which is used by the mobile application to check whether the raspberry pi is live or not.

1. HOW TO RUN THE NODE SERVER ON RASPBERRY PI

Follow the below listed steps to start a node server on raspberry PI

* Open the folder 'NodeServer'.
* Open Terminal/Power Shell at this location and run the command `npm install` to install the dependencies.
* Run the command `node index`. This will start a node server at port 3000. You can access the server by using the url `http://localhost:3000/`. Only get requests can be made to this server. Express js is used f
* Run the command `ngrok http 3000`. Ngrok is a lightweight tool that creates a secure tunnel on your local machine along with a public URL you can use for browsing your local site.
* Copy the public url visible on the command prompt we will need it later. Refer the screenshot below. [clickhere] (https://drive.google.com/open?id=1-V_KO9Zo64b_Pd9fyPAN0yD3dppoM12l) to see the screenshot.

2. HOW TO RUN THE NODE APPLICATION WHICH WILL SEND THE STATE OF PARKING SLOT TO THE REALTIME DATABASE.

* Connect Arduino to Raspberry pi via USB (We assume that you have already integrated the IR sensor into Arduino).
* Navigate to the folder 'RaspberrySendState'.
* Open Terminal/Power Shell at this location and run the command `npm install` to install the dependencies.
* Open the file index.js in any editor. There are four variables named `lat`, `lng`, `url`, `rate`. We need to put in values into these variables. We are hardcoding the values. This setup has to be done just once.
    * lat - It contains the latitude of the parking slot.
    * lng - It contains the longitude of the parking slot.
    * rate - It contains the parking charges per minute.
    * url - It contains the public url of the node server which we configured earlier.
* Run the command `node index`. This will execute index.js which will constantly save the state of the parking slot to the database.

I have tested it in my windows10 laptop, because I was not having raspberry pi. But this should work fine in raspberry pi too.

## Replacing Arduino and Raspberry Pi by an Android phone

It is practically not feasible to install multiple Arduino boards for testing.​
It is possible to use an android phone as replacement for Arduino board and Raspberry Pi.​
Android phone's proximity sensor is used as a replacement for IR sensor on the Arduino board.​
Termux Terminal is used to create a Linux environment on our android phone. ​
Please refer the following video to see a demo on how android phone can be used as a replacement for Arduino and Raspberry Pi.​


Steps :

1. Download termux terminal from [here](https://play.google.com/store/apps/details?id=com.termux&hl=en_IN).
2. Run command `pkg install -g nodejs`. This will install nodejs.
2. Download ngrok package from [here](https://steemit.com/utopian-io/@faisalamin/how-to-download-install-ngrok-in-android-termux-also-work-for-non-rooted-devices)
3. Open termux terminal and run command `termux-setup-storage`.
4. Copy 'NodeServer' folder into your android phone.
5. Open Terminal/Power Shell at this location and run the command `npm install` to install the dependencies.
6. Run the command `node index`. This will start a node server at port 3000. You can access the server by using the url `http://localhost:3000/`. Only get requests can be made to this server. Express js is used f
7. Run the command `ngrok http 3000`. Ngrok is a lightweight tool that creates a secure tunnel on your local machine along with a public URL you can use for browsing your local site.
8. Copy the public url visible on the command prompt we will need it later. Refer the screenshot below. [clickhere] (https://drive.google.com/open?id=1-V_KO9Zo64b_Pd9fyPAN0yD3dppoM12l) to see the screenshot.
9. Navigate to 'ionicSensor' folder. It contains a file `test.apk`. Install this apk (Before installing please make sure developer options are enabled on your phone and usb debugging is turned on).
10. Open the app, paste the url that we copied in step 8 into the text box and click on 'submit' button and leave the app open. Click [here] () to see the demo.


## Using the mobile application


'smartParking' folder contains the code of final ionic application which will be used by the end users. There is a file named 'final.apk' in this folder. Install this apk (Before installing please make sure developer options are enabled on your phone and usb debugging is turned on).






