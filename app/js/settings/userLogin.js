function initUserLogin() {
    $("#user-login").click(function() {
        if ($("#log-in-sign-up-container").hasClass("active")) {
            $("#log-in-sign-up-container").removeClass("active");
            $("#log-in-sign-up-container").empty();
        } else {
            $("#log-in-sign-up-container").addClass("active");
            renderTemplate("signUp", null, $("#log-in-sign-up-container"));
            $("#log-in-window").hide();

            $('.tab a').click( function (e) {
                if ($(this).data().id == "signup") {
                    $("#log-in-window").hide();
                    $("#log-in-tab").removeClass("active");

                    $("#sign-up-window").show();
                    $("#sign-up-tab").addClass("active");
                } else {
                    $("#log-in-window").show();
                    $("#log-in-tab").addClass("active");
                    
                    $("#sign-up-window").hide();
                    $("#sign-up-tab").removeClass("active");
                }
            });


            $("#signUp").click(function () {
                signUp($("input#emailSignUp").val(), $("input#passwordSignUp").val());
            })
            $("#logIn").click(function () {
                logIn($("input#emailLogIn").val(), $("input#passwordLogIn").val());
            })
        }
    });
}

firebase.initializeApp({
    apiKey: "AIzaSyCo1UVUXi83YUE3yc8Xyrzml9Bfg-s1FpI",
    authDomain: "the-here-times.firebaseapp.com",
    databaseURL: "https://the-here-times.firebaseio.com",
    projectId: "the-here-times",
    storageBucket: "the-here-times.appspot.com",
    messagingSenderId: "142930524086"
});

function signUp(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(success) {
        console.log(success);
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
    });
}

function logIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (success) {
        console.log(success);
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}