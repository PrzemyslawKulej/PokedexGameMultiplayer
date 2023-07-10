const signupModal = document.getElementById('signup-modal');
const wrapper = document.querySelector('.modal-container')
const loginLink = document.querySelector('.login-link')
const registerLink = document.querySelector('.register-link')

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

// Get the button that opens the modal
const signupBtn = document.getElementById("signup-button");

// Get the <span> element that closes the modal
const closeButtons = document.getElementsByClassName("close-button");

// When the user clicks the button, open the modal
signupBtn.onclick = function() {
    signupModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function() {
        signupModal.style.display = "none";
    }
}

// Close the modal when user clicks outside of the form
window.onclick = function(event) {
    if (event.target == signupModal) {
        signupModal.style.display = "none";
    }
}