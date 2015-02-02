angular.module('Sahiplendir.controllers', ['Sahiplendir.services'])

    .controller('SideMenuCtrl', function ($scope, $ionicSideMenuDelegate) {
        $scope.toggleRight = function () {
            $ionicSideMenuDelegate.toggleRight();
        };
        $scope.user = {

            name: Parse.User.current() ? Parse.User.current().get('name') : 'Sahiplendir',
            id: Parse.User.current() ? Parse.User.current().get('fbId') : 'undefined',
            email: Parse.User.current() ? Parse.User.current().get('email') : 'no mail',
            picture: Parse.User.current() ? Parse.User.current().get('profilePicture') : 'no',
        }
    })


    .controller('MainPageCtrl', function ($scope, $state, $timeout, PostService) {

        $scope.isHiddenText = true;
        $scope.showSlidebox = false;
        $scope.posts = [];

        PostService.getPosts().then(function (arr) {
                $scope.posts = arr;
                $scope.showSlidebox = true;
                setScopeValues(0);
            },
            function (err) {
                console.log(err);
            });


        $scope.addPost = function () {
            $state.go('app.post.add.photo');
        };

        $scope.changeSlide = function (index) {

            $scope.isHiddenText = false;
            $timeout(function () {
                $scope.isHiddenText = true
            }, 200);
            setScopeValues(index);


        }

        function setScopeValues(index) {
            $scope.title = $scope.posts[index].title;
            $scope.userpic = $scope.posts[index].userpic;
            $scope.userfullname = $scope.posts[index].userfullname;
            $scope.timestamp = moment($scope.posts[index].created).fromNow();
        }


        $scope.mainLinks = [
            {href: '#/app/posts/all/save', bg: 'energized-bg', icon: 'sahiplendir-icon-cat', label: 'Hayvanları Gör'},
            {
                href: '#/app/veterinarian/list',
                bg: 'balanced-bg',
                icon: 'sahiplendir-icon-veterinarian',
                label: 'Veterinerler'
            },
            {href: '#/app/info', bg: 'royal-bg', icon: 'sahiplendir-icon-info', label: 'Yararlı Bilgiler'}
        ]


    })

// POSTS

    .controller('PostsAllCtrl', function ($scope, PostService, $stateParams) {

        ($stateParams.s == 'save' ) ? $scope.s = 'save' : '';
        PostService.getPosts().then(function (arr) {
                $scope.posts = arr;
            },
            function (err) {
                console.log(err);
            });


    })

    .controller('PostsMeCtrl', function ($scope, $filter, PostService) {
        var found = $filter('filter')(PostService.getAllPosts(), {userid: 's35qkAMhFw'}, true);
        if (found.length) {
            $scope.posts = found;

        } else {
            console.log('bulunamadı');
        }

    })


    .controller('PostDetailCtrl', function ($scope, $filter, $stateParams, PostService) {
        console.log($stateParams.id);
        //$scope.post = filterFilter(PostService.getAllPosts(), $stateParams.id);

        var found = $filter('filter')(PostService.getAllPosts(), {id: $stateParams.id}, true);
        if (found.length) {
            $scope.post = found[0];
            $scope.post.time = moment(found[0].createdAt).format('llll');

        } else {
            console.log('bulunamadı');
        }

        $scope.mapCreated = function (map) {
            $scope.map = map;
            var latlng = new google.maps.LatLng();
            marker = new google.maps.Marker({
                position: $scope.post.location,
                map: $scope.map
            });


            var infowindow = new google.maps.InfoWindow({
                content: $scope.post.address,
                maxWidth: 200
            });

            infowindow.open($scope.map, marker);
            $scope.map.setCenter($scope.post.location);
        };

    })


    .controller('InfoCtrl', function ($scope) {
        $scope.items = [];
        for (var i = 0; i < 20; i++) {
            $scope.items.push('Item ' + i);
        }
    })

    .controller("SideMenuListCtrl", function ($scope) {

        $scope.data = {
            items: [
                {href: '#/app/home', icon: 'sahiplendir-icon-home assertive', label: 'Ana Sayfa'},
                {href: '#/app/posts/all/std', icon: 'sahiplendir-icon-cat energized', label: 'Hayvanları Gör'},
                {
                    href: '#/app/posts/veterinarian/list',
                    icon: 'sahiplendir-icon-veterinarian balanced',
                    label: 'Hayvanları Gör'
                },
                {href: '#/app/info', icon: 'sahiplendir-icon-info royal', label: 'Yararlı Bilgiler'}
            ]
        };

    })


