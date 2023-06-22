const signupModal = document.getElementById('signup-modal');
const loginModal = document.getElementById('login-modal');

// Get the button that opens the modals
const signupBtn = document.getElementById("signup-button");
const loginBtn = document.getElementById("login-button");

// Get the <span> element that closes the modals
const span = document.getElementsByClassName("close-button");

// When the user clicks the button, open the modal
signupBtn.onclick = function() {
    signupModal.style.display = "block";
}

loginBtn.onclick = function() {
    loginModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
for (let i = 0; i < span.length; i++) {
    span[i].onclick = function() {
        if(signupModal.style.display === "block") {
            signupModal.style.display = "none";
        }
        if(loginModal.style.display === "block") {
            loginModal.style.display = "none";
        }
    }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === signupModal) {
        signupModal.style.display = "none";
    }
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
}