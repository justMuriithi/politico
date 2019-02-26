const BASE_URL = 'https://murmuring-atoll-51852.herokuapp.com/api/v2';

function displayError(msg){
    document.getElementById('snackbar').innerText = msg
    document.getElementById('snackbar').style.backgroundColor = '#d32f2f';
    showSnackbar();
}
function showSnackbar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
/**
 * Signup function
 */
function onSignup() {
    password = document.getElementById('password').value
    confirm_password = document.getElementById('confirm_password').value

    if (password !== confirm_password){
        displayError('Passwords do not match')
        return;
    }

    let payload = {
        firstname: document.getElementById('first_name').value,
        lastname: document.getElementById('last_name').value,
        national_id: document.getElementById('national_id').value,
        admin: false,
        email: document.getElementById('email').value,
        password: password,
    }

    fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then((data) => {

        console.log(data);
        if (data.status === 201) {
            var user = data.data[0].user

            // Save user profile to local storage
            localStorage.setItem('token', data.data[0].token);
            localStorage.setItem('firstname', user.firstname);
            localStorage.setItem('lastname', user.lastname);
            localStorage.setItem('email', user.email);
            localStorage.setItem('admin', user.admin);
            localStorage.setItem('uid', user.id);
            // Redirect to login after successful signup
            window.location.replace('login.html');

        }else {
            displayError(data.error)
            console.log(data.status);
        }

    })
    .catch((error) => {
        displayError('Please check your connection')
    });
}

/**
 * Login function
 */
function onLogin() {
   
    fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        }),
    })
    .then(res => res.json())
    .then((data) => {

        if (data.status === 200) {
            var user = data.data[0].user

            // Save user profile to local storage
            localStorage.setItem('token', data.data[0].token);
            localStorage.setItem('firstname', user.firstname);
            localStorage.setItem('lastname', user.lastname);
            localStorage.setItem('email', user.email);
            localStorage.setItem('national_id', user.national_id);
            localStorage.setItem('admin', user.admin);
            localStorage.setItem('uid', user.id);
            // Redirect to homepage after successful login
            window.location.replace('vote.html');

        }else {
            displayError(data.error)
            console.log(data.status);
        }   

    })
    .catch((error) => {
        displayError('Please check your connection')
    });
}