// ----------------------------- POST ADD ---------------------------------------

    .controller("PostAddCtrl", function ($scope, $state, $rootScope, $timeout) {

        $scope.buttonName = 'Devam';

        statesToGo = ['app.post.add.location', 'app.post.add.message'];
        phase = 0;


        $scope.goToNextStep = function () {

            if (phase == 1) {
                $scope.buttonName = 'Kaydet';
            }
            if (phase == 2) {
                $rootScope.$broadcast('savePostData');
            } else {
                $state.go(statesToGo[phase]);
                phase++;
            }

        }
        $scope.setCurrentLocation = function () {
            $rootScope.$broadcast('setMyLocation');
        }


    })


// PHOTO ADD

    .controller("PostAddPhotoCtrl", function ($scope, $ionicSlideBoxDelegate, Camera, $timeout, LoadingService, PostService) {

        // PHOTO GALLERY

        $scope.photos = [];


        // disable swiping after the slidebox rendered
        //$timeout(function() { $ionicSlideBoxDelegate.$getByHandle('post-main').enableSlide(false)}, 500);

        // PHOTO ADD

        $scope.addPostPhoto = function (from) {

            LoadingService.show();

            var opt = {

                quality: 60,
                correctOrientation: true,
                targetWidth: 400,
                targetHeight: 400,
                saveToPhotoAlbum: false,
                //destinationType: 0,// base64 string
                sourceType: (from == 'camera') ? 1 : 0 // camera or library

            }

            Camera.getPicture(opt).then(function (imageURL) {

                $scope.lastPhoto = imageURL;
                LoadingService.show();
                savePostImages();
                //$timeout(function() {   console.log($scope.imageURL)},400);

            }, function (err) {
                console.err(err);
            }, opt);

        }


        // SAVE POST IMAGE

        function savePostImages() {


            window.resolveLocalFileSystemURL($scope.lastPhoto, gotFile, gotFail, PostService);

            function gotFail(e) {
                console.log("FileSystem Error");
                console.dir(e);
            };

            function gotFile(fileEntry) {

                fileEntry.file(function (file) {

                    console.log("size: " + file.size);

                    var reader = new FileReader();

                    reader.onloadend = function (e) {

                        var name = "large.jpg";

                        var parseFile = new Parse.File(name, {base64: e.target.result});
                        parseFile.save().then(function () {

                            var cloudObj = {
                                url: parseFile.url()
                            }

                            console.log("large: " + cloudObj.url);

                            Parse.Cloud.run('savePostImage', cloudObj, {
                                success: function (img_obj) {

                                    console.log("thumbUrl: " + img_obj.small)
                                    PostService.addPhoto({large: img_obj.large, small: img_obj.small});
                                    $scope.photos = PostService.getAllPhotos();
                                    $timeout(function () {
                                        $ionicSlideBoxDelegate.update();
                                        LoadingService.hide()
                                    }, 500);

                                },
                                error: function (error) {
                                    console.log("from controller: " + error.message);
                                }
                            });

                        }, function (error) {
                            console.log(error.message);

                        })

                    }

                    reader.readAsDataURL(file);
                });

            }

        }


    })

// LOCATION ADD

    .controller("PostAddLocationCtrl", function ($scope, $rootScope, LoadingService, PostService) {

        // LOCATION

        $scope.mapCreated = function (map) {
            $scope.map = map;
        };

        $scope.$on('setMyLocation', function (evt, args) {
            console.log("Centering");
            if (!$scope.map) {
                return;
            }

            var geocoder = new google.maps.Geocoder();
            var infowindow = new google.maps.InfoWindow();

            LoadingService.show();

            navigator.geolocation.getCurrentPosition(function (pos) {
                var content_str;

                PostService.postloc = new Parse.GeoPoint({
                    latitude: parseFloat(pos.coords.latitude),
                    longitude: parseFloat(pos.coords.longitude)
                });
                var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

                $scope.map.setCenter(latlng);

                geocoder.geocode({'latLng': latlng}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {

                        if (results[0]) {
                            LoadingService.hide();

                            marker = new google.maps.Marker({
                                position: latlng,
                                map: $scope.map
                            });

                            infowindow.setContent(results[0].formatted_address);
                            PostService.setAddress(results[0].formatted_address);
                            infowindow.open($scope.map, marker);
                        } else {
                            console.log('No results found');
                        }
                    } else {
                        LoadingService.hide();
                        alert('Geocoder failed due to: ' + status);
                    }
                })


                /*var marker = new google.maps.Marker({
                 position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                 map: $scope.map,
                 draggable: false,
                 animation: google.maps.Animation.DROP
                 });*/

            }, function (error) {
                LoadingService.hide();
                alert('Unable to get location: ' + error.message);
            }, {enableHighAccuracy: true, timeout: 10000});
        });


    })


