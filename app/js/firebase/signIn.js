/**
* Handles the sign in button press.
*/

function signUpLogInEventListeners() {
    $("button#log-in-selector").click(function() {
        $("#sign-up-log-in-container").empty();
        renderTemplate("logIn", null, $("#sign-up-log-in-container"));
    });
    $("button#sign-up-selector").click(function() {
        $("#sign-up-log-in-container").empty();
        renderTemplate("signUp", null, $("#sign-up-log-in-container"));
        $("#sign-up").click(function () {
            handleSignUp();
        })
    });
}

function toggleSignIn() {
    
        if (firebase.auth().currentUser) {
            // [START signout]
            firebase.auth().signOut();
            // [END signout]
        } else {
            var email = $('#email').val();
            var password = $('#password').val();
            if (email.length < 4) {
                alert('Please enter an email address.');
                return;
            }
            if (password.length < 4) {
                alert('Please enter a password.');
                return;
            }
            // Sign in with email and pass.
            // [START authwithemail]
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
                document.getElementById('quickstart-sign-in').disabled = false;
                // [END_EXCLUDE]
            });
            // [END authwithemail]
        }
        document.getElementById('quickstart-sign-in').disabled = true;
}

function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        
            });
    // [END createwithemail]
}

function closeSignInWindow() {
    $("#sign-up-log-in-container").empty();
}