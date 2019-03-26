// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC-mPkUYLOsuLTrzv-IdfiADXdloAjI5eo",
    authDomain: "smartparking1998.firebaseapp.com",
    databaseURL: "https://smartparking1998.firebaseio.com",
    projectId: "smartparking1998",
    storageBucket: "smartparking1998.appspot.com",
    messagingSenderId: "94170178175"
  };
  firebase.initializeApp(config);



angular.module('starter', ['ionic', 'starter.controllers', 'firebase','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
          controller: 'homeController'
      }
    }
  })
    
  .state('app.history', {
    url: '/history',
    views: {
      'menuContent': {
        templateUrl: 'templates/history.html',
          controller: 'homeController'
      }
    }
  })
    
  .state('app.locked', {
    url: '/locked',
    views: {
      'menuContent': {
        templateUrl: 'templates/locked.html',
          controller: 'lockedController'
      }
    },
    params: {
        id: null
    }
  })
    
  .state('app.current', {
    url: '/current',
    views: {
      'menuContent': {
        templateUrl: 'templates/current.html',
          controller: 'currentController'
      }
    },
    
  })
    
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
          controller: 'loginController'
      }
    }
  })

  .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html',
          controller: 'signupController'
      }
    }
  })
    
  .state('app.logout', {
      url: '/logout',
      views: {
        'menuContent': {
          templateUrl: 'templates/logout.html',
            controller: 'logoutController'
        }
      }
    })
    .state('app.previous', {
      url: '/previous',
      views: {
        'menuContent': {
          templateUrl: 'templates/previous.html',
          controller: 'previousController'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/home');
    $urlRouterProvider.otherwise('/app/home');
});