// MESSAGE ADD

    .controller("PostAddMessageCtrl", function ($scope, $state, PostService) {

        $scope.p = {};

        $scope.$on('savePostData', function (evt, args) {
            PostService.setTitle($scope.p.title);
            PostService.setMessage($scope.p.message);
            PostService.post().then(function (item) {
                PostService.resetPosts();
                $state.go('app.posts.all', {s: 'save'});
            }, function (err) {
                console.log(err.message);
            });
        });


    })


    .controller("SignUp", function ($scope) {
        $scope.signup = {

            submit: function () {
                console.log("ok form");
                var user = new Parse.User();
                user.set("name", $scope.signup.firstname + " " + $scope.signup.lastname);
                user.set("username", $scope.signup.email);
                user.set("password", $scope.signup.pwd);
                user.set("email", $scope.signup.email);

                user.signUp(null, {
                    success: function (user) {
                        // Hooray! Let them use the app now.
                        console.log("hooray");
                    },
                    error: function (user, error) {
                        // Show the error message somewhere and let the user try again.
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            }

        }

    })

    .controller("SignIn", function ($scope, AlertService, $state, $ionicPopup, LoadingService) {

        $scope.data = {};

        $scope.setAlert = function (msg) {
            AlertService.show(msg).then(function (t) {
                console.log('hello moto')
            })
        }


        $scope.sendLostPassword = function () {

            var mailPopup = $ionicPopup.show({
                template: '<input type="email" ng-model="data.email" required>',
                title: 'Şifremi Unuttum',
                subTitle: 'Lütfen kayıtlı mail adresinizi giriniz',
                scope: $scope,
                buttons: [
                    {text: 'Vazgeç'},
                    {
                        text: '<b>Gönder</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.email) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {

                                return $scope.data.email;

                            }
                        }
                    }
                ]
            });

            mailPopup.then(function (res) {

                if (res) {

                    LoadingService.show();


                    var query = new Parse.Query(Parse.User);
                    query.equalTo("email", res);
                    query.find({
                        success: function (results) {


                            if (results.length > 0) {

                                console.log(results[0].get("password"));

                                Parse.User.requestPasswordReset(res, {
                                    success: function () {
                                        // Password reset request was sent successfully
                                        LoadingService.hide();
                                        AlertService.show("Şifre değiştirme talebiniz e-mail adresinize gönderilmiştir");

                                    },
                                    error: function (error) {
                                        // Show the error message somewhere
                                        console.log("Error: " + error.code + " " + error.message);
                                    }
                                });


                                /* Parse.Cloud.run('sendPasswordMail', {mailToSend: res, name: results[0].get("name"), pwd: results[0].get("password")}, {
                                 success: function(res) {
                                 console.log(res);
                                 LoadingService.hide();
                                 AlertService.show("Şifreniz gönderildi");

                                 },
                                 error: function(error) {
                                 console.log("from controller: "+error.message);
                                 }
                                 });*/

                            } else {

                                LoadingService.hide();
                                AlertService.show("Şifreniz gönderildi");


                            }


                        },
                        error: function (error) {

                            console.log(error.message);
                        }

                    })
                }


            })


        }


        $scope.signin = {

            submit: function () {
                console.log("ok form");
                Parse.User.logIn($scope.signin.email, $scope.signin.pwd, {
                    success: function (user) {
                        // Do stuff after successful login.
                        AlertService.show("Ok").then(function () {
                            $state.go('app.home');
                        });


                    },
                    error: function (user, error) {
                        // The login failed. Check error to see why.
                        AlertService.show(error.message);
                    }
                });
            }

        }


    })


    .controller('LoginCtrl', ['$scope', '$state', 'LoadingService', function ($scope, $state, LoadingService) {

        var fbLogged = new Parse.Promise();

        var fbLoginSuccess = function (response) {
            if (!response.authResponse) {
                fbLoginError("Cannot find the authResponse");
                return;
            }
            var expDate = new Date(
                new Date().getTime() + response.authResponse.expiresIn * 1000
            ).toISOString();

            var authData = {
                id: String(response.authResponse.userID),
                access_token: response.authResponse.accessToken,
                expiration_date: expDate
            }
            fbLogged.resolve(authData);
            fbLoginSuccess = null;
            console.log("fblogin response str:" + JSON.stringify(response));
        };

        var fbLoginError = function (error) {
            fbLogged.reject(error);
        };

        $scope.login = function () {
            LoadingService.show();
            console.log('Login');
            if (!window.cordova) {
                facebookConnectPlugin.browserInit('1510553752541619');
            }
            facebookConnectPlugin.login(['email'], fbLoginSuccess, fbLoginError);

            fbLogged.then(function (authData) {
                console.log('Promised string:' + JSON.stringify(authData));
                return Parse.FacebookUtils.logIn(authData);
            })
                .then(function (userObject) {
                    console.log("userobject: " + JSON.stringify(userObject));

                    var authData = userObject.get('authData');
                    console.log("authdata-promise:" + authData);
                    facebookConnectPlugin.api('/me', null,
                        function (response) {
                            console.log("/me response:" + response);
                            userObject.set('name', response.name);
                            userObject.set('email', response.email);
                            userObject.set('fbId', response.id);
                            //userObject.save();
                            facebookConnectPlugin.api('/me/picture?type=normal&redirect=false', null,
                                function (res) {
                                    console.log("/me pic response:" + res.data.url);
                                    userObject.set('profilePicture', res.data.url);
                                    userObject.save().then(function () {
                                        LoadingService.hide();
                                        $state.go('app.profile');
                                    })
                                },
                                function (error) {
                                    console.log("me pic error:" + error);
                                }
                            );

                            //
                        },
                        function (err) {
                            console.log("/me error:" + err);
                        }
                    );


                }, function (error) {
                    console.log("user object:" + error);
                });
        };


    }])

    .controller('VeterinarianCtrl', function ($scope, LoadingService) {
        var infowindow;

        $scope.vets = [];
        $scope.mapCreated = function (map) {

            var latlng;

            $scope.map = map;
            LoadingService.show();


            navigator.geolocation.getCurrentPosition(function (pos) {

                latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

                $scope.map.setCenter(latlng);

                var request = {
                    location: latlng,
                    radius: 5000,
                    types: ['veterinary_care']

                }

                infowindow = new google.maps.InfoWindow();
                var service = new google.maps.places.PlacesService(map);
                var bounds = new google.maps.LatLngBounds();
                service.nearbySearch(request, function (results, status) {
                    LoadingService.hide();
                    console.log(results);
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        for (var i = 0; i < results.length; i++) {
                            $scope.vets.push({name: results[i].name, address: results[i].vicinity});
                            bounds.extend(results[i].geometry.location);
                            createMarker(results[i]);


                        }
                        $scope.map.fitBounds(bounds);

                    }


                });

            })

        };

        function createMarker(place) {

            var icon = {
                url: 'img/pin.png',
                size: new google.maps.Size(44, 70),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(22, 70)
            };

            var marker = new google.maps.Marker({
                map: $scope.map,
                icon: icon,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open($scope.map, this);
            });
        }

    })

    //sapp detail
    .controller('VeterinarianDetailCtrl', function ($scope, $stateParams) {
        var request = {
            placeId: $scope.vets[$stateParams.id]
        };

        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, callback);

        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {

            }
        }

    })


    .controller("ProfileCtrl", function ($scope, $state) {


        $scope.logout = function () {
            Parse.User.logOut();
            facebookConnectPlugin.logout(
                function (success) {
                    console.log('successfully logged out');
                },
                function (error) {
                    console.log('not logged out');
                });

            $state.go('tabs.signin');

        }
    })

//



