// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('Sahiplendir', ['ionic', 'Sahiplendir.controllers', 'Sahiplendir.directives', 'Sahiplendir.services'])

app.config(function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

app.config(function ($stateProvider, $urlRouterProvider) {

    //$ionicConfigProvider.views.maxCache(0);
    $stateProvider

        .state('tabs', {
            url: '/tab',
            abstract: true,
            templateUrl: "templates/login.html",
            controller: 'LoginCtrl'
        })

        .state('tabs.signup', {
            url: '/signup',
            views: {
                'signup-tab': {
                    templateUrl: "templates/signup.html",
                    controller: 'SignUp'
                }
            },
            data: {
                authenticate: false
            }
        })

        .state('tabs.signin', {
            url: '/signin',
            views: {
                'signin-tab': {
                    templateUrl: "templates/signin.html",
                    controller: 'SignIn'
                }
            },
            data: {
                authenticate: false
            }
        })

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html'

        })


        .state('app.home', {
            url: '/home',
            controller: 'MainPageCtrl',
            templateUrl: 'templates/home.html'

        })

        .state('app.profile', {
            url: '/profile',
            controller: 'ProfileCtrl',
            templateUrl: 'templates/profile.html',
            data: {
                authenticate: true
            }
        })

        .state('app.info', {
            url: '/info',
            controller: 'InfoCtrl',
            templateUrl: 'templates/info.html'

        })


        .state('app.post', {
            url: '/post',
            abstract: true,
            template: '<ion-nav-view></ion-nav-view>'

        })


        .state('app.post.add', {
            url: '/add',
            abstract: true,
            templateUrl: 'templates/post-add.html',
            controller: 'PostAddCtrl'


        })

        .state('app.post.add.photo', {
            url: '/photo',
            controller: 'PostAddPhotoCtrl',
            templateUrl: 'templates/post-add-photo.html'


        })

        .state('app.post.add.location', {
            url: '/location',
            controller: 'PostAddLocationCtrl',
            templateUrl: 'templates/post-add-location.html'

        })

        .state('app.post.add.message', {
            url: '/message',
            controller: 'PostAddMessageCtrl',
            templateUrl: 'templates/post-add-message.html'

        })

        .state('app.posts', {
            url: '/posts',
            abstract: true,
            templateUrl: 'templates/posts.html',


        })
        .state('app.posts.all', {
            url: '/all/:s',
            views: {
                'posts-all': {
                    templateUrl: 'templates/posts-list.html',
                    controller: 'PostsAllCtrl'
                }
            },
            data: {
                type: 'all'
            }

        })
        .state('app.posts.me', {
            url: '/me',
            views: {
                'posts-me': {
                    templateUrl: 'templates/posts-list.html',
                    controller: 'PostsMeCtrl'
                }
            },
            data: {
                type: 'me'
            }

        })

        .state('app.post.detail', {
            url: '/detail/:id',
            controller: 'PostDetailCtrl',
            templateUrl: 'templates/post-detail.html'

        })

        .state('app.veterinarian', {
            url: '/veterinarian',
            abstract: true,
            controller: 'VeterinarianCtrl',
            templateUrl: 'templates/veterinarian.html'


        })

        .state('app.veterinarian.list', {
            url: '/list',
            templateUrl: 'templates/veterinarian-list.html',
            controller: function($scope) {
                $scope.showMarkers('all')
            }

        })
        .state('app.veterinarian.detail', {
            url: '/detail/:id',
            templateUrl: 'templates/veterinarian-detail.html',
            controller: 'VeterinarianDetailCtrl'

        })

    $urlRouterProvider.otherwise('/tab/signin')


});

app.run(['$rootScope', '$state', '$ionicPlatform', function ($rootScope, $state, $ionicPlatform) {
    $rootScope.$state = $state;

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });


    /*$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
     if (toState.data.authenticate && !Parse.User.current()) {
     // User isn’t authenticated
     $state.transitionTo("tabs.signin");
     event.preventDefault();
     }
     });*/


}]);